import React, { useState } from 'react';

export default function Register({ onNavigateLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      // Fetch existing users or initialize empty object
      const existingUsers = JSON.parse(localStorage.getItem('caremate_users') || '{}');

      if (existingUsers[formData.username]) {
        setError('Username already exists. Please choose another.');
        setIsLoading(false);
        return;
      }

      // Save new user
      existingUsers[formData.username] = formData.password;
      localStorage.setItem('caremate_users', JSON.stringify(existingUsers));

      setSuccess(true);
      setIsLoading(false);
      
      // Auto-redirect to login after a short delay
      setTimeout(() => {
        onNavigateLogin();
      }, 1500);

    }, 600);
  };

  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', outline: 'none', fontSize: '0.95rem', color: 'var(--text-main)' };
  const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-main)' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--surface)', padding: '40px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', margin: '0 auto 16px auto', fontWeight: 'bold' }}>+</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Join CareMate AI today.</p>
        </div>

        {success ? (
          <div className="animate-fade-in" style={{ padding: '20px', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: '8px', textAlign: 'center', fontWeight: '600' }}>
            Account created successfully! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div><label style={labelStyle}>Username</label><input type="text" name="username" value={formData.username} onChange={handleChange} required style={inputStyle} /></div>
            <div><label style={labelStyle}>Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} /></div>
            <div><label style={labelStyle}>Confirm Password</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={inputStyle} /></div>

            {error && <div className="animate-fade-in" style={{ padding: '12px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

            <button type="submit" disabled={isLoading || !formData.username || !formData.password} style={{ marginTop: '8px', width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: (isLoading) ? 'not-allowed' : 'pointer', opacity: (isLoading) ? 0.7 : 1, transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <button onClick={onNavigateLogin} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
            Already have an account? Login
          </button>
        </div>

      </div>
    </div>
  );
}