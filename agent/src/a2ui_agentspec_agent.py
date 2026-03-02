from __future__ import annotations

import os
import json

import dotenv
dotenv.load_dotenv()

from pyagentspec.agent import Agent
from pyagentspec.llms import OpenAiCompatibleConfig
from pyagentspec.serialization import AgentSpecSerializer
from pyagentspec.tools import ServerTool, ClientTool
from pyagentspec.property import StringProperty
from pyagentspec.llms.openaiconfig import OpenAIAPIType
from pyagentspec.llms.llmgenerationconfig import LlmGenerationConfig
from pathlib import Path

a2ui_prompts_folder = Path(__file__).resolve().parent / "a2ui_prompts"
A2UI_JSON_SCHEMA = (a2ui_prompts_folder / "a2ui_schema.json").read_text(encoding="utf-8")
A2UI_PROMPT = (a2ui_prompts_folder / "a2ui_prompt.txt").read_text(encoding="utf-8")

A2UI_JSON_SCHEMA_PROMPT = f"""
# JSON Schema Reference
---BEGIN A2UI JSON SCHEMA---
{A2UI_JSON_SCHEMA}
---END A2UI JSON SCHEMA---
"""

a2ui_calendar_component_json = (a2ui_prompts_folder / "calendar.json").read_text(encoding="utf-8")
a2ui_calendar_update_json = (a2ui_prompts_folder / "calendar_update.json").read_text(encoding="utf-8")

a2ui_email_component_json = (a2ui_prompts_folder / "email_form.json").read_text(encoding="utf-8")
a2ui_email_update_json = (a2ui_prompts_folder / "email_form_update.json").read_text(encoding="utf-8")


A2UI_SYSTEM_PROMPT = f"""You are a helpful assistant that can render rich UI surfaces using the A2UI protocol.

When the user asks for visual content (cards, forms, lists, buttons, etc.), use the send_a2ui_json_to_client tool to render A2UI surfaces.

{A2UI_PROMPT}

{A2UI_JSON_SCHEMA_PROMPT}

# Your Concrete Task

You are a Scheduling Assistant.
Using the following Calendar component and example Calendar data update, please help the user manage their calendar. In particular, always render the user's schedule with this component.
Using the following Email Form component and example Email data update, please help the user manage their emails. In particular, always render emails using this component.

---BEGIN CALENDAR COMPONENT EXAMPLE---
{a2ui_calendar_component_json}
---END CALENDAR COMPONENT EXAMPLE---

---BEGIN CALENDAR DATA UPDATE EXAMPLE---
{a2ui_calendar_update_json}
---END CALENDAR DATA UPDATE EXAMPLE---

---BEGIN EMAIL FORM COMPONENT EXAMPLE---
{a2ui_email_component_json}
---END EMAIL FORM COMPONENT EXAMPLE---

---BEGIN EMAIL FORM DATA UPDATE EXAMPLE---
{a2ui_email_update_json}
---END EMAIL FORM DATA UPDATE EXAMPLE---

# Your Concrete Task

You are a Scheduling Assistant.
Using the following Calendar component and example Calendar data update, please help the user manage their calendar. In particular, always render the user's schedule with this component.
Using the following Email Form component and example Email data update, please help the user manage their emails. In particular, always render emails using this component.

# Reminders

Please refer to the instructions in the **## A2UI Protocol Instructions** above for how to generate valid send_a2ui_json_to_client tool calls with the valid a2ui_json structure.
Please make sure to always generate valid JSON (double-quoted property names).
Please follow the A2UI JSON SCHEMA to generate valid a2ui_json structure.
Today's date: 2026-02-01. When the user asks a question without a specific date, assume they mean today.
Note that when updating the schedule, you can add extra time slots if needed.
IMPORTANT: when updating the schedule, please repeat all existing events, because your update will override any existing data!
"""


# A2UI_SYSTEM_PROMPT = f"""You are a helpful assistant that can render rich UI surfaces using the A2UI protocol.

# When the user asks for visual content (cards, forms, lists, buttons, etc.), use the send_a2ui_json_to_client tool to render A2UI surfaces.

# {A2UI_PROMPT}

# {A2UI_JSON_SCHEMA_PROMPT}
# """

agent_llm = OpenAiCompatibleConfig(
    name="my_llm",
    model_id=os.environ.get("OPENAI_MODEL", "gpt-5.2"),
    url=os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1"),
    api_type=OpenAIAPIType.RESPONSES,
    default_generation_parameters=LlmGenerationConfig(reasoning={"effort": "none"})
)

send_a2ui_json_to_client_tool = ClientTool(
    name="send_a2ui_json_to_client",
    description="Sends A2UI JSON to the client to render rich UI for the user. " +
    "This tool can be called multiple times in the same call to render multiple UI surfaces. " +
    "The A2UI JSON Schema definition is between ---BEGIN A2UI JSON SCHEMA--- and ---END A2UI JSON SCHEMA--- in the system instructions.",
    inputs=[StringProperty(title="a2ui_json", description="Valid A2UI JSON Schema to send to the client.")]
)

check_user_inbox_tool = ServerTool(
    name="check_user_inbox",
    description="Checks the user's inbox. Searches based on keywords.",
    inputs=[StringProperty(title="search_query")],
    outputs=[StringProperty(title="email_content")],
)

get_user_schedule_tool = ServerTool(
    name="get_user_schedule",
    description="Retrieves the user's schedule for today. No inputs needed.",
)

agent = Agent(
    name="a2ui_chat_agent",
    llm_config=agent_llm,
    system_prompt=A2UI_SYSTEM_PROMPT,
    tools=[send_a2ui_json_to_client_tool, check_user_inbox_tool, get_user_schedule_tool]
)

a2ui_chat_json = AgentSpecSerializer().to_json(agent)

demo_schedule = [
    ("08:00-09:00", "Morning Meeting"),
    ("09:00-10:00", "Project Work"),
    ("10:00-11:00", "Available"),
    ("11:00-11:30", "Client Call"),
    ("12:00-13:00", "Lunch Break"),
    ("13:00-14:00", "Available"),
    ("14:00-15:00", "Team Sync"),
    ("15:00-16:00", "Available"),
    ("16:00-16:30", "Report Review"),
    ("17:00-", "Available"),
]

def user_schedule_tool(*args, **kwargs):
    return str(demo_schedule)

def check_inbox_tool(*args, **kwargs):
    return "From: david.dave@company.org\nTo: joe.charlie@company.org\nSubject: Quick Sync\n\nHey, I need to loop you in with some colleagues for a meeting to set up a new project. When would you be available? Please reply asap"

a2ui_demo_tool_registry = {
    "check_user_inbox": check_inbox_tool,
    "get_user_schedule": user_schedule_tool 
}
