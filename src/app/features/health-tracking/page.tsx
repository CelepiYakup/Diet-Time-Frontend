'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.scss';

export default function HealthTrackingFeature() {
  const benefits = [
    'Centralized storage of all your health metrics',
    'Track body measurements and composition over time',
    'Monitor vital signs like blood pressure and heart rate',
    'Record blood test results and other lab values',
    'Set alerts for important health indicators',
    'Share health data with healthcare professionals'
  ];

  const trackableMetrics = [
    {
      name: 'Body Measurements',
      description: 'Track weight, BMI, body fat percentage, and other body composition metrics',
      icon: '📏'
    },
    {
      name: 'Vital Signs',
      description: 'Monitor blood pressure, heart rate, temperature, and other vital health indicators',
      icon: '❤️'
    },
    {
      name: 'Blood Work',
      description: 'Record cholesterol levels, blood glucose, and other important lab values',
      icon: '🩸'
    },
    {
      name: 'Sleep Patterns',
      description: 'Track sleep duration and quality to optimize your rest and recovery',
      icon: '😴'
    },
    {
      name: 'Exercise Stats',
      description: 'Log workouts, steps, and other physical activity metrics',
      icon: '🏃‍♂️'
    },
    {
      name: 'Medication Tracking',
      description: 'Keep track of medications, supplements, and dosage schedules',
      icon: '💊'
    }
  ];

  return (
    <div className={styles.featureContainer}>
      <div className={styles.featureHeader}>
        <h1 className={styles.title}>Health Data Tracking</h1>
        <p className={styles.subtitle}>
          Monitor all your important health metrics in one secure place
        </p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureDescription}>
          <h2 className={styles.sectionTitle}>Comprehensive Health Monitoring</h2>
          <p className={styles.paragraph}>
            Diet Time allows you to effortlessly track essential health data such as body measurements, blood pressure, cholesterol levels, and more within the platform. All your relevant health data is centralized in one secure location, simplifying assessment and analysis.
          </p>
          <p className={styles.paragraph}>
            Understanding the relationship between your nutrition and overall health is crucial for making informed decisions. Our health tracking tools provide a complete picture of your wellness journey, helping you see how dietary changes impact your health metrics.
          </p>
        </div>

        <div className={styles.metricsSection}>
          <h2 className={styles.sectionTitle}>What You Can Track</h2>
          <div className={styles.metricsGrid}>
            {trackableMetrics.map((metric, index) => (
              <div key={index} className={styles.metricCard}>
                <div className={styles.metricIcon}>{metric.icon}</div>
                <h3 className={styles.metricName}>{metric.name}</h3>
                <p className={styles.metricDescription}>{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.benefitsSection}>
          <h2 className={styles.sectionTitle}>Key Benefits</h2>
          <ul className={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <li key={index} className={styles.benefitItem}>
                <span className={styles.checkmark}>✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.dataSecuritySection}>
          <h2 className={styles.sectionTitle}>Your Data Security</h2>
          <div className={styles.securityContent}>
            <div className={styles.securityIcon}>🔒</div>
            <div className={styles.securityText}>
              <p className={styles.paragraph}>
                We take your health data privacy seriously. Diet Time implements industry-leading security measures to ensure your sensitive health information remains protected:
              </p>
              <ul className={styles.securityList}>
                <li>End-to-end encryption for all health data</li>
                <li>HIPAA-compliant data storage and processing</li>
                <li>Granular privacy controls for sharing data</li>
                <li>Regular security audits and compliance checks</li>
                <li>Data portability and export options</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to start tracking your health data?</h2>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.primaryButton}>
              Get Started
            </Link>
            <Link href="/features" className={styles.secondaryButton}>
              Explore Other Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 