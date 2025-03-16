'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.scss';

export default function ProgressTrackingFeature() {
  const trackingFeatures = [
    {
      id: 1,
      title: 'Visual Progress Charts',
      description: 'Track your nutrition and health metrics with interactive charts that visualize your progress over time.'
    },
    {
      id: 2,
      title: 'Customizable Dashboards',
      description: 'Create personalized dashboards that display the metrics most important to your health and nutrition goals.'
    },
    {
      id: 3,
      title: 'Progress Photos',
      description: 'Document your physical transformation with our secure photo storage and comparison tools.'
    },
    {
      id: 4,
      title: 'Goal Achievement Tracking',
      description: 'Monitor your progress toward specific goals with percentage-based completion indicators.'
    },
    {
      id: 5,
      title: 'Trend Analysis',
      description: 'Identify patterns in your nutrition and health data with our advanced trend analysis tools.'
    },
    {
      id: 6,
      title: 'Progress Reports',
      description: 'Generate detailed reports summarizing your progress over custom time periods for sharing with health professionals.'
    }
  ];

  const trackableMetrics = [
    'Weight and body measurements',
    'Body composition (body fat percentage, muscle mass)',
    'Caloric intake and macronutrient distribution',
    'Micronutrient consumption',
    'Water intake',
    'Exercise frequency and intensity',
    'Sleep quality and duration',
    'Mood and energy levels',
    'Blood pressure and heart rate',
    'Blood glucose levels'
  ];

  const benefits = [
    {
      title: 'Stay Motivated',
      description: 'Seeing your progress visualized helps maintain motivation and commitment to your health goals.'
    },
    {
      title: 'Identify Patterns',
      description: 'Recognize connections between your nutrition habits and health outcomes through comprehensive data analysis.'
    },
    {
      title: 'Make Informed Adjustments',
      description: 'Use data-driven insights to fine-tune your nutrition plan and optimize your results.'
    },
    {
      title: 'Celebrate Achievements',
      description: 'Acknowledge and celebrate your milestones with achievement badges and progress highlights.'
    }
  ];

  return (
    <div className={styles.featureContainer}>
      <header className={styles.featureHeader}>
        <h1 className={styles.title}>Progress Tracking</h1>
        <p className={styles.subtitle}>
          Visualize your journey and celebrate every milestone with our comprehensive progress tracking tools
        </p>
      </header>

      <div className={styles.featureContent}>
        <section className={styles.featureDescription}>
          <h2 className={styles.sectionTitle}>Track Your Journey to Better Health</h2>
          <p className={styles.paragraph}>
            Diet Time&apos;s Progress Tracking feature provides powerful tools to monitor and visualize your health and 
            nutrition journey. By tracking key metrics over time, you can see tangible evidence of your progress, 
            identify what&apos;s working, and make informed adjustments to your approach.
          </p>
          <p className={styles.paragraph}>
            Whether you&apos;re focused on weight management, improving body composition, or enhancing overall health, 
            our tracking tools give you the insights you need to stay motivated and achieve your goals.
          </p>
        </section>

        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Tracking Tools</h2>
          <div className={styles.featuresGrid}>
            {trackingFeatures.map(feature => (
              <div key={feature.id} className={styles.featureCard}>
                <h3 className={styles.featureName}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.metricsSection}>
          <h2 className={styles.sectionTitle}>What You Can Track</h2>
          <p className={styles.paragraph}>
            Our comprehensive tracking system allows you to monitor a wide range of health and nutrition metrics:
          </p>
          <div className={styles.metricsGrid}>
            {trackableMetrics.map((metric, index) => (
              <div key={index} className={styles.metricItem}>
                <span className={styles.metricDot}></span>
                <span className={styles.metricText}>{metric}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.benefitsSection}>
          <h2 className={styles.sectionTitle}>Benefits of Progress Tracking</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.dataVisualizationSection}>
          <h2 className={styles.sectionTitle}>Powerful Data Visualization</h2>
          <p className={styles.paragraph}>
            Diet Time transforms your health and nutrition data into clear, intuitive visualizations that make it easy to:
          </p>
          <ul className={styles.visualizationList}>
            <li>Compare current metrics with past performance</li>
            <li>Identify trends and patterns over time</li>
            <li>Correlate different metrics to understand relationships</li>
            <li>Set realistic goals based on your historical data</li>
            <li>Share progress with healthcare providers or coaches</li>
          </ul>
        </section>

        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to Track Your Progress?</h2>
          <div className={styles.ctaButtons}>
            <Link href="/dashboard/progress" className={styles.primaryButton}>
              Start Tracking Now
            </Link>
            <Link href="/features" className={styles.secondaryButton}>
              Explore Other Features
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 