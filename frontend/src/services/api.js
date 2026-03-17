const BASE_URL = 'http://localhost:8000';

export const checkSymptoms = async (symptomsText) => {
  const response = await fetch(`${BASE_URL}/symptom-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms: symptomsText }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const result = await response.json();
  return result.data; 
};

export const getDietRecommendation = async (metrics) => {
  const response = await fetch(`${BASE_URL}/diet-recommendation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      age: parseInt(metrics.age, 10),
      height: parseFloat(metrics.height),
      weight: parseFloat(metrics.weight),
      health_goal: metrics.health_goal,
    }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};