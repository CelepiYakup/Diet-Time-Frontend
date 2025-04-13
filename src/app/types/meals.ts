
export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  userId?: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  mealId: string;
  day: string;
  mealTime: string;
  meal?: Meal;
}


export interface PlannedMeal {
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


export interface ExternalMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
  ingredients?: string[];
}

export interface ExternalMealSearchParams {
  query: string;
  mealType?: string;
  maxCalories?: number;
  minProtein?: number;
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type Day = typeof DAYS[number];

export const MEAL_TIMES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;
export type MealTime = typeof MEAL_TIMES[number];

export const TIME_FORMAT_MAP: Record<string, MealTime> = {
  '08:00:00': 'Breakfast',
  '12:00:00': 'Lunch',
  '18:00:00': 'Dinner',
  '15:00:00': 'Snack'
}; 