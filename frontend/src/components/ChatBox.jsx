import React, { useState, useRef, useEffect } from 'react';

export default function ChatBox({ messages, onSend, isLoading }) {
  // Local state for the input field
  const [inputValue, setInputValue] = useState('');
  
  // Reference to the bottom of the chat to enable auto-scrolling
  const messagesEndRef = useRef(null);

  // Automatically scroll to the bottom whenever the 'messages' array updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending the message
  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue.trim()); // Pass the text up to the parent component
      setInputValue('');         // Clear the input field
    }
  };

  // Allow sending by pressing the Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container" style={styles.container}>
      
      {/* Scrollable Message Area */}
      <div className="chat-messages" style={styles.messageArea}>
        {messages.length === 0 ? (
          <p style={styles.placeholder}>Type your symptoms below to get started...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageWrapper,
                // Align user messages to the right, AI to the left
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  // Blue background for user, light gray for AI
                  backgroundColor: msg.role === 'user' ? '#0ea5e9' : '#f1f5f9',
                  color: msg.role === 'user' ? '#ffffff' : '#334155',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div style={{ ...styles.messageWrapper, justifyContent: 'flex-start' }}>
            <div style={{ ...styles.messageBubble, backgroundColor: '#f1f5f9', color: '#64748b' }}>
              <em>CareMate AI is typing...</em>
            </div>
          </div>
        )}
        
        {/* Invisible div to act as the scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-area" style={styles.inputArea}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="E.g., I have a headache and a mild fever..."
          style={styles.input}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          style={{ 
            ...styles.sendButton, 
            opacity: inputValue.trim() && !isLoading ? 1 : 0.5 
          }}
          disabled={!inputValue.trim() || isLoading}
        >
          Send
        </button>
      </div>
      
    </div>
  );
}

// ----------------------------------------------------------------------
// Inline Styles (Keeping it self-contained for easy drop-in)
// ----------------------------------------------------------------------
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '400px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  messageArea: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  messageWrapper: {
    display: 'flex',
    width: '100%',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap', // Preserves line breaks in AI responses
  },
  placeholder: {
    textAlign: 'center',
    color: '#94a3b8',
    margin: 'auto',
  },
  inputArea: {
    display: 'flex',
    padding: '16px',
    borderTop: '1px solid #e2e8f0',
    gap: '12px',
    backgroundColor: '#f8fafc',
  },
  input: {
    flex: 1,
    padding: '12px 20px',
    borderRadius: '24px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    fontSize: '0.95rem',
  },
  sendButton: {
    padding: '0 24px',
    borderRadius: '24px',
    backgroundColor: '#0ea5e9',
    color: '#ffffff',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};