import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Render the main React application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// --- PWA Service Worker and Notification Setup ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
        
        // After successful registration, request permission for notifications
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission has been granted.');
          } else {
            console.log('Notification permission has been denied.');
          }
        });

      })
      .catch((registrationError) => {
        console.error('Service Worker registration failed:', registrationError);
      });
  });
}
