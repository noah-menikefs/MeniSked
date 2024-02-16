import React from 'react';
import { createRoot } from 'react-dom'; // Import createRoot from react-dom
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'tachyons';
import 'bootstrap/dist/css/bootstrap.min.css';

// Use createRoot instead of ReactDOM.render
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// You can keep the service worker part as is
serviceWorker.unregister();