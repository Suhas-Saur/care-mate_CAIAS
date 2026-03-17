from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers from the 'routes' package
from routes import symptom, diet, records

# 1. Initialize the FastAPI application
app = FastAPI(
    title="CareMate AI Backend",
    description="Backend API for CareMate AI.",
    version="1.0.0"
)

# 2. Configure CORS so the React frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Your Vite frontend URL
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

# 3. Include routers WITHOUT prefixes
# This ensures your endpoints are exactly at /symptom-check and /diet-recommendation
# matching what your React frontend is trying to call.
app.include_router(symptom.router, tags=["Symptoms"])
app.include_router(diet.router, tags=["Diet"])
app.include_router(records.router, tags=["Records"])

# 4. Define the root endpoint
@app.get("/", tags=["Health"])
async def root():
    """
    Root endpoint used primarily for health checks.
    """
    return {"message": "CareMate AI backend is running"}