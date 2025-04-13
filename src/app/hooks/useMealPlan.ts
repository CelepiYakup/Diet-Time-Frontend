import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { toast } from 'react-hot-toast';
import { PlannedMeal, Meal, MealPlan, DAYS, MEAL_TIMES, Day, MealTime } from '@/app/types/meals';
import { mealApi, mealPlanApi } from '@/api/mealService';
import { convertToPlannedMeals, convertToApiTimeFormat } from '@/app/lib/utils/mealPlanUtils';

interface UseMealPlanProps {
  userId: string | null;
}

interface UseMealPlanReturn {
  meals: Meal[];
  mealPlan: PlannedMeal[];
  isLoading: boolean;
  selectedDay: Day | string;
  selectedTime: MealTime | string;
  setSelectedDay: Dispatch<SetStateAction<Day | string>>;
  setSelectedTime: Dispatch<SetStateAction<MealTime | string>>;
  addMealToPlan: (mealId: string) => void;
  removeMealFromPlan: (plannedMealId: string) => void;
  saveMealPlan: () => Promise<void>;
  setMeals: Dispatch<SetStateAction<Meal[]>>;
}

export const useMealPlan = ({ userId }: UseMealPlanProps): UseMealPlanReturn => {

  const [meals, setMeals] = useState<Meal[]>([]);

  const [mealPlan, setMealPlan] = useState<PlannedMeal[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Day | string>(DAYS[0]);
  const [selectedTime, setSelectedTime] = useState<MealTime | string>(MEAL_TIMES[0]);

  const getCacheKey = useCallback(() => {
    return userId ? `mealPlan-${userId}` : 'mealPlan-guest';
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    const loadMealPlanData = async () => {
      try {
        setIsLoading(true);

        const cacheKey = getCacheKey();
        const cachedMealPlan = localStorage.getItem(cacheKey);

        const mealsData = await mealApi.getUserMeals(userId);
        setMeals(mealsData);

        if (cachedMealPlan) {
          try {
            const cachedPlan: PlannedMeal[] = JSON.parse(cachedMealPlan);
            setMealPlan(cachedPlan);
          } catch (error) {

          }
        }

        try {
          const mealPlansData = await mealPlanApi.getUserMealPlans(userId);
          const convertedPlans = convertToPlannedMeals(mealPlansData, mealsData);
          

          if (convertedPlans && convertedPlans.length > 0) {
            setMealPlan(convertedPlans);
            

            localStorage.setItem(cacheKey, JSON.stringify(convertedPlans));
          } else if (!cachedMealPlan) {
            setMealPlan([]);
          }
        } catch (apiError) {
          console.error('Error fetching meal plans from API:', apiError);
          if (!cachedMealPlan) {
            toast.error('Failed to load meal plans from server');
          }
        }
      } catch (error) {
        console.error('Error fetching meal planning data:', error);
        toast.error('Failed to load meal planning data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMealPlanData();
  }, [userId, getCacheKey]);
  

  const addMealToPlan = useCallback((mealId: string) => {
    try {
      let meal: Meal | undefined;

      const mealIdStr = String(mealId);

      
      if (mealIdStr.startsWith('ext-') || mealIdStr.includes('spoon-')) {

        const externalMeal = meals.find(m => String(m.id) === mealIdStr);
        
        if (!externalMeal) {

          toast.error('External meal not found');
          return;
        }


        const tempId = `temp-${Date.now()}`;

        const newPlannedMeal: PlannedMeal = {
          id: tempId,
          mealId: mealIdStr,
          day: selectedDay,
          time: selectedTime,
          name: externalMeal.name,
          calories: externalMeal.calories || 0,
          protein: externalMeal.protein || 0,
          carbs: externalMeal.carbs || 0,
          fat: externalMeal.fat || 0
        };
        

        const updatedPlan = [...mealPlan, newPlannedMeal];
        setMealPlan(updatedPlan);
        toast.success(`Added ${externalMeal.name} to ${selectedDay} ${selectedTime}`);

        localStorage.setItem(getCacheKey(), JSON.stringify(updatedPlan));
        
        return;
      }

      meal = meals.find(m => m.id === mealId);
      
      if (!meal) {
        toast.error('Meal not found');
        return;
      }

      const newPlannedMeal: PlannedMeal = {
        id: `temp-${Date.now()}`,
        mealId: mealIdStr,
        day: selectedDay,
        time: selectedTime,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0
      };
      

      const updatedPlan = [...mealPlan, newPlannedMeal];
      setMealPlan(updatedPlan);
      toast.success(`Added ${meal.name} to ${selectedDay} ${selectedTime}`);

      localStorage.setItem(getCacheKey(), JSON.stringify(updatedPlan));
    } catch (error) {
      console.error('Error adding meal to plan:', error);
      toast.error('Failed to add meal to plan');
    }
  }, [meals, mealPlan, selectedDay, selectedTime, getCacheKey]);

  const removeMealFromPlan = useCallback((plannedMealId: string) => {
    setMealPlan(prev => {
      const updatedPlan = prev.filter(meal => meal.id !== plannedMealId);

      localStorage.setItem(getCacheKey(), JSON.stringify(updatedPlan));
      
      return updatedPlan;
    });
    
    toast.success('Meal removed from plan');
  }, [getCacheKey]);

  const saveMealPlan = useCallback(async () => {
    if (!userId) {
      toast.error('You must be logged in to save a meal plan');
      return;
    }
    
    try {
      const newMeals = mealPlan.filter(meal => String(meal.id).startsWith('temp-'));
      const existingMeals = mealPlan.filter(meal => !String(meal.id).startsWith('temp-'));

      const savableMeals = newMeals.filter(meal => {
        const mealIdStr = String(meal.mealId);
        const isExternalMeal = mealIdStr.startsWith('ext-') || mealIdStr.includes('spoon-');
        if (isExternalMeal) {
        }
        return !isExternalMeal;
      });
      
      
 
      const mealPlansToSave: Omit<MealPlan, 'id'>[] = savableMeals.map(meal => ({
        userId,
        mealId: meal.mealId,
        day: meal.day,
        mealTime: convertToApiTimeFormat(meal.time as MealTime)
      }));
      
      const externalMeals = newMeals.filter(meal => 
        String(meal.mealId).startsWith('ext-') || 
        String(meal.mealId).includes('spoon-')
      );
      
      let finalPlan = [...existingMeals, ...externalMeals];

      if (mealPlansToSave.length > 0) {
        try {
          const savedPlans = await mealPlanApi.saveMealPlan(userId, mealPlansToSave);

          if (savedPlans && Array.isArray(savedPlans)) {
            const savedPlannedMeals = convertToPlannedMeals(savedPlans, meals);

            finalPlan = [...existingMeals, ...savedPlannedMeals, ...externalMeals];
          } else {
          }
        } catch (saveError) {
          toast.error('Some meals could not be saved, but we kept your plan');
        }
      }

      setMealPlan(finalPlan);

      localStorage.setItem(getCacheKey(), JSON.stringify(finalPlan));
      
      toast.success('Meal plan saved successfully');
    } catch (error) {
      toast.error('Failed to save meal plan');
    }
  }, [userId, mealPlan, meals, getCacheKey]);
  
  return {
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
  };
}; 