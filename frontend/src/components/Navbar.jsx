import React from 'react';

export default function Navbar() {
  return (
    // The .navbar class handles the flexbox layout, height, and bottom border
    <header className="navbar">
      
      <div className="navbar-brand">
        {/* The .navbar-title class applies your brand typography and colors */}
        <h1 className="navbar-title">CareMate AI</h1>
      </div>
      
      {/* This section is a placeholder for future responsive elements. 
        As your app grows, you can easily drop in a notification bell, 
        a user profile picture, or a mobile hamburger menu toggle here.
      */}
      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
          Welcome, User
        </span>
        {/* Example of a simple, responsive profile placeholder */}
        <div 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            backgroundColor: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontWeight: 'bold'
          }}
        >
          U
        </div>
      </div>

    </header>
  );
}