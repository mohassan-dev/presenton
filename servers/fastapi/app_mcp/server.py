from fastmcp import FastMCP
from app_mcp.tools import register_tools
from app_mcp.services.workflow_orchestrator import WorkflowOrchestrator

def create_mcp_server():
    print("DEBUG: Creating FastMCP instance...")
    mcp = FastMCP("PresentonMCP")
    print("DEBUG: FastMCP instance created successfully")
    
    print("DEBUG: Initializing WorkflowOrchestrator...")
    orchestrator = WorkflowOrchestrator()
    print("DEBUG: WorkflowOrchestrator initialized successfully")
    
    print("DEBUG: Registering tools...")
    register_tools(mcp, orchestrator)
    print("DEBUG: All tools registered successfully")
    
    print("DEBUG: MCP server created successfully.")
    return mcp

uvicorn_config = {
    "reload": True,
}
