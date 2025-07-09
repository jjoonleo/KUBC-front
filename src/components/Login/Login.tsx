import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { naverLogin, restoreSession, clearError } from '../../store/slices/authSlice';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Try to restore session from localStorage on component mount
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    // Clear error when component unmounts or user starts fresh
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleNaverLogin = () => {
    // Redux action handles the AuthService call
    dispatch(naverLogin());
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    window.location.href = '/events';
    return null;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <h1>KUBC</h1>
          <p>Korea University Badminton Club</p>
        </div>
        
        <div className={styles.loginContent}>
          <h2>로그인</h2>
          <p>네이버 계정으로 로그인하여 배드민턴 클럽 이벤트를 관리하세요.</p>
          
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          <button 
            className={styles.naverLoginBtn}
            onClick={handleNaverLogin}
            disabled={loading}
          >
            {loading ? (
              <div className={styles.spinner}></div>
            ) : (
              <>
                <img 
                  src="https://developers.naver.com/inc/devcenter/downloads/naver_logo.png" 
                  alt="Naver" 
                  className={styles.naverLogo}
                />
                네이버로 로그인
              </>
            )}
          </button>
          
          <div className={styles.apiInfo}>
            <small>
              API: {process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}
              {process.env.REACT_APP_NAVER_LOGIN_ENDPOINT || '/api/auth/oauth2/authorization/naver'}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 