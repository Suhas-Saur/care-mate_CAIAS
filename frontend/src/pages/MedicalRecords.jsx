import React, { useState, useEffect } from 'react';
import { uploadMedicalRecord, getMedicalRecords, deleteRecord, deleteAllRecords } from '../services/api';

export default function MedicalRecords() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try { setIsFetching(true); const data = await getMedicalRecords(); setRecords(data); } 
    catch (err) { console.error(err); } 
    finally { setIsFetching(false); }
  };

  const handleFileChange = (e) => { if (e.target.files.length > 0) { setFile(e.target.files[0]); setStatus(null); } };

  const handleUpload = async (e) => {
    e.preventDefault(); if (!file) return;
    setIsLoading(true);
    try {
      const result = await uploadMedicalRecord(file);
      setStatus({ type: 'success', message: result.message });
      setFile(null); document.getElementById('file-upload').value = ''; fetchRecords();
    } catch (err) { setStatus({ type: 'error', message: 'Upload failed.' }); } 
    finally { setIsLoading(false); }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;
    try { await deleteRecord(filename); fetchRecords(); } catch (err) { console.error(err); }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete ALL records? This cannot be undone.")) return;
    try { await deleteAllRecords(); fetchRecords(); } catch (err) { console.error(err); }
  };

  const filteredRecords = records.filter(rec => rec.filename.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <header>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Medical Records</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Securely manage your health documents and reports.</p>
      </header>

      {/* Upload Area */}
      <div style={{ backgroundColor: 'var(--surface)', padding: '32px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <form onSubmit={handleUpload} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative' }}>
             <input id="file-upload" type="file" onChange={handleFileChange} disabled={isLoading}
              style={{ width: '100%', padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '12px', cursor: 'pointer', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none', transition: 'border 0.2s' }} />
          </div>
          <button type="submit" disabled={!file || isLoading}
            style={{ padding: '16px 32px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', cursor: (!file || isLoading) ? 'not-allowed' : 'pointer', opacity: (!file || isLoading) ? 0.6 : 1, fontWeight: '700', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' }}>
            {isLoading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
        {status && <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', backgroundColor: status.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)', color: status.type === 'success' ? 'var(--success)' : 'var(--danger)', fontWeight: '500' }}>{status.message}</div>}
      </div>

      {/* Database Area */}
      <div style={{ backgroundColor: 'var(--surface)', padding: '32px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Database</h3>
          <div style={{ display: 'flex', gap: '12px', flex: '1 1 200px', justifyContent: 'flex-end' }}>
            <input type="text" placeholder="🔍 Search files..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: '20px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', outline: 'none', width: '100%', maxWidth: '300px', fontSize: '0.95rem' }} />
            {records.length > 0 && (
              <button onClick={handleDeleteAll} style={{ padding: '10px 20px', backgroundColor: '#fff', color: 'var(--danger)', border: '1px solid var(--danger-light)', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--danger-light)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}>
                Delete All
              </button>
            )}
          </div>
        </div>
        
        {isFetching ? ( <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Loading secure records...</p> ) 
        : filteredRecords.length === 0 ? ( <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>{searchTerm ? 'No matching files found.' : 'Your database is empty.'}</p> ) 
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredRecords.map((rec, index) => (
              <div key={index} className="animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: 'var(--bg-main)', transition: 'transform 0.2s' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{rec.filename}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{rec.upload_date} • {rec.size_kb} KB</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={rec.url} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 20px', backgroundColor: '#fff', color: 'var(--primary)', border: '1px solid var(--border)', textDecoration: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', boxShadow: 'var(--shadow-sm)' }}>View</a>
                  <button onClick={() => handleDelete(rec.filename)} style={{ padding: '8px 20px', backgroundColor: '#fff', color: 'var(--danger)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}