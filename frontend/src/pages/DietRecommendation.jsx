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
    setIsLoading(true); setError(null); setDietPlan(null);
    try {
      const plan = await getDietRecommendation(formData);
      setDietPlan(plan);
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', outline: 'none', fontSize: '0.95rem' };
  const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Diet Recommendation</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Personalized nutrition planning powered by AI.</p>
      </header>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <form onSubmit={handleSubmit} style={{ flex: '1 1 350px', backgroundColor: 'var(--surface)', padding: '32px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', fontWeight: '700' }}>Patient Metrics</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label style={labelStyle}>Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} required min="1" style={inputStyle} /></div>
            <div><label style={labelStyle}>Weight (kg)</label><input type="number" name="weight" value={formData.weight} onChange={handleChange} required min="1" style={inputStyle} /></div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Height (cm)</label><input type="number" name="height" value={formData.height} onChange={handleChange} required min="1" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Primary Goal</label>
            <select name="health_goal" value={formData.health_goal} onChange={handleChange} style={inputStyle}>
              <option value="weight loss">Weight Loss</option>
              <option value="muscle gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: 'var(--success)', color: '#fff', border: 'none', fontWeight: '600', fontSize: '1rem', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, transition: 'background-color 0.2s' }}>
            {isLoading ? 'Processing...' : 'Generate Plan'}
          </button>
          
          {error && <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        </form>

        {dietPlan && (
          <div className="animate-fade-in" style={{ flex: '2 1 450px', backgroundColor: 'var(--surface)', padding: '40px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--bg-main)', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Nutrition Plan</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Target: {formData.health_goal.toUpperCase()}</p>
              </div>
              <div style={{ textAlign: 'right', padding: '12px 20px', backgroundColor: 'var(--success-light)', borderRadius: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '700', textTransform: 'uppercase' }}>Daily Calories</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#166534', margin: 0 }}>{dietPlan.estimated_daily_calories} <span style={{fontSize:'1rem'}}>kcal</span></p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              {['breakfast', 'lunch', 'dinner'].map(meal => (
                <div key={meal} style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: '8px' }}>
                  <h4 style={{ textTransform: 'capitalize', color: 'var(--primary)', fontWeight: '700', marginBottom: '8px' }}>{meal}</h4>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>{dietPlan.meal_plan[meal]}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--primary-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>💧</span>
              <div>
                <h4 style={{ color: 'var(--primary)', fontWeight: '700', margin: 0 }}>Hydration Goal</h4>
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', margin: 0 }}>{dietPlan.hydration_goal}</p>
              </div>
            </div>
            
            <p style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>* CareMate AI is an AI tool, not a doctor. Always consult a healthcare professional for medical advice.</p>
          </div>
        )}
      </div>
    </div>
  );
}