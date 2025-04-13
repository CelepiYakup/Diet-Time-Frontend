import { PlannedMeal, MealPlan, Meal, TIME_FORMAT_MAP, MealTime } from '@/app/types/meals';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

export const convertToPlannedMeals = (
  mealPlansData: MealPlan[],
  availableMeals: Meal[]
): PlannedMeal[] => {
  console.log('Converting API meal plans to frontend format:', { 
    mealPlansCount: mealPlansData?.length || 0, 
    availableMealsCount: availableMeals?.length || 0 
  });
  
  if (!mealPlansData || !Array.isArray(mealPlansData) || mealPlansData.length === 0) {
    console.warn('No meal plans data to convert');
    return [];
  }
  
  return mealPlansData.map(plan => {
    const planMeal = plan.meal || availableMeals.find(m => m.id === plan.mealId);
    
    if (!planMeal) {
      console.warn(`No meal found for meal_id ${plan.mealId} in available meals`);
      return {
        id: String(plan.id || ''),
        mealId: String(plan.mealId || ''),
        day: plan.day,
        time: convertTimeFormat(plan.mealTime),
        name: 'Unknown Meal',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      };
    }
    
    return {
      id: String(plan.id || ''),
      mealId: String(planMeal.id || ''),
      day: plan.day,
      time: convertTimeFormat(plan.mealTime),
      name: planMeal.name,
      calories: planMeal.calories,
      protein: planMeal.protein || 0,
      carbs: planMeal.carbs || 0,
      fat: planMeal.fat || 0
    };
  });
};

export const convertTimeFormat = (time: string): MealTime => {

  if (time in TIME_FORMAT_MAP) {
    return TIME_FORMAT_MAP[time];
  }

  const hour = time.split(':')[0];
  if (hour === '08') return 'Breakfast';
  else if (hour === '12') return 'Lunch';
  else if (hour === '18') return 'Dinner';
  else if (hour === '15') return 'Snack';

  return 'Breakfast';
};


export const convertToApiTimeFormat = (displayTime: MealTime): string => {
  switch (displayTime) {
    case 'Breakfast': return '08:00:00';
    case 'Lunch': return '12:00:00';
    case 'Dinner': return '18:00:00';
    case 'Snack': return '15:00:00';
    default: return '08:00:00';
  }
};


export const groupMealsByDayAndTime = (meals: PlannedMeal[]): Record<string, Record<string, PlannedMeal[]>> => {
  const grouped: Record<string, Record<string, PlannedMeal[]>> = {};
  
  meals.forEach(meal => {
    if (!grouped[meal.day]) {
      grouped[meal.day] = {};
    }
    
    if (!grouped[meal.day][meal.time]) {
      grouped[meal.day][meal.time] = [];
    }
    
    grouped[meal.day][meal.time].push(meal);
  });
  
  return grouped;
};


export const calculateTotals = (meals: PlannedMeal[]): { calories: number; protein: number; carbs: number; fat: number } => {
  return meals.reduce((totals, meal) => {
    return {
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
};


export const exportToExcel = (mealPlan: PlannedMeal[], fileName = 'meal-plan.xlsx'): void => {

  const groupedMeals = groupMealsByDayAndTime(mealPlan);
  

  const wsData: any[] = [];
  

  wsData.push(['Day', 'Meal', 'Name', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)']);
  

  Object.entries(groupedMeals).forEach(([day, timeGroups]) => {
    Object.entries(timeGroups).forEach(([time, meals]) => {
      meals.forEach((meal, index) => {

        wsData.push([
          index === 0 ? day : '',
          index === 0 ? time : '',
          meal.name,
          meal.calories,
          meal.protein,
          meal.carbs,
          meal.fat
        ]);
      });
    });
    

    const dayMeals = Object.values(timeGroups).flat();
    const dayTotals = calculateTotals(dayMeals);
    wsData.push([
      `${day} Totals`,
      '',
      '',
      dayTotals.calories,
      dayTotals.protein,
      dayTotals.carbs,
      dayTotals.fat
    ]);
    
    wsData.push(['', '', '', '', '', '', '']);
  });
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  XLSX.utils.book_append_sheet(wb, ws, 'Meal Plan');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(data, fileName);
}; 