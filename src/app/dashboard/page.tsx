'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';
import { useAuth } from '../context/AuthContext';
import { mealApi, Meal, goalApi, Goal } from '../services/api';
import { FaUtensils, FaCalendarAlt, FaHeartbeat, FaBullseye, FaArrowRight, FaEdit, FaTrash } from 'react-icons/fa';
import ProgressBar from '../components/Progress/ProgressBar';
import LearnMore from '../components/LearnMore';
import LoadingIndicator from '../components/LoadingIndicator';

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
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [isGoalsLoading, setIsGoalsLoading] = useState(true);
  const [goalsError, setGoalsError] = useState<string | null>(null);

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

    const fetchGoals = async () => {
      if (!user) return;

      try {
        setIsGoalsLoading(true);
        const fetchedGoals = await goalApi.getActiveGoals(user.id);
        setActiveGoals(fetchedGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
        setGoalsError('Failed to load goals');
      } finally {
        setIsGoalsLoading(false);
      }
    };

    fetchMeals();
    fetchGoals();
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

  // Format date for display in UTC
  const formatDateInUTC = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      timeZone: 'UTC',
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className={styles.dashboardContainer}>
      <section className={styles.dashboardHeader}>
        <h1 className={styles.welcomeMessage}>Welcome back, {user?.username || 'User'}!</h1>
        <p className={styles.dateDisplay}>
          {formatDateInUTC(new Date().toISOString())}
        </p>
      </section>

      {/* Quick Access Section */}
      <section className={styles.quickAccessSection}>
        <h2 className={styles.sectionTitle}>Quick Access</h2>
        <div className={styles.quickAccessGrid}>
          <Link href="/meals/add" className={styles.quickAccessCard}>
            <div className={styles.quickAccessIcon}>
              <FaUtensils />
            </div>
            <div className={styles.quickAccessContent}>
              <h3>Add Meal</h3>
              <p>Log your latest meal</p>
            </div>
          </Link>
          
          <Link href="/dashboard/meal-plans" className={styles.quickAccessCard}>
            <div className={styles.quickAccessIcon}>
              <FaCalendarAlt />
            </div>
            <div className={styles.quickAccessContent}>
              <h3>Meal Plans</h3>
              <p>View or create meal plans</p>
            </div>
          </Link>
          
          <Link href="/dashboard/goals" className={styles.quickAccessCard}>
            <div className={styles.quickAccessIcon}>
              <FaBullseye />
            </div>
            <div className={styles.quickAccessContent}>
              <h3>Goal Setting</h3>
              <p>Track your health goals</p>
            </div>
          </Link>
          
          <Link href="/dashboard/health-tracking" className={styles.quickAccessCard}>
            <div className={styles.quickAccessIcon}>
              <FaHeartbeat />
            </div>
            <div className={styles.quickAccessContent}>
              <h3>Health Tracking</h3>
              <p>Monitor your health metrics</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Active Goals Section */}
      <section className={styles.activeGoalsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Active Goals</h2>
          <Link href="/dashboard/goals" className={styles.viewAllLink}>
            View All <FaArrowRight className={styles.viewAllIcon} />
          </Link>
        </div>

        {isGoalsLoading ? (
          <LoadingIndicator text="Loading your goals..." />
        ) : goalsError ? (
          <div className={styles.errorState}>{goalsError}</div>
        ) : activeGoals.length > 0 ? (
          <div className={styles.goalsList}>
            {activeGoals.slice(0, 3).map((goal) => (
              <div key={goal.id} className={styles.goalCard}>
                <div className={styles.goalHeader}>
                  <div className={styles.goalCategory}>{goal.category}</div>
                  <div className={styles.goalStatus}>{goal.status}</div>
                </div>
                <h3 className={styles.goalTitle}>{goal.title}</h3>
                <p className={styles.goalDescription}>{goal.description}</p>
                {goal.target_value && goal.current_value && (
                  <div className={styles.goalProgress}>
                    <ProgressBar 
                      currentValue={goal.current_value}
                      maxValue={goal.target_value}
                      unit={goal.unit}
                    />
                  </div>
                )}
                <div className={styles.goalDates}>
                  <div className={styles.goalDate}>
                    <span>Start:</span> {new Date(goal.start_date).toLocaleDateString()}
                  </div>
                  <div className={styles.goalDate}>
                    <span>Target:</span> {new Date(goal.target_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>You haven&apos;t set any goals yet.</p>
            <Link href="/dashboard/goals" className="btn btn-primary">
              Set Your First Goal
            </Link>
          </div>
        )}
      </section>

      {/* Nutrition Summary Section */}
      <section className={styles.nutritionSummarySection}>
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

      {/* Today's Meals Section */}
      <section className={styles.recentMealsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Today&apos;s Meals</h2>
          <Link href="/meals/add" className={`btn btn-primary ${styles.addButton}`}>
            + Add Meal
          </Link>
        </div>

        {isLoading ? (
          <LoadingIndicator text="Loading your meals..." />
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
                    <FaEdit />
                  </Link>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteMeal(meal.id)}
                  >
                    <FaTrash />
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

      {/* More sections and recommendations */}
      <section className={styles.moreFeaturesSection}>
        <LearnMore 
          title="Discover More Diet Time Features"
          description="Explore our comprehensive suite of tools designed to help you achieve your health and nutrition goals."
          linkUrl="/features"
          linkText="Explore All Features"
        />
      </section>
    </div>
  );
}