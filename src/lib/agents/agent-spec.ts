import { HttpAgent } from "@ag-ui/client";
import { A2UIMiddleware } from "@ag-ui/a2ui-middleware";

// Agent Spec client for this app:
// - Always enables A2UI middleware (backend already supports A2UI)
// - URL resolution order: explicit config.url → AGENT_URL → NEXT_PUBLIC_AGENT_URL → default
export class AgentSpecAgent extends HttpAgent {
  constructor(config?: ConstructorParameters<typeof HttpAgent>[0]) {
    const resolvedUrl =
      (config && (config as any).url) ||
      process.env.AGENT_URL ||
      process.env.NEXT_PUBLIC_AGENT_URL ||
      "http://localhost:8000/";

    super({ ...(config as any), url: resolvedUrl });
    this.use(new A2UIMiddleware({ systemInstructionsAdded: true }));
  }
}
