const BASE_URL = 'http://localhost:8000';

export const checkSymptoms = async (symptomsText) => {
  const response = await fetch(`${BASE_URL}/symptom-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms: symptomsText }),
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
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
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  const result = await response.json();
  return result.data;
};

export const uploadMedicalRecord = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${BASE_URL}/upload-record`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
  return await response.json();
};

export const getMedicalRecords = async () => {
  const response = await fetch(`${BASE_URL}/records`);
  if (!response.ok) throw new Error(`Failed to fetch records: ${response.status}`);
  const result = await response.json();
  return result.data;
};

// --- NEW: Delete a specific record ---
export const deleteRecord = async (filename) => {
  const response = await fetch(`${BASE_URL}/records/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete: ${response.status}`);
  return await response.json();
};

// --- NEW: Delete all records ---
export const deleteAllRecords = async () => {
  const response = await fetch(`${BASE_URL}/records`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete all: ${response.status}`);
  return await response.json();
};