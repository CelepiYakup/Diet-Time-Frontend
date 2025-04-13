'use client';

import React from 'react';
import Link from 'next/link';
import { FaUtensils, FaChartLine,FaHeartbeat, FaBullseye } from 'react-icons/fa';
import styles from './page.module.scss';

export default function FeaturesOverview() {
  const features = [
    {
      id: 'meal-planning',
      icon: <FaUtensils className={styles.featureIcon} />,
      title: 'Meal Planning',
      description: 'Plan your meals in advance with our intuitive calendar interface, recipe integration, and automatic shopping lists.',
      link: '/features/meal-planning'
    },
    {
      id: 'progress-tracking',
      icon: <FaChartLine className={styles.featureIcon} />,
      title: 'Progress Tracking',
      description: 'Visualize your journey with interactive charts, customizable dashboards, and comprehensive progress reports.',
      link: '/features/progress-tracking'
    },

    {
      id: 'health-tracking',
      icon: <FaHeartbeat className={styles.featureIcon} />,
      title: 'Health Data Tracking',
      description: 'Monitor vital health metrics, track body measurements, and maintain a comprehensive health profile.',
      link: '/features/health-tracking'
    },
    {
      id: 'goal-setting',
      icon: <FaBullseye className={styles.featureIcon} />,
      title: 'Goal Setting',
      description: 'Set clear nutrition and health goals, track your progress, and receive personalized recommendations.',
      link: '/features/goal-setting'
    }
  ];

  return (
    <div className={styles.featuresContainer}>
      <header className={styles.featuresHeader}>
        <h1 className={styles.title}>Diet Time Features</h1>
        <p className={styles.subtitle}>
          Discover the powerful tools that make Diet Time the ultimate nutrition and health companion
        </p>
      </header>

      <section className={styles.featuresIntro}>
        <p className={styles.introParagraph}>
          Diet Time offers a comprehensive suite of features designed to simplify your nutrition journey and 
          help you achieve your health goals. From meal planning to progress tracking, our tools work together 
          to provide a seamless experience that adapts to your unique needs.
        </p>
      </section>

      <section className={styles.featuresGrid}>
        {features.map(feature => (
          <Link href={feature.link} key={feature.id} className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              {feature.icon}
            </div>
            <h2 className={styles.featureTitle}>{feature.title}</h2>
            <p className={styles.featureDescription}>{feature.description}</p>
            <span className={styles.learnMore}>Learn more →</span>
          </Link>
        ))}
      </section>

      <section className={styles.integrationSection}>
        <h2 className={styles.sectionTitle}>Seamless Integration</h2>
        <p className={styles.sectionParagraph}>
          All Diet Time features are designed to work together, creating a unified experience that makes 
          managing your nutrition and health simpler than ever. Data flows seamlessly between features, 
          ensuring you always have the information you need at your fingertips.
        </p>
        <div className={styles.integrationPoints}>
          <div className={styles.integrationPoint}>
            <h3>Meal Planning + Progress Tracking</h3>
            <p>See how your planned meals affect your nutritional progress over time.</p>
          </div>
          <div className={styles.integrationPoint}>
            <h3>Health Tracking + Goal Setting</h3>
            <p>Set goals based on your health data and track your progress toward achieving them.</p>
          </div>
          <div className={styles.integrationPoint}>
            <h3>Community + Meal Planning</h3>
            <p>Discover new recipes from the community and add them directly to your meal plan.</p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Transform Your Nutrition Journey?</h2>
        <div className={styles.ctaButtons}>
          <Link href="/register" className={styles.primaryButton}>
            Get Started Now
          </Link>
          <Link href="/" className={styles.secondaryButton}>
            Learn More About Diet Time
          </Link>
        </div>
      </section>
    </div>
  );
} 