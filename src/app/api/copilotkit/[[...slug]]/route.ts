import {
  CopilotRuntime,
  createCopilotEndpoint,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { handle } from "hono/vercel";
import { AgentSpecAgent } from "@/lib/agents/agent-spec";

const agent = new AgentSpecAgent({
    url:
      process.env.AGENT_URL ||
      process.env.NEXT_PUBLIC_AGENT_URL ||
      "http://localhost:8000/",
  })

const runtime = new CopilotRuntime({
  agents: {my_a2ui_agent: agent},
  runner: new InMemoryAgentRunner(),
});

const app = createCopilotEndpoint({ runtime, basePath: "/api/copilotkit" });

export const GET = handle(app);
export const POST = handle(app);
