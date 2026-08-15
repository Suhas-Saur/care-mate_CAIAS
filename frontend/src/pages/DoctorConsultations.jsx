import React, { useState, useEffect, useRef } from 'react';

export default function DoctorConsultations() {
  const [patientThreads, setPatientThreads] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  // Load current doctor username from localStorage
  const currentDoctor = localStorage.getItem('caremate_current_user') || 'doctor';

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      loadMessages();
    }
  }, [selectedPatient]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadThreads = () => {
    const allConsults = JSON.parse(localStorage.getItem('caremate_consultations') || '[]');
    
    // Find all unique patient usernames in consultations
    const uniquePatientNames = Array.from(new Set(allConsults.map(c => c.patient)));
    
    const threads = uniquePatientNames.map(username => {
      const patientMessages = allConsults.filter(c => c.patient === username);
      const lastMsg = patientMessages[patientMessages.length - 1];
      return {
        username: username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        lastMessageText: lastMsg ? lastMsg.text : 'No messages yet',
        lastMessageTime: lastMsg ? lastMsg.timestamp : ''
      };
    });

    setPatientThreads(threads);
  };

  const loadMessages = () => {
    if (!selectedPatient) return;
    const allConsults = JSON.parse(localStorage.getItem('caremate_consultations') || '[]');
    const filtered = allConsults.filter(m => m.patient === selectedPatient.username);
    setMessages(filtered);
  };

  const handleSend = () => {
    if (!inputValue.trim() || !selectedPatient) return;

    const newMessage = {
      id: 'msg_' + Date.now(),
      patient: selectedPatient.username,
      doctor: currentDoctor,
      sender: currentDoctor,
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const allConsults = JSON.parse(localStorage.getItem('caremate_consultations') || '[]');
    allConsults.push(newMessage);
    localStorage.setItem('caremate_consultations', JSON.stringify(allConsults));

    setInputValue('');
    loadMessages();
    loadThreads(); // Refresh last message in threads list
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 140px)', width: '100%' }}>
      
      {/* Patient Thread List Panel */}
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Consultation Inbox</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Active queries from patients</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {patientThreads.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
              No inquiries received yet.
            </p>
          ) : (
            patientThreads.map(thread => (
              <div
                key={thread.username}
                onClick={() => setSelectedPatient(thread)}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedPatient?.username === thread.username ? 'var(--primary-light)' : 'transparent',
                  transition: 'all 0.2s',
                  marginBottom: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  if (selectedPatient?.username !== thread.username) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPatient?.username !== thread.username) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem', margin: 0 }}>
                    {thread.displayName}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {thread.lastMessageTime}
                  </span>
                </div>
                <p style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--text-muted)', 
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {thread.lastMessageText}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Consult Chat Area Panel */}
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
        {selectedPatient ? (
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
                  Case Sheet: {selectedPatient.displayName}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Reviewing inquiry and history
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

            {/* Message Body */}
            <div style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: '#fff'
            }}>
              {messages.map(msg => {
                const isMe = msg.sender === currentDoctor;
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
                      fontSize: '0.95rem'
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
              })}
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
                placeholder="Write prescription instructions, diagnostic advice, or response..."
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
                Send Prescription / Advice
              </button>
            </div>
          </>
        ) : (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '20px' }}>📬</div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              Select a Consultation Thread
            </h4>
            <p style={{ fontSize: '0.95rem', maxWidth: '350px', margin: '0 auto', lineHeight: '1.6' }}>
              Click on a patient thread on the left to see their diagnostic request, write prescriptions, and review their case logs.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
