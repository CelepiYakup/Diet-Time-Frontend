'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import styles from './LearnMore.module.scss';

interface LearnMoreProps {
  title: string;
  description: string;
  linkUrl: string;
  linkText?: string;
}

const LearnMore: React.FC<LearnMoreProps> = ({
  title,
  description,
  linkUrl,
  linkText = 'Learn More',
}) => {
  return (
    <div className={styles.learnMoreContainer}>
      <div className={styles.learnMoreBg}></div>
      <div className={styles.learnMoreContent}>
        <h3 className={styles.learnMoreTitle}>{title}</h3>
        <p className={styles.learnMoreDescription}>{description}</p>
        <Link href={linkUrl} className={styles.learnMoreButton}>
          {linkText}
          <FaArrowRight className={styles.icon} />
        </Link>
      </div>
    </div>
  );
};

export default LearnMore; 