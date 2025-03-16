'use client';

import Link from 'next/link';
import styles from './Header.module.scss';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // No need to redirect, the app will handle it automatically
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Diet Time
      </Link>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/features" className={styles.navLink}>
          Features
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link href="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link href="/meals" className={styles.navLink}>
              Meals
            </Link>
            <div className={styles.userMenu}>
              <span className={styles.username}>Hi, {user?.username}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.navLink}>
              Login
            </Link>
            <Link href="/register" className={styles.navLink}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header; 