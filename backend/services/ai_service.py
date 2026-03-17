import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Verify the API key exists
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is missing. Please check your backend/.env file.")

genai.configure(api_key=api_key)

# We are using 'gemini-1.5-flash-latest' to bypass alias issues. 
# If this STILL fails, change this string to 'gemini-pro'
model = genai.GenerativeModel('gemini-2.5-flash')

def parse_ai_json(text: str) -> dict:
    """
    Hackathon savior function: 
    Sometimes AI wraps JSON in markdown blocks like ```json ... ```. 
    This safely strips that out so json.loads() doesn't crash.
    """
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
        
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
        
    return json.loads(cleaned.strip())


async def analyze_symptoms(symptoms: str) -> dict:
    prompt = f"""
    You are an AI health assistant. A user reports the following symptoms: "{symptoms}".
    Provide ONLY a valid JSON response strictly following this schema. Do not include any conversational text outside the JSON.
    {{
        "preliminary_assessment": "A concise 2-sentence assessment.",
        "recommendations": ["Actionable advice 1", "Actionable advice 2", "Actionable advice 3"],
        "disclaimer": "A standard medical disclaimer stating you are an AI, not a doctor."
    }}
    """
    response = model.generate_content(prompt)
    return parse_ai_json(response.text)


async def generate_diet_plan(age: int, height: float, weight: float, health_goal: str) -> dict:
    prompt = f"""
    You are an expert AI nutritionist. Generate a diet plan for a {age}-year-old, {height}cm tall, weighing {weight}kg. Goal: {health_goal}.
    Provide ONLY a valid JSON response strictly following this schema. Do not include any conversational text outside the JSON.
    {{
        "estimated_daily_calories": 2000,
        "meal_plan": {{
            "breakfast": "Description",
            "lunch": "Description",
            "dinner": "Description",
            "snacks": ["Snack 1", "Snack 2"]
        }},
        "hydration_goal": "Water intake advice",
        "disclaimer": "Standard health disclaimer."
    }}
    """
    response = model.generate_content(prompt)
    return parse_ai_json(response.text)