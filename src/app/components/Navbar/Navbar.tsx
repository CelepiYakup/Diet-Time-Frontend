'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';
import styles from './Navbar.module.scss';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLeft}>
          <button className={styles.sidebarToggle} onClick={toggleSidebar}>
            <FaBars />
          </button>
          <Link href="/" className={styles.logo}>
            Diet Time
          </Link>
        </div>

        <nav className={styles.navLinks}>
          <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
            Home
          </Link>
          <Link href="/features" className={`${styles.navLink} ${pathname === '/features' ? styles.active : ''}`}>
            Features
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className={`${styles.navLink} ${pathname === '/dashboard' ? styles.active : ''}`}>
                Dashboard
              </Link>
              <Link href="/meals" className={`${styles.navLink} ${pathname.startsWith('/meals') ? styles.active : ''}`}>
                Meals
              </Link>
            </>
          )}
        </nav>

        <div className={styles.navbarRight}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.userButton} onClick={toggleDropdown}>
                <div className={styles.userAvatar}>
                  {user?.username?.charAt(0).toUpperCase() || <FaUser />}
                </div>
                <span className={styles.username}>{user?.username}</span>
              </button>
              
              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.userAvatarLarge}>
                      {user?.username?.charAt(0).toUpperCase() || <FaUser />}
                    </div>
                    <div>
                      <div className={styles.usernameLarge}>{user?.username}</div>
                      <div className={styles.userEmail}>{user?.email}</div>
                    </div>
                  </div>
                  
                  <div className={styles.dropdownDivider}></div>
                  
                  <Link href="/profile" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                    <FaUser className={styles.dropdownIcon} />
                    <span>Profile</span>
                  </Link>
                  
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    <FaSignOutAlt className={styles.dropdownIcon} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginButton}>
                Login
              </Link>
              <Link href="/register" className={styles.registerButton}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar; 