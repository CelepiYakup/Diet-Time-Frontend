'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';
import { userApi, LoginInput } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState<LoginInput>({
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
      // Validate form
      if (!formData.email || !formData.password) {
        showError('All fields are required');
        setIsLoading(false);
        return;
      }

      // Login user
      const response = await userApi.loginUser(formData);
      
      // Set user in context
      login(response.user);
      
      // Show success message
      showSuccess('Login successful!');
      
      // Redirect to dashboard
      router.push('/dashboard');
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
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <span className={styles.logoText}>Diet Time</span>
            </div>
          </div>
          
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue to Diet Time</p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
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
              <div className={styles.labelRow}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <Link href="/forgot-password" className={styles.forgotPassword}>
                  Forgot password?
                </Link>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loadingSpinner}></span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className={styles.footer}>
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/register" className={styles.link}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 