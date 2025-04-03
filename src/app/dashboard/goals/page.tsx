'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaBullseye, FaWeight, FaHeartbeat, FaUtensils, FaRunning, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './page.module.scss';
import { useAuth } from '../../context/AuthContext';
import { goalApi, Goal, GoalInput } from '../../services/api';
import ProgressBar from '@/app/components/Progress/ProgressBar';
import LoadingIndicator from '@/app/components/LoadingIndicator';

export default function GoalSettingDashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  const [formData, setFormData] = useState({
    category: 'weight',
    target_value: '',
    current_value: '',
    unit: '',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const fetchGoals = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await goalApi.getUserGoals(user.id);
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      setError('Failed to load goals. Please try again later.');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchGoals();
  }, [isAuthenticated, router, user, fetchGoals]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!formData.category || !formData.target_value || !formData.current_value || !formData.unit || !formData.deadline) {
        setError('All fields are required');
        return;
      }

      // Validate numeric fields
      if (isNaN(parseFloat(formData.target_value))) {
        setError('Target value must be a valid number');
        return;
      }

      if (isNaN(parseFloat(formData.current_value))) {
        setError('Current value must be a valid number');
        return;
      }

      // Prepare form data with proper type conversions
      const goalData: GoalInput = {
        user_id: user.id,
        category: formData.category,
        target_value: parseFloat(formData.target_value),
        current_value: parseFloat(formData.current_value),
        unit: formData.unit.trim(),
        deadline: formData.deadline
      };
      
      if (isEditing && editingGoal) {
        await goalApi.updateGoal(editingGoal.id, goalData);
      } else {
        await goalApi.createGoal(goalData);
      }
      
      // Reset form and refresh data
      setFormData({
        category: 'weight',
        target_value: '',
        current_value: '',
        unit: '',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setIsEditing(false);
      setEditingGoal(null);
      setShowForm(false);
      await fetchGoals();
    } catch (err) {
      console.error('Failed to save goal:', err);
      setError(err instanceof Error ? err.message : 'Failed to save goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    if (!user) return;

    try {
      setLoading(true);
      await goalApi.deleteGoal(goalId);
      // Refresh goals list after deletion
      fetchGoals();
    } catch (err) {
      console.error('Failed to delete goal:', err);
      setError('Failed to delete goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoalStatus = async (goalId: number, status: 'in_progress' | 'completed' | 'failed') => {
    try {
      await goalApi.updateGoal(goalId, {});
      fetchGoals();
    } catch (err) {
      console.error('Error updating goal status:', err);
      setError('Failed to update goal status');
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setFormData({
      category: goal.category,
      target_value: goal.target_value.toString(),
      current_value: goal.current_value.toString(),
      unit: goal.unit,
      deadline: goal.deadline,
    });
    setIsEditing(true);
    setEditingGoal(goal);
    setShowForm(true);
  };

  // Compute filtered goals based on active category
  const displayedGoals = activeCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === activeCategory);

  const categoryIcons: Record<string, React.ReactNode> = {
    weight: <FaWeight />,
    nutrition: <FaUtensils />,
    fitness: <FaRunning />,
    health: <FaHeartbeat />,
    other: <FaBullseye />
  };

  const formatStatus = (status: string): string => {
    if (status === 'in_progress') return 'in progress';
    return status.replace('_', ' ');
  };

  const renderGoalForm = () => (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>{isEditing ? 'Edit Goal' : 'Create New Goal'}</h2>
      <form onSubmit={handleSubmit} className={styles.goalForm}>
        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="weight">Weight</option>
            <option value="nutrition">Nutrition</option>
            <option value="fitness">Fitness</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="target_value">Target Value</label>
          <input
            type="number"
            id="target_value"
            name="target_value"
            value={formData.target_value}
            onChange={handleInputChange}
            required
            step="0.1"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="current_value">Current Value</label>
          <input
            type="number"
            id="current_value"
            name="current_value"
            value={formData.current_value}
            onChange={handleInputChange}
            required
            step="0.1"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="unit">Unit</label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            required
            placeholder="e.g., kg, lbs, minutes"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={() => setShowForm(false)} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            {isEditing ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderGoalCard = (goal: Goal) => (
    <div key={goal.id} className={styles.goalCard}>
      <div className={styles.goalHeader}>
        <div className={styles.goalCategory}>
          {categoryIcons[goal.category]}
          <span className={styles.categoryName}>{goal.category}</span>
        </div>
        <div className={styles.goalActions}>
          <button onClick={() => handleEditGoal(goal)} className={styles.editButton}>
            <FaEdit />
          </button>
          <button onClick={() => handleDeleteGoal(goal.id)} className={styles.deleteButton}>
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className={styles.goalProgress}>
        <ProgressBar
          currentValue={goal.current_value}
          maxValue={goal.target_value}
          unit={goal.unit}
        />
      </div>
      
      <div className={styles.goalDates}>
        <div className={styles.dateItem}>
          <span className={styles.dateLabel}>Deadline:</span>
          <span className={styles.dateValue}>{new Date(goal.deadline).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.goalSettingContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Goal Setting</h1>
        <p className={styles.dashboardDescription}>
          Set and track your health and fitness goals to stay motivated
        </p>
      </div>

      {!isAuthenticated ? (
        <div className={styles.authMessage}>
          <h2>Please log in to view your goals</h2>
          <p>You need to be logged in to access your personal goal tracking dashboard.</p>
        </div>
      ) : loading && goals.length === 0 ? (
        <LoadingIndicator text="Loading goals..." />
      ) : error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <>
          <div className={styles.categoryFilter}>
            <button 
              className={`${styles.categoryButton} ${activeCategory === 'all' ? styles.active : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Goals
            </button>
            <button 
              className={`${styles.categoryButton} ${activeCategory === 'weight' ? styles.active : ''}`}
              onClick={() => setActiveCategory('weight')}
            >
              <FaWeight /> Weight
            </button>
            <button 
              className={`${styles.categoryButton} ${activeCategory === 'nutrition' ? styles.active : ''}`}
              onClick={() => setActiveCategory('nutrition')}
            >
              <FaUtensils /> Nutrition
            </button>
            <button 
              className={`${styles.categoryButton} ${activeCategory === 'fitness' ? styles.active : ''}`}
              onClick={() => setActiveCategory('fitness')}
            >
              <FaRunning /> Fitness
            </button>
            <button 
              className={`${styles.categoryButton} ${activeCategory === 'health' ? styles.active : ''}`}
              onClick={() => setActiveCategory('health')}
            >
              <FaHeartbeat /> Health
            </button>
            <button 
              className={`${styles.categoryButton} ${activeCategory === 'other' ? styles.active : ''}`}
              onClick={() => setActiveCategory('other')}
            >
              <FaBullseye /> Other
            </button>
          </div>
          
          <div className={styles.goalsHeader}>
            <h2 className={styles.sectionTitle}>Your Goals</h2>
            <button className={styles.addButton} onClick={() => setShowForm(true)}>
              <FaPlus /> Add New Goal
            </button>
          </div>
          
          {showForm && renderGoalForm()}
          
          {displayedGoals.length > 0 ? (
            <div className={styles.goalsList}>
              {displayedGoals.map((goal) => renderGoalCard(goal))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FaBullseye className={styles.emptyIcon} />
              <h3>No Goals Found</h3>
              <p>You haven&apos;t set any goals yet. Click the &quot;Add New Goal&quot; button to get started.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 