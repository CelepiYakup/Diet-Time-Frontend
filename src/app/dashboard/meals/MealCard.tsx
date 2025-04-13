import React, { memo } from 'react';
import { FaTrash } from 'react-icons/fa';
import { PlannedMeal } from '@/app/types/meals';
import styles from './MealCard.module.scss';

interface MealCardProps {
  meal: PlannedMeal;
  onRemove: (id: string) => void;
}

const MealCard = memo(({ meal, onRemove }: MealCardProps) => {
  return (
    <div className={styles.mealCard}>
      <div className={styles.mealInfo}>
        <span className={styles.mealName}>{meal.name}</span>
        <div className={styles.mealNutrition}>
          <span>{meal.calories} cal</span>
          <span>{meal.protein}g protein</span>
        </div>
      </div>
      <button
        className={styles.removeMealButton}
        onClick={() => onRemove(meal.id)}
        title="Remove meal"
      >
        <FaTrash size={14} />
      </button>
    </div>
  );
});

// Set display name for React DevTools
MealCard.displayName = 'MealCard';

export default MealCard; 