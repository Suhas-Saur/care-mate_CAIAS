import { useState } from 'react';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import DietRecommendation from './pages/DietRecommendation';
import MedicalRecords from './pages/MedicalRecords';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login'); 
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [currentUser, setCurrentUser] = useState(''); 

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setCurrentUser(username); 
    setCurrentPage('Dashboard'); 
  };

  // NEW: Handle logout by resetting state
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setAuthView('login'); // Send user back to the login view
  };

  // Auth Routing
  if (!isAuthenticated) {
    if (authView === 'login') {
      return <Login onLogin={handleLogin} onNavigateRegister={() => setAuthView('register')} />;
    }
    if (authView === 'register') {
      return <Register onNavigateLogin={() => setAuthView('login')} />;
    }
  }

  // Dashboard Routing
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
      
      <div className="main-wrapper" style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--bg-main)' }}>
        {/* NEW: Pass the onLogout prop to the Navbar */}
        <Navbar username={currentUser} onLogout={handleLogout} />
        
        <main className="content-area" style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;