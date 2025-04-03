'use client';

import Link from 'next/link';
import styles from './Header.module.scss';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();

  };
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {isAuthenticated ? (
          <>

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