import { useState } from 'react';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import DietRecommendation from './pages/DietRecommendation';
import MedicalRecords from './pages/MedicalRecords';
import ConsultDoctor from './pages/ConsultDoctor';

// Doctor pages
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDirectory from './pages/PatientDirectory';
import DoctorConsultations from './pages/DoctorConsultations';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login'); 
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [currentUser, setCurrentUser] = useState(''); 
  const [userRole, setUserRole] = useState('patient'); // 'patient' or 'doctor'

  const handleLogin = (username, role) => {
    setIsAuthenticated(true);
    setCurrentUser(username); 
    setUserRole(role || 'patient');
    setCurrentPage(role === 'doctor' ? 'DoctorDashboard' : 'Dashboard'); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setUserRole('patient');
    setAuthView('login'); 
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
    if (userRole === 'doctor') {
      switch (currentPage) {
        case 'DoctorDashboard': return <DoctorDashboard setCurrentPage={setCurrentPage} />;
        case 'PatientDirectory': return <PatientDirectory />;
        case 'DoctorConsultations': return <DoctorConsultations />;
        default: return <DoctorDashboard setCurrentPage={setCurrentPage} />;
      }
    } else {
      switch (currentPage) {
        case 'Dashboard': return <Dashboard setCurrentPage={setCurrentPage} />;
        case 'SymptomChecker': return <SymptomChecker />;
        case 'DietRecommendation': return <DietRecommendation />;
        case 'MedicalRecords': return <MedicalRecords />;
        case 'ConsultDoctor': return <ConsultDoctor />;
        default: return <Dashboard setCurrentPage={setCurrentPage} />;
      }
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} userRole={userRole} />
      
      <div className="main-wrapper" style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--bg-main)' }}>
        <Navbar username={currentUser} onLogout={handleLogout} />
        
        <main className="content-area" style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;