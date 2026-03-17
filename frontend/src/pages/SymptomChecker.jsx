import React, { useState } from 'react';
import ChatBox from '../components/ChatBox';

export default function SymptomChecker() {
  // Initialize chat with a welcoming AI message
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: 'Hello! Please describe your symptoms in detail, and I will provide a preliminary assessment.' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle sending the message to the FastAPI backend
  const handleSendMessage = async (userText) => {
    // 1. Immediately display the user's message in the chat
    const newUserMessage = { role: 'user', text: userText };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    
    // 2. Set loading state to show the "AI is typing..." indicator
    setIsLoading(true);

    try {
      // 3. Make the POST request to the FastAPI backend
      // Ensure your FastAPI server is running on port 8000
      const response = await fetch('http://localhost:8000/api/symptoms/symptom-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The Pydantic model expects a JSON object with a 'description' field
        body: JSON.stringify({ description: userText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const aiData = result.data;

      // 4. Format the structured backend response into a readable chat message
      let formattedResponse = `${aiData.preliminary_assessment}\n\n`;
      
      if (aiData.recommendations && aiData.recommendations.length > 0) {
        formattedResponse += "Recommendations:\n";
        aiData.recommendations.forEach(rec => {
          formattedResponse += `- ${rec}\n`;
        });
        formattedResponse += '\n';
      }
      
      formattedResponse += `*${aiData.disclaimer}*`;

      // 5. Append the AI's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages, 
        { role: 'ai', text: formattedResponse }
      ]);

    } catch (error) {
      console.error("Error communicating with backend:", error);
      // Handle network errors gracefully in the UI
      setMessages((prevMessages) => [
        ...prevMessages, 
        { role: 'ai', text: "I'm having trouble connecting to the server right now. Please make sure the backend is running and try again." }
      ]);
    } finally {
      // 6. Turn off the loading indicator
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Symptom Checker</h2>
        <p style={styles.description}>
          Type your symptoms below. This tool provides a preliminary AI analysis and should not replace professional medical advice.
        </p>
      </header>

      {/* The ChatBox takes up the remaining vertical space */}
      <div style={styles.chatWrapper}>
        <ChatBox 
          messages={messages} 
          onSend={handleSendMessage} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Inline Styles
// ----------------------------------------------------------------------
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Takes full height of the main content area
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
  },
  description: {
    fontSize: '1rem',
    color: '#64748b',
  },
  chatWrapper: {
    flex: 1, // Allows the chat box to grow and fill the screen
    minHeight: '0', // Prevents flexbox overflow issues
  }
};