import { getAuthToken } from '../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

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
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
  status: string;
  start_date: string;
  target_date: string;
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

// Health data interfaces
export interface HealthData {
  id: string;
  user_id: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface BodyMeasurement extends HealthData {
  weight: string;
  bmi: string;
  body_fat: string;
  waist: string;
}

export interface VitalSign extends HealthData {
  heart_rate: string;
  blood_pressure: string;
  temperature: string;
  respiratory_rate: string;
}

export interface BloodWork extends HealthData {
  glucose: string;
  cholesterol: string;
  hdl: string;
  ldl: string;
  triglycerides: string;
}

export interface SleepPattern extends HealthData {
  duration: string;
  quality: string;
  deep_sleep: string;
  rem_sleep: string;
}

// User API calls
export const userApi = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders()
      });
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
      const response = await fetch(`${API_URL}/users/${id}`, {
        headers: getAuthHeaders()
      });
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders()
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
      const response = await fetch(`${API_URL}/meals/user/${userId}`, {
        headers: getAuthHeaders()
      });
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
      const response = await fetch(`${API_URL}/meals/${id}`, {
        headers: getAuthHeaders()
      });
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders()
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
      const response = await fetch(`${API_URL}/goals/user/${userId}`, {
        headers: getAuthHeaders()
      });
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
      const response = await fetch(`${API_URL}/goals/${id}`, {
        headers: getAuthHeaders()
      });
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders()
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
      const response = await fetch(`${API_URL}/goals/user/${userId}/category/${category}`, {
        headers: getAuthHeaders()
      });
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
      const response = await fetch(`${API_URL}/goals/user/${userId}/active`, {
        headers: getAuthHeaders()
      });
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

