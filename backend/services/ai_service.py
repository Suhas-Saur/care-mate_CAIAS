import os
import json
from dotenv import load_dotenv

# Try to import the Google generative AI client; if unavailable, fall back to mock mode.
try:
    import google.generativeai as genai
    _GENAI_AVAILABLE = True
except Exception:
    genai = None
    _GENAI_AVAILABLE = False

# Load environment variables
load_dotenv()

# Read API key (may be None)
api_key = os.getenv("GEMINI_API_KEY")

# Development-friendly mock mode: enabled when the client or API key is missing
MOCK_MODE = not (_GENAI_AVAILABLE and api_key)

if not MOCK_MODE:
    genai.configure(api_key=api_key)
    # Use a stable model string; can be changed via env if needed
    model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-2.5-flash"))


def parse_ai_json(text: str) -> dict:
    """Safely extract JSON from model output, stripping markdown fences if present."""
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return json.loads(cleaned.strip())


async def analyze_symptoms(symptoms: str) -> dict:
    """Return a structured symptom analysis. Uses the real model when available, otherwise returns a mock response."""
    if MOCK_MODE:
        # Provide a deterministic mock response suitable for frontend development and testing
        return {
            "preliminary_assessment": "Symptoms could indicate a mild viral infection or common cold. Monitor for worsening signs.",
            "recommendations": [
                "Rest and stay hydrated.",
                "Use over-the-counter symptom relief as needed.",
                "Seek immediate care if breathing worsens or high fever persists."
            ],
            "disclaimer": "I am an AI assistant, not a medical professional. This is not medical advice."
        }

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
    # genai responses usually expose `.text`
    text = getattr(response, "text", str(response))
    return parse_ai_json(text)


async def generate_diet_plan(age: int, height: float, weight: float, health_goal: str) -> dict:
    """Return a diet plan JSON; use the real model when available otherwise return a sensible mock plan."""
    if MOCK_MODE:
        est_calories = 2000
        # crude mock adjustment
        if health_goal and "lose" in health_goal.lower():
            est_calories = 1800
        elif health_goal and "gain" in health_goal.lower():
            est_calories = 2500

        return {
            "estimated_daily_calories": est_calories,
            "meal_plan": {
                "breakfast": "Oatmeal with fruit and a protein source (eggs or yogurt).",
                "lunch": "Lean protein, mixed vegetables, and a whole grain (eg chicken, quinoa).",
                "dinner": "Balanced plate with protein, vegetables, and healthy fats.",
                "snacks": ["Greek yogurt", "Nuts and fruit"]
            },
            "hydration_goal": "Aim for 8 cups (about 2 liters) of water daily, adjust for activity.",
            "disclaimer": "This is a general recommendation and not a substitute for professional medical advice."
        }

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
    text = getattr(response, "text", str(response))
    return parse_ai_json(text)