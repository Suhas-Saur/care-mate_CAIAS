import React, { useState, useEffect } from 'react';
import { getMedicalRecords } from '../services/api';

export default function PatientDirectory() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [isFetchingRecords, setIsFetchingRecords] = useState(false);

  useEffect(() => {
    // 1. Get all registered patient users from localStorage
    const users = JSON.parse(localStorage.getItem('caremate_users') || '{}');
    const systemPatients = Object.keys(users)
      .filter(name => users[name]?.role === 'patient')
      .map(name => ({
        username: name,
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
        age: 28,
        height: 175,
        weight: 70,
        goal: 'Maintain overall fitness'
      }));

    // Pre-populate default dummy patients if database is thin
    const defaultPatients = [
      { username: 'admin', displayName: 'Admin User (Patient)', age: 32, height: 178, weight: 82, goal: 'Build lean muscle' },
      { username: 'john_doe', displayName: 'John Doe', age: 45, height: 182, weight: 90, goal: 'Reduce blood pressure' },
      { username: 'sarah_lee', displayName: 'Sarah Lee', age: 24, height: 163, weight: 54, goal: 'Improve stamina & cardiovascular health' }
    ];

    const mergedPatients = [...systemPatients];
    defaultPatients.forEach(dp => {
      if (!mergedPatients.some(mp => mp.username === dp.username)) {
        mergedPatients.push(dp);
      }
    });

    setPatients(mergedPatients);
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientRecords();
    }
  }, [selectedPatient]);

  const fetchPatientRecords = async () => {
    setIsFetchingRecords(true);
    try {
      const allRecords = await getMedicalRecords();
      // Since it's a demo, show general records, but we can filter some files or show all records for the patient
      setRecords(allRecords);
    } catch (err) {
      console.error(err);
      setRecords([]);
    } finally {
      setIsFetchingRecords(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 140px)', width: '100%' }}>
      
      {/* Patient List Column */}
      <div style={{
        width: '320px',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Patients List</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Select a patient to inspect details</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {patients.map(pat => (
            <div
              key={pat.username}
              onClick={() => setSelectedPatient(pat)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedPatient?.username === pat.username ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.2s',
                marginBottom: '4px'
              }}
              onMouseEnter={(e) => {
                if (selectedPatient?.username !== pat.username) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPatient?.username !== pat.username) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <p style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem', margin: 0 }}>
                {pat.displayName}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Patient ID: {pat.username}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Details & Documents Column */}
      <div style={{
        flex: 1,
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: '32px'
      }}>
        {selectedPatient ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', height: '100%', overflowY: 'auto' }}>
            
            {/* Profile Overview */}
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                {selectedPatient.displayName}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
                Patient Health Metrics Profile
              </p>
            </div>

            {/* Metrics cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Age</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{selectedPatient.age} years</p>
              </div>
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Height</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{selectedPatient.height} cm</p>
              </div>
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Weight</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{selectedPatient.weight} kg</p>
              </div>
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Health Goal</p>
                <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedPatient.goal}
                </p>
              </div>
            </div>

            {/* Medical Records / Dossier section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Shared Health Documents</h3>
                <button 
                  onClick={fetchPatientRecords} 
                  style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Refresh Files
                </button>
              </div>

              {isFetchingRecords ? (
                <p style={{ color: 'var(--text-muted)', padding: '20px', textAlign: 'center' }}>Fetching health documents...</p>
              ) : records.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px', backgroundColor: 'var(--bg-main)', borderRadius: '8px' }}>
                  No uploaded files found in patient directory.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {records.map((rec, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '16px 20px', 
                        border: '1px solid var(--border)', 
                        borderRadius: '8px', 
                        backgroundColor: 'var(--bg-main)' 
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{rec.filename}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                          Uploaded: {rec.upload_date} • {rec.size_kb} KB
                        </p>
                      </div>
                      <a 
                        href={rec.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ 
                          padding: '6px 16px', 
                          backgroundColor: '#fff', 
                          color: 'var(--primary)', 
                          border: '1px solid var(--border)', 
                          textDecoration: 'none', 
                          borderRadius: '6px', 
                          fontSize: '0.85rem', 
                          fontWeight: '600', 
                          boxShadow: 'var(--shadow-sm)' 
                        }}
                      >
                        Inspect File
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '20px' }}>📁</div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              Patient Dossier Viewer
            </h4>
            <p style={{ fontSize: '0.95rem', maxWidth: '350px', margin: '0 auto', lineHeight: '1.6' }}>
              Select a patient from the directory on the left to examine their demographic details and inspect uploaded clinical charts.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