// Health tracking API
export const healthApi = {
  // Body Measurements
  getBodyMeasurements: async (userId: number): Promise<BodyMeasurement[]> => {
    try {
      const response = await fetch(`${API_URL}/health/body-measurements/user/${userId}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to fetch body measurements');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching body measurements:', error);
      throw error;
    }
  },

  createBodyMeasurement: async (data: Omit<BodyMeasurement, 'id' | 'created_at' | 'updated_at'>): Promise<BodyMeasurement> => {
    try {
      const response = await fetch(`${API_URL}/health/body-measurements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create body measurement');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating body measurement:', error);
      throw error;
    }
  },

  updateBodyMeasurement: async (id: string, data: Partial<BodyMeasurement>): Promise<BodyMeasurement> => {
    try {
      // Ensure date is in correct format if provided
      if (data.date && typeof data.date === 'string') {
        // Keep date in YYYY-MM-DD format
        if (data.date.includes('T')) {
          data.date = data.date.split('T')[0];
        }
        
        // Log the date we're sending to the API
        console.log('Sending date to API:', data.date);
      }
      
      const response = await fetch(`${API_URL}/health/body-measurements/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      // If record doesn't exist, create a new one instead
      if (response.status === 404) {
        console.warn(`Body measurement with ID ${id} not found, creating a new record instead`);
        if (data.user_id) {
          return await healthApi.createBodyMeasurement(data as Omit<BodyMeasurement, 'id' | 'created_at' | 'updated_at'>);
        } else {
          throw new Error('User ID is required to create a new record');
        }
      }
      
      if (!response.ok) {
        throw new Error('Failed to update body measurement');
      }
      
      const result = await response.json();
      
      // Log the response to check returned date
      console.log('API response data:', result);
      
      return result;
    } catch (error) {
      console.error('Error updating body measurement:', error);
      throw error;
    }
  },

  deleteBodyMeasurement: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/health/body-measurements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to delete body measurement');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting body measurement:', error);
      throw error;
    }
  },

  // Vital Signs
  getVitalSigns: async (userId: number): Promise<VitalSign[]> => {
    try {
      const response = await fetch(`${API_URL}/health/vital-signs/user/${userId}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to fetch vital signs');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching vital signs:', error);
      throw error;
    }
  },

  createVitalSign: async (data: Omit<VitalSign, 'id' | 'created_at' | 'updated_at'>): Promise<VitalSign> => {
    try {
      const response = await fetch(`${API_URL}/health/vital-signs`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create vital sign');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating vital sign:', error);
      throw error;
    }
  },

  updateVitalSign: async (id: string, data: Partial<VitalSign>): Promise<VitalSign> => {
    try {
      // Ensure date is in correct format if provided
      if (data.date && typeof data.date === 'string') {
        // Keep date in YYYY-MM-DD format
        if (data.date.includes('T')) {
          data.date = data.date.split('T')[0];
        }
        
        // Log the date we're sending to the API
        console.log('Sending date to API:', data.date);
      }
      
      const response = await fetch(`${API_URL}/health/vital-signs/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      // If record doesn't exist, create a new one instead
      if (response.status === 404) {
        console.warn(`Vital sign with ID ${id} not found, creating a new record instead`);
        if (data.user_id) {
          return await healthApi.createVitalSign(data as Omit<VitalSign, 'id' | 'created_at' | 'updated_at'>);
        } else {
          throw new Error('User ID is required to create a new record');
        }
      }
      
      if (!response.ok) {
        throw new Error('Failed to update vital sign');
      }
      
      const result = await response.json();
      
      // Log the response to check returned date
      console.log('API response data:', result);
      
      return result;
    } catch (error) {
      console.error('Error updating vital sign:', error);
      throw error;
    }
  },

  deleteVitalSign: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/health/vital-signs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to delete vital sign');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting vital sign:', error);
      throw error;
    }
  },

  // Blood Work
  getBloodWork: async (userId: number): Promise<BloodWork[]> => {
    try {
      const response = await fetch(`${API_URL}/health/blood-work/user/${userId}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to fetch blood work');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching blood work:', error);
      throw error;
    }
  },

  createBloodWork: async (data: Omit<BloodWork, 'id' | 'created_at' | 'updated_at'>): Promise<BloodWork> => {
    try {
      const response = await fetch(`${API_URL}/health/blood-work`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create blood work');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating blood work:', error);
      throw error;
    }
  },

  updateBloodWork: async (id: string, data: Partial<BloodWork>): Promise<BloodWork> => {
    try {
      // Ensure date is in correct format if provided
      if (data.date && typeof data.date === 'string') {
        // Keep date in YYYY-MM-DD format
        if (data.date.includes('T')) {
          data.date = data.date.split('T')[0];
        }
        
        // Log the date we're sending to the API
        console.log('Sending date to API:', data.date);
      }
      
      const response = await fetch(`${API_URL}/health/blood-work/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      // If record doesn't exist, create a new one instead
      if (response.status === 404) {
        console.warn(`Blood work with ID ${id} not found, creating a new record instead`);
        if (data.user_id) {
          return await healthApi.createBloodWork(data as Omit<BloodWork, 'id' | 'created_at' | 'updated_at'>);
        } else {
          throw new Error('User ID is required to create a new record');
        }
      }
      
      if (!response.ok) {
        throw new Error('Failed to update blood work');
      }
      
      const result = await response.json();
      
      // Log the response to check returned date
      console.log('API response data:', result);
      
      return result;
    } catch (error) {
      console.error('Error updating blood work:', error);
      throw error;
    }
  },

  deleteBloodWork: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/health/blood-work/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to delete blood work');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting blood work:', error);
      throw error;
    }
  },

  // Sleep Patterns
  getSleepPatterns: async (userId: number): Promise<SleepPattern[]> => {
    try {
      const response = await fetch(`${API_URL}/health/sleep-patterns/user/${userId}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to fetch sleep patterns');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sleep patterns:', error);
      throw error;
    }
  },

  createSleepPattern: async (data: Omit<SleepPattern, 'id' | 'created_at' | 'updated_at'>): Promise<SleepPattern> => {
    try {
      const response = await fetch(`${API_URL}/health/sleep-patterns`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create sleep pattern');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating sleep pattern:', error);
      throw error;
    }
  },

  updateSleepPattern: async (id: string, data: Partial<SleepPattern>): Promise<SleepPattern> => {
    try {
      // Ensure date is in correct format if provided
      if (data.date && typeof data.date === 'string') {
        // Keep date in YYYY-MM-DD format
        if (data.date.includes('T')) {
          data.date = data.date.split('T')[0];
        }
        
        // Log the date we're sending to the API
        console.log('Sending date to API:', data.date);
      }
      
      const response = await fetch(`${API_URL}/health/sleep-patterns/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      // If record doesn't exist, create a new one instead
      if (response.status === 404) {
        console.warn(`Sleep pattern with ID ${id} not found, creating a new record instead`);
        if (data.user_id) {
          return await healthApi.createSleepPattern(data as Omit<SleepPattern, 'id' | 'created_at' | 'updated_at'>);
        } else {
          throw new Error('User ID is required to create a new record');
        }
      }
      
      if (!response.ok) {
        throw new Error('Failed to update sleep pattern');
      }
      
      const result = await response.json();
      
      // Log the response to check returned date
      console.log('API response data:', result);
      
      return result;
    } catch (error) {
      console.error('Error updating sleep pattern:', error);
      throw error;
    }
  },

  deleteSleepPattern: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/health/sleep-patterns/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to delete sleep pattern');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting sleep pattern:', error);
      throw error;
    }
  }
};

// Meal Plan API calls
export const mealPlanApi = {
  // Get all meal plans for a user
  getUserMealPlans: async (userId: number): Promise<MealPlan[]> => {
    try {
      const response = await fetch(`${API_URL}/meal-plans/user/${userId}`, {
        headers: getAuthHeaders()
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
      const response = await fetch(`${API_URL}/meal-plans`, {
        method: 'POST',
        headers: getAuthHeaders(),
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

  // Update meal plan entry
  updateMealPlan: async (id: number, mealPlanData: Partial<MealPlanInput>): Promise<MealPlan> => {
    try {
      const response = await fetch(`${API_URL}/meal-plans/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
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

  // Delete meal plan entry
  deleteMealPlan: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/meal-plans/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete meal plan');
      }
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      throw error;
    }
  },
  
  // Delete all meal plans for a specific day
  deleteMealPlansForDay: async (userId: number, day: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/meal-plans/user/${userId}/day/${day}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete meal plans for day');
      }
    } catch (error) {
      console.error('Error deleting meal plans for day:', error);
      throw error;
    }
  }
}; 