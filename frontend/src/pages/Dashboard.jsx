import React from 'react';

export default function Dashboard({ setCurrentPage }) {
  const features = [
    { id: 'SymptomChecker', title: 'Symptom Checker', desc: 'AI-driven preliminary assessment of your symptoms.', icon: '🩺', color: 'var(--primary-light)', text: 'var(--primary)' },
    { id: 'DietRecommendation', title: 'Diet Plan', desc: 'Personalized meal plans tailored to your health metrics.', icon: '🥗', color: 'var(--success-light)', text: 'var(--success)' },
    { id: 'MedicalRecords', title: 'Medical Records', desc: 'Securely upload and search your health documents.', icon: '📁', color: '#f3e8ff', text: '#7e22ce' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1100px', margin: '0 auto' }}>
      
      <header style={{ 
        padding: '40px', borderRadius: 'var(--radius)', backgroundColor: 'var(--primary)', 
        color: '#fff', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Good morning.</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px' }}>
            Welcome to CareMate AI. Your intelligent health companion is ready. Select a tool below to get started.
          </p>
        </div>
        {/* Decorative background shape */}
        <div style={{ position: 'absolute', right: '-5%', top: '-50%', width: '300px', height: '300px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', zIndex: 0 }}></div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {features.map((feature) => (
          <div 
            key={feature.id} 
            onClick={() => setCurrentPage && setCurrentPage(feature.id)}
            style={{
              backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', padding: '32px',
              border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: feature.color, color: feature.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>
              {feature.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>{feature.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}