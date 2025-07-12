import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import './styles/index.css';
import { AuthProvider } from './context/AuthContext'; // ✅ Import AuthProvider

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider> 
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element with ID "root" not found in the document.');
}
