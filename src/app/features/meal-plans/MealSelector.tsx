import React, { useState, useCallback } from 'react';
import { FaPlus, FaSearch, FaUtensils, FaSpinner } from 'react-icons/fa';
import { Meal, DAYS, MEAL_TIMES, Day, MealTime } from '@/app/types/meals';
import { externalMealApi } from '@/api/mealService';
import { toast } from 'react-hot-toast';
import styles from './MealSelector.module.scss';

interface MealSelectorProps {
  meals: Meal[];
  selectedDay: Day | string;
  selectedTime: MealTime | string;
  setSelectedDay: React.Dispatch<React.SetStateAction<Day | string>>;
  setSelectedTime: React.Dispatch<React.SetStateAction<MealTime | string>>;
  onAddMeal: (mealId: string) => void;
  isLoading: boolean;
  onUpdateMeals?: (newMeals: Meal[]) => void; 
}

const MealSelector: React.FC<MealSelectorProps> = ({
  meals,
  selectedDay,
  selectedTime,
  setSelectedDay,
  setSelectedTime,
  onAddMeal,
  isLoading,
  onUpdateMeals
}) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [allMeals, setAllMeals] = useState<Meal[]>(meals);

  React.useEffect(() => {
    setAllMeals(meals);
  }, [meals]);
  

  const filteredMeals = searchTerm.length > 0
    ? meals.filter(meal => 
        meal.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : meals;
  

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    try {
      setIsSearching(true);
      toast.loading('Searching for recipes...', { id: 'recipeSearch' });
      
      const results = await externalMealApi.searchMeals({
        query: searchTerm,
        mealType: selectedTime.toString().toLowerCase()
      });
      
      if (results.length === 0) {
        toast.error('No recipes found. Try a different search term.', { id: 'recipeSearch' });
      } else {
        toast.success(`Found ${results.length} recipes`, { id: 'recipeSearch' });
        

        const convertedResults: Meal[] = results.map(meal => ({
          id: `ext-${meal.id}`,
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat
        }));
        
   
        setSearchResults(convertedResults);
        

        const updatedMeals = [...allMeals];

        const filteredMeals = updatedMeals.filter(meal => 
          !convertedResults.some(result => result.id === meal.id)
        );

        const newMeals = [...filteredMeals, ...convertedResults];
        setAllMeals(newMeals);

        if (onUpdateMeals) {
          onUpdateMeals(newMeals);
        }
      }
    } catch (error) {
      toast.error('Error searching for recipes. Please try again.', { id: 'recipeSearch' });
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, selectedTime, allMeals, onUpdateMeals]);

  React.useEffect(() => {
    setSearchTerm('');
    setSearchResults([]);
  }, [selectedDay, selectedTime]);

  const handleAddMeal = (mealId: string) => {
    const mealExists = allMeals.some(m => String(m.id) === String(mealId));
    if (!mealExists) {
      console.error('Meal not found in available meals:', { mealId, availableMeals: allMeals.map(m => m.id) });
      toast.error('Cannot add meal: Not found in available meals');
      return;
    }
    
    onAddMeal(mealId);
    
    const mealIdStr = String(mealId);
    if (mealIdStr.startsWith('ext-') || mealIdStr.includes('spoon-')) {
      setSearchTerm('');
      setSearchResults([]);
    }
  };
  
  if (isLoading) {
    return <div className={styles.loading}>Loading meals...</div>;
  }
  
  return (
    <div className={styles.mealSelector}>
      <div className={styles.selectorHeader}>
        <h3>Add Meals to Plan</h3>
      </div>
      
      <div className={styles.options}>
        <div className={styles.optionGroup}>
          <label htmlFor="day-select">Day:</label>
          <select 
            id="day-select"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className={styles.select}
          >
            {DAYS.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.optionGroup}>
          <label htmlFor="time-select">Meal:</label>
          <select 
            id="time-select"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className={styles.select}
          >
            {MEAL_TIMES.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <input
            type="text"
            placeholder="Search meals or recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.search}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            className={styles.searchButton}
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
          >
            {isSearching ? <FaSpinner className={styles.spinner} /> : <FaSearch />}
          </button>
        </div>
      </div>
      
      <div className={styles.mealsList}>
        <div className={styles.mealsHeader}>
          <h4>
            <FaUtensils className={styles.icon} /> 
            {searchResults.length > 0 
              ? 'Recipe Search Results' 
              : 'Your Meals'}
          </h4>
        </div>
        
        {isSearching ? (
          <div className={styles.searching}>Searching recipes...</div>
        ) : (
          <div className={styles.meals}>
            {searchResults.length > 0 ? (

              searchResults.map(meal => (
                <div key={meal.id} className={styles.meal}>
                  <div className={styles.mealDetails}>
                    <div className={styles.mealName}>{meal.name}</div>
                    <div className={styles.mealStats}>
                      <span>{meal.calories} cal</span>
                      <span>{meal.protein}g protein</span>
                    </div>
                  </div>
                  <button
                    className={styles.addButton}
                    onClick={() => handleAddMeal(meal.id)}
                    title={`Add ${meal.name} to ${selectedDay} ${selectedTime}`}
                  >
                    <FaPlus />
                  </button>
                </div>
              ))
            ) : searchTerm.length > 0 && filteredMeals.length === 0 ? (

              <div className={styles.noResults}>
                No meals found matching "{searchTerm}".
                Try searching online with the search button.
              </div>
            ) : filteredMeals.length === 0 ? (
 
              <div className={styles.noResults}>
                You don't have any meals yet. Create meals first or search online.
              </div>
            ) : (

              filteredMeals.map(meal => (
                <div key={meal.id} className={styles.meal}>
                  <div className={styles.mealDetails}>
                    <div className={styles.mealName}>{meal.name}</div>
                    <div className={styles.mealStats}>
                      <span>{meal.calories} cal</span>
                      <span>{meal.protein}g protein</span>
                    </div>
                  </div>
                  <button
                    className={styles.addButton}
                    onClick={() => handleAddMeal(meal.id)}
                    title={`Add ${meal.name} to ${selectedDay} ${selectedTime}`}
                  >
                    <FaPlus />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealSelector; 