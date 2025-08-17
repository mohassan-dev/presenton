import sys
import os
import argparse
import asyncio
import traceback

from app_mcp.server import create_mcp_server, uvicorn_config

async def main():
    try:
        print("DEBUG: MCP Server startup initiated")
        parser = argparse.ArgumentParser(description="Run the FastAPI server")
        parser.add_argument(
            "--port", type=int, default=8001, help="Port number to run the server on"
        )
        args = parser.parse_args()
        print(f"DEBUG: Parsed args - port: {args.port}")

        print("DEBUG: Creating MCP server...")
        mcp = create_mcp_server()
        print("DEBUG: MCP server created successfully")
        
        print(f"DEBUG: Starting MCP server on host=0.0.0.0, port={args.port}")
        await mcp.run_async(
            transport="http",
            host="0.0.0.0",
            port=args.port,
            uvicorn_config=uvicorn_config
        )
        print("DEBUG: MCP server run_async completed")
    except Exception as e:
        print(f"ERROR: MCP server startup failed: {e}")
        print(f"ERROR: Traceback: {traceback.format_exc()}")
        raise

if __name__ == "__main__":
    print("DEBUG: Starting MCP main function")
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"FATAL ERROR: {e}")
        print(f"FATAL TRACEBACK: {traceback.format_exc()}")
        sys.exit(1)
