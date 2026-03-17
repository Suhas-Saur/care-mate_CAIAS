from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

# Assuming you have a services folder with an ai_service.py file
# and an async function called analyze_symptoms
from services.ai_service import analyze_symptoms

# 1. Initialize the router
router = APIRouter()

# 2. Define the Pydantic model for the request body
class SymptomRequest(BaseModel):
    """
    Pydantic model to validate incoming JSON payload.
    Requires a 'symptoms' string. Added a minimum length for basic validation.
    """
    # CHANGED: 'description' is now 'symptoms'
    symptoms: str = Field(..., min_length=5, description="A detailed description of the symptoms.")

# 3. Create the POST endpoint
@router.post("/symptom-check", summary="Analyze symptoms using AI")
async def check_symptoms(payload: SymptomRequest):
    """
    Accepts a symptom description and passes it to the AI service for analysis.
    
    - **symptoms**: The user's typed out symptoms (e.g., "I have a headache and mild fever")
    """
    try:
        # Call the external AI service function
        # CHANGED: Passed payload.symptoms instead of payload.description
        ai_response = await analyze_symptoms(payload.symptoms)
        
        # FastAPI automatically serializes dictionaries to JSON
        return {
            "status": "success",
            "data": ai_response
        }
        
    except Exception as e:
        # Catch any errors (like AI service timeouts or failures) and return a clean HTTP 500 error
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while analyzing symptoms: {str(e)}"
        )