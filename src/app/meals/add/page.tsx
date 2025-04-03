'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';
import { useAuth } from '../../context/AuthContext';
import { mealApi, MealInput } from '../../services/api';

interface MealFormData {
  name: string;
  date: string;
  time: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export default function AddMeal() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState<MealFormData>({
    name: '',
    date: new Date().toISOString().split('T')[0], 
    time: new Date().toTimeString().slice(0, 5), 
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {

    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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
    setIsLoading(true);

    try {

      if (!formData.name || !formData.date || !formData.time || !formData.calories) {
        setError('Name, date, time, and calories are required');
        setIsLoading(false);
        return;
      }

      if (!user) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }


      const mealData: MealInput = {
        name: formData.name,
        calories: parseInt(formData.calories),
        meal_date: formData.date,
        meal_time: formData.time,
      };

 
      if (formData.protein) {
        mealData.protein = parseInt(formData.protein);
      }
      if (formData.carbs) {
        mealData.carbs = parseInt(formData.carbs);
      }
      if (formData.fat) {
        mealData.fat = parseInt(formData.fat);
      }


      await mealApi.createMeal(user.id, mealData);
      

      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className={styles.addMealContainer}>
      <h1 className={styles.title}>Add a Meal</h1>
      
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
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Meal'}
          </button>
          <Link href="/dashboard" className={`btn btn-secondary ${styles.cancelButton}`}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
} 