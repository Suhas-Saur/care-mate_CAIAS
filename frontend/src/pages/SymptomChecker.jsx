import React, { useState } from 'react';
import ChatBox from '../components/ChatBox';
import { checkSymptoms } from '../services/api';

export default function SymptomChecker() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! Please describe your symptoms in detail, and I will provide a preliminary assessment.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (userText) => {
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const aiData = await checkSymptoms(userText);
      
      let formattedResponse = `${aiData.preliminary_assessment}\n\n`;
      if (aiData.recommendations?.length > 0) {
        formattedResponse += "Recommendations:\n" + aiData.recommendations.map(r => `- ${r}`).join('\n') + '\n\n';
      }
      formattedResponse += `*${aiData.disclaimer}*`;

      setMessages((prev) => [...prev, { role: 'ai', text: formattedResponse }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [...prev, { role: 'ai', text: "Connection error. Is the FastAPI server running and CORS enabled?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Symptom Checker</h2>
        <p style={{ color: '#64748b' }}>Type your symptoms below for a preliminary AI analysis.</p>
      </header>
      <div style={{ flex: 1, minHeight: '0' }}>
        <ChatBox messages={messages} onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}