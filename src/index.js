import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { NotificationsProvider } from '@mantine/notifications';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <NotificationsProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </NotificationsProvider>
  </Router>
);
