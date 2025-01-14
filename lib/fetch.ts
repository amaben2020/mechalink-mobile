import { useSignupStore } from '@/store/auth/get-user';
import { useState, useEffect, useCallback } from 'react';

export const fetchAPI = async (url: string, options?: RequestInit) => {
  // use getState when you wanna opt out of hook
  const { token } = useSignupStore.getState();
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...options,
    });
    if (!response.ok) {
      new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();

    return res;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(
        `${process.env.EXPO_PUBLIC_BACKEND_API + url}`,
        options
      );
      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
