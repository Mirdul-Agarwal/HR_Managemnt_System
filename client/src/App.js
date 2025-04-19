

// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes'; // Import routes from AppRoutes.js

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
