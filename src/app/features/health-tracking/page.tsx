'use client';

import React from 'react';
import Link from 'next/link';
import { FaHeartbeat, FaRulerVertical, FaTint, FaBed, FaRunning, FaPills } from 'react-icons/fa';
import styles from './page.module.scss';

export default function HealthTrackingFeature() {
  return (
    <div className={styles.featureContainer}>
      <header className={styles.featureHeader}>
        <h1 className={styles.title}>Health Data Tracking</h1>
        <p className={styles.subtitle}>Monitor all your important health metrics in one secure place</p>
      </header>

      <section className={styles.featureSection}>
        <h2 className={styles.sectionTitle}>Comprehensive Health Monitoring</h2>
        <div className={styles.sectionContent}>
          <p className={styles.paragraph}>
            Diet Time allows you to effortlessly track essential health data such as body measurements, blood
            pressure, cholesterol levels, and more within the platform. All your relevant health data is centralized
            in one secure location, simplifying assessment and analysis.
          </p>
          <p className={styles.paragraph}>
            Understanding the relationship between your nutrition and overall health is crucial for making
            informed decisions. Our health tracking tools provide a complete picture of your wellness journey,
            helping you see how dietary changes impact your health metrics.
          </p>
        </div>
      </section>

      <section className={styles.featureSection}>
        <h2 className={styles.sectionTitle}>What You Can Track</h2>
        <div className={styles.trackingGrid}>
          <div className={styles.trackingCard}>
            <div className={styles.trackingIconWrapper}>
              <FaRulerVertical className={styles.trackingIcon} />
            </div>
            <h3 className={styles.trackingTitle}>Body Measurements</h3>
            <p className={styles.trackingDescription}>
              Track weight, height, BMI, body fat percentage, and measurements for different body parts
            </p>
          </div>

          <div className={styles.trackingCard}>
            <div className={styles.trackingIconWrapper}>
              <FaHeartbeat className={styles.trackingIcon} />
            </div>
            <h3 className={styles.trackingTitle}>Vital Signs</h3>
            <p className={styles.trackingDescription}>
              Monitor blood pressure, heart rate, temperature, and respiratory rate
            </p>
          </div>

          <div className={styles.trackingCard}>
            <div className={styles.trackingIconWrapper}>
              <FaTint className={styles.trackingIcon} />
            </div>
            <h3 className={styles.trackingTitle}>Blood Work</h3>
            <p className={styles.trackingDescription}>
              Record cholesterol levels, blood glucose, hemoglobin A1C, and other lab results
            </p>
          </div>

          <div className={styles.trackingCard}>
            <div className={styles.trackingIconWrapper}>
              <FaBed className={styles.trackingIcon} />
            </div>
            <h3 className={styles.trackingTitle}>Sleep Patterns</h3>
            <p className={styles.trackingDescription}>
              Track sleep duration, quality, and patterns to optimize your rest
            </p>
          </div>

          <div className={styles.trackingCard}>
            <div className={styles.trackingIconWrapper}>
              <FaRunning className={styles.trackingIcon} />
            </div>
            <h3 className={styles.trackingTitle}>Exercise Stats</h3>
            <p className={styles.trackingDescription}>
              Log workouts, steps, distance, calories burned, and activity levels
            </p>
          </div>

          <div className={styles.trackingCard}>
            <div className={styles.trackingIconWrapper}>
              <FaPills className={styles.trackingIcon} />
            </div>
            <h3 className={styles.trackingTitle}>Medication Tracking</h3>
            <p className={styles.trackingDescription}>
              Keep track of medications, dosages, schedules, and adherence
            </p>
          </div>
        </div>
      </section>

      <section className={styles.featureSection}>
        <h2 className={styles.sectionTitle}>Key Benefits</h2>
        <div className={styles.benefitsList}>
          <div className={styles.benefitItem}>
            <h3 className={styles.benefitTitle}>Comprehensive Health Overview</h3>
            <p className={styles.benefitDescription}>
              Get a complete picture of your health with all metrics in one place
            </p>
          </div>
          
          <div className={styles.benefitItem}>
            <h3 className={styles.benefitTitle}>Identify Trends and Patterns</h3>
            <p className={styles.benefitDescription}>
              Visualize changes over time to spot correlations between diet and health
            </p>
          </div>
          
          <div className={styles.benefitItem}>
            <h3 className={styles.benefitTitle}>Make Informed Decisions</h3>
            <p className={styles.benefitDescription}>
              Use data-driven insights to adjust your nutrition and lifestyle choices
            </p>
          </div>
          
          <div className={styles.benefitItem}>
            <h3 className={styles.benefitTitle}>Share With Healthcare Providers</h3>
            <p className={styles.benefitDescription}>
              Export your health data to share with doctors and nutritionists
            </p>
          </div>
        </div>
      </section>

      <section className={styles.featureSection}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsList}>
          <div className={styles.stepItem}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Enter Your Health Data</h3>
              <p className={styles.stepDescription}>
                Manually input your health metrics or connect with compatible health devices and apps
              </p>
            </div>
          </div>
          
          <div className={styles.stepItem}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>View Visualizations</h3>
              <p className={styles.stepDescription}>
                See your data displayed in easy-to-understand charts and graphs
              </p>
            </div>
          </div>
          
          <div className={styles.stepItem}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Analyze Trends</h3>
              <p className={styles.stepDescription}>
                Identify patterns and correlations between your diet and health metrics
              </p>
            </div>
          </div>
          
          <div className={styles.stepItem}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Receive Insights</h3>
              <p className={styles.stepDescription}>
                Get personalized recommendations based on your health data
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.ctaContainer}>
        <Link href="/dashboard/health-tracking" className={styles.ctaButton}>
          Start Tracking Your Health
        </Link>
      </div>
    </div>
  );
} 