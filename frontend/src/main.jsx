import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import store from './store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#12121c',
              color: '#f0f0fa',
              border: '1px solid #1e1e2e',
              borderRadius: '12px',
              fontFamily: '"DM Sans", sans-serif',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#050508' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#050508' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
