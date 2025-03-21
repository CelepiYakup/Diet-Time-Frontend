'use client';

import React from 'react';
import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
  title?: string;
  currentValue: number;
  maxValue: number;
  unit?: string;
  showLabels?: boolean;
  variant?: 'success' | 'warning' | 'danger';
  isPulsing?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  title,
  currentValue,
  maxValue,
  unit = '',
  showLabels = true,
  variant = 'success',
  isPulsing = false,
}) => {
  // Fix for current value greater than max value
  const effectiveCurrentValue = Math.min(currentValue, maxValue);
  const percentage = Math.min(100, (effectiveCurrentValue / maxValue) * 100);
  
  // Determine variant class based on percentage if not specified
  const determineVariant = () => {
    if (variant) return variant;
    if (percentage < 40) return 'danger';
    if (percentage < 70) return 'warning';
    return 'success';
  };
  
  const progressVariant = determineVariant();
  const progressClasses = `${styles.progressFill} ${styles[progressVariant]} ${isPulsing ? styles.pulsing : ''}`;
  
  return (
    <div className={styles.progressContainer}>
      {title && <div className={styles.progressTitle}>{title}</div>}
      <div className={styles.progressValue}>
        {currentValue} / {maxValue} {unit}
      </div>
      <div className={styles.progressBar}>
        <div 
          className={progressClasses} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {showLabels && (
        <div className={styles.progressLabels}>
          <div>0 {unit}</div>
          <div>{maxValue} {unit}</div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar; 