import React, { useState, useRef, useEffect } from 'react';

export default function ChatBox({ messages, onSend, isLoading }) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px',
      border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-md)', overflow: 'hidden'
    }}>
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👋</div>
            <p>I am CareMate AI.</p>
            <p style={{ fontSize: '0.9rem' }}>Describe your symptoms below to begin.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="animate-fade-in" style={{ display: 'flex', width: '100%', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%', padding: '14px 18px',
                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-main)',
                color: msg.role === 'user' ? '#fff' : 'var(--text-main)',
                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(2, 132, 199, 0.2)' : 'none',
                fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '14px 18px', borderRadius: '20px 20px 20px 4px', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }}>
               <span style={{ fontStyle: 'italic' }}>Analyzing data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface)', display: 'flex', gap: '12px' }}>
        <input
          type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="Type your symptoms here..." disabled={isLoading}
          style={{
            flex: 1, padding: '14px 20px', borderRadius: '30px', border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-main)', outline: 'none', fontSize: '0.95rem', transition: 'border 0.2s'
          }}
        />
        <button
          onClick={handleSend} disabled={!inputValue.trim() || isLoading}
          style={{
            padding: '0 28px', borderRadius: '30px', backgroundColor: 'var(--primary)', color: '#fff',
            border: 'none', fontWeight: '600', cursor: (!inputValue.trim() || isLoading) ? 'not-allowed' : 'pointer',
            opacity: (!inputValue.trim() || isLoading) ? 0.6 : 1, transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}