from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import analyze_symptoms

router = APIRouter()

class SymptomRequest(BaseModel):
    symptoms: str

@router.post("/symptom-check")
async def check_symptoms(payload: SymptomRequest):
    try:
        # Pass the validated string directly to the AI service
        ai_response = await analyze_symptoms(payload.symptoms)
        return {"status": "success", "data": ai_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis Failed: {str(e)}")