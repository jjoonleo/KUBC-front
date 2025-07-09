import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import styles from './UserMenu.module.css';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Redux action handles the AuthService call
    dispatch(logoutUser()).then(() => {
      window.location.href = '/login';
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.userMenu}>
      <button 
        className={styles.userButton}
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.nickname || user.name}</span>
          <span className={styles.userEmail}>{user.email}</span>
        </div>
        <span className={styles.dropdownArrow}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <div className={styles.userDetails}>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
              <small>ID: {user.id.substring(0, 8)}...</small>
            </div>
          </div>
          
          <div className={styles.dropdownDivider}></div>
          
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
      )}

      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default UserMenu; 