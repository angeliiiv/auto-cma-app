// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Create a root.

root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);

// Performance measuring remains unchanged
reportWebVitals();