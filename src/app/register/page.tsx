'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';
import { userApi, UserInput } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState<UserInput>({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      if (!formData.username || !formData.email || !formData.password) {
        showError('All fields are required');
        setIsLoading(false);
        return;
      }


      await userApi.registerUser(formData);
      

      showSuccess('Account created successfully! Please log in.');

      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <div className={styles.logoContainer}>
          </div>
          
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join Diet Time to track your nutrition</p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={styles.input}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>
              <p className={styles.passwordHint}>
                Password should be at least 8 characters
              </p>
            </div>
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loadingSpinner}></span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className={styles.footer}>
            <p>
              Already have an account?{' '}
              <Link href="/login" className={styles.link}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 