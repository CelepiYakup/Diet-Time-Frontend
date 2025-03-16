'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';
import { useAuth } from '../../../context/AuthContext';
import { mealApi, Meal, MealInput } from '../../../services/api';

interface MealFormData {
  name: string;
  date: string;
  time: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export default function EditMeal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<MealFormData>({
    name: '',
    date: '',
    time: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchMeal = async () => {
      try {
        setIsLoading(true);
        const mealId = parseInt(params.id);
        
        if (isNaN(mealId)) {
          setError('Invalid meal ID');
          return;
        }
        
        const fetchedMeal = await mealApi.getMealById(mealId);
        setMeal(fetchedMeal);
        
        // Set form data
        setFormData({
          name: fetchedMeal.name,
          date: fetchedMeal.meal_date,
          time: fetchedMeal.meal_time,
          calories: fetchedMeal.calories.toString(),
          protein: fetchedMeal.protein.toString(),
          carbs: fetchedMeal.carbs.toString(),
          fat: fetchedMeal.fat.toString(),
        });
      } catch (err) {
        console.error('Error fetching meal:', err);
        setError('Failed to load meal. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeal();
  }, [isAuthenticated, router, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      // Validate form
      if (!formData.name || !formData.date || !formData.time || !formData.calories) {
        setError('Name, date, time, and calories are required');
        setIsSaving(false);
        return;
      }

      if (!meal) {
        setError('Meal not found');
        setIsSaving(false);
        return;
      }

      // Create meal data for API
      const mealData: Partial<MealInput> = {
        name: formData.name,
        calories: parseInt(formData.calories),
        meal_date: formData.date,
        meal_time: formData.time,
      };

      // Add optional fields if provided
      if (formData.protein) {
        mealData.protein = parseInt(formData.protein);
      }
      if (formData.carbs) {
        mealData.carbs = parseInt(formData.carbs);
      }
      if (formData.fat) {
        mealData.fat = parseInt(formData.fat);
      }

      // Update meal
      await mealApi.updateMeal(meal.id, mealData);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  if (isLoading) {
    return <div className={styles.loadingState}>Loading meal data...</div>;
  }

  if (error && !meal) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.editMealContainer}>
      <h1 className={styles.title}>Edit Meal</h1>
      
      {error && <p className={styles.error}>{error}</p>}
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Meal Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Breakfast, Lunch, Dinner, Snack"
            required
          />
        </div>
        
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.label}>
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className={styles.input}
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="time" className={styles.label}>
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              className={styles.input}
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="calories" className={styles.label}>
            Calories
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            className={styles.input}
            value={formData.calories}
            onChange={handleChange}
            placeholder="e.g., 500"
            required
          />
        </div>
        
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="protein" className={styles.label}>
              Protein (g)
            </label>
            <input
              type="number"
              id="protein"
              name="protein"
              className={styles.input}
              value={formData.protein}
              onChange={handleChange}
              placeholder="e.g., 20"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="carbs" className={styles.label}>
              Carbs (g)
            </label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              className={styles.input}
              value={formData.carbs}
              onChange={handleChange}
              placeholder="e.g., 50"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="fat" className={styles.label}>
              Fat (g)
            </label>
            <input
              type="number"
              id="fat"
              name="fat"
              className={styles.input}
              value={formData.fat}
              onChange={handleChange}
              placeholder="e.g., 15"
            />
          </div>
        </div>
        
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={`btn btn-primary ${styles.submitButton}`}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/dashboard" className={`btn btn-secondary ${styles.cancelButton}`}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
} 