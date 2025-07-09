import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { naverLogin, clearError } from '../../store/slices/authSlice';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleNaverLogin = () => {
    // Clear any previous errors
    dispatch(clearError());
    
    // This will trigger a browser redirect to Naver OAuth
    dispatch(naverLogin());
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>KUBC</h1>
          <h2 className={styles.subtitle}>배드민턴 클럽 이벤트 관리</h2>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button 
              onClick={() => dispatch(clearError())}
              className={styles.errorCloseButton}
            >
              ✕
            </button>
          </div>
        )}

        <div className={styles.loginSection}>
          <p className={styles.description}>
            KUBC 회원만 이용 가능한 서비스입니다.<br />
            네이버 계정으로 로그인해주세요.
          </p>
          
          <button 
            onClick={handleNaverLogin}
            disabled={loading}
            className={styles.naverLoginButton}
          >
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <span>로그인 중...</span>
              </div>
            ) : (
              <>
                <div className={styles.naverIcon}>N</div>
                <span>네이버로 로그인</span>
              </>
            )}
          </button>
        </div>

        <div className={styles.footer}>
          <p>© 2024 KUBC. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 