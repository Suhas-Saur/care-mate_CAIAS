from fastapi import FastAPI

# Import routers from the 'routes' package
# Ensure you have a 'routes' folder with __init__.py and these module files
from routes import symptom, diet, records

# 1. Initialize the FastAPI application
app = FastAPI(
    title="CareMate AI Backend",
    description="Backend API for CareMate AI, handling symptoms, diet tracking, and health records.",
    version="1.0.0"
)

# 2. Include routers
# Prefixes keep URLs organized (e.g., /api/symptoms). 
# Tags group related endpoints together in the auto-generated documentation.
app.include_router(symptom.router, prefix="/api/symptoms", tags=["Symptoms"])
app.include_router(diet.router, prefix="/api/diet", tags=["Diet"])
app.include_router(records.router, prefix="/api/records", tags=["Records"])

# 3. Define the root endpoint
@app.get("/", tags=["Health"])
async def root():
    """
    Root endpoint used primarily for health checks to verify the server is active.
    """
    return {"message": "CareMate AI backend is running"}