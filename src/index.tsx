// @ts-nocheck

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from 'styled-components';
import { lightTheme, MeetingProvider } from 'amazon-chime-sdk-component-library-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
        <MeetingProvider>
            <App />
        </MeetingProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

reportWebVitals();
