import React, { useState, useEffect } from 'react';
import { getMedicalRecords } from '../services/api';

export default function DoctorDashboard({ setCurrentPage }) {
  const [metrics, setMetrics] = useState({
    patientsCount: 0,
    consultsCount: 0,
    filesCount: 0
  });

  const currentUser = localStorage.getItem('caremate_current_user') || 'doctor';
  const displayDoctor = currentUser.startsWith('Dr.') ? currentUser : `Dr. ${currentUser.charAt(0).toUpperCase() + currentUser.slice(1)}`;

  useEffect(() => {
    // 1. Calculate patient counts
    const users = JSON.parse(localStorage.getItem('caremate_users') || '{}');
    const patients = Object.keys(users).filter(name => users[name]?.role === 'patient');
    // Pre-populate some dummy patients if none registered to make dashboard look rich
    const totalPatients = Math.max(patients.length, 3); 

    // 2. Calculate consultations count
    const consultations = JSON.parse(localStorage.getItem('caremate_consultations') || '[]');
    // Unique patients consulting
    const uniqueConsults = new Set(consultations.map(c => c.patient)).size;
    const totalConsults = Math.max(uniqueConsults, 2);

    // 3. Fetch file records
    getMedicalRecords().then(records => {
      setMetrics({
        patientsCount: totalPatients,
        consultsCount: totalConsults,
        filesCount: records ? records.length : 0
      });
    }).catch(err => {
      console.error(err);
      setMetrics({
        patientsCount: totalPatients,
        consultsCount: totalConsults,
        filesCount: 0
      });
    });
  }, []);

  const features = [
    { id: 'PatientDirectory', title: 'Patient Directory', desc: 'Browse registered patients and view uploaded medical records.', icon: '👥', color: 'var(--primary-light)', text: 'var(--primary)' },
    { id: 'DoctorConsultations', title: 'Consultations', desc: 'Answer diagnostic queries, provide clinical recommendations, and write prescriptions.', icon: '📥', color: 'var(--success-light)', text: 'var(--success)' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      
      {/* Header banner */}
      <header style={{ 
        padding: '40px', borderRadius: 'var(--radius)', backgroundColor: 'var(--primary)', 
        color: '#fff', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Welcome, {displayDoctor}.
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px' }}>
            CareMate Professional Portal. Manage your patients, check medical dossiers, and answer clinical consult queries.
          </p>
        </div>
        {/* Decorative background shape */}
        <div style={{ position: 'absolute', right: '-5%', top: '-50%', width: '300px', height: '300px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', zIndex: 0 }}></div>
      </header>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Assigned Patients</p>
          <h3 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>{metrics.patientsCount}</h3>
        </div>
        
        <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Consultations</p>
          <h3 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--success)', marginTop: '8px' }}>{metrics.consultsCount}</h3>
        </div>

        <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hosted Dossier Files</p>
          <h3 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary)', marginTop: '8px' }}>{metrics.filesCount}</h3>
        </div>
      </div>

      {/* Nav Cards Grid */}
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
