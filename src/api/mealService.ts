import axios from 'axios';
import { Meal, MealPlan } from '@/app/types/meals';
import { getAuthToken } from '@/app/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

export const mealApi = {
  getUserMeals: async (userId: string): Promise<Meal[]> => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_URL}/meals/user/${userId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching user meals:', error);
      return [];
    }
  },

  createMeal: async (meal: Omit<Meal, 'id'>, userId: string): Promise<Meal> => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.post(`${API_URL}/meals`, { ...meal, userId }, { headers });
      return response.data;
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  },

  updateMeal: async (mealId: string, meal: Partial<Meal>): Promise<Meal> => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.put(`${API_URL}/meals/${mealId}`, meal, { headers });
      return response.data;
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  },

  deleteMeal: async (mealId: string): Promise<void> => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.delete(`${API_URL}/meals/${mealId}`, { headers });
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  }
};

export const mealPlanApi = {
  getUserMealPlans: async (userId: string): Promise<MealPlan[]> => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_URL}/meal-plans/user/${userId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching user meal plans:', error);
      return [];
    }
  },

  saveMealPlan: async (userId: string, mealPlans: Omit<MealPlan, 'id'>[]): Promise<MealPlan[]> => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.post(`${API_URL}/meal-plans/batch`, { userId, mealPlans }, { headers });
      return response.data;
    } catch (error) {
      console.error('Error saving meal plan:', error);
      throw error;
    }
  }
};

export const externalMealApi = {
  searchMeals: async ({ query, mealType }: { query: string, mealType?: string }): Promise<any[]> => {
    try {
      // Mock response for development
      if (process.env.NODE_ENV === 'development' && (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === '4916fa32f6da422984ac96c6c522c8fd')) {
        return mockSearchResults;
      }

      const params = new URLSearchParams({
        apiKey: SPOONACULAR_API_KEY || '',
        query,
        number: '5',
      });

      if (mealType) {
        params.append('type', mealType);
      }

      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`);

      const recipes = response.data.results;
      const detailedRecipes = await Promise.all(
        recipes.map(async (recipe: any) => {
          try {
            const nutritionResponse = await axios.get(
              `https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json?apiKey=${SPOONACULAR_API_KEY}`
            );
            
            return {
              id: `spoon-${recipe.id}`,
              name: recipe.title,
              calories: parseInt(nutritionResponse.data.calories, 10),
              protein: parseInt(nutritionResponse.data.protein, 10),
              carbs: parseInt(nutritionResponse.data.carbs, 10),
              fat: parseInt(nutritionResponse.data.fat, 10),

            };
          } catch (error) {
            console.error(`Error fetching nutrition for recipe ${recipe.id}:`, error);
            return {
              id: `spoon-${recipe.id}`,
              name: recipe.title,
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,

            };
          }
        })
      );

      return detailedRecipes;
    } catch (error) {
      console.error('Error searching for external meals:', error);
      return mockSearchResults;
    }
  }
};

const mockSearchResults = [
  {
    id: 'spoon-1',
    name: 'Grilled Chicken Salad',
    calories: 350,
    protein: 30,
    carbs: 15,
    fat: 10,
    
  },
  {
    id: 'spoon-2',
    name: 'Vegetable Stir Fry',
    calories: 250,
    protein: 12,
    carbs: 30,
    fat: 8,

  },
  {
    id: 'spoon-3',
    name: 'Salmon with Roasted Vegetables',
    calories: 420,
    protein: 35,
    carbs: 20,
    fat: 15,
  }
]; 