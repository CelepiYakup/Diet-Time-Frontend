'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.scss';

export default function CommunityFeature() {
  const communityFeatures = [
    {
      id: 1,
      title: 'Discussion Forums',
      description: 'Connect with like-minded individuals in topic-specific forums covering nutrition, recipes, workout routines, and more.'
    },
    {
      id: 2,
      title: 'Support Groups',
      description: 'Join specialized groups based on dietary preferences, health conditions, or fitness goals for targeted support and advice.'
    },
    {
      id: 3,
      title: 'Recipe Sharing',
      description: 'Discover and share healthy recipes with the community, complete with nutritional information and preparation tips.'
    },
    {
      id: 4,
      title: 'Challenge Participation',
      description: 'Join community challenges to stay motivated and accountable while working toward your health and nutrition goals.'
    },
    {
      id: 5,
      title: 'Expert Q&A Sessions',
      description: 'Participate in scheduled sessions with nutritionists, dietitians, and fitness experts to get your questions answered.'
    },
    {
      id: 6,
      title: 'Success Stories',
      description: 'Share your progress and achievements or find inspiration in the success stories of other community members.'
    }
  ];

  const communityBenefits = [
    {
      title: 'Motivation & Accountability',
      description: 'Stay motivated with support from others who understand your journey and can help keep you accountable to your goals.'
    },
    {
      title: 'Knowledge Sharing',
      description: 'Learn from the collective wisdom and experiences of community members who have faced similar challenges.'
    },
    {
      title: 'Emotional Support',
      description: 'Find understanding and encouragement during difficult moments from people who truly understand what you&apos;re going through.'
    },
    {
      title: 'Diverse Perspectives',
      description: 'Gain insights from people with different backgrounds, approaches, and experiences with nutrition and health.'
    }
  ];

  const communityGuidelines = [
    'Be respectful and supportive of all community members',
    'Share evidence-based information and clearly label personal experiences',
    'Respect privacy and confidentiality of other members',
    'Focus on constructive feedback rather than criticism',
    'Report inappropriate content to community moderators',
    'Avoid promoting extreme or potentially harmful practices'
  ];

  return (
    <div className={styles.featureContainer}>
      <header className={styles.featureHeader}>
        <h1 className={styles.title}>Community</h1>
        <p className={styles.subtitle}>
          Connect, share, and grow with a supportive network of individuals on similar health and nutrition journeys
        </p>
      </header>

      <div className={styles.featureContent}>
        <section className={styles.featureDescription}>
          <h2 className={styles.sectionTitle}>The Power of Community Support</h2>
          <p className={styles.paragraph}>
            Diet Time&apos;s Community feature creates a supportive environment where you can connect with others 
            who share your health and nutrition goals. Research consistently shows that social support is a 
            key factor in achieving and maintaining healthy lifestyle changes.
          </p>
          <p className={styles.paragraph}>
            Our community spaces are designed to foster meaningful connections, facilitate knowledge sharing, 
            and provide the motivation and accountability that can make all the difference in your journey 
            toward better health.
          </p>
        </section>

        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Community Features</h2>
          <div className={styles.featuresGrid}>
            {communityFeatures.map(feature => (
              <div key={feature.id} className={styles.featureCard}>
                <h3 className={styles.featureName}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.benefitsSection}>
          <h2 className={styles.sectionTitle}>Benefits of Community Engagement</h2>
          <div className={styles.benefitsGrid}>
            {communityBenefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.guidelinesSection}>
          <h2 className={styles.sectionTitle}>Community Guidelines</h2>
          <p className={styles.paragraph}>
            To ensure our community remains a positive and supportive space for everyone, we ask all members to adhere to these guidelines:
          </p>
          <ul className={styles.guidelinesList}>
            {communityGuidelines.map((guideline, index) => (
              <li key={index} className={styles.guidelineItem}>
                <span className={styles.checkmark}>✓</span>
                <span>{guideline}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.moderationSection}>
          <h2 className={styles.sectionTitle}>Community Moderation</h2>
          <p className={styles.paragraph}>
            Our community is moderated by a team of nutrition and fitness professionals along with experienced 
            community leaders. Moderators ensure discussions remain supportive, factual, and aligned with 
            evidence-based health practices.
          </p>
          <p className={styles.paragraph}>
            All content is reviewed to maintain a safe and helpful environment. Our moderators are also 
            available to assist with any questions or concerns you may have about community interactions.
          </p>
        </section>

        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to Join Our Community?</h2>
          <div className={styles.ctaButtons}>
            <Link href="/community" className={styles.primaryButton}>
              Join the Community
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