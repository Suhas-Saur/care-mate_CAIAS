import React from 'react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  // Define the navigation items in an array for easy mapping and maintenance
  const navItems = [
    { id: 'Dashboard', label: 'Dashboard' },
    { id: 'SymptomChecker', label: 'Symptom Checker' },
    { id: 'DietRecommendation', label: 'Diet Recommendation' },
    { id: 'MedicalRecords', label: 'Medical Records' },
  ];

  return (
    // The .sidebar class from index.css handles the vertical layout and fixed width
    <aside className="sidebar">
      
      <div className="sidebar-logo">
        CareMate AI
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            // Dynamically apply the 'active' class if this button matches the current state
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      
    </aside>
  );
}