'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaBullseye, FaWeight, FaHeartbeat, FaUtensils, FaRunning, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './page.module.scss';
import { useAuth } from '../../context/AuthContext';
import { goalApi, Goal } from '../../services/api';
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
    title: '',
    description: '',
    target_value: '',
    current_value: '',
    unit: '',
    category: 'weight',
    start_date: new Date().toISOString().split('T')[0],
    target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
      
      // Prepare form data with proper type conversions
      const goalData = {
        title: formData.title,
        description: formData.description,
        target_value: formData.target_value ? parseFloat(formData.target_value) : undefined,
        current_value: formData.current_value ? parseFloat(formData.current_value) : undefined,
        unit: formData.unit,
        category: formData.category,
        start_date: formData.start_date,
        target_date: formData.target_date,
        status: 'in_progress' as const,
        user_id: user.id
      };
      
      if (isEditing && editingGoal) {
        await goalApi.updateGoal(editingGoal.id, goalData);
      } else {
        await goalApi.createGoal(goalData);
      }
      
      // Reset form and refresh data
      setFormData({
        title: '',
        description: '',
        target_value: '',
        current_value: '',
        unit: '',
        category: 'weight',
        start_date: new Date().toISOString().split('T')[0],
        target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setIsEditing(false);
      setEditingGoal(null);
      setShowForm(false);
      fetchGoals();
    } catch (err) {
      console.error('Failed to save goal:', err);
      setError('Failed to save goal. Please try again.');
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
      await goalApi.updateGoal(goalId, { status });
      fetchGoals();
    } catch (err) {
      console.error('Error updating goal status:', err);
      setError('Failed to update goal status');
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setFormData({
      title: goal.title,
      description: goal.description || '',
      target_value: goal.target_value ? goal.target_value.toString() : '',
      current_value: goal.current_value ? goal.current_value.toString() : '',
      unit: goal.unit || '',
      category: goal.category,
      start_date: goal.start_date,
      target_date: goal.target_date,
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
          <label htmlFor="title">Goal Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="e.g., Lose 10 pounds"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your goal in detail"
            rows={3}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="current_value">Current Value</label>
            <input
              type="number"
              id="current_value"
              name="current_value"
              value={formData.current_value}
              onChange={handleInputChange}
              placeholder="e.g., 170"
              step="0.01"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="target_value">Target Value</label>
            <input
              type="number"
              id="target_value"
              name="target_value"
              value={formData.target_value}
              onChange={handleInputChange}
              placeholder="e.g., 160"
              step="0.01"
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
              placeholder="e.g., lbs, kg, steps"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Category *</label>
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

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="start_date">Start Date *</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="target_date">Target Date *</label>
            <input
              type="date"
              id="target_date"
              name="target_date"
              value={formData.target_date}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.cancelButton} onClick={() => {
            setShowForm(false);
            setIsEditing(false);
            setEditingGoal(null);
            setFormData({
              title: '',
              description: '',
              target_value: '',
              current_value: '',
              unit: '',
              category: 'weight',
              start_date: new Date().toISOString().split('T')[0],
              target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            });
          }}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            {isEditing ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
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
              {displayedGoals.map((goal) => (
                <div key={goal.id} className={`${styles.goalCard} ${styles[goal.status]}`}>
                  <div className={styles.goalHeader}>
                    <div className={styles.goalCategoryIcon}>
                      {categoryIcons[goal.category] || <FaBullseye />}
                    </div>
                    <div className={styles.goalCategory}>{goal.category}</div>
                    <div className={styles.goalStatus}>
                      {formatStatus(goal.status)}
                    </div>
                  </div>
                  <h3 className={styles.goalTitle}>{goal.title}</h3>
                  {goal.description && <p className={styles.goalDescription}>{goal.description}</p>}
                  
                  {goal.target_value && goal.current_value && (
                    <div className={styles.goalProgress}>
                      <ProgressBar 
                        currentValue={goal.current_value}
                        maxValue={goal.target_value}
                        unit={goal.unit}
                        variant={
                          goal.status === 'completed' 
                            ? 'success' 
                            : goal.status === 'failed' 
                              ? 'danger' 
                              : undefined
                        }
                      />
                    </div>
                  )}
                  
                  <div className={styles.goalDates}>
                    <div className={styles.goalDate}>
                      <span>Start:</span> {new Date(goal.start_date).toLocaleDateString()}
                    </div>
                    <div className={styles.goalDate}>
                      <span>Target:</span> {new Date(goal.target_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className={styles.goalActions}>
                    {goal.status === 'in_progress' && (
                      <>
                        <button 
                          className={styles.completeButton}
                          onClick={() => handleUpdateGoalStatus(goal.id, 'completed')}
                        >
                          Mark Complete
                        </button>
                        <button 
                          className={styles.failButton}
                          onClick={() => handleUpdateGoalStatus(goal.id, 'failed')}
                        >
                          Mark Failed
                        </button>
                      </>
                    )}
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditGoal(goal)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
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