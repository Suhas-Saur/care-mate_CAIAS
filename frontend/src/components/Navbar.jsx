import React from 'react';

export default function Navbar() {
  return (
    <header style={{
      height: '70px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          CareMate <span style={{ color: 'var(--primary)' }}>AI</span>
        </h1>
        <span style={{ padding: '4px 8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 'bold' }}>Beta</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>
          Hello, Patient
        </span>
        <div style={{ 
            width: '40px', height: '40px', borderRadius: '50%', 
            backgroundColor: 'var(--primary-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)', fontWeight: 'bold', border: '2px solid #fff',
            boxShadow: 'var(--shadow-sm)', cursor: 'pointer'
          }}>
          P
        </div>
      </div>
    </header>
  );
}