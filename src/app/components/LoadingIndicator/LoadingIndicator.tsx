'use client';

import React from 'react';
import styles from './LoadingIndicator.module.scss';

interface LoadingIndicatorProps {
  text?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ text = 'Loading...' }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  );
};

export default LoadingIndicator;

 