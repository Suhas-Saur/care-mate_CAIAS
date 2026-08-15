import React, { useState, useEffect, useRef } from 'react';

export default function ConsultDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  // Load current user from the session / local storage
  const currentUser = localStorage.getItem('caremate_current_user') || 'admin';

  // Get active username from App/Navbar state (fallback to localStorage or 'admin')
  const getLoggedInUser = () => {
    // If we have a stored session or active user, use it. Otherwise 'admin'
    return currentUser;
  };

  useEffect(() => {
    // Get doctors from localStorage + default list
    const users = JSON.parse(localStorage.getItem('caremate_users') || '{}');
    const systemDoctors = Object.keys(users)
      .filter((name) => users[name]?.role === 'doctor')
      .map((name) => ({
        username: name,
        displayName: name.startsWith('Dr.') ? name : `Dr. ${name.charAt(0).toUpperCase() + name.slice(1)}`,
        specialty: 'Healthcare Professional',
        isOnline: true,
      }));

    const defaultDoctors = [
      { username: 'Dr. Alice Smith', displayName: 'Dr. Alice Smith', specialty: 'Cardiologist', isOnline: true },
      { username: 'Dr. Bob Johnson', displayName: 'Dr. Bob Johnson', specialty: 'General Physician', isOnline: false },
      { username: 'Dr. Clara Davis', displayName: 'Dr. Clara Davis', specialty: 'Pediatrician', isOnline: true },
    ];

    // Combine and remove duplicates by username
    const allDoctors = [...systemDoctors];
    defaultDoctors.forEach((d) => {
      if (!allDoctors.some((ad) => ad.username === d.username)) {
        allDoctors.push(d);
      }
    });

    setDoctors(allDoctors);
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      loadMessages();
    }
  }, [selectedDoctor]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = () => {
    if (!selectedDoctor) return;
    const allConsults = JSON.parse(localStorage.getItem('caremate_consultations') || '[]');
    const patientName = getLoggedInUser();
    const filtered = allConsults.filter(
      (m) =>
        (m.patient === patientName && m.doctor === selectedDoctor.username) ||
        (m.patient === patientName && m.doctor === selectedDoctor.displayName)
    );
    setMessages(filtered);
  };

  const handleSend = () => {
    if (!inputValue.trim() || !selectedDoctor) return;

    const patientName = getLoggedInUser();
    const newMessage = {
      id: 'msg_' + Date.now(),
      patient: patientName,
      doctor: selectedDoctor.username,
      sender: patientName,
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const allConsults = JSON.parse(localStorage.getItem('caremate_consultations') || '[]');
    allConsults.push(newMessage);
    localStorage.setItem('caremate_consultations', JSON.stringify(allConsults));

    setInputValue('');
    loadMessages();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 140px)', width: '100%' }}>
      
      {/* Doctors List Panel */}
      <div style={{
        width: '320px',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Our Medical Panel</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Select a doctor to consult</p>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {doctors.map((doc) => (
            <div 
              key={doc.username}
              onClick={() => setSelectedDoctor(doc)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedDoctor?.username === doc.username ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedDoctor?.username !== doc.username) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedDoctor?.username !== doc.username) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}>
                  🩺
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: doc.isOnline ? 'var(--success)' : '#94a3b8',
                  border: '2px solid var(--surface)'
                }}></div>
              </div>
              
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem', margin: 0 }}>
                  {doc.displayName}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {doc.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area Panel */}
      <div style={{
        flex: 1,
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {selectedDoctor ? (
          <>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-main)'
            }}>
              <div>
                <h4 style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.1rem', margin: 0 }}>
                  Consulting with {selectedDoctor.displayName}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Active Consultation • {selectedDoctor.specialty}
                </p>
              </div>
              <button 
                onClick={loadMessages}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}
              >
                🔄 Refresh
              </button>
            </div>

            {/* Messages Body */}
            <div style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: '#fff'
            }}>
              {messages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', maxWidth: '400px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💬</div>
                  <h5 style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '8px' }}>Start the Conversation</h5>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Describe your symptoms, medical concerns, or questions below. The doctor will review your query and reply soon.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender === getLoggedInUser();
                  return (
                    <div 
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: isMe ? 'flex-end' : 'flex-start',
                        width: '100%'
                      }}
                    >
                      <div style={{
                        maxWidth: '70%',
                        padding: '12px 16px',
                        borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        backgroundColor: isMe ? 'var(--primary)' : 'var(--bg-main)',
                        color: isMe ? '#fff' : 'var(--text-main)',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: '0.95rem',
                        position: 'relative'
                      }}>
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        <span style={{
                          display: 'block',
                          fontSize: '0.7rem',
                          color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                          marginTop: '6px',
                          textAlign: 'right'
                        }}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border)',
              backgroundColor: 'var(--bg-main)',
              display: 'flex',
              gap: '12px'
            }}>
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your medical query or question here..."
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: '30px',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  fontSize: '0.95rem',
                  backgroundColor: '#fff'
                }}
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                style={{
                  padding: '0 28px',
                  borderRadius: '30px',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '700',
                  cursor: !inputValue.trim() ? 'not-allowed' : 'pointer',
                  opacity: !inputValue.trim() ? 0.6 : 1,
                  transition: 'all 0.2s',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Send Query
              </button>
            </div>
          </>
        ) : (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '20px' }}>🏥</div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              Doctor Consultations
            </h4>
            <p style={{ fontSize: '0.95rem', maxWidth: '350px', margin: '0 auto', lineHeight: '1.6' }}>
              Choose a medical specialist from the left panel to begin your direct consultation and review clinical recommendations.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
