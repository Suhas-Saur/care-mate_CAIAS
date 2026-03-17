import React, { useState } from 'react';

export default function MedicalRecords() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); // type can be 'success' or 'error'

  // Handle file selection
  const handleFileChange = (e) => {
    // e.target.files is an array of selected files. We only need the first one.
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // Reset any previous status messages when a new file is chosen
      setStatus({ type: '', message: '' });
    }
  };

  // Handle the upload process
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a file to upload first.' });
      return;
    }

    setIsUploading(true);
    setStatus({ type: '', message: '' });

    // 1. Prepare the file using FormData
    const formData = new FormData();
    // The first argument 'file' MUST match the parameter name in your FastAPI endpoint:
    // async def upload_record(file: UploadFile = File(...))
    formData.append('file', file);

    try {
      // 2. Send the POST request to the backend
      const response = await fetch('http://localhost:8000/api/records/upload-record', {
        method: 'POST',
        // IMPORTANT: Do NOT manually set the 'Content-Type' header to 'multipart/form-data'. 
        // The browser automatically sets it along with the required boundary string when it detects FormData.
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload the file. Please try again.');
      }

      const result = await response.json();
      
      // 3. Update the UI on success
      setStatus({ type: 'success', message: result.message || `Successfully uploaded ${file.name}` });
      setFile(null); // Clear the selected file
      
      // Optional: Reset the actual file input element visually
      document.getElementById('file-upload-input').value = '';

    } catch (error) {
      console.error('Upload error:', error);
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Medical Records</h2>
        <p style={styles.description}>
          Securely upload your health documents, test results, or medical images.
        </p>
      </header>

      <div style={styles.uploadCard}>
        <form onSubmit={handleUpload} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="file-upload-input" style={styles.label}>
              Select a file to upload:
            </label>
            <input
              id="file-upload-input"
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              style={styles.fileInput}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              ...styles.uploadButton, 
              opacity: isUploading || !file ? 0.6 : 1,
              cursor: isUploading || !file ? 'not-allowed' : 'pointer'
            }}
            disabled={isUploading || !file}
          >
            {isUploading ? 'Uploading...' : 'Upload Record'}
          </button>
        </form>

        {/* Status Message Display */}
        {status.message && (
          <div style={{
            ...styles.statusBox,
            backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: status.type === 'success' ? '#166534' : '#b91c1c',
            borderColor: status.type === 'success' ? '#bbf7d0' : '#f87171'
          }}>
            {status.type === 'success' ? '✅ ' : '❌ '}
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Inline Styles
// ----------------------------------------------------------------------
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
  },
  description: {
    fontSize: '1rem',
    color: '#64748b',
  },
  uploadCard: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#334155',
  },
  fileInput: {
    padding: '12px',
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
  },
  uploadButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    backgroundColor: '#0ea5e9', // Blue action button
    color: '#ffffff',
    border: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    alignSelf: 'flex-start',
    transition: 'opacity 0.2s',
  },
  statusBox: {
    marginTop: '24px',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.95rem',
    fontWeight: '500',
  }
};