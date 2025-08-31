import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

export const useShiftsPagination = (filters) => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0
  });

  const fetchShifts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      // Create query params
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      const startTime = performance.now();
      const response = await fetch(
        `${API_URL}/api/shifts/all?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch shifts');

      const data = await response.json();
      const endTime = performance.now();
      console.log(`Fetch shifts took ${endTime - startTime}ms`);

      setShifts(prev => 
        pagination.page === 1 
          ? data.shifts 
          : [...prev, ...data.shifts]
      );
      setPagination(prev => ({
        ...prev,
        total: data.total
      }));
      setHasMore(data.shifts.length === pagination.limit);
    } catch (error) {
      setError(error.message);
      toast.error('Không thể tải danh sách ca làm việc');
      console.error('Error fetching shifts:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPagination(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    setShifts([]);
  }, []);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  return {
    shifts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    total: pagination.total
  };
}; 