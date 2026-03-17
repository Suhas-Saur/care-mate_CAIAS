import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Find the root HTML element and render the React application inside it
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode is a development tool that helps catch common bugs early 
  // by double-rendering components to check for side effects.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)