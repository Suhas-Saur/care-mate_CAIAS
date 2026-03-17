import React from 'react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'SymptomChecker', label: 'Symptom Checker', icon: '🩺' },
    { id: 'DietRecommendation', label: 'Diet Plan', icon: '🥗' },
    { id: 'MedicalRecords', label: 'Medical Records', icon: '📁' },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      zIndex: 20
    }}>
      <div style={{
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--primary)',
        marginBottom: '40px',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem'}}>
          +
        </div>
        CareMate
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '16px 12px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emergency?</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--danger)', fontWeight: 'bold' }}>Call 911 immediately</p>
      </div>
    </aside>
  );
}