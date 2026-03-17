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
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const renderContent = () => {
    switch (currentPage) {
      case 'Dashboard': return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'SymptomChecker': return <SymptomChecker />;
      case 'DietRecommendation': return <DietRecommendation />;
      case 'MedicalRecords': return <MedicalRecords />;
      default: return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="main-wrapper" style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#f8fafc' }}>
        <Navbar />
        <main className="content-area" style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;