'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './page.module.scss';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from '../../components/LoadingIndicator';

// ... existing types ...

export default function MealDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<MealFormData>({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    meal_date: new Date().toISOString().split('T')[0],
    meal_time: '12:00'
  });
  const [editingMealId, setEditingMealId] = useState<number | null>(null);

  // Fetch meals data
  const fetchMeals = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/meals/user/${user.id}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching meals: ${response.status}`);
      }
      
      const data = await response.json();
      setMeals(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      setError('Failed to load meals. Please try again later.');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load meals on component mount
  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const method = editingMealId ? 'PUT' : 'POST';
      const url = editingMealId ? `/api/meals/${editingMealId}` : '/api/meals';
      
      // Prepare the meal data
      const mealData = {
        ...formData,
        user_id: user.id,
        calories: parseFloat(formData.calories),
        protein: formData.protein ? parseFloat(formData.protein) : null,
        carbs: formData.carbs ? parseFloat(formData.carbs) : null,
        fat: formData.fat ? parseFloat(formData.fat) : null
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mealData)
      });
      
      if (!response.ok) {
        throw new Error(`Error saving meal: ${response.status}`);
      }
      
      // Reset form and refresh data
      setFormData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        meal_date: new Date().toISOString().split('T')[0],
        meal_time: '12:00'
      });
      setEditingMealId(null);
      setShowForm(false);
      fetchMeals();
    } catch (error) {
      console.error('Failed to save meal:', error);
      setError('Failed to save meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle meal edit
  const handleEditMeal = (meal: Meal) => {
    setFormData({
      name: meal.name,
      calories: meal.calories.toString(),
      protein: meal.protein?.toString() || '',
      carbs: meal.carbs?.toString() || '',
      fat: meal.fat?.toString() || '',
      meal_date: meal.meal_date,
      meal_time: meal.meal_time
    });
    setEditingMealId(meal.id);
    setShowForm(true);
  };

  // Handle meal deletion
  const handleDeleteMeal = async (mealId: number) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/meals/${mealId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting meal: ${response.status}`);
      }
      
      // Refresh data after deletion
      fetchMeals();
    } catch (error) {
      console.error('Failed to delete meal:', error);
      setError('Failed to delete meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render meal form
  const renderMealForm = () => (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h2>{editingMealId ? 'Edit Meal' : 'Add New Meal'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={() => {
              setShowForm(false);
              setEditingMealId(null);
              setFormData({
                name: '',
                calories: '',
                protein: '',
                carbs: '',
                fat: '',
                meal_date: new Date().toISOString().split('T')[0],
                meal_time: '12:00'
              });
            }}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {editingMealId ? 'Update Meal' : 'Add Meal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.dashboardTitle}>Meal Tracking</h1>
        <p className={styles.dashboardDescription}>
          Track your meals and monitor your nutritional intake
        </p>
      </div>

      {!isAuthenticated ? (
        <div className={styles.authMessage}>
          <h2>Please log in to view your meals</h2>
          <p>You need to be logged in to access your personal meal tracking dashboard.</p>
        </div>
      ) : loading && meals.length === 0 ? (
        <LoadingIndicator text="Loading meals..." />
      ) : error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <>
          <div className={styles.controls}>
            <button 
              className={styles.addButton} 
              onClick={() => setShowForm(true)}
            >
              <FaPlus /> Add New Meal
            </button>
          </div>
          
          {meals.length > 0 ? (
            <div className={styles.mealsList}>
              {/* Meal list */}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3>No meals recorded yet</h3>
              <p>Start tracking by adding your first meal</p>
            </div>
          )}
          
          {showForm && renderMealForm()}
        </>
      )}
    </div>
  );
} 