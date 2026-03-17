import React, { useState, useEffect } from 'react';

export default function Login({ onLogin, onNavigateRegister }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pre-populate a demo user if the database is completely empty
  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem('caremate_users') || '{}');
    if (Object.keys(existingUsers).length === 0) {
      existingUsers['admin'] = 'admin123';
      localStorage.setItem('caremate_users', JSON.stringify(existingUsers));
    }
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('caremate_users') || '{}');
      
      // Check if username exists and password matches
      if (users[credentials.username] && users[credentials.username] === credentials.password) {
        onLogin(credentials.username);
      } else {
        setError('Invalid username or password. Please try again.');
        setIsLoading(false);
      }
    }, 600);
  };

  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', outline: 'none', fontSize: '0.95rem', color: 'var(--text-main)' };
  const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-main)' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--surface)', padding: '40px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', margin: '0 auto 16px auto', fontWeight: 'bold' }}>+</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px', marginBottom: '8px' }}>CareMate <span style={{ color: 'var(--primary)' }}>AI</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Enter your credentials to access the portal.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div><label style={labelStyle}>Username</label><input type="text" name="username" value={credentials.username} onChange={handleChange} required style={inputStyle} /></div>
          <div><label style={labelStyle}>Password</label><input type="password" name="password" value={credentials.password} onChange={handleChange} required style={inputStyle} /></div>

          {error && <div className="animate-fade-in" style={{ padding: '12px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

          <button type="submit" disabled={isLoading || !credentials.username || !credentials.password} style={{ marginTop: '8px', width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: (isLoading || !credentials.username || !credentials.password) ? 'not-allowed' : 'pointer', opacity: (isLoading || !credentials.username || !credentials.password) ? 0.7 : 1, transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}>
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <button onClick={onNavigateRegister} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
            Don't have an account? Register
          </button>
        </div>

      </div>
    </div>
  );
}