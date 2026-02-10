import logging
import os
from ag_ui_agentspec.endpoint import add_agentspec_fastapi_endpoint
from fastapi import FastAPI
import uvicorn

from agent import build_agentspec_agent, build_a2ui_chat_agent


def configure_logging() -> None:
    """Enable INFO logs for ag_ui_agentspec and pyagentspec and attach a console handler.

    Uvicorn's default logging config doesn't automatically show 3rd‑party logger output.
    We install a root handler and set levels explicitly so logs appear in the terminal.
    """
    root = logging.getLogger()
    if not root.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s"))
        root.addHandler(handler)
    root.setLevel(logging.INFO)
    for h in root.handlers:
        try:
            h.setLevel(logging.INFO)
        except Exception:
            pass

    # Turn on INFO for relevant namespaces and propagate to root
    for name in (
        "ag_ui_agentspec",
        "ag_ui_agentspec.endpoint",
        "ag_ui_agentspec.tracing",
        "pyagentspec",
        "wayflowcore",
    ):
        lg = logging.getLogger(name)
        lg.setLevel(logging.INFO)
        lg.propagate = True

    # Also make uvicorn loggers propagate to our root handler
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        lg = logging.getLogger(name)
        lg.setLevel(logging.INFO)
        lg.propagate = True


def build_server() -> FastAPI:
    configure_logging()
    app = FastAPI(title="Agent Spec Agent")
    agent = build_a2ui_chat_agent(runtime="langgraph")
    add_agentspec_fastapi_endpoint(app, agent, path="/")
    return app


app = build_server()


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=True,
        log_level="info",
        log_config=None,  # use our logging config below
    )
