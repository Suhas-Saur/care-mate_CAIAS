import React, { useState, useEffect } from 'react';

export default function Login({ onLogin, onNavigateRegister }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pre-populate a demo patient and doctor if empty
  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem('caremate_users') || '{}');
    if (Object.keys(existingUsers).length === 0) {
      existingUsers['admin'] = { password: 'admin123', role: 'patient' };
      existingUsers['doctor'] = { password: 'doctor123', role: 'doctor' };
      localStorage.setItem('caremate_users', JSON.stringify(existingUsers));
    }
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleInstantLogin = (username, role) => {
    setIsLoading(true);
    // Ensure default users are guaranteed to exist in localStorage
    const users = JSON.parse(localStorage.getItem('caremate_users') || '{}');
    if (!users[username]) {
      users[username] = { password: username === 'admin' ? 'admin123' : 'doctor123', role };
      localStorage.setItem('caremate_users', JSON.stringify(users));
    }
    setTimeout(() => {
      onLogin(username, role);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('caremate_users') || '{}');
      const userRecord = users[credentials.username];
      
      let passwordMatches = false;
      let role = 'patient';
      
      if (userRecord) {
        if (typeof userRecord === 'object' && userRecord !== null) {
          passwordMatches = userRecord.password === credentials.password;
          role = userRecord.role || 'patient';
        } else {
          // Fallback for simple legacy text passwords
          passwordMatches = userRecord === credentials.password;
          role = 'patient';
        }
      }
      
      // Check if credentials match
      if (passwordMatches) {
        onLogin(credentials.username, role);
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
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: 'var(--surface)', padding: '40px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', margin: '0 auto 16px auto', fontWeight: 'bold' }}>+</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px', marginBottom: '8px' }}>CareMate <span style={{ color: 'var(--primary)' }}>AI</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Enter your credentials or use Instant Demo Login.</p>
        </div>

        {/* Instant One-Click Login Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', border: '1px solid #bae6fd' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', margin: 0, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚡ Instant 1-Click Demo Login
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleInstantLogin('admin', 'patient')}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              🧑‍🤝‍🧑 Patient Demo
            </button>
            <button
              type="button"
              onClick={() => handleInstantLogin('doctor', 'doctor')}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: 'var(--success)',
                color: '#fff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              🩺 Doctor Demo
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>OR MANUAL LOGIN</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div><label style={labelStyle}>Username</label><input type="text" name="username" value={credentials.username} onChange={handleChange} required style={inputStyle} /></div>
          <div><label style={labelStyle}>Password</label><input type="password" name="password" value={credentials.password} onChange={handleChange} required style={inputStyle} /></div>

          {error && <div className="animate-fade-in" style={{ padding: '12px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

          <button type="submit" disabled={isLoading || !credentials.username || !credentials.password} style={{ marginTop: '4px', width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: (isLoading || !credentials.username || !credentials.password) ? 'not-allowed' : 'pointer', opacity: (isLoading || !credentials.username || !credentials.password) ? 0.7 : 1, transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}>
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <button onClick={onNavigateRegister} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
            Don't have an account? Register
          </button>
        </div>

      </div>
    </div>
  );
}