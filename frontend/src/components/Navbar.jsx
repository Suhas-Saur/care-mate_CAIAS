import React, { useState } from 'react';

// NEW: Accept the onLogout prop
export default function Navbar({ username, onLogout }) {
  // NEW: State to toggle the logout dropdown menu
  const [showDropdown, setShowDropdown] = useState(false);

  const displayName = username || 'User';
  const initial = displayName.charAt(0).toUpperCase();

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
          Hello, {displayName}
        </span>
        
        {/* NEW: Wrap avatar in a relative div to position the dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)} // NEW: Toggle dropdown on click
            style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              backgroundColor: 'var(--primary-light)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary)', fontWeight: 'bold', border: '2px solid #fff',
              boxShadow: 'var(--shadow-sm)', cursor: 'pointer', textTransform: 'uppercase'
            }}>
            {initial}
          </div>

          {/* NEW: Logout Dropdown Menu */}
          {showDropdown && (
            <div className="animate-fade-in" style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-md)',
              padding: '8px',
              minWidth: '120px',
              zIndex: 20
            }}>
              <button 
                onClick={onLogout} 
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'transparent',
                  color: 'var(--danger)',
                  border: 'none',
                  borderRadius: '6px',
                  textAlign: 'left',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-light)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}