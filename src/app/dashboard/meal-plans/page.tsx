'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { FaPlus, FaSave, FaTrash, FaUtensils } from 'react-icons/fa';
import styles from './page.module.scss';
import LoadingIndicator from '@/app/components/LoadingIndicator';

// Meal type definition
interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Planned meal with day and time
interface PlannedMeal {
  id: string;
  mealId: string;
  day: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function MealPlanningPage() {
  // State for available meals
  const [meals, setMeals] = useState<Meal[]>([]);
  // State for the meal plan
  const [mealPlan, setMealPlan] = useState<PlannedMeal[]>([]);
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  // State for the selected day and time when adding a meal
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTime, setSelectedTime] = useState('Breakfast');
  const [selectedMeal, setSelectedMeal] = useState('');
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTimes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  // Fetch meals from API
  useEffect(() => {
    // Simulated API call - replace with actual API call
    setTimeout(() => {
      const dummyMeals: Meal[] = [
        { id: '1', name: 'Oatmeal with Berries', calories: 350, protein: 10, carbs: 60, fat: 7 },
        { id: '2', name: 'Chicken Salad', calories: 420, protein: 35, carbs: 20, fat: 22 },
        { id: '3', name: 'Salmon with Vegetables', calories: 480, protein: 40, carbs: 15, fat: 28 },
        { id: '4', name: 'Greek Yogurt with Honey', calories: 220, protein: 15, carbs: 30, fat: 5 },
        { id: '5', name: 'Turkey Sandwich', calories: 380, protein: 25, carbs: 45, fat: 12 },
        { id: '6', name: 'Vegetable Stir Fry', calories: 320, protein: 15, carbs: 40, fat: 10 },
      ];
      setMeals(dummyMeals);
      
      // Load saved meal plan if exists
      const savedMealPlan = localStorage.getItem('mealPlan');
      if (savedMealPlan) {
        setMealPlan(JSON.parse(savedMealPlan));
      }
      
      setIsLoading(false);
    }, 1000);
  }, []);

  // Save meal plan to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    }
  }, [mealPlan, isLoading]);

  // Add meal to plan
  const addMealToPlan = () => {
    if (!selectedMeal) return;
    
    const meal = meals.find(m => m.id === selectedMeal);
    if (!meal) return;
    
    const newPlannedMeal: PlannedMeal = {
      id: Date.now().toString(),
      mealId: meal.id,
      day: selectedDay,
      time: selectedTime,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat
    };
    
    setMealPlan([...mealPlan, newPlannedMeal]);
    setSelectedMeal('');
  };

  // Remove meal from plan
  const removeMealFromPlan = (id: string) => {
    setMealPlan(mealPlan.filter(meal => meal.id !== id));
  };

  // Calculate daily totals
  const calculateDailyTotals = (day: string) => {
    const dayMeals = mealPlan.filter(meal => meal.day === day);
    return {
      calories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
      protein: dayMeals.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: dayMeals.reduce((sum, meal) => sum + meal.carbs, 0),
      fat: dayMeals.reduce((sum, meal) => sum + meal.fat, 0)
    };
  };

  // Get meals for a specific day and time
  const getMealsForDayAndTime = (day: string, time: string) => {
    return mealPlan.filter(meal => meal.day === day && meal.time === time);
  };

  if (isLoading) {
    return <LoadingIndicator text="Loading meal planning data..." />;
  }

  return (
    <div className={styles.mealPlanContainer}>
      <h1 className={styles.pageTitle}>Weekly Meal Planner</h1>
      
      <div className={styles.addMealSection}>
        <h2>Add Meal to Plan</h2>
        <div className={styles.addMealForm}>
          <div className={styles.formGroup}>
            <label htmlFor="day">Day:</label>
            <select 
              id="day" 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(e.target.value)}
              className={styles.select}
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="time">Meal Time:</label>
            <select 
              id="time" 
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)}
              className={styles.select}
            >
              {mealTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="meal">Meal:</label>
            <select 
              id="meal" 
              value={selectedMeal} 
              onChange={(e) => setSelectedMeal(e.target.value)}
              className={styles.select}
            >
              <option value="">Select a meal</option>
              {meals.map(meal => (
                <option key={meal.id} value={meal.id}>
                  {meal.name} ({meal.calories} cal)
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className={styles.addButton} 
            onClick={addMealToPlan}
            disabled={!selectedMeal}
          >
            <FaPlus /> Add to Plan
          </button>
        </div>
      </div>
      
      <div className={styles.weeklyPlanSection}>
        <h2>Weekly Meal Plan</h2>
        
        <Suspense fallback={<LoadingIndicator text="Loading weekly meal plan..." />}>
          <div className={styles.weekGrid}>
            {days.map(day => (
              <div key={day} className={styles.dayColumn}>
                <h3 className={styles.dayHeader}>{day}</h3>
                
                {mealTimes.map(time => (
                  <div key={`${day}-${time}`} className={styles.mealTimeSlot}>
                    <h4 className={styles.mealTimeHeader}>{time}</h4>
                    
                    <div className={styles.mealsList}>
                      {getMealsForDayAndTime(day, time).map(meal => (
                        <div key={meal.id} className={styles.mealCard}>
                          <div className={styles.mealInfo}>
                            <span className={styles.mealName}>{meal.name}</span>
                            <div className={styles.mealNutrition}>
                              <span>{meal.calories} cal</span>
                              <span>{meal.protein}g protein</span>
                            </div>
                          </div>
                          <button 
                            className={styles.removeButton}
                            onClick={() => removeMealFromPlan(meal.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      
                      {getMealsForDayAndTime(day, time).length === 0 && (
                        <div className={styles.emptyMealSlot}>
                          <FaUtensils className={styles.emptyIcon} />
                          <span>No meal planned</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className={styles.dailyTotals}>
                  <h4>Daily Totals</h4>
                  <div className={styles.totalsGrid}>
                    <div className={styles.totalItem}>
                      <span className={styles.totalLabel}>Calories</span>
                      <span className={styles.totalValue}>{calculateDailyTotals(day).calories}</span>
                    </div>
                    <div className={styles.totalItem}>
                      <span className={styles.totalLabel}>Protein</span>
                      <span className={styles.totalValue}>{calculateDailyTotals(day).protein}g</span>
                    </div>
                    <div className={styles.totalItem}>
                      <span className={styles.totalLabel}>Carbs</span>
                      <span className={styles.totalValue}>{calculateDailyTotals(day).carbs}g</span>
                    </div>
                    <div className={styles.totalItem}>
                      <span className={styles.totalLabel}>Fat</span>
                      <span className={styles.totalValue}>{calculateDailyTotals(day).fat}g</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Suspense>
      </div>
      
      <div className={styles.saveSection}>
        <button className={styles.saveButton}>
          <FaSave /> Save Meal Plan
        </button>
      </div>
    </div>
  );
} 