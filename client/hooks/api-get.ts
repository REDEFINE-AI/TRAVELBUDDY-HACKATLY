
import { useState, useEffect } from 'react';
import axios from 'axios';

type UseApiGetReturn<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

function useApiGet<T>(url: string): UseApiGetReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<T>(url);
        setData(response.data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, loading };
}

export default useApiGet;
