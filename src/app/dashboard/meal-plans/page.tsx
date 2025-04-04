'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { FaPlus, FaSave, FaTrash, FaUtensils, FaEdit } from 'react-icons/fa';
import styles from './page.module.scss';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import { useAuth } from '@/app/context/AuthContext'; 
import { Meal, MealPlan, mealApi, mealPlanApi } from '@/app/services/api';
import { toast } from 'react-hot-toast';

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
  const { user } = useAuth();
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

  // Fetch meals and meal plans from API
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch user's meals
        const mealsData = await mealApi.getUserMeals(user.id);
        setMeals(mealsData);
        
        // Fetch user's meal plans
        const mealPlansData = await mealPlanApi.getUserMealPlans(user.id);
        
        // Convert API meal plans to frontend format
        const convertedMealPlans: PlannedMeal[] = mealPlansData.map(plan => {
          const planMeal = plan.meal || mealsData.find(m => m.id === plan.meal_id);
          
          if (!planMeal) {
            console.error(`No meal found for meal_id ${plan.meal_id}`);
            return {
              id: plan.id.toString(),
              mealId: plan.meal_id.toString(),
              day: plan.day,
              time: plan.meal_time,
              name: 'Unknown Meal',
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0
            };
          }
          
          return {
            id: plan.id.toString(),
            mealId: planMeal.id.toString(),
            day: plan.day,
            time: plan.meal_time,
            name: planMeal.name,
            calories: planMeal.calories,
            protein: planMeal.protein || 0,
            carbs: planMeal.carbs || 0,
            fat: planMeal.fat || 0
          };
        });
        
        setMealPlan(convertedMealPlans);
      } catch (error) {
        console.error('Error fetching meal planning data:', error);
        toast.error('Failed to load meal planning data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Add meal to plan
  const addMealToPlan = async () => {
    if (!selectedMeal || !user) return;
    
    const meal = meals.find(m => m.id.toString() === selectedMeal);
    if (!meal) return;
    
    try {
      // Prepare data for API
      const mealPlanInput = {
        user_id: user.id,
        day: selectedDay,
        meal_time: selectedTime,
        meal_id: meal.id
      };
      
      // Send to API
      const response = await mealPlanApi.createMealPlan(mealPlanInput);
      
      // API response contains a mealPlan object with the id
      if (!response || !response.mealPlan || typeof response.mealPlan.id === 'undefined') {
        console.error('Invalid API response structure:', response);
        toast.error('Server returned an invalid response');
        return;
      }
      
      // Create frontend object from response
      const newPlannedMeal: PlannedMeal = {
        id: String(response.mealPlan.id),
        mealId: String(meal.id),
        day: selectedDay,
        time: selectedTime,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0
      };
      
      setMealPlan([...mealPlan, newPlannedMeal]);
      setSelectedMeal('');
      toast.success('Meal added to plan');
    } catch (error) {
      console.error('Error adding meal to plan:', error);
      toast.error('Failed to add meal to plan');
    }
  };

  // Remove meal from plan
  const removeMealFromPlan = async (id: string) => {
    if (!user) return;
    
    try {
      // Call API to delete meal plan
      await mealPlanApi.deleteMealPlan(parseInt(id));
      
      // Update local state
      setMealPlan(mealPlan.filter(meal => meal.id !== id));
      toast.success('Meal removed from plan');
    } catch (error) {
      console.error('Error removing meal from plan:', error);
      toast.error('Failed to remove meal from plan');
    }
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

  // Clear all meals for a specific day
  const clearDayMeals = async (day: string) => {
    if (!user || !confirm(`Are you sure you want to clear all meals for ${day}?`)) return;
    
    try {
      // Call API to delete all meals for the day
      await mealPlanApi.deleteMealPlansForDay(user.id, day);
      
      // Update local state
      setMealPlan(mealPlan.filter(meal => meal.day !== day));
      toast.success(`All meals for ${day} cleared`);
    } catch (error) {
      console.error(`Error clearing meals for ${day}:`, error);
      toast.error(`Failed to clear meals for ${day}`);
    }
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
                <option key={meal.id} value={meal.id.toString()}>
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
                <div className={styles.dayHeader}>
                  <h3>{day}</h3>
                  <button 
                    className={styles.clearDayButton}
                    onClick={() => clearDayMeals(day)}
                    title={`Clear all meals for ${day}`}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
                
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
                          <div className={styles.mealActions}>
                            <button 
                              className={styles.editButton}
                              onClick={() => {/* Edit functionality will go here */}}
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className={styles.deleteButton}
                              onClick={() => removeMealFromPlan(meal.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
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