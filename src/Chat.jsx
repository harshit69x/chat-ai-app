import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

const API_KEY = 'AIzaSyBGR9Y2TgP8nt2KYrPdbJ5BAA-WGE_bGyk'; // Replace with your actual API key

const Chat = () => {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Store conversation history

  const handleSend = async () => {
    if (!prompt.trim()) {
      return;
    }

    const userMessage = { sender: 'You', message: prompt };
    setChatHistory((prev) => [...prev, userMessage]); // Add user message to chat

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(prompt);
      const aiResponse = {
        sender: 'Bot',
        message: result.response.text(),
      };

      setChatHistory((prev) => [...prev, aiResponse]); // Add AI response to chat
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        sender: 'Bot',
        message: 'An error occurred. Check the console for details.',
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setPrompt(''); // Clear input field after sending
    }
  };

  return (
    <div className="App">
      <h1>ChatBot</h1>
      <div className="chat-container">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`message ${chat.sender === 'You' ? 'user' : 'ai'}`}
          >
            <strong>{chat.sender}:</strong> {chat.message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          placeholder="Type a message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
