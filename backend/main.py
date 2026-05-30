from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router

# 1. Initialize the FastAPI app
app = FastAPI(
    title="InsureIntel AI Agent API",
    description="Modular Agentic RAG pipeline for insurance document analysis.",
    version="1.0.0"
)

# 2. Configure CORS to allow communication with your Next.js frontend
# Ensure the origins match exactly where your frontend is running (usually localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Include the modular routes from your app/api/endpoints.py
app.include_router(router)

# 4. Optional: Root endpoint to test if the server is live
@app.get("/")
async def root():
    return {"message": "InsureIntel AI Backend is online."}