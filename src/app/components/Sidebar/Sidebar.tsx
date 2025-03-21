'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaChartLine, 
  FaUtensils, 
  FaCalendarAlt, 
  FaWeight, 
  FaUsers, 
  FaCog,
  FaQuestionCircle,
  FaBook,
  FaBullseye,
  FaChevronRight
} from 'react-icons/fa';
import styles from './Sidebar.module.scss';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, isCollapsed, onClose }: SidebarProps) => {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !isCollapsed && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isCollapsed]);

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen && !isCollapsed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isCollapsed]);

  // Handle sidebar open/close/collapse states
  const getSidebarClassName = () => {
    if (!isOpen) {
      return styles.sidebar;
    }
    
    if (isCollapsed) {
      return `${styles.sidebar} ${styles.closed}`;
    }
    
    return `${styles.sidebar} ${styles.open}`;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/features', label: 'Features', icon: <FaBook /> },
  ];

  const authenticatedNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
    { path: '/meals', label: 'Meal Tracking', icon: <FaUtensils /> },
    { path: '/dashboard/meal-plans', label: 'Meal Planning', icon: <FaCalendarAlt /> },
    { path: '/dashboard/goals', label: 'Goal Setting', icon: <FaBullseye /> },
    { path: '/progress', label: 'Progress Tracking', icon: <FaWeight /> },
    { path: '/community', label: 'Community', icon: <FaUsers /> },
    { path: '/settings', label: 'Settings', icon: <FaCog /> },
    { path: '/help', label: 'Help & Support', icon: <FaQuestionCircle /> },
  ];

  return (
    <>
      {isOpen && !isCollapsed && (
        <div 
          className={`${styles.sidebarOverlay} ${styles.active}`} 
          onClick={onClose}
        ></div>
      )}
      
      <aside 
        className={getSidebarClassName()} 
        ref={sidebarRef}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>Diet Time</div>
          <button className={styles.closeButton} onClick={() => onClose()}>
            <FaChevronRight className={isCollapsed ? styles.collapsed : ''} />
          </button>
        </div>

        {isAuthenticated && (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.username}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
        )}

        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </div>

          {isAuthenticated && (
            <>
              <div className={styles.navDivider}></div>
              <div className={styles.navSectionTitle}>App</div>
              <div className={styles.navSection}>
                {authenticatedNavItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`${styles.navItem} ${
                      pathname === item.path || 
                      (item.path !== '/' && pathname?.startsWith(item.path)) 
                        ? styles.active 
                        : ''
                    }`}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabel}>{item.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.footerText}>Diet Time &copy; {new Date().getFullYear()}</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 