'use client';

import Link from 'next/link';
import styles from './page.module.scss';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      id: 'meal-plans',
      icon: '🍽️',
      title: 'Personalized Meal Plans',
      description: 'Create highly personalized meal plans that cater to your unique dietary requirements and preferences.',
    },
    {
      id: 'progress-monitoring',
      icon: '📊',
      title: 'Dietary Progress Monitoring',
      description: 'Track your dietary progress with precision using real-time tracking and visualization tools.',
    },

    {
      id: 'health-tracking',
      icon: '❤️',
      title: 'Health Data Tracking',
      description: 'Track essential health data such as body measurements, blood pressure, and cholesterol levels.',
    },
    {
      id: 'goal-setting',
      icon: '🎯',
      title: 'Goal Setting',
      description: 'Set achievable health and dietary goals for your wellness journey with clear milestones.'
    },
    {
      id: 'dietary-advice',
      icon: '🥗',
      title: 'Personalized Dietary Advice',
      description: 'Receive personalized dietary recommendations based on your individual profile and health objectives.'
    }
  ];

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.title}>Transform Your Nutrition Journey</h1>
        <p className={styles.subtitle}>
          Diet Time helps you track meals, monitor nutrition, and achieve your health goals with personalized tools and professional guidance
        </p>
        
        <div className={styles.ctaButtons}>
          {!isAuthenticated && (
            <>
              <Link href="/register" className={styles.primaryButton}>
                Get Started
              </Link>
              <Link href="/features" className={styles.secondaryButton}>
                Explore Features
              </Link>
            </>
          )}
          
          {isAuthenticated && (
            <Link href="/dashboard" className={styles.primaryButton}>
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Key Features</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.id} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.featuresFooter}>
          <Link href="/features" className={styles.viewAllButton}>
            View All Features
          </Link>
        </div>
      </section>

      <section className={styles.testimonialSection}>
        <h2 className={styles.sectionTitle}>What Our Users Say</h2>
        <div className={styles.testimonial}>
          <p className={styles.testimonialText}>
            "Diet Time has completely transformed how I approach nutrition. The personalized meal plans and progress tracking have helped me achieve my health goals faster than I ever thought possible."
          </p>
          <div className={styles.testimonialAuthor}>
            <p className={styles.authorName}>Michael R.</p>
            <p className={styles.authorRole}>Diet Time User</p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to start your nutrition journey?</h2>
        <p className={styles.ctaDescription}>
          Join Diet Time today and take control of your health with our comprehensive nutrition management tools.
        </p>
        <Link href="/register" className={styles.ctaButton}>
          Get Started Now
        </Link>
      </section>
    </div>
  );
}
