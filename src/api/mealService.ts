import axios from 'axios';
import { Meal, MealPlan } from '@/app/types/meals';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY || '4916fa32f6da422984ac96c6c522c8fd';

// Meal API for internal meals
export const mealApi = {
  getUserMeals: async (userId: string): Promise<Meal[]> => {
    try {
      const response = await axios.get(`${API_URL}/meals/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user meals:', error);
      return [];
    }
  },

  createMeal: async (meal: Omit<Meal, 'id'>, userId: string): Promise<Meal> => {
    try {
      const response = await axios.post(`${API_URL}/meals`, { ...meal, userId });
      return response.data;
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  },

  updateMeal: async (mealId: string, meal: Partial<Meal>): Promise<Meal> => {
    try {
      const response = await axios.put(`${API_URL}/meals/${mealId}`, meal);
      return response.data;
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  },

  deleteMeal: async (mealId: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/meals/${mealId}`);
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  }
};

// Meal Plan API for saving meal plans
export const mealPlanApi = {
  getUserMealPlans: async (userId: string): Promise<MealPlan[]> => {
    try {
      const response = await axios.get(`${API_URL}/meal-plans/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user meal plans:', error);
      return [];
    }
  },

  saveMealPlan: async (userId: string, mealPlans: Omit<MealPlan, 'id'>[]): Promise<MealPlan[]> => {
    try {
      const response = await axios.post(`${API_URL}/meal-plans/batch`, { userId, mealPlans });
      return response.data;
    } catch (error) {
      console.error('Error saving meal plan:', error);
      throw error;
    }
  }
};

// External Meal API for Spoonacular integration
export const externalMealApi = {
  searchMeals: async ({ query, mealType }: { query: string, mealType?: string }): Promise<any[]> => {
    try {
      // Mock response for development
      if (process.env.NODE_ENV === 'development' && (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === '4916fa32f6da422984ac96c6c522c8fd')) {
        return mockSearchResults;
      }

      // Prepare parameters for Spoonacular API
      const params = new URLSearchParams({
        apiKey: SPOONACULAR_API_KEY,
        query,
        number: '5',
      });

      if (mealType) {
        params.append('type', mealType);
      }

      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`);
      
      // Get nutrition information for each recipe
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
              image: recipe.image
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
              image: recipe.image
            };
          }
        })
      );

      return detailedRecipes;
    } catch (error) {
      console.error('Error searching for external meals:', error);
      return mockSearchResults; // Fallback to mock data
    }
  }
};

// Mock search results for development
const mockSearchResults = [
  {
    id: 'spoon-1',
    name: 'Grilled Chicken Salad',
    calories: 350,
    protein: 30,
    carbs: 15,
    fat: 10,
    image: 'https://spoonacular.com/recipeImages/grilled-chicken-salad.jpg'
  },
  {
    id: 'spoon-2',
    name: 'Vegetable Stir Fry',
    calories: 250,
    protein: 12,
    carbs: 30,
    fat: 8,
    image: 'https://spoonacular.com/recipeImages/vegetable-stir-fry.jpg'
  },
  {
    id: 'spoon-3',
    name: 'Salmon with Roasted Vegetables',
    calories: 420,
    protein: 35,
    carbs: 20,
    fat: 15,
    image: 'https://spoonacular.com/recipeImages/salmon-vegetables.jpg'
  }
]; 