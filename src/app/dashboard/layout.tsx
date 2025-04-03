'use client';

import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Header from '../components/Header';
import styles from './layout.module.scss';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className={styles.dashboardLayout}>
        <Header />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
} 