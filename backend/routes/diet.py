from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import generate_diet_plan

router = APIRouter()

class DietRequest(BaseModel):
    age: int
    height: float
    weight: float
    health_goal: str

@router.post("/diet-recommendation")
async def get_diet_recommendation(payload: DietRequest):
    try:
        diet_plan = await generate_diet_plan(
            age=payload.age, 
            height=payload.height, 
            weight=payload.weight, 
            health_goal=payload.health_goal
        )
        return {"status": "success", "data": diet_plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Diet Generation Failed: {str(e)}")