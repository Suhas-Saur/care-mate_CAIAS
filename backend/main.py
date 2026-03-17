import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import routers from the 'routes' package
from routes import symptom, diet, records

# Initialize the FastAPI application
app = FastAPI(
    title="CareMate AI Backend",
    description="Backend API for CareMate AI.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# --- NEW: Serve Static Files ---
# Ensure the uploads directory exists before mounting to prevent startup crashes
os.makedirs("uploads", exist_ok=True)
# This allows the frontend to access files via http://localhost:8000/uploads/filename.ext
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(symptom.router, tags=["Symptoms"])
app.include_router(diet.router, tags=["Diet"])
app.include_router(records.router, tags=["Records"])

# Define the root endpoint
@app.get("/", tags=["Health"])
async def root():
    return {"message": "CareMate AI backend is running"}