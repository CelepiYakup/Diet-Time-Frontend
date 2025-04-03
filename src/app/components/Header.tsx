'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/meal-plans', label: 'Meal Plans' },
    { href: '/dashboard/health-tracking', label: 'Health Tracking' },
    { href: '/dashboard/goals', label: 'Goals' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/dashboard">Diet Time</Link>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${
                    pathname === item.href ? styles.active : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={styles.userSection}>
          {user && (
            <>
              <span className={styles.username}>{user.username}</span>
              <button onClick={logout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 