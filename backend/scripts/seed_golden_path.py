import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from datetime import datetime, timedelta, timezone

from app.core.config import settings
from app.models import ProjectSession

# Setup timestamps
now = datetime.now(timezone.utc)
eight_mins_ago_dt = now - timedelta(minutes=8)
three_mins_ago_dt = now - timedelta(minutes=3)

eight_mins_ago = eight_mins_ago_dt.isoformat()
three_mins_ago = three_mins_ago_dt.isoformat()

# Message 2 XML content
msg2_content = """<role>
  You are a senior backend architect with deep expertise in API design, distributed systems, and production-grade server engineering.
</role>
<instructions>
  <step>Step 1: Define the tech stack and framework requirements.</step>
  <step>Step 2: Design the authentication and authorization patterns.</step>
  <step>Step 3: Specify the request and response schemas with input validation rules.</step>
  <step>Step 4: Implement a robust error handling strategy with HTTP status codes.</step>
  <step>Step 5: Design the database schema and ORM patterns.</step>
  <step>Step 6: Integrate security constraints, CORS, and rate limiting.</step>
  <step>Step 7: Specify logging, monitoring, and observability requirements.</step>
</instructions>
<constraints>
  - Must use a modern framework and language.
  - Must define explicit input validation rules.
  - Must use correct HTTP status codes for all success and failure flows.
  - Must enforce strict rate limiting.
</constraints>
<output_format>
  Return a comprehensive backend engineering specification for the REST API in markdown format.
</output_format>"""

# Message 4 XML content
msg4_content = msg2_content + """\n\n<authentication>
  - Use JSON Web Tokens (JWT) for authentication.
  - Access tokens must have a 15-minute expiration time.
  - Refresh tokens must be stored securely in the database and rotated on use.
  - Implement role-based access control (RBAC) with 'admin', 'editor', and 'viewer' roles.
</authentication>
<pagination>
  - Implement keyset pagination (cursor-based) for the task list endpoint.
  - Default page size: 20 items; maximum page size: 100 items.
  - Return next/prev cursor links in the response envelope.
</pagination>"""

async def main():
    print("Connecting to database...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(database=client[settings.DATABASE_NAME], document_models=[ProjectSession])
    
    print("Deleting existing golden path session if any...")
    deleted = await ProjectSession.find(ProjectSession.workspace_id == "demo-golden-path").delete()
    print(f"Deleted {deleted} session(s).")
    
    print("Creating the golden path session...")
    messages = [
        {
            "role": "user",
            "content": "Build me a REST API for a task management app",
            "timestamp": eight_mins_ago
        },
        {
            "role": "assistant",
            "content": msg2_content,
            "timestamp": eight_mins_ago
        },
        {
            "role": "user",
            "content": "Now add JWT authentication and pagination to that",
            "timestamp": three_mins_ago
        },
        {
            "role": "assistant",
            "content": msg4_content,
            "timestamp": three_mins_ago
        }
    ]
    
    session = ProjectSession(
        workspace_id="demo-golden-path",
        title="Backend Dev + Claude — Power Combo Demo",
        messages=messages,
        created_at=eight_mins_ago_dt,
        updated_at=three_mins_ago_dt
    )
    
    await session.insert()
    print(f"Golden path session seeded successfully! Session ID: {session.id}")

if __name__ == "__main__":
    asyncio.run(main())
