from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

# Import the mock AI service function
from services.ai_service import generate_diet_plan

# 1. Initialize the router
router = APIRouter()

# 2. Define the Pydantic model for the request body
class DietRequest(BaseModel):
    """
    Pydantic model to validate the incoming JSON payload for diet recommendations.
    Includes constraints to ensure realistic health data is provided.
    """
    age: int = Field(..., gt=0, le=120, description="Age of the user in years")
    height: float = Field(..., gt=0, description="Height of the user in centimeters (cm)")
    weight: float = Field(..., gt=0, description="Weight of the user in kilograms (kg)")
    health_goal: str = Field(
        ..., 
        min_length=3, 
        description="The user's primary health goal (e.g., 'weight loss', 'muscle gain', 'maintenance')"
    )

# 3. Create the POST endpoint
@router.post("/diet-recommendation", summary="Generate an AI diet plan")
async def get_diet_recommendation(payload: DietRequest):
    """
    Accepts user health metrics and goals to generate a personalized diet plan using AI.
    """
    try:
        # Pass the validated data to the AI service
        # Awaiting the async function so the server isn't blocked during generation
        diet_plan = await generate_diet_plan(
            age=payload.age,
            height=payload.height,
            weight=payload.weight,
            health_goal=payload.health_goal
        )
        
        # Return the AI-generated plan wrapped in a standard JSON response structure
        return {
            "status": "success",
            "data": diet_plan
        }
        
    except ValueError as ve:
        # Handle specific validation or logic errors from the service layer
        raise HTTPException(
            status_code=400,
            detail=f"Invalid input data: {str(ve)}"
        )
    except Exception as e:
        # Catch broader errors (like AI service downtime) and return a 500 error
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while generating the diet plan: {str(e)}"
        )