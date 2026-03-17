// Define the base URL for your FastAPI backend
// If you deploy your app later, you can easily swap this out using environment variables 
// e.g., const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const BASE_URL = 'http://localhost:8000/api';

export async function checkSymptoms(symptoms) {
  const response = await fetch("http://localhost:8000/symptom-check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ symptoms })
  });

  return response.json();
}

export async function getDietRecommendation(data) {
  const response = await fetch("http://localhost:8000/diet-recommendation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response.json();
}

/**
 * Sends user symptoms to the AI for a preliminary check.
 * * @param {string} description - The user's typed symptoms.
 * @returns {Promise<Object>} The AI analysis data.
 */
export const checkSymptoms = async (description) => {
  const response = await fetch(`${BASE_URL}/symptoms/symptom-check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

/**
 * Generates a personalized diet plan based on user metrics.
 * * @param {Object} metrics - Contains age, height, weight, and health_goal.
 * @returns {Promise<Object>} The generated diet plan.
 */
export const getDietRecommendation = async (metrics) => {
  const response = await fetch(`${BASE_URL}/diet/diet-recommendation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      age: parseInt(metrics.age, 10),
      height: parseFloat(metrics.height),
      weight: parseFloat(metrics.weight),
      health_goal: metrics.health_goal,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

/**
 * Uploads a medical record file to the server securely.
 * * @param {File} file - The file object selected by the user.
 * @returns {Promise<Object>} The server's success message and filename.
 */
export const uploadMedicalRecord = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/records/upload-record`, {
    method: 'POST',
    // Note: Do NOT manually set the 'Content-Type' to 'multipart/form-data'.
    // The browser automatically sets the correct header and boundary when passing FormData.
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload failed with status: ${response.status}`);
  }

  return await response.json();
};