'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';
import { useAuth } from '../context/AuthContext';
import { mealApi, Meal } from '../services/api';
import { FaUtensils, FaCalendarAlt } from 'react-icons/fa';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchMeals = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const fetchedMeals = await mealApi.getUserMeals(user.id);
        
        console.log('Fetched meals:', fetchedMeals);
        
        // Show all meals for now to debug
        setMeals(fetchedMeals);
        
        // Calculate totals for all meals
        const calories = fetchedMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const protein = fetchedMeals.reduce((sum, meal) => sum + meal.protein, 0);
        const carbs = fetchedMeals.reduce((sum, meal) => sum + meal.carbs, 0);
        const fat = fetchedMeals.reduce((sum, meal) => sum + meal.fat, 0);

        setTotalCalories(calories);
        setTotalProtein(protein);
        setTotalCarbs(carbs);
        setTotalFat(fat);
      } catch (err) {
        console.error('Error fetching meals:', err);
        setError('Failed to load meals. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [isAuthenticated, router, user]);

  const handleDeleteMeal = async (mealId: number) => {
    try {
      await mealApi.deleteMeal(mealId);
      
      // Update meals list
      setMeals(prevMeals => {
        const updatedMeals = prevMeals.filter(meal => meal.id !== mealId);
        
        // Recalculate totals
        const calories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const protein = updatedMeals.reduce((sum, meal) => sum + meal.protein, 0);
        const carbs = updatedMeals.reduce((sum, meal) => sum + meal.carbs, 0);
        const fat = updatedMeals.reduce((sum, meal) => sum + meal.fat, 0);

        setTotalCalories(calories);
        setTotalProtein(protein);
        setTotalCarbs(carbs);
        setTotalFat(fat);
        
        return updatedMeals;
      });
    } catch (err) {
      console.error('Error deleting meal:', err);
      setError('Failed to delete meal. Please try again later.');
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className={styles.dashboardContainer}>
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome, {user?.username}!</h1>
        <p className={styles.welcomeSubtitle}>
          Here&apos;s your nutrition summary for today
        </p>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Total Calories</div>
            <div className={styles.statValue}>{totalCalories}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Protein (g)</div>
            <div className={styles.statValue}>{totalProtein}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Carbs (g)</div>
            <div className={styles.statValue}>{totalCarbs}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Fat (g)</div>
            <div className={styles.statValue}>{totalFat}</div>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Quick Access</h2>
        <div className={styles.featuresGrid}>
          <Link href="/meals" className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <FaUtensils className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Meal Tracking</h3>
            <p className={styles.featureDescription}>Log your daily meals and track your calorie intake</p>
          </Link>
          
          <Link href="/dashboard/meal-plans" className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <FaCalendarAlt className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Meal Planning</h3>
            <p className={styles.featureDescription}>Plan your meals for the week and generate shopping lists</p>
          </Link>
        </div>
      </section>

      <section className={styles.recentMealsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Today&apos;s Meals</h2>
          <Link href="/meals/add" className={`btn btn-primary ${styles.addButton}`}>
            + Add Meal
          </Link>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>Loading meals...</div>
        ) : error ? (
          <div className={styles.errorState}>{error}</div>
        ) : meals.length > 0 ? (
          <div className={styles.mealsList}>
            {meals.map((meal) => (
              <div key={meal.id} className={styles.mealCard}>
                <div className={styles.mealHeader}>
                  <div className={styles.mealName}>{meal.name}</div>
                  <div className={styles.mealTime}>{meal.meal_time}</div>
                </div>
                <div className={styles.mealDetails}>
                  <div className={styles.mealDetail}>
                    <span className={styles.mealDetailLabel}>Calories</span>
                    <span className={styles.mealDetailValue}>{meal.calories}</span>
                  </div>
                  <div className={styles.mealDetail}>
                    <span className={styles.mealDetailLabel}>Protein</span>
                    <span className={styles.mealDetailValue}>{meal.protein}g</span>
                  </div>
                  <div className={styles.mealDetail}>
                    <span className={styles.mealDetailLabel}>Carbs</span>
                    <span className={styles.mealDetailValue}>{meal.carbs}g</span>
                  </div>
                  <div className={styles.mealDetail}>
                    <span className={styles.mealDetailLabel}>Fat</span>
                    <span className={styles.mealDetailValue}>{meal.fat}g</span>
                  </div>
                </div>
                <div className={styles.mealActions}>
                  <Link href={`/meals/edit/${meal.id}`} className={styles.editButton}>
                    Edit
                  </Link>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteMeal(meal.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>You haven&apos;t added any meals today.</p>
            <Link href="/meals/add" className="btn btn-primary">
              Add Your First Meal
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}