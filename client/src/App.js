import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Dashboard, SingleQuestion } from './components';
import { AuthProvider } from './helpers/auth';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    // Provide context to each routed component
    // Each children component will have access to the context values
    <AuthProvider>
      {/* Set routes */}
      <Router>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/questions/:questionId" component={SingleQuestion} />
      </Router>
    </AuthProvider>
  );
}
