'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.scss';

export default function MealPlansFeature() {
  const benefits = [
    'Customized meal plans based on individual dietary needs and preferences',
    'Adaptable plans for various dietary restrictions (gluten-free, vegan, etc.)',
    'Nutritionally balanced meals that support health goals',
    'Easy-to-follow recipes and preparation instructions',
    'Flexible meal scheduling to fit your lifestyle',
    'Automatic grocery lists generated from your meal plan'
  ];

  const howItWorks = [
    {
      title: 'Complete Your Profile',
      description: 'Fill out your dietary preferences, restrictions, and health goals.'
    },
    {
      title: 'Receive Your Personalized Plan',
      description: 'Our system generates a customized meal plan tailored to your needs.'
    },
    {
      title: 'Adjust as Needed',
      description: 'Modify your plan with easy drag-and-drop tools to suit your preferences.'
    },
    {
      title: 'Shop with Ease',
      description: 'Use the auto-generated shopping list for all ingredients you need.'
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor your adherence and nutritional intake as you follow your plan.'
    }
  ];

  return (
    <div className={styles.featureContainer}>
      <div className={styles.featureHeader}>
        <h1 className={styles.title}>Personalized Meal Plans</h1>
        <p className={styles.subtitle}>
          Tailored nutrition plans designed specifically for your unique needs and goals
        </p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureDescription}>
          <h2 className={styles.sectionTitle}>Transform Your Nutrition Journey</h2>
          <p className={styles.paragraph}>
            Diet Time equips you with highly personalized meal plans that cater to your unique dietary requirements and preferences. Through our intuitive interface, you can customize meal plans to address specific health goals, dietary restrictions, and nutritional needs.
          </p>
          <p className={styles.paragraph}>
            Whether you're looking to lose weight, gain muscle, manage a health condition, or simply eat healthier, our personalized meal planning system adapts to your specific situation. No more generic meal plans that don't fit your lifestyle or preferences.
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

        <div className={styles.howItWorksSection}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepsContainer}>
            {howItWorks.map((step, index) => (
              <div key={index} className={styles.stepCard}>
                <div className={styles.stepNumber}>{index + 1}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to start your personalized nutrition journey?</h2>
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