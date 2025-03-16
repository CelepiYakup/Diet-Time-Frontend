'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.scss';

export default function CommunicationFeature() {
  const benefits = [
    'Secure messaging with nutrition professionals',
    'Video conferencing for virtual consultations',
    'File sharing for meal plans and resources',
    'Appointment scheduling and reminders',
    'Feedback and progress discussion tools',
    'Mobile-friendly communication on the go'
  ];

  const communicationTools = [
    {
      title: 'Secure Messaging',
      description: 'Exchange messages with your nutrition professional in a secure, HIPAA-compliant environment.',
      icon: '✉️'
    },
    {
      title: 'Video Consultations',
      description: 'Have face-to-face meetings with your dietitian from the comfort of your home.',
      icon: '📹'
    },
    {
      title: 'Document Sharing',
      description: 'Share meal plans, recipes, and educational resources easily within the platform.',
      icon: '📄'
    },
    {
      title: 'Appointment Management',
      description: 'Schedule, reschedule, or cancel appointments with simple calendar integration.',
      icon: '📅'
    }
  ];

  return (
    <div className={styles.featureContainer}>
      <div className={styles.featureHeader}>
        <h1 className={styles.title}>Client Communication Tools</h1>
        <p className={styles.subtitle}>
          Stay connected with nutrition professionals for ongoing support and guidance
        </p>
      </div>

      <div className={styles.featureContent}>
        <div className={styles.featureDescription}>
          <h2 className={styles.sectionTitle}>Seamless Communication for Better Results</h2>
          <p className={styles.paragraph}>
            Diet Time integrates robust communication features that enable you to maintain seamless contact with nutrition professionals. Through secure messaging and video conferencing, you can receive guidance, answers to your questions, and ongoing support throughout your wellness journey.
          </p>
          <p className={styles.paragraph}>
            Effective communication is key to successful nutrition counseling. Our platform ensures that you&apos;re never alone in your health journey, with multiple ways to connect with your dietitian or nutritionist whenever you need support or have questions.
          </p>
        </div>

        <div className={styles.communicationToolsSection}>
          <h2 className={styles.sectionTitle}>Communication Tools</h2>
          <div className={styles.toolsGrid}>
            {communicationTools.map((tool, index) => (
              <div key={index} className={styles.toolCard}>
                <div className={styles.toolIcon}>{tool.icon}</div>
                <h3 className={styles.toolTitle}>{tool.title}</h3>
                <p className={styles.toolDescription}>{tool.description}</p>
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

        <div className={styles.testimonialSection}>
          <h2 className={styles.sectionTitle}>What Our Users Say</h2>
          <div className={styles.testimonial}>
            <div className={styles.testimonialContent}>
              <p className={styles.testimonialText}>
                &quot;Being able to message my dietitian whenever I have questions has been a game-changer. I get quick responses and don&apos;t have to wait for my next appointment to make adjustments to my meal plan.&quot;
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}></div>
                <div className={styles.testimonialInfo}>
                  <p className={styles.testimonialName}>Sarah J.</p>
                  <p className={styles.testimonialRole}>Diet Time User</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to connect with nutrition professionals?</h2>
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