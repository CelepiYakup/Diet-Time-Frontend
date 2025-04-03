import { getAuthToken } from '../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface Meal {
  id: number;
  user_id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_date: string;
  meal_time: string;
  created_at: string;
}

export interface MealInput {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  meal_date: string;
  meal_time: string;
}

export interface Goal {
  id: number;
  user_id: number;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
  created_at: string;
  updated_at: string;
}

export interface GoalInput {
  user_id: number;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
}

// MealPlan interfaces
export interface MealPlan {
  id: number;
  user_id: number;
  day: string;
  meal_time: string;
  meal_id: number;
  created_at: string;
  updated_at: string;
  meal?: Meal; // Optional meal details
}

export interface MealPlanInput {
  user_id: number;
  day: string;
  meal_time: string;
  meal_id: number;
}

// User API calls
export const userApi = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Register new user
  registerUser: async (userData: UserInput): Promise<{ message: string; user: User }> => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user
  loginUser: async (loginData: LoginInput): Promise<{ message: string; user: User & { token: string } }> => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: number, userData: Partial<UserInput>): Promise<{ message: string; user: User }> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

// Meal API calls
export const mealApi = {
  // Get all meals for a user
  getUserMeals: async (userId: number): Promise<Meal[]> => {
    try {
      const response = await fetch(`${API_URL}/meals/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching meals:', error);
      throw error;
    }
  },

  // Get meal by ID
  getMealById: async (id: number): Promise<Meal> => {
    try {
      const response = await fetch(`${API_URL}/meals/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch meal');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching meal:', error);
      throw error;
    }
  },

  // Create a new meal
  createMeal: async (userId: number, mealData: MealInput): Promise<{ message: string; meal: Meal }> => {
    try {
      const response = await fetch(`${API_URL}/meals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ...mealData
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create meal');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  },

  // Update meal
  updateMeal: async (id: number, mealData: Partial<MealInput>): Promise<{ message: string; meal: Meal }> => {
    try {
      const response = await fetch(`${API_URL}/meals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update meal');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  },

  // Delete meal
  deleteMeal: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/meals/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete meal');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  },
};

// Goal API calls
export const goalApi = {
  // Get all goals for a user
  getUserGoals: async (userId: number): Promise<Goal[]> => {
    try {
      const response = await fetch(`${API_URL}/goals/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },

  // Get goal by ID
  getGoalById: async (id: number): Promise<Goal> => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch goal');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching goal:', error);
      throw error;
    }
  },

  // Create a new goal
  createGoal: async (goalData: GoalInput): Promise<Goal> => {
    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create goal');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },

  // Update goal
  updateGoal: async (id: number, goalData: Partial<GoalInput>): Promise<Goal> => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update goal');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  // Delete goal
  deleteGoal: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  // Get goals by category for a user
  getGoalsByCategory: async (userId: number, category: string): Promise<Goal[]> => {
    try {
      const response = await fetch(`${API_URL}/goals/user/${userId}/category/${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch goals by category');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching goals by category:', error);
      throw error;
    }
  },

  // Get active goals for a user
  getActiveGoals: async (userId: number): Promise<Goal[]> => {
    try {
      const response = await fetch(`${API_URL}/goals/user/${userId}/active`);
      if (!response.ok) {
        throw new Error('Failed to fetch active goals');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching active goals:', error);
      throw error;
    }
  },
};

// Meal Plan API calls
export const mealPlanApi = {
  // Get all meal plans for a user
  getUserMealPlans: async (userId: number): Promise<MealPlan[]> => {
    try {
      // Get token using helper function
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/meal-plans/user/${userId}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch meal plans');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      throw error;
    }
  },

  // Create a new meal plan entry
  createMealPlan: async (mealPlanData: MealPlanInput): Promise<{ message: string; mealPlan: MealPlan }> => {
    try {
      // Get token using helper function
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/meal-plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(mealPlanData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create meal plan');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating meal plan:', error);
      throw error;
    }
  },

  // Update a meal plan entry
  updateMealPlan: async (id: number, mealPlanData: Partial<MealPlanInput>): Promise<{ message: string; mealPlan: MealPlan }> => {
    try {
      // Get token using helper function
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/meal-plans/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(mealPlanData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update meal plan');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating meal plan:', error);
      throw error;
    }
  },

  // Delete a meal plan entry
  deleteMealPlan: async (id: number): Promise<{ message: string }> => {
    try {
      // Get token using helper function
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/meal-plans/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete meal plan');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      throw error;
    }
  },
  
  // Delete all meal plans for a specific day
  deleteMealPlansForDay: async (userId: number, day: string): Promise<{ message: string }> => {
    try {
      // Get token using helper function
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/meal-plans/user/${userId}/day/${day}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete meal plans for day');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting meal plans for day:', error);
      throw error;
    }
  }
}; 