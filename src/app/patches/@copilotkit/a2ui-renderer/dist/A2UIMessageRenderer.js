import { jsx as _jsx } from "react/jsx-runtime";
import { useCopilotKit } from "@copilotkit/react-core/v2";
import { v0_8 } from "@a2ui/lit";
import React, { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { z } from "zod";
export function createA2UIMessageRenderer(options) {
    const { theme } = options;
    return {
        activityType: "a2ui-surface",
        content: z.any(),
        render: ({ content, agent }) => {
            const [operations, setOperations] = useState([]);
            const lastSignatureRef = useRef(null);
            const processorsRef = useRef(new Map());
            const { copilotkit } = useCopilotKit();
            const actionLogger = useCallback(async (event, context) => {
                if (!agent) {
                    return;
                }
                const resolvedContext = {};
                const processorInstance = context.processor;
                const surfaceKey = context.surfaceId ?? v0_8.Data.A2uiMessageProcessor.DEFAULT_SURFACE_ID;
                const actionContext = event.detail.action?.context;
                if (Array.isArray(actionContext) && actionContext.length > 0) {
                    for (const item of actionContext) {
                        if (!item?.key) {
                            continue;
                        }
                        const valueDescriptor = item.value;
                        if (!valueDescriptor) {
                            continue;
                        }
                        if (typeof valueDescriptor.literalBoolean === "boolean" ||
                            typeof valueDescriptor.literalNumber === "number" ||
                            typeof valueDescriptor.literalString === "string") {
                            resolvedContext[item.key] =
                                valueDescriptor.literalBoolean ??
                                    valueDescriptor.literalNumber ??
                                    valueDescriptor.literalString;
                            continue;
                        }
                        const path = valueDescriptor.path;
                        if (path && processorInstance && typeof path === "string") {
                            const resolvedPath = processorInstance.resolvePath(path, event.detail.dataContextPath);
                            const value = processorInstance.getData(event.detail.sourceComponent, resolvedPath, surfaceKey);
                            if (value !== undefined) {
                                resolvedContext[item.key] = value;
                            }
                        }
                    }
                }
                const userAction = {
                    userAction: {
                        name: event.detail.action.name ?? "",
                        surfaceId: context.surfaceId ?? surfaceKey,
                        sourceComponentId: event.detail.sourceComponentId,
                        timestamp: new Date().toISOString(),
                        context: {
                            ...resolvedContext,
                            surfaceId: context.surfaceId ?? surfaceKey,
                        },
                    },
                };
                try {
                    console.info("[A2UI] Action dispatched", userAction.userAction);
                    copilotkit.setProperties({
                        ...(copilotkit.properties ?? {}),
                        a2uiAction: userAction,
                    });
                    await copilotkit.runAgent({ agent });
                }
                finally {
                    if (copilotkit.properties) {
                        const { a2uiAction, ...rest } = copilotkit.properties;
                        copilotkit.setProperties(rest);
                    }
                }
            }, [agent, copilotkit]);
            useEffect(() => {
                if (!content || !Array.isArray(content.operations)) {
                    processorsRef.current.forEach((processor) => processor.clearSurfaces());
                    processorsRef.current.clear();
                    lastSignatureRef.current = null;
                    setOperations([]);
                    return;
                }
                const processors = processorsRef.current;
                const incoming = content.operations;
                const signature = stringifyOperations(incoming);
                if (signature && signature === lastSignatureRef.current) {
                    return;
                }
                const groupedOperations = new Map();
                for (const operation of incoming) {
                    const surfaceId = getOperationSurfaceId(operation) ?? v0_8.Data.A2uiMessageProcessor.DEFAULT_SURFACE_ID;
                    if (!groupedOperations.has(surfaceId)) {
                        groupedOperations.set(surfaceId, []);
                    }
                    groupedOperations.get(surfaceId).push(operation);
                }
                groupedOperations.forEach((operationsForSurfaceId, surfaceId) => {
                    let processor = processors.get(surfaceId);
                    if (!processor) {
                        // Use signal-based processor for reactive updates (same as A2UIViewer)
                        processor = v0_8.Data.createSignalA2uiMessageProcessor();
                        processors.set(surfaceId, processor);
                    }
                    try {
                        processor.processMessages(operationsForSurfaceId);
                    }
                    catch (error) {
                        processors.delete(surfaceId);
                    }
                });
                const emptyProcessors = [];
                processors.forEach((processor, surfaceId) => {
                    if (processor.getSurfaces().size === 0) {
                        emptyProcessors.push(surfaceId);
                    }
                });
                if (emptyProcessors.length > 0) {
                    for (const surfaceId of emptyProcessors) {
                        processors.delete(surfaceId);
                    }
                }
                lastSignatureRef.current = signature;
                setOperations(incoming);
            }, [content]);
            const surfaceEntries = useMemo(() => {
                const entries = [];
                processorsRef.current.forEach((processor) => {
                    processor.getSurfaces().forEach((surface, surfaceId) => {
                        const typedSurface = surface;
                        if (typedSurface?.componentTree) {
                            entries.push({ id: surfaceId, surface: typedSurface, processor });
                        }
                    });
                });
                return entries;
            }, [operations]);
            if (!surfaceEntries.length) {
                return null;
            }
            return (_jsx("div", { className: "flex min-h-0 flex-1 flex-col gap-6 overflow-auto py-6", children: surfaceEntries.map(({ id, surface, processor }) => (_jsx(SurfaceHost, { actionLogger: actionLogger, processor: processor, surface: surface, surfaceId: id, theme: theme }, id))) }));
        },
    };
}
function getOperationSurfaceId(operation) {
    if (!operation || typeof operation !== "object") {
        return null;
    }
    if (typeof operation.surfaceId === "string") {
        return operation.surfaceId;
    }
    return (operation?.beginRendering?.surfaceId ??
        operation?.surfaceUpdate?.surfaceId ??
        operation?.dataModelUpdate?.surfaceId ??
        operation?.deleteSurface?.surfaceId ??
        null);
}
function stringifyOperations(ops) {
    try {
        return JSON.stringify(ops);
    }
    catch (error) {
        return null;
    }
}
function SurfaceHost({ actionLogger, processor, surface, surfaceId, theme }) {
    const elementRef = useRef(null);
    useEffect(() => {
        const element = elementRef.current;
        if (!element) {
            return;
        }
        element.processor = processor;
        element.surfaceId = surfaceId;
        element.surface = surface;
        element.onAction = actionLogger;
        element.theme = theme;
        return () => {
            if (elementRef.current === element) {
                element.onAction = null;
            }
        };
    }, [processor, surface, surfaceId, actionLogger, theme]);
    return (_jsx("div", { className: "flex w-full flex-none overflow-visible rounded-lg bg-white/5 p-4", children: React.createElement("themed-a2ui-surface", {
            ref: elementRef,
            className: "flex flex-1",
            style: { height: "auto", maxHeight: "70vh", overflow: "auto", display: "block" },
            "data-surface-id": surfaceId,
        }) }));
}
//# sourceMappingURL=A2UIMessageRenderer.js.map
