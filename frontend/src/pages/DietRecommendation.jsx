import React, { useState } from 'react';

export default function DietRecommendation() {
  // Form state
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    health_goal: 'weight loss', // default option
  });

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setDietPlan(null);

    try {
      // Send data to the FastAPI backend
      const response = await fetch('http://localhost:8000/api/diet/diet-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Convert age, height, and weight to numbers to pass Pydantic validation
        body: JSON.stringify({
          age: parseInt(formData.age, 10),
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          health_goal: formData.health_goal,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to generate diet plan');
      }

      const result = await response.json();
      setDietPlan(result.data); // Store the AI response in state

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Diet Recommendation</h2>
        <p style={styles.description}>
          Enter your metrics below to generate a personalized, AI-driven meal plan.
        </p>
      </header>

      <div style={styles.contentWrapper}>
        {/* Input Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Age (years)</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              max="120"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              min="1"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              min="1"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Health Goal</label>
            <select
              name="health_goal"
              value={formData.health_goal}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="weight loss">Weight Loss</option>
              <option value="muscle gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="better energy">Better Energy</option>
            </select>
          </div>

          <button 
            type="submit" 
            style={{ ...styles.submitButton, opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Generating Plan...' : 'Generate Diet Plan'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results Display */}
        {dietPlan && (
          <div style={styles.resultsCard}>
            <h3 style={styles.resultsTitle}>Your Personalized Plan</h3>
            <div style={styles.metricBadge}>
              Estimated Daily Calories: <strong>{dietPlan.estimated_daily_calories} kcal</strong>
            </div>
            
            <div style={styles.mealSection}>
              <h4 style={styles.mealTitle}>Breakfast</h4>
              <p style={styles.mealText}>{dietPlan.meal_plan.breakfast}</p>
            </div>
            
            <div style={styles.mealSection}>
              <h4 style={styles.mealTitle}>Lunch</h4>
              <p style={styles.mealText}>{dietPlan.meal_plan.lunch}</p>
            </div>
            
            <div style={styles.mealSection}>
              <h4 style={styles.mealTitle}>Dinner</h4>
              <p style={styles.mealText}>{dietPlan.meal_plan.dinner}</p>
            </div>

            <div style={styles.mealSection}>
              <h4 style={styles.mealTitle}>Snacks</h4>
              <ul style={{ paddingLeft: '20px', margin: '4px 0', color: '#475569' }}>
                {dietPlan.meal_plan.snacks.map((snack, index) => (
                  <li key={index}>{snack}</li>
                ))}
              </ul>
            </div>

            <div style={styles.hydrationBox}>
              <strong>💧 Hydration:</strong> {dietPlan.hydration_goal}
            </div>

            <p style={styles.disclaimer}>*{dietPlan.disclaimer}*</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Inline Styles
// ----------------------------------------------------------------------
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
  },
  description: {
    fontSize: '1rem',
    color: '#64748b',
  },
  contentWrapper: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  form: {
    flex: '1 1 300px',
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    outline: 'none',
  },
  submitButton: {
    marginTop: '8px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#10b981', // A healthy green color
    color: '#ffffff',
    border: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  errorBox: {
    flex: '1 1 100%',
    padding: '16px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    borderRadius: '8px',
    border: '1px solid #f87171',
  },
  resultsCard: {
    flex: '2 1 400px',
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  resultsTitle: {
    fontSize: '1.5rem',
    color: '#0f172a',
    marginBottom: '16px',
  },
  metricBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '24px',
    fontSize: '0.95rem',
    marginBottom: '24px',
  },
  mealSection: {
    marginBottom: '16px',
  },
  mealTitle: {
    fontSize: '1.1rem',
    color: '#334155',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '4px',
    marginBottom: '8px',
  },
  mealText: {
    color: '#475569',
    lineHeight: '1.5',
  },
  hydrationBox: {
    marginTop: '24px',
    padding: '12px',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    borderRadius: '8px',
    fontWeight: '500',
  },
  disclaimer: {
    marginTop: '24px',
    fontSize: '0.85rem',
    color: '#94a3b8',
    textAlign: 'center',
  }
};