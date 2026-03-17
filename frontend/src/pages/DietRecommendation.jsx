import React, { useState } from 'react';
import { getDietRecommendation } from '../services/api';

export default function DietRecommendation() {
  const [formData, setFormData] = useState({ age: '', height: '', weight: '', health_goal: 'weight loss' });
  const [dietPlan, setDietPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setDietPlan(null);

    try {
      const plan = await getDietRecommendation(formData);
      setDietPlan(plan);
    } catch (err) {
      setError('Failed to connect to the backend server.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Diet Recommendation</h2>
        <p style={{ color: '#64748b' }}>Enter your metrics to generate an AI meal plan.</p>
      </header>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <form onSubmit={handleSubmit} style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Age (years)</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required min="1" style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Height (cm)</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} required min="1" style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Weight (kg)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} required min="1" style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Health Goal</label>
            <select name="health_goal" value={formData.health_goal} onChange={handleChange} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="weight loss">Weight Loss</option>
              <option value="muscle gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Generating...' : 'Get Diet Plan'}
          </button>
          
          {error && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}
        </form>

        {dietPlan && (
          <div style={{ flex: '2 1 400px', backgroundColor: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>Your Personalized Plan</h3>
            <div style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '24px', fontSize: '0.95rem', marginBottom: '24px' }}>
              Estimated Daily Calories: <strong>{dietPlan.estimated_daily_calories} kcal</strong>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1.1rem', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '8px' }}>Meals</h4>
              <p style={{ color: '#475569', lineHeight: '1.6' }}><strong>Breakfast:</strong> {dietPlan.meal_plan.breakfast}</p>
              <p style={{ color: '#475569', lineHeight: '1.6' }}><strong>Lunch:</strong> {dietPlan.meal_plan.lunch}</p>
              <p style={{ color: '#475569', lineHeight: '1.6' }}><strong>Dinner:</strong> {dietPlan.meal_plan.dinner}</p>
            </div>

            <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '8px', fontWeight: '500' }}>
              💧 Hydration: {dietPlan.hydration_goal}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}