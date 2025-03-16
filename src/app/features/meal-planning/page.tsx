'use client';

import React from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaUtensils, FaShoppingCart, FaChartPie, FaClipboardList, FaRandom } from 'react-icons/fa';
import styles from './page.module.scss';

export default function MealPlanningFeature() {
  const planningFeatures = [
    {
      id: 1,
      icon: <FaCalendarAlt className={styles.featureIcon} />,
      title: 'Weekly Meal Calendars',
      description: 'Plan your meals for the entire week with our intuitive calendar interface. Organize breakfast, lunch, dinner, and snacks in advance.'
    },
    {
      id: 2,
      icon: <FaUtensils className={styles.featureIcon} />,
      title: 'Recipe Integration',
      description: 'Access thousands of healthy recipes that fit your dietary preferences and nutritional goals. Save favorites and add them directly to your meal plan.'
    },
    {
      id: 3,
      icon: <FaShoppingCart className={styles.featureIcon} />,
      title: 'Automatic Shopping Lists',
      description: 'Generate shopping lists based on your meal plan. Our system automatically compiles ingredients and quantities for efficient grocery shopping.'
    },
    {
      id: 4,
      icon: <FaChartPie className={styles.featureIcon} />,
      title: 'Nutritional Balance',
      description: 'Ensure your meal plans meet your nutritional needs. View macronutrient distribution and get suggestions for balanced eating.'
    },
    {
      id: 5,
      icon: <FaClipboardList className={styles.featureIcon} />,
      title: 'Dietary Preference Settings',
      description: 'Customize your meal plans according to dietary restrictions, allergies, or preferences like vegetarian, vegan, gluten-free, and more.'
    },
    {
      id: 6,
      icon: <FaRandom className={styles.featureIcon} />,
      title: 'Meal Suggestions',
      description: 'Get personalized meal suggestions based on your preferences, past choices, and nutritional goals when you need inspiration.'
    }
  ];

  const benefits = [
    'Save time by planning meals in advance',
    'Reduce food waste with precise shopping lists',
    'Maintain consistent nutrition throughout the week',
    'Decrease impulsive food choices and unhealthy eating',
    'Simplify grocery shopping with organized lists',
    'Achieve dietary goals with balanced meal planning',
    'Discover new recipes that match your preferences',
    'Reduce mealtime stress with prepared plans'
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Set Your Preferences',
      description: 'Begin by setting your dietary preferences, restrictions, and nutritional goals in your profile.'
    },
    {
      step: 2,
      title: 'Browse Recipes',
      description: 'Explore our recipe database or add your own favorite recipes to your collection.'
    },
    {
      step: 3,
      title: 'Create Your Plan',
      description: 'Drag and drop meals into your weekly calendar, or use our auto-suggest feature for quick planning.'
    },
    {
      step: 4,
      title: 'Generate Shopping List',
      description: 'With one click, create a comprehensive shopping list organized by grocery department.'
    },
    {
      step: 5,
      title: 'Shop Efficiently',
      description: 'Use the shopping list in-store or send it to grocery delivery services through our integrations.'
    },
    {
      step: 6,
      title: 'Follow Your Plan',
      description: 'Receive reminders and follow your plan throughout the week, making adjustments as needed.'
    }
  ];

  return (
    <div className={styles.featureContainer}>
      <header className={styles.featureHeader}>
        <h1 className={styles.title}>Meal Planning</h1>
        <p className={styles.subtitle}>
          Take the guesswork out of healthy eating with our comprehensive meal planning tools
        </p>
      </header>

      <div className={styles.featureContent}>
        <section className={styles.featureDescription}>
          <h2 className={styles.sectionTitle}>Plan Your Way to Better Nutrition</h2>
          <p className={styles.paragraph}>
            Diet Time&apos;s Meal Planning feature empowers you to take control of your nutrition through thoughtful, 
            organized meal preparation. Whether you&apos;re trying to lose weight, build muscle, or simply eat healthier, 
            planning your meals in advance is one of the most effective strategies for success.
          </p>
          <p className={styles.paragraph}>
            Our intuitive tools make it easy to create balanced meal plans that align with your dietary goals and 
            preferences. From generating shopping lists to suggesting recipes based on your nutritional needs, 
            we&apos;ve designed every aspect of our meal planning system to save you time and help you make healthier choices.
          </p>
        </section>

        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Key Planning Tools</h2>
          <div className={styles.featuresGrid}>
            {planningFeatures.map(feature => (
              <div key={feature.id} className={styles.featureCard}>
                <div className={styles.featureIconContainer}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureName}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.howItWorksSection}>
          <h2 className={styles.sectionTitle}>How Meal Planning Works</h2>
          <div className={styles.stepsContainer}>
            {howItWorks.map(item => (
              <div key={item.step} className={styles.stepCard}>
                <div className={styles.stepNumber}>{item.step}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                  <p className={styles.stepDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.benefitsSection}>
          <h2 className={styles.sectionTitle}>Benefits of Meal Planning</h2>
          <ul className={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <li key={index} className={styles.benefitItem}>
                <span className={styles.checkmark}>✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to Simplify Your Meal Planning?</h2>
          <div className={styles.ctaButtons}>
            <Link href="/dashboard/meal-plans" className={styles.primaryButton}>
              Start Planning Now
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