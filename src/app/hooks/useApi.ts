import { useState, useCallback } from 'react';
import { getAuthToken } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: object;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  execute: (url: string, options?: ApiOptions) => Promise<T | null>;
};

export function useApi<T>(): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const execute = useCallback(
    async (url: string, options: ApiOptions = {}): Promise<T | null> => {
      const {
        method = 'GET',
        body,
        headers = {},
        requiresAuth = true
      } = options;

      try {
        setLoading(true);
        setError(null);


        if (requiresAuth) {
          const token = getAuthToken();
          if (!token) {

            toast.error('Please log in to continue');
            localStorage.removeItem('user');
            router.push('/login');
            throw new Error('Authentication required');
          }
          headers.Authorization = `Bearer ${token}`;
        }


        const fetchOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          }
        };

        // Add body for non-GET requests
        if (body && method !== 'GET') {
          fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);


        if (response.status === 401) {

          localStorage.removeItem('user');
          toast.error('Your session has expired. Please log in again.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#FF5252',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#FF5252',
            },
          });
          router.push('/login');
          throw new Error('Unauthorized: Token has expired');
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'An error occurred');
        }

    
        const responseData = await response.json();
        setData(responseData);
        return responseData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setError(new Error(errorMessage));
        console.error('API Error:', error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return { data, error, loading, execute };
}

export default useApi; 