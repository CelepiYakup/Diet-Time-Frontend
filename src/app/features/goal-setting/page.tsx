'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.scss';

export default function GoalSettingFeature() {
  const benefits = [
    'Set clear, achievable nutrition and health goals',
    'Track progress with visual indicators and milestones',
    'Receive personalized recommendations based on your goals',
    'Adjust goals as your health journey evolves',
    'Celebrate achievements with built-in reward system',
    'Share progress with nutrition professionals for guidance'
  ];

  const goalTypes = [
    {
      name: 'Weight Management',
      description: 'Set targets for weight loss, gain, or maintenance with realistic timelines',
      icon: '⚖️'
    },
    {
      name: 'Macronutrient Targets',
      description: 'Define specific protein, carb, and fat ratios aligned with your dietary approach',
      icon: '🥩'
    },
    {
      name: 'Calorie Goals',
      description: 'Establish daily or weekly calorie targets based on your activity level and objectives',
      icon: '🔥'
    },
    {
      name: 'Hydration Targets',
      description: 'Set water intake goals to ensure proper hydration throughout the day',
      icon: '💧'
    },
    {
      name: 'Meal Frequency',
      description: 'Plan your ideal meal timing and frequency to support your lifestyle',
      icon: '🕒'
    },
    {
      name: 'Health Metrics',
      description: 'Set targets for blood pressure, cholesterol, and other important health indicators',
      icon: '📊'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Assess Your Current State',
      description: 'Take baseline measurements and evaluate your starting point'
    },
    {
      number: 2,
      title: 'Define Your Vision',
      description: 'Clarify what you want to achieve with your nutrition and health'
    },
    {
      number: 3,
      title: 'Set SMART Goals',
      description: 'Create specific, measurable, achievable, relevant, and time-bound objectives'
    },
    {
      number: 4,
      title: 'Break Down Into Milestones',
      description: 'Divide larger goals into smaller, manageable checkpoints'
    },
    {
      number: 5,
      title: 'Track Your Progress',
      description: 'Regularly monitor and record your advancement toward goals'
    },
    {
      number: 6,
      title: 'Adjust As Needed',
      description: 'Refine your goals based on progress and changing circumstances'
    }
  ];

  return (
    <div className={styles.featureContainer}>
      <div className={styles.featureHeader}>
        <h1 className={styles.title}>Goal Setting</h1>
        <p className={styles.subtitle}>
          Define clear objectives and track your progress toward better health
        </p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureDescription}>
          <h2 className={styles.sectionTitle}>Achieve Your Health Ambitions</h2>
          <p className={styles.paragraph}>
            Diet Time helps you set achievable health and dietary goals for your wellness journey. Work collaboratively with nutrition professionals towards achieving your desired outcomes with clear and measurable milestones.
          </p>
          <p className={styles.paragraph}>
            Research shows that people who set specific goals are significantly more likely to achieve their health objectives. Our goal-setting tools are designed based on behavioral psychology principles to maximize your chances of success.
          </p>
        </div>

        <div className={styles.goalTypesSection}>
          <h2 className={styles.sectionTitle}>Types of Goals You Can Set</h2>
          <div className={styles.goalTypesGrid}>
            {goalTypes.map((goalType, index) => (
              <div key={index} className={styles.goalTypeCard}>
                <div className={styles.goalTypeIcon}>{goalType.icon}</div>
                <h3 className={styles.goalTypeName}>{goalType.name}</h3>
                <p className={styles.goalTypeDescription}>{goalType.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.stepsSection}>
          <h2 className={styles.sectionTitle}>Goal Setting Process</h2>
          <div className={styles.stepsContainer}>
            {steps.map((step) => (
              <div key={step.number} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
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

        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to set and achieve your health goals?</h2>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.primaryButton}>
              Start Setting Goals
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