import React, { useState, useEffect } from 'react';
import { externalMealApi } from '@/api/mealService';
import { Meal, ExternalMealSearchParams } from '../../types/meals';
import styles from './SearchMealList.module.scss';

interface SearchMealListProps {
  searchTerm: string;
  setLoading: (isLoading: boolean) => void;
  mealType: string;
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxProtein?: number;
  minFat?: number;
  maxFat?: number;
  minCarbs?: number;
  maxCarbs?: number;
  onAddMeal: (mealId: string) => void;
  setSearchResults: (results: Meal[]) => void;
}

const SearchMealList: React.FC<SearchMealListProps> = ({
  searchTerm,
  setLoading,
  mealType,
  minCalories,
  maxCalories,
  minProtein,
  maxProtein,
  minFat,
  maxFat,
  minCarbs,
  maxCarbs,
  onAddMeal,
  setSearchResults,
}) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchMeals = async () => {
      setError(null);
      
      if (!searchTerm) {
        setMeals([]);
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setLoading(true);

      try {
        const searchParams: ExternalMealSearchParams = {
          query: searchTerm,
          mealType: mealType,
          maxCalories: maxCalories,
          minProtein: minProtein
        };

        const results = await externalMealApi.searchMeals(searchParams);
        
        const formattedMeals: Meal[] = results.map(meal => ({
          id: meal.id,
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat
        }));

        setMeals(formattedMeals);
        setSearchResults(formattedMeals);
      } catch (err) {
        console.error('Error searching for meals:', err);
        setError('Failed to search for meals. Please try again.');
        setMeals([]);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchMeals();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    mealType,
    minCalories,
    maxCalories,
    minProtein,
    maxProtein,
    minFat,
    maxFat,
    minCarbs,
    maxCarbs,
    setLoading,
    setSearchResults,
  ]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Searching for meals...</div>
        <div className={styles.skeletonGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonText}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (meals.length === 0 && searchTerm) {
    return (
      <div className={styles.noResultsContainer}>
        <p>No meals found matching your search criteria. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className={styles.searchResultsContainer}>
      {meals.length > 0 && (
        <div className={styles.resultsContent}>
          <h3 className={styles.resultsTitle}>Search Results</h3>
          <hr className={styles.divider} />
          <div className={styles.mealsGrid}>
            {meals.map((meal) => (
              <div key={meal.id} className={styles.mealCard}>
                <div className={styles.mealContent}>
                  <h4 className={styles.mealName}>{meal.name}</h4>
                  <hr className={styles.divider} />
                  <div className={styles.mealStats}>
                    <div className={styles.statRow}>
                      <span>Calories: {meal.calories}</span>
                      <span>Protein: {meal.protein}g</span>
                    </div>
                    <div className={styles.statRow}>
                      <span>Carbs: {meal.carbs}g</span>
                      <span>Fat: {meal.fat}g</span>
                    </div>
                  </div>
                  <button 
                    className={styles.addButton}
                    onClick={() => onAddMeal(meal.id)}
                  >
                    Add to Meal Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchMealList; 