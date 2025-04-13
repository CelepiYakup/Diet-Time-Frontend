import { getAuthToken } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
export interface ExternalMeal {
  id: string;
  label: string;
  name?: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: string;
  url: string;
  source_url?: string;
  servings?: number;
  ingredients?: string[];
  nutrients?: {
    protein: number;
    fat: number;
    carbs: number;
  };
  cooking_time?: number;
}

export interface ExternalMealSearchParams {
  query: string;
  mealType: string;
}

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  registerUser: async (
    userData: UserInput
  ): Promise<{ message: string; user: User }> => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  loginUser: async (
    loginData: LoginInput
  ): Promise<{ message: string; user: User & { token: string } }> => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      return await response.json();
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  updateUser: async (
    id: number,
    userData: Partial<UserInput>
  ): Promise<{ message: string; user: User }> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};

export const mealApi = {
  getUserMeals: async (userId: number): Promise<Meal[]> => {
    try {
      const response = await fetch(`${API_URL}/meals/user/${userId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch meals");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching meals:", error);
      throw error;
    }
  },

  getMealById: async (id: number): Promise<Meal> => {
    try {
      const response = await fetch(`${API_URL}/meals/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch meal");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching meal:", error);
      throw error;
    }
  },

  createMeal: async (
    userId: number,
    mealData: MealInput
  ): Promise<{ message: string; meal: Meal }> => {
    try {
      if (mealData.meal_time) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

        if (!timeRegex.test(mealData.meal_time)) {
          if (/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.test(mealData.meal_time)) {
            mealData.meal_time = `${mealData.meal_time}:00`;
          } else if (
            ["Breakfast", "Lunch", "Dinner", "Snack"].includes(
              mealData.meal_time
            )
          ) {
            const timeMap: Record<string, string> = {
              Breakfast: "08:00:00",
              Lunch: "12:00:00",
              Dinner: "18:00:00",
              Snack: "15:00:00",
            };
            mealData.meal_time = timeMap[mealData.meal_time] || "12:00:00";
          } else if (!timeRegex.test(mealData.meal_time)) {
            console.warn(
              "Invalid time format provided:",
              mealData.meal_time,
              "using default"
            );
            mealData.meal_time = "12:00:00";
          }
        }
      } else {
        mealData.meal_time = "12:00:00";
      }

      const response = await fetch(`${API_URL}/meals`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          user_id: userId,
          ...mealData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create meal");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating meal:", error);
      throw error;
    }
  },

  updateMeal: async (
    id: number,
    mealData: Partial<MealInput>
  ): Promise<{ message: string; meal: Meal }> => {
    try {
      if (mealData.meal_time) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

        if (!timeRegex.test(mealData.meal_time)) {
          if (/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.test(mealData.meal_time)) {
            mealData.meal_time = `${mealData.meal_time}:00`;
          } else if (
            ["Breakfast", "Lunch", "Dinner", "Snack"].includes(
              mealData.meal_time
            )
          ) {
            const timeMap: Record<string, string> = {
              Breakfast: "08:00:00",
              Lunch: "12:00:00",
              Dinner: "18:00:00",
              Snack: "15:00:00",
            };
            mealData.meal_time = timeMap[mealData.meal_time] || "12:00:00";
          } else if (!timeRegex.test(mealData.meal_time)) {
            console.warn(
              "Invalid time format provided for update:",
              mealData.meal_time,
              "using default"
            );
            mealData.meal_time = "12:00:00";
          }
        }
      }

      const response = await fetch(`${API_URL}/meals/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(mealData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update meal");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating meal:", error);
      throw error;
    }
  },

  deleteMeal: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/meals/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete meal");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting meal:", error);
      throw error;
    }
  },
};

export const goalApi = {
  getUserGoals: async (userId: number): Promise<Goal[]> => {
    try {
      const response = await fetch(`${API_URL}/goals/user/${userId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching goals:", error);
      throw error;
    }
  },

  getGoalById: async (id: number): Promise<Goal> => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch goal");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching goal:", error);
      throw error;
    }
  },

  createGoal: async (goalData: GoalInput): Promise<Goal> => {
    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create goal");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating goal:", error);
      throw error;
    }
  },

  updateGoal: async (
    id: number,
    goalData: Partial<GoalInput>
  ): Promise<Goal> => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update goal");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating goal:", error);
      throw error;
    }
  },

  deleteGoal: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete goal");
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      throw error;
    }
  },

  getGoalsByCategory: async (
    userId: number,
    category: string
  ): Promise<Goal[]> => {
    try {
      const response = await fetch(
        `${API_URL}/goals/user/${userId}/category/${category}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch goals by category");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching goals by category:", error);
      throw error;
    }
  },

  getActiveGoals: async (userId: number): Promise<Goal[]> => {
    try {
      const response = await fetch(`${API_URL}/goals/user/${userId}/active`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch active goals");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching active goals:", error);
      throw error;
    }
  },
};

export const healthApi = {
  getBodyMeasurements: async (userId: number): Promise<BodyMeasurement[]> => {
    try {
      const response = await fetch(
        `${API_URL}/health/body-measurements/user/${userId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch body measurements");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching body measurements:", error);
      throw error;
    }
  },

  createBodyMeasurement: async (
    data: Omit<BodyMeasurement, "id" | "created_at" | "updated_at">
  ): Promise<BodyMeasurement> => {
    try {
      const response = await fetch(`${API_URL}/health/body-measurements`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create body measurement");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating body measurement:", error);
      throw error;
    }
  },

  updateBodyMeasurement: async (
    id: string,
    data: Partial<BodyMeasurement>
  ): Promise<BodyMeasurement> => {
    try {
      if (data.date && typeof data.date === "string") {
        if (data.date.includes("T")) {
          data.date = data.date.split("T")[0];
        }
      }

      const response = await fetch(
        `${API_URL}/health/body-measurements/${id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );

      if (response.status === 404) {
        console.warn(
          `Body measurement with ID ${id} not found, creating a new record instead`
        );
        if (data.user_id) {
          return await healthApi.createBodyMeasurement(
            data as Omit<BodyMeasurement, "id" | "created_at" | "updated_at">
          );
        } else {
          throw new Error("User ID is required to create a new record");
        }
      }

      if (!response.ok) {
        throw new Error("Failed to update body measurement");
      }

      const result = await response.json();

      return result;
    } catch (error) {
      throw error;
    }
  },

  deleteBodyMeasurement: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/health/body-measurements/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete body measurement");
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting body measurement:", error);
      throw error;
    }
  },

  getVitalSigns: async (userId: number): Promise<VitalSign[]> => {
    try {
      const response = await fetch(
        `${API_URL}/health/vital-signs/user/${userId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch vital signs");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching vital signs:", error);
      throw error;
    }
  },

  createVitalSign: async (
    data: Omit<VitalSign, "id" | "created_at" | "updated_at">
  ): Promise<VitalSign> => {
    try {
      const response = await fetch(`${API_URL}/health/vital-signs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create vital sign");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateVitalSign: async (
    id: string,
    data: Partial<VitalSign>
  ): Promise<VitalSign> => {
    try {
      if (data.date && typeof data.date === "string") {
        if (data.date.includes("T")) {
          data.date = data.date.split("T")[0];
        }
      }

      const response = await fetch(`${API_URL}/health/vital-signs/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (response.status === 404) {
        console.warn(
          `Vital sign with ID ${id} not found, creating a new record instead`
        );
        if (data.user_id) {
          return await healthApi.createVitalSign(
            data as Omit<VitalSign, "id" | "created_at" | "updated_at">
          );
        } else {
          throw new Error("User ID is required to create a new record");
        }
      }

      if (!response.ok) {
        throw new Error("Failed to update vital sign");
      }

      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Error updating vital sign:", error);
      throw error;
    }
  },

  deleteVitalSign: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/health/vital-signs/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to delete vital sign");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getBloodWork: async (userId: number): Promise<BloodWork[]> => {
    try {
      const response = await fetch(
        `${API_URL}/health/blood-work/user/${userId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch blood work");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching blood work:", error);
      throw error;
    }
  },

  createBloodWork: async (
    data: Omit<BloodWork, "id" | "created_at" | "updated_at">
  ): Promise<BloodWork> => {
    try {
      const response = await fetch(`${API_URL}/health/blood-work`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create blood work");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateBloodWork: async (
    id: string,
    data: Partial<BloodWork>
  ): Promise<BloodWork> => {
    try {
      if (data.date && typeof data.date === "string") {
        if (data.date.includes("T")) {
          data.date = data.date.split("T")[0];
        }
      }

      const response = await fetch(`${API_URL}/health/blood-work/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (response.status === 404) {
        console.warn(
          `Blood work with ID ${id} not found, creating a new record instead`
        );
        if (data.user_id) {
          return await healthApi.createBloodWork(
            data as Omit<BloodWork, "id" | "created_at" | "updated_at">
          );
        } else {
          throw new Error("User ID is required to create a new record");
        }
      }

      if (!response.ok) {
        throw new Error("Failed to update blood work");
      }

      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Error updating blood work:", error);
      throw error;
    }
  },

  deleteBloodWork: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/health/blood-work/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to delete blood work");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getSleepPatterns: async (userId: number): Promise<SleepPattern[]> => {
    try {
      const response = await fetch(
        `${API_URL}/health/sleep-patterns/user/${userId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sleep patterns");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  createSleepPattern: async (
    data: Omit<SleepPattern, "id" | "created_at" | "updated_at">
  ): Promise<SleepPattern> => {
    try {
      const response = await fetch(`${API_URL}/health/sleep-patterns`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create sleep pattern");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateSleepPattern: async (
    id: string,
    data: Partial<SleepPattern>
  ): Promise<SleepPattern> => {
    try {
      if (data.date && typeof data.date === "string") {
        if (data.date.includes("T")) {
          data.date = data.date.split("T")[0];
        }
      }

      const response = await fetch(`${API_URL}/health/sleep-patterns/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (response.status === 404) {
        console.warn(
          `Sleep pattern with ID ${id} not found, creating a new record instead`
        );
        if (data.user_id) {
          return await healthApi.createSleepPattern(
            data as Omit<SleepPattern, "id" | "created_at" | "updated_at">
          );
        } else {
          throw new Error("User ID is required to create a new record");
        }
      }

      if (!response.ok) {
        throw new Error("Failed to update sleep pattern");
      }

      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Error updating sleep pattern:", error);
      throw error;
    }
  },

  deleteSleepPattern: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/health/sleep-patterns/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to delete sleep pattern");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

export const mealPlanApi = {
  getUserMealPlans: async (userId: number): Promise<MealPlan[]> => {
    try {
      const response = await fetch(`${API_URL}/meal-plans/user/${userId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch meal plans");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  createMealPlan: async (
    mealPlanData: MealPlanInput
  ): Promise<{ message: string; mealPlan: MealPlan }> => {
    try {
      if (mealPlanData.meal_time) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

        if (!timeRegex.test(mealPlanData.meal_time)) {
          if (
            /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.test(mealPlanData.meal_time)
          ) {
            mealPlanData.meal_time = `${mealPlanData.meal_time}:00`;
          } else if (
            ["Breakfast", "Lunch", "Dinner", "Snack"].includes(
              mealPlanData.meal_time
            )
          ) {
            const timeMap: Record<string, string> = {
              Breakfast: "08:00:00",
              Lunch: "12:00:00",
              Dinner: "18:00:00",
              Snack: "15:00:00",
            };
            mealPlanData.meal_time =
              timeMap[mealPlanData.meal_time] || "12:00:00";
          } else if (!timeRegex.test(mealPlanData.meal_time)) {
            console.warn(
              "Invalid time format provided for meal plan:",
              mealPlanData.meal_time,
              "using default"
            );
            mealPlanData.meal_time = "12:00:00";
          }
        }
      } else {
        mealPlanData.meal_time = "12:00:00";
      }

      const response = await fetch(`${API_URL}/meal-plans`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(mealPlanData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create meal plan");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateMealPlan: async (
    id: number,
    mealPlanData: Partial<MealPlanInput>
  ): Promise<MealPlan> => {
    try {
      if (
        mealPlanData.meal_time &&
        typeof mealPlanData.meal_time === "string"
      ) {
        if (mealPlanData.meal_time.split(":").length === 2) {
          mealPlanData.meal_time = `${mealPlanData.meal_time}:00`;
        }
        const mealTimeMap: Record<string, string> = {
          Breakfast: "08:00:00",
          Lunch: "12:00:00",
          Dinner: "18:00:00",
          Snack: "15:00:00",
        };

        if (mealTimeMap[mealPlanData.meal_time]) {
          mealPlanData.meal_time = mealTimeMap[mealPlanData.meal_time];
        }
      }

      const response = await fetch(`${API_URL}/meal-plans/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(mealPlanData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update meal plan");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deleteMealPlan: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/meal-plans/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete meal plan");
      }
    } catch (error) {
      throw error;
    }
  },

  deleteMealPlansForDay: async (userId: number, day: string): Promise<void> => {
    try {
      const response = await fetch(
        `${API_URL}/meal-plans/user/${userId}/day/${day}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to delete meal plans for day"
        );
      }
    } catch (error) {
      console.error("Error deleting meal plans for day:", error);
      throw error;
    }
  },
};

export const externalMealApi = {
  searchMeals: async (
    params: ExternalMealSearchParams
  ): Promise<ExternalMeal[]> => {
    try {
      const { query, mealType } = params;

      const APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
      const APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;

      if (!APP_ID || !APP_KEY) {
        console.error(
          "Edamam API credentials not found in environment variables"
        );
        return getMockRecipes(query, mealType);
      }

      const USER_ID = `user_${Math.floor(Math.random() * 1000000)}`;

      const baseUrl = "https://api.edamam.com/api/recipes/v2";

      const queryParams = new URLSearchParams({
        type: "public",
        app_id: APP_ID,
        app_key: APP_KEY,
        q: query,
      });

      if (mealType) {
        queryParams.append("mealType", mealType);
      }

      const response = await fetch(`${baseUrl}?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Edamam-Account-User": USER_ID,
        },
      });

      if (!response.ok) {
        console.error(
          "Edamam API error:",
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("Error response:", errorText);

        if (response.status === 401) {
          console.warn("Authentication error with Edamam API, using mock data");
          return getMockRecipes(query, mealType);
        }

        throw new Error(`Failed to search recipes: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.hits || data.hits.length === 0) {
        return [];
      }

      return data.hits.map((hit: any) => {
        const recipe = hit.recipe;

        const id =
          recipe.uri.split("#recipe_")[1] ||
          `ext-${Math.random().toString(36).substring(2, 10)}`;

        const calories = Math.round(
          (recipe.calories || 0) / (recipe.yield || 1)
        );
        const protein = Math.round(
          (recipe.totalNutrients?.PROCNT?.quantity || 0) / (recipe.yield || 1)
        );
        const fat = Math.round(
          (recipe.totalNutrients?.FAT?.quantity || 0) / (recipe.yield || 1)
        );
        const carbs = Math.round(
          (recipe.totalNutrients?.CHOCDF?.quantity || 0) / (recipe.yield || 1)
        );

        return {
          id: id,
          label: recipe.label,
          name: recipe.label,
          description: recipe.cuisineType?.join(", ") || "",
          calories: calories,
          protein: protein,
          fat: fat,
          carbs: carbs,
          source: recipe.source || "Edamam",
          url: recipe.url || "",
          source_url: recipe.url || "",
          servings: recipe.yield || 1,
          ingredients: recipe.ingredientLines || [],
          nutrients: {
            protein: protein,
            fat: fat,
            carbs: carbs,
          },
          cooking_time: recipe.totalTime > 0 ? recipe.totalTime : 30,
        };
      });
    } catch (error) {
      console.error("Error searching external meals:", error);
      return getMockRecipes(params.query, params.mealType);
    }
  },
  convertToAppMeal: (
    externalMeal: ExternalMeal,
    userId: number
  ): Omit<Meal, "id" | "created_at"> => {
    const now = new Date();
    const currentHour = now.getHours();

    let mealTime = "12:00:00";
    if (currentHour < 10) {
      mealTime = "08:00:00";
    } else if (currentHour < 15) {
      mealTime = "12:00:00";
    } else if (currentHour < 20) {
      mealTime = "18:00:00";
    } else {
      mealTime = "19:30:00";
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    if (!timeRegex.test(mealTime)) {
      console.warn(
        "Invalid time format in convertToAppMeal:",
        mealTime,
        "using default 12:00:00"
      );
      mealTime = "12:00:00";
    }

    return {
      user_id: userId,
      name: externalMeal.label || externalMeal.name || "Unnamed Recipe",
      calories: externalMeal.calories,
      protein: externalMeal.protein || externalMeal.nutrients?.protein || 0,
      carbs: externalMeal.carbs || externalMeal.nutrients?.carbs || 0,
      fat: externalMeal.fat || externalMeal.nutrients?.fat || 0,
      meal_date: now.toISOString().split("T")[0],
      meal_time: mealTime,
    };
  },
};

function getMockRecipes(query: string, mealType: string): ExternalMeal[] {
  const count = Math.floor(Math.random() * 3) + 3;
  const mockRecipes: ExternalMeal[] = [];

  const mealTypeNames = {
    breakfast: ["Breakfast", "Morning", "Early", "Rise & Shine"],
    lunch: ["Lunch", "Midday", "Noon", "Afternoon"],
    dinner: ["Dinner", "Evening", "Supper", "Night"],
    snack: ["Snack", "Quick", "Bite", "Light"],
  };

  const prefix =
    mealTypeNames[mealType as keyof typeof mealTypeNames]?.[
      Math.floor(Math.random() * 4)
    ] || "";

  for (let i = 0; i < count; i++) {
    const calories = Math.floor(Math.random() * 500) + 200;
    const protein = Math.floor(Math.random() * 30) + 5;
    const fat = Math.floor(Math.random() * 20) + 3;
    const carbs = Math.floor(Math.random() * 50) + 10;

    mockRecipes.push({
      id: `mock-${Date.now()}-${i}`,
      label: `${prefix} ${
        query.charAt(0).toUpperCase() + query.slice(1)
      } Recipe ${i + 1}`,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      source: "Mock Recipe Database",
      url: "#",
    });
  }

  return mockRecipes;
}
