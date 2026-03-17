import React, { useState } from 'react';
import ChatBox from '../components/ChatBox';
import { checkSymptoms } from '../services/api';

export default function SymptomChecker() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! Please describe your symptoms in detail, and I will provide a preliminary medical assessment.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (userText) => {
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const aiData = await checkSymptoms(userText);
      let formattedResponse = `${aiData.preliminary_assessment}\n\n`;
      if (aiData.recommendations?.length > 0) {
        formattedResponse += "Recommendations:\n" + aiData.recommendations.map(r => `• ${r}`).join('\n') + '\n\n';
      }
      formattedResponse += `Disclaimer: CareMate AI is an AI tool, not a doctor. Always consult a healthcare professional for medical advice.`;

      setMessages((prev) => [...prev, { role: 'ai', text: formattedResponse }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: "Connection error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Symptom Checker</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Describe how you're feeling for an AI-powered preliminary assessment.</p>
      </header>
      <div style={{ flex: 1, minHeight: '0' }}>
        <ChatBox messages={messages} onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}