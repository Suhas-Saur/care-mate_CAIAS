import React from 'react';

export default function Dashboard({ setCurrentPage }) {
  // Array of features to map over, making it easy to add more cards later
  const features = [
    {
      id: 'SymptomChecker',
      title: 'Symptom Checker',
      description: 'Describe how you are feeling and get an instant, AI-driven preliminary assessment of your symptoms.',
      icon: '🩺',
      color: '#e0f2fe',
      textColor: '#0369a1'
    },
    {
      id: 'DietRecommendation',
      title: 'Diet Recommendation',
      description: 'Generate personalized meal plans tailored to your age, metrics, and specific health goals.',
      icon: '🥗',
      color: '#dcfce7',
      textColor: '#15803d'
    },
    {
      id: 'MedicalRecords',
      title: 'Medical Records',
      description: 'Securely upload, view, and manage your health documents and test results in one place.',
      icon: '📁',
      color: '#f3e8ff',
      textColor: '#7e22ce'
    }
  ];

  return (
    <div style={styles.container}>
      
      {/* Welcome Header */}
      <header style={styles.header}>
        <h2 style={styles.welcomeText}>Welcome to CareMate AI</h2>
        <p style={styles.subText}>
          Your personal, AI-powered health assistant. Select a tool below or from the sidebar to get started.
        </p>
      </header>

      {/* Feature Cards Grid */}
      <div style={styles.grid}>
        {features.map((feature) => (
          <div 
            key={feature.id} 
            style={styles.card}
            // Optional: If you pass setCurrentPage as a prop to Dashboard, 
            // clicking a card will instantly navigate to that feature.
            onClick={() => setCurrentPage && setCurrentPage(feature.id)}
          >
            <div 
              style={{
                ...styles.iconWrapper,
                backgroundColor: feature.color,
                color: feature.textColor
              }}
            >
              {feature.icon}
            </div>
            <h3 style={styles.cardTitle}>{feature.title}</h3>
            <p style={styles.cardDescription}>{feature.description}</p>
          </div>
        ))}
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
    gap: '32px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'left',
  },
  welcomeText: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
  },
  subText: {
    fontSize: '1.1rem',
    color: '#64748b',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
  },
  cardDescription: {
    fontSize: '0.95rem',
    color: '#64748b',
    lineHeight: '1.5',
  }
};