import React from 'react';
import { FaSave, FaDownload, FaTrash } from 'react-icons/fa';
import MealCard from '@/app/dashboard/meals/MealCard';
import { PlannedMeal, DAYS, MEAL_TIMES } from '@/app/types/meals';
import { groupMealsByDayAndTime, calculateTotals, exportToExcel } from '@/app/lib/utils/mealPlanUtils';
import styles from './MealPlanCalendar.module.scss';

interface MealPlanCalendarProps {
  mealPlan: PlannedMeal[];
  isLoading: boolean;
  onRemoveMeal: (id: string) => void;
  onSavePlan: () => Promise<void>;
}

const MealPlanCalendar: React.FC<MealPlanCalendarProps> = ({
  mealPlan,
  isLoading,
  onRemoveMeal,
  onSavePlan
}) => {
  const groupedMeals = groupMealsByDayAndTime(mealPlan);
  

  const handleExport = () => {
    exportToExcel(mealPlan);
  };
  
  if (isLoading) {
    return <div className={styles.loading}>Loading meal plan...</div>;
  }
  
  return (
    <div className={styles.mealPlanCalendar}>
      <div className={styles.calendarHeader}>
        <h2>Weekly Meal Plan</h2>
        <div className={styles.actions}>
          <button 
            className={styles.saveButton}
            onClick={onSavePlan}
            title="Save meal plan"
          >
            <FaSave /> Save Plan
          </button>
          <button 
            className={styles.exportButton}
            onClick={handleExport}
            title="Export to Excel"
          >
            <FaDownload /> Export
          </button>
        </div>
      </div>
      
      <div className={styles.calendarGrid}>
        {/* Day headers */}
        <div className={styles.timeHeader}></div>
        {DAYS.map(day => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}

        {MEAL_TIMES.map(time => (
          <React.Fragment key={time}>
            <div className={styles.timeCell}>
              {time}
            </div>
            

            {DAYS.map(day => {
              const meals = groupedMeals[day]?.[time] || [];
              const totals = calculateTotals(meals);
              
              return (
                <div key={`${day}-${time}`} className={styles.dayCell}>
                  {meals.length > 0 ? (
                    <>
                      {meals.map(meal => (
                        <MealCard 
                          key={meal.id} 
                          meal={meal} 
                          onRemove={onRemoveMeal}
                        />
                      ))}
                      
                      {meals.length > 1 && (
                        <div className={styles.mealTotals}>
                          <span>Total: {totals.calories} cal</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={styles.emptyCell}>
                      <span>No meals planned</span>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}

        <div className={styles.timeCell}>
          <strong>Daily Total</strong>
        </div>
        
        {DAYS.map(day => {
          const dayMeals = Object.values(groupedMeals[day] || {}).flat();
          const totals = calculateTotals(dayMeals);
          
          return (
            <div key={`${day}-total`} className={styles.totalCell}>
              <div className={styles.dailyTotal}>
                <div><strong>{totals.calories}</strong> calories</div>
                <div><strong>{totals.protein}</strong>g protein</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealPlanCalendar; 