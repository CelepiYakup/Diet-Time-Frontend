'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { mealApi, Meal } from '../services/api';
import { FaPlus } from 'react-icons/fa';
import ProgressBar from '../components/Progress/ProgressBar';

interface FilterState {
  searchTerm: string;
  sortBy: string;
  filterBy: string;
}

export default function MealTracking() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    sortBy: 'date',
    filterBy: 'all'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    
    let filtered = [...meals];
    
    // Filter by meal name
    if (filters.searchTerm) {
      filtered = filtered.filter(meal => 
        meal.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    // Filter by start date
    if (filters.filterBy === 'today') {
      const today = new Date().toDateString();
      filtered = filtered.filter(meal => new Date(meal.meal_date).toDateString() === today);
    } else if (filters.filterBy === 'this-week') {
      const startOfWeek = new Date().setDate(new Date().getDate() - new Date().getDay());
      const endOfWeek = new Date().setDate(new Date().getDate() - new Date().getDay() + 7);
      filtered = filtered.filter(meal => 
        new Date(meal.meal_date).getTime() >= startOfWeek && new Date(meal.meal_date).getTime() <= endOfWeek
      );
    } else if (filters.filterBy === 'this-month') {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime();
      filtered = filtered.filter(meal => 
        new Date(meal.meal_date).getTime() >= startOfMonth && new Date(meal.meal_date).getTime() <= endOfMonth
      );
    }
    
    // Sort meals
    if (filters.sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.meal_date).getTime() - new Date(b.meal_date).getTime());
    } else if (filters.sortBy === 'calories') {
      filtered.sort((a, b) => Number(b.calories || 0) - Number(a.calories || 0));
    } else if (filters.sortBy === 'protein') {
      filtered.sort((a, b) => Number(b.protein || 0) - Number(a.protein || 0));
    } else if (filters.sortBy === 'carbs') {
      filtered.sort((a, b) => Number(b.carbs || 0) - Number(a.carbs || 0));
    } else if (filters.sortBy === 'fat') {
      filtered.sort((a, b) => Number(b.fat || 0) - Number(a.fat || 0));
    }
    
    setFilteredMeals(filtered);
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      sortBy: 'date',
      filterBy: 'all'
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

  // Calculate daily calorie totals
  const dailyCalories = meals.reduce((acc, meal) => {
    const mealDate = new Date(meal.meal_date).toDateString();
    
    if (!acc[mealDate]) {
      acc[mealDate] = 0;
    }
    
    acc[mealDate] += Number(meal.calories || 0);
    return acc;
  }, {} as Record<string, number>);

  // Show calorie tracking summary
  const renderCalorieSummary = () => {
    const today = new Date().toDateString();
    const todayCalories = dailyCalories[today] || 0;
    const targetCalories = 2000; // This would be user-specific in a real app
    
    return (
      <div className={styles.calorieSummary}>
        <h3 className={styles.summaryTitle}>Today&apos;s Calories</h3>
        <ProgressBar 
          currentValue={todayCalories}
          maxValue={targetCalories}
          unit="kcal"
          title="Daily Calorie Intake"
          variant={todayCalories > targetCalories ? 'danger' : 'success'}
        />
      </div>
    );
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
            <label htmlFor="searchTerm" className={styles.filterLabel}>
              Meal Name
            </label>
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              className={styles.filterInput}
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="e.g., Breakfast"
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="filterBy" className={styles.filterLabel}>
              Filter By
            </label>
            <select
              id="filterBy"
              name="filterBy"
              className={styles.filterInput}
              value={filters.filterBy}
              onChange={handleFilterChange}
            >
              <option value="all">All Meals</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="sortBy" className={styles.filterLabel}>
              Sort By
            </label>
            <select
              id="sortBy"
              name="sortBy"
              className={styles.filterInput}
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="date">Date</option>
              <option value="calories">Calories</option>
              <option value="protein">Protein</option>
              <option value="carbs">Carbs</option>
              <option value="fat">Fat</option>
            </select>
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

      <div className={styles.content}>
        <div className={styles.mealHeader}>
          <h1 className={styles.pageTitle}>Meal Tracker</h1>
          <button className={styles.addButton} onClick={() => setShowForm(true)}>
            <FaPlus /> Add Meal
          </button>
        </div>
        
        {renderCalorieSummary()}
        
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
    </div>
  );
} 