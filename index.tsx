import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

// --- CONFIGURATION ---
const CLERK_PUBLISHABLE_KEY = "pk_test_Y2VudHJhbC1mbG91bmRlci02MC5jbGVyay5hY2NvdW50cy5kZXYk";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
    </ClerkProvider>
  </React.StrictMode>
);