import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(       //root element where the app will be mounted
  // StrictMode is used to highlight potential problems in an application
  // It activates additional checks and warnings for its descendants.
  <StrictMode>
    <App />
  </StrictMode>,                
);  


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
        
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
