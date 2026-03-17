import React, { useState, useEffect } from 'react';
import { uploadMedicalRecord, getMedicalRecords, deleteRecord, deleteAllRecords } from '../services/api';

export default function MedicalRecords() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [records, setRecords] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  
  // NEW: Search state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setIsFetching(true);
      const data = await getMedicalRecords();
      setRecords(data);
    } catch (err) {
      console.error("Failed to load records:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      const result = await uploadMedicalRecord(file);
      setStatus({ type: 'success', message: result.message });
      setFile(null);
      document.getElementById('file-upload').value = ''; 
      fetchRecords(); // Refresh list after upload
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to upload document.' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: Delete Single File Handler ---
  const handleDelete = async (filename) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${filename}"?`);
    if (!isConfirmed) return;

    try {
      await deleteRecord(filename);
      setStatus({ type: 'success', message: `Deleted ${filename}` });
      fetchRecords(); // Refresh list to remove the deleted item
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to delete file.' });
    }
  };

  // --- NEW: Delete All Files Handler ---
  const handleDeleteAll = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete ALL uploaded records? This cannot be undone.");
    if (!isConfirmed) return;

    try {
      await deleteAllRecords();
      setStatus({ type: 'success', message: 'All records have been deleted.' });
      fetchRecords(); // Refresh list (it will be empty)
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to delete all files.' });
    }
  };

  // --- NEW: Dynamic Search Filter ---
  const filteredRecords = records.filter(rec => 
    rec.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Medical Records</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Securely upload and manage your health documents.</p>

      {/* Upload Section */}
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Upload New Record</h3>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            id="file-upload"
            type="file" 
            onChange={handleFileChange} 
            disabled={isLoading}
            style={{ padding: '12px', border: '2px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#f8fafc' }}
          />
          <button 
            type="submit" 
            disabled={!file || isLoading}
            style={{ padding: '12px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '8px', cursor: (!file || isLoading) ? 'not-allowed' : 'pointer', opacity: (!file || isLoading) ? 0.6 : 1, fontWeight: 'bold' }}
          >
            {isLoading ? 'Uploading...' : 'Upload Record'}
          </button>
        </form>

        {status && (
          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2', color: status.type === 'success' ? '#166534' : '#b91c1c' }}>
            {status.message}
          </div>
        )}
      </div>

      {/* Documents List Section */}
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        
        {/* NEW: Header with Search and Delete All */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Your Documents</h3>
          
          <input 
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', flex: '1 1 200px', maxWidth: '300px' }}
          />

          {records.length > 0 && (
            <button 
              onClick={handleDeleteAll}
              style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #f87171', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Delete All
            </button>
          )}
        </div>
        
        {isFetching ? (
          <p style={{ color: '#64748b' }}>Loading records...</p>
        ) : filteredRecords.length === 0 ? (
          <p style={{ color: '#64748b' }}>{searchTerm ? 'No matching records found.' : 'No records uploaded yet.'}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredRecords.map((rec, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', color: '#0f172a', margin: 0, wordBreak: 'break-all' }}>{rec.filename}</p>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>
                    Uploaded: {rec.upload_date} • {rec.size_kb} KB
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a 
                    href={rec.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', color: '#334155', textDecoration: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500' }}
                  >
                    View
                  </a>
                  {/* NEW: Individual Delete Button */}
                  <button 
                    onClick={() => handleDelete(rec.filename)}
                    style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}