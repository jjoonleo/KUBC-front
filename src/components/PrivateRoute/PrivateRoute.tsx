import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, user, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log("🔐 PrivateRoute: Authentication state check", {
      isAuthenticated,
      loading,
      hasUser: !!user,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "NONE"
    });
  }, [isAuthenticated, loading, user, token]);

  if (loading) {
    console.log("⏳ PrivateRoute: Showing loading state");
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("❌ PrivateRoute: Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ PrivateRoute: Authenticated, rendering protected content");
  return <>{children}</>;
};

export default PrivateRoute; 