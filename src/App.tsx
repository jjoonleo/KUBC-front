import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from './store/hooks';
import { restoreSession } from './store/slices/authSlice';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './components/Login/Login';
import EventList from './components/EventList/EventList';
import EventDetail from './components/EventDetail/EventDetail';
import EventCreationForm from './components/EventCreation/EventCreationForm';
import './App.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Restore session from localStorage when app loads
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public route - Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/events" element={
            <PrivateRoute>
              <EventList />
            </PrivateRoute>
          } />
          
          <Route path="/events/create" element={
            <PrivateRoute>
              <EventCreationForm />
            </PrivateRoute>
          } />
          
          <Route path="/events/:id" element={
            <PrivateRoute>
              <EventDetail />
            </PrivateRoute>
          } />
          
          {/* Redirect root to events */}
          <Route path="/" element={<Navigate to="/events" replace />} />
          
          {/* 404 page */}
          <Route path="*" element={
            <PrivateRoute>
              <div style={{ 
                padding: '20px', 
                textAlign: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f8f9fa'
              }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 