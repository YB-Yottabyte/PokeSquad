import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // For React 18 and onwards
import { BrowserRouter } from 'react-router-dom'; // Needed for routing
import App from './App'; // Main App component
import './index.css'; // Make sure this file exists for styles

// Ensure the root element exists in your index.html file (in the public folder)
// <div id="root"></div> in your HTML file

// Create the root of your application
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Wrapping the app with BrowserRouter for handling routes */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
