import { useState } from 'react';

// Import layout components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Import page components
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import DietRecommendation from './pages/DietRecommendation';
import MedicalRecords from './pages/MedicalRecords';

function App() {
  // 1. Initialize state to track the active page
  const [currentPage, setCurrentPage] = useState('Dashboard');

  // 2. Simple routing logic to return the correct component
  const renderContent = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'SymptomChecker':
        return <SymptomChecker />;
      case 'DietRecommendation':
        return <DietRecommendation />;
      case 'MedicalRecords':
        return <MedicalRecords />;
      default:
        return <Dashboard />;
    }
  };

  return (
    // Standard dashboard layout: full height, flex container
    <div className="app-container" style={{ display: 'flex', height: '100vh' }}>
      
      {/* Sidebar receives the state and the setter to update navigation */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="main-wrapper" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Navbar sits at the top of the main content area */}
        <Navbar />

        {/* Main content area where the selected page is injected */}
        <main className="content-area" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {renderContent()}
        </main>
      </div>
      
    </div>
  );
}

export default App;