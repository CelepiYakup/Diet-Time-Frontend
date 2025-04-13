'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.scss';

export default function ProgressMonitoringFeature() {
  const benefits = [
    'Real-time tracking of your dietary progress',
    'Visual charts and graphs to monitor changes over time',
    'Comprehensive nutritional analysis of your diet',
    'Customizable metrics based on your health goals',
    'Trend analysis to identify patterns in your nutrition',
    'Progress reports that can be shared with health professionals'
  ];

  const metrics = [
    {
      name: 'Calorie Intake',
      description: 'Track your daily calorie consumption against your goals'
    },
    {
      name: 'Macronutrient Balance',
      description: 'Monitor your protein, carbs, and fat ratios'
    },
    {
      name: 'Weight Tracking',
      description: 'Record and visualize changes in your weight over time'
    },
    {
      name: 'Body Measurements',
      description: 'Keep track of changes in your body composition'
    },
    {
      name: 'Nutrient Analysis',
      description: 'Ensure you are getting essential vitamins and minerals'
    },
    {
      name: 'Hydration Levels',
      description: 'Monitor your daily water intake'
    }
  ];

  return (
    <div className={styles.featureContainer}>
      <div className={styles.featureHeader}>
        <h1 className={styles.title}>Dietary Progress Monitoring</h1>
        <p className={styles.subtitle}>
          Track your nutrition journey with precision and gain valuable insights
        </p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureDescription}>
          <h2 className={styles.sectionTitle}>Data-Driven Nutrition Decisions</h2>
          <p className={styles.paragraph}>
            Diet Time offers real-time tracking capabilities, allowing you to monitor your dietary progress with precision. Our platform provides insightful data visualization tools to track changes in weight, dietary habits, and health indicators over time, facilitating data-driven decision-making for better health outcomes.
          </p>
          <p className={styles.paragraph}>
            Understanding your nutrition patterns is key to making sustainable changes. Our progress monitoring tools help you identify what's working and what needs adjustment, so you can continuously optimize your diet for your health goals.
          </p>
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

        <div className={styles.metricsSection}>
          <h2 className={styles.sectionTitle}>What You Can Track</h2>
          <div className={styles.metricsGrid}>
            {metrics.map((metric, index) => (
              <div key={index} className={styles.metricCard}>
                <h3 className={styles.metricName}>{metric.name}</h3>
                <p className={styles.metricDescription}>{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.visualizationSection}>
          <h2 className={styles.sectionTitle}>Powerful Visualizations</h2>
          <div className={styles.visualizationContent}>
            <div className={styles.visualizationText}>
              <p className={styles.paragraph}>
                Our intuitive charts and graphs transform your nutrition data into clear, actionable insights. See your progress at a glance with:
              </p>
              <ul className={styles.visualizationList}>
                <li>Interactive timeline charts</li>
                <li>Macronutrient distribution wheels</li>
                <li>Progress comparison views</li>
                <li>Goal achievement indicators</li>
                <li>Customizable dashboard widgets</li>
              </ul>
            </div>
            <div className={styles.visualizationPlaceholder}>
              {/* Placeholder for chart/graph image */}
              <div className={styles.chartPlaceholder}>
                <div className={styles.chartBar} style={{ height: '60%' }}></div>
                <div className={styles.chartBar} style={{ height: '80%' }}></div>
                <div className={styles.chartBar} style={{ height: '40%' }}></div>
                <div className={styles.chartBar} style={{ height: '90%' }}></div>
                <div className={styles.chartBar} style={{ height: '70%' }}></div>
                <div className={styles.chartBar} style={{ height: '50%' }}></div>
                <div className={styles.chartBar} style={{ height: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to track your nutrition journey?</h2>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.primaryButton}>
              Start Tracking Now
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