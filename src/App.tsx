import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch } from './store/hooks';
import { restoreSession, handleSocialLoginCallback } from './store/slices/authSlice';

import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './components/Login/Login';
import EventList from './components/EventList/EventList';
import EventDetail from './components/EventDetail/EventDetail';
import EventCreationForm from './components/EventCreation/EventCreationForm';
import './App.css';

const SocialLoginLoadingScreen: React.FC = () => (
  
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #8B0029 0%, #B91C43 50%, #E8405A 100%)',
    color: 'white'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h2>소셜 로그인 처리 중...</h2>
      <div style={{ 
        border: '3px solid rgba(255,255,255,0.3)',
        borderTop: '3px solid white',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '20px auto'
      }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Debug logging for URL analysis
    console.log('=== APP STARTUP DEBUG ===');
    console.log('Current URL:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    console.log('Search params:', window.location.search);
    
    const urlParams = new URLSearchParams(window.location.search);
    console.log('All URL parameters:');
    urlParams.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    // Check localStorage status
    console.log('📋 LocalStorage status:');
    console.log('  auth_token:', localStorage.getItem('auth_token') ? 'EXISTS' : 'NONE');
    console.log('  token_type:', localStorage.getItem('token_type') ? 'EXISTS' : 'NONE');
    console.log('  user_info:', localStorage.getItem('user_info') ? 'EXISTS' : 'NONE');
    
    // Check if this is a social login redirect
    if (urlParams.has('redirectedFromSocialLogin')) {
      console.log('🎉 SOCIAL LOGIN REDIRECT DETECTED!');
      console.log('redirectedFromSocialLogin value:', urlParams.get('redirectedFromSocialLogin'));
      console.log('Handling social login callback...');
      dispatch(handleSocialLoginCallback(navigate)).then((result) => {
        if (handleSocialLoginCallback.fulfilled.match(result)) {
          console.log('✅ Social login successful, redirecting to events');
          navigate('/events', { replace: true });
        } else {
          console.log('❌ Social login failed, redirecting to login');
          navigate('/login', { replace: true });
        }
      });
    } else {
      console.log('🔄 Normal app load - session should be restored from initial state');
      // Since we now check localStorage in initial state, we don't need to dispatch restoreSession
      // But we can still dispatch it to trigger any side effects or ensure consistency
      dispatch(restoreSession());
    }
    console.log('=== END APP STARTUP DEBUG ===');
  }, [dispatch, navigate]);

  return (
    <div className="App">
      <Routes>
        {/* Public route - Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Debug route for testing social login redirect */}
        

        
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
        
        {/* Redirect root to events (but show loading during social login callback) */}
        <Route path="/" element={
          new URLSearchParams(window.location.search).has('redirectedFromSocialLogin') 
            ? <SocialLoginLoadingScreen />
            : <Navigate to="/events" replace />
        } />
        
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
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App; 