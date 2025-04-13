'use client';

import React from 'react';
import { Suspense } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import MealPlanCalendar from '@/app/features/meal-plans/MealPlanCalendar';
import MealSelector from '@/app/features/meal-plans/MealSelector';
import { useMealPlan } from '@/app/hooks/useMealPlan';
import styles from './page.module.scss';
import { Meal } from '@/app/types/meals';

export default function MealPlanningPage() {
  const { user } = useAuth();
  
  const {
    meals,
    mealPlan,
    isLoading,
    selectedDay,
    selectedTime,
    setSelectedDay,
    setSelectedTime,
    addMealToPlan,
    removeMealFromPlan,
    saveMealPlan,
    setMeals
  } = useMealPlan({ userId: user?.id ? String(user.id) : null });

  // Handler for updating meals from search
  const handleUpdateMeals = (newMeals: Meal[]) => {
    console.log('Updating meals from external search:', newMeals.length);
    if (newMeals.length > 0) {
      setMeals(newMeals);
    }
  };

  return (
    <div className={styles.mealPlanningPage}>
      <div className={styles.pageHeader}>
        <h1>Meal Planning</h1>
        <p>Plan your meals for the week ahead</p>
      </div>

      <Suspense fallback={<LoadingIndicator />}>
        <div className={styles.mealPlanningContainer}>
          <div className={styles.sidePanel}>
            <MealSelector
              meals={meals}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
              setSelectedDay={setSelectedDay}
              setSelectedTime={setSelectedTime}
              onAddMeal={addMealToPlan}
              isLoading={isLoading}
              onUpdateMeals={handleUpdateMeals}
            />
          </div>

          <div className={styles.mainPanel}>
            <MealPlanCalendar
              mealPlan={mealPlan}
              isLoading={isLoading}
              onRemoveMeal={removeMealFromPlan}
              onSavePlan={saveMealPlan}
            />
          </div>
        </div>
      </Suspense>
    </div>
  );
} 