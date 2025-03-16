'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';
import { useAuth } from '../context/AuthContext';
import { mealApi, Meal } from '../services/api';

interface FilterState {
  startDate: string;
  endDate: string;
  mealName: string;
}

export default function Meals() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    mealName: '',
  });
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
        setMeals(fetchedMeals);
        setFilteredMeals(fetchedMeals);
      } catch (err) {
        console.error('Error fetching meals:', err);
        setError('Failed to load meals. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [isAuthenticated, router, user]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = (e: FormEvent) => {
    e.preventDefault();
    
    let filtered = [...meals];
    
    // Filter by meal name
    if (filters.mealName) {
      filtered = filtered.filter(meal => 
        meal.name.toLowerCase().includes(filters.mealName.toLowerCase())
      );
    }
    
    // Filter by start date
    if (filters.startDate) {
      filtered = filtered.filter(meal => meal.meal_date >= filters.startDate);
    }
    
    // Filter by end date
    if (filters.endDate) {
      filtered = filtered.filter(meal => meal.meal_date <= filters.endDate);
    }
    
    setFilteredMeals(filtered);
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      mealName: '',
    });
    setFilteredMeals(meals);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDeleteMeal = async (mealId: number) => {
    try {
      await mealApi.deleteMeal(mealId);
      
      // Update meals list
      const updatedMeals = meals.filter(meal => meal.id !== mealId);
      setMeals(updatedMeals);
      setFilteredMeals(prevFiltered => 
        prevFiltered.filter(meal => meal.id !== mealId)
      );
    } catch (err) {
      console.error('Error deleting meal:', err);
      setError('Failed to delete meal. Please try again later.');
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className={styles.mealsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Meals</h1>
        <Link href="/meals/add" className={`btn btn-primary ${styles.addButton}`}>
          + Add Meal
        </Link>
      </div>

      <section className={styles.filterSection}>
        <form className={styles.filterForm} onSubmit={applyFilters}>
          <div className={styles.filterGroup}>
            <label htmlFor="mealName" className={styles.filterLabel}>
              Meal Name
            </label>
            <input
              type="text"
              id="mealName"
              name="mealName"
              className={styles.filterInput}
              value={filters.mealName}
              onChange={handleFilterChange}
              placeholder="e.g., Breakfast"
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="startDate" className={styles.filterLabel}>
              From Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className={styles.filterInput}
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="endDate" className={styles.filterLabel}>
              To Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className={styles.filterInput}
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <button type="submit" className={`btn btn-primary ${styles.filterButton}`}>
            Filter
          </button>
          
          <button 
            type="button" 
            className={`btn btn-secondary ${styles.filterButton}`}
            onClick={resetFilters}
          >
            Reset
          </button>
        </form>
      </section>

      {isLoading ? (
        <div className={styles.loadingState}>Loading meals...</div>
      ) : error ? (
        <div className={styles.errorState}>{error}</div>
      ) : filteredMeals.length > 0 ? (
        <div className={styles.mealsList}>
          {filteredMeals.map((meal) => (
            <div key={meal.id} className={styles.mealCard}>
              <div className={styles.mealHeader}>
                <div className={styles.mealInfo}>
                  <div className={styles.mealName}>{meal.name}</div>
                  <div className={styles.mealDate}>
                    {formatDate(meal.meal_date)} at {meal.meal_time}
                  </div>
                </div>
                <div className={styles.mealActions}>
                  <Link href={`/meals/edit/${meal.id}`} className={styles.actionButton}>✏️</Link>
                  <button className={styles.actionButton} onClick={() => handleDeleteMeal(meal.id)}>🗑️</button>
                </div>
              </div>
              
              <div className={styles.mealDetails}>
                <div className={styles.mealDetail}>
                  <span className={styles.detailLabel}>Calories</span>
                  <span className={styles.detailValue}>{meal.calories}</span>
                </div>
                <div className={styles.mealDetail}>
                  <span className={styles.detailLabel}>Protein</span>
                  <span className={styles.detailValue}>{meal.protein}g</span>
                </div>
                <div className={styles.mealDetail}>
                  <span className={styles.detailLabel}>Carbs</span>
                  <span className={styles.detailValue}>{meal.carbs}g</span>
                </div>
                <div className={styles.mealDetail}>
                  <span className={styles.detailLabel}>Fat</span>
                  <span className={styles.detailValue}>{meal.fat}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>No meals found. Try adjusting your filters or add a new meal.</p>
          <Link href="/meals/add" className="btn btn-primary">
            Add Your First Meal
          </Link>
        </div>
      )}
    </div>
  );
} 