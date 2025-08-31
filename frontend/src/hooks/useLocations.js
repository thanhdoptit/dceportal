import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { fetchAllLocations, fetchActiveLocations, searchLocations } from '../services/locationService';

export const useLocations = (options = {}) => {
  const {
    autoFetch = true,        // Tự động fetch khi mount
    activeOnly = false,      // Chỉ lấy locations active
    searchTerm = '',         // Từ khóa tìm kiếm
    onError = null,          // Callback xử lý lỗi
    onSuccess = null         // Callback xử lý thành công
  } = options;

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Sử dụng ref để tránh re-render không cần thiết
  const optionsRef = useRef({ autoFetch, activeOnly, searchTerm, onError, onSuccess });
  optionsRef.current = { autoFetch, activeOnly, searchTerm, onError, onSuccess };
  
  // Ref để track đã fetch chưa
  const hasFetchedRef = useRef(false);

  // Hàm fetch locations
  const fetchLocations = useCallback(async (fetchOptions = {}) => {
    const {
      forceRefresh = false,
      customSearchTerm = optionsRef.current.searchTerm,
      customActiveOnly = optionsRef.current.activeOnly
    } = fetchOptions;

    // Nếu đang loading và không force refresh thì bỏ qua
    if (loading && !forceRefresh) return;
    
    // Nếu đã fetch và không force refresh thì bỏ qua
    if (hasFetchedRef.current && !forceRefresh) return;

    try {
      setLoading(true);
      setError(null);

      let data;
      
      if (customSearchTerm && customSearchTerm.trim()) {
        // Tìm kiếm locations
        data = await searchLocations(customSearchTerm);
      } else if (customActiveOnly) {
        // Chỉ lấy locations active
        data = await fetchActiveLocations();
      } else {
        // Lấy tất cả locations
        data = await fetchAllLocations();
      }

      setLocations(data);
      hasFetchedRef.current = true; // Đánh dấu đã fetch
      
      // Gọi callback thành công nếu có
      if (optionsRef.current.onSuccess) {
        optionsRef.current.onSuccess(data);
      }

      return data;
    } catch (err) {
      const errorMessage = err.message || 'Không thể tải danh sách địa điểm';
      setError(errorMessage);
      
      // Hiển thị thông báo lỗi
      message.error(errorMessage);
      
      // Gọi callback lỗi nếu có
      if (optionsRef.current.onError) {
        optionsRef.current.onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Bỏ tất cả dependencies để tránh re-create

  // Hàm refresh locations
  const refreshLocations = useCallback(() => {
    return fetchLocations({ forceRefresh: true });
  }, [fetchLocations]);

  // Hàm tìm kiếm locations
  const searchLocationsByTerm = useCallback((term) => {
    return fetchLocations({ 
      forceRefresh: true, 
      customSearchTerm: term 
    });
  }, [fetchLocations]);

  // Hàm lấy location theo ID
  const getLocationById = useCallback((locationId) => {
    return locations.find(loc => loc.id === locationId);
  }, [locations]);

  // Hàm lấy location theo name
  const getLocationByName = useCallback((locationName) => {
    return locations.find(loc => loc.name === locationName);
  }, [locations]);

  // Hàm lọc locations theo trạng thái active
  const getActiveLocations = useCallback(() => {
    return locations.filter(loc => loc.isActive);
  }, [locations]);

  // Hàm lọc locations theo trạng thái inactive
  const getInactiveLocations = useCallback(() => {
    return locations.filter(loc => !loc.isActive);
  }, [locations]);

  // Chỉ fetch một lần khi mount và khi options thay đổi
  useEffect(() => {
    if (optionsRef.current.autoFetch && !hasFetchedRef.current) {
      fetchLocations();
    }
    
    // Cleanup khi unmount
    return () => {
      hasFetchedRef.current = false;
    };
  }, [autoFetch, activeOnly, searchTerm]); // Dependency các options quan trọng

  return {
    // State
    locations,
    loading,
    error,
    
    // Actions
    fetchLocations,
    refreshLocations,
    searchLocationsByTerm,
    
    // Utilities
    getLocationById,
    getLocationByName,
    getActiveLocations,
    getInactiveLocations,
    
    // Computed values
    totalLocations: locations.length,
    activeLocationsCount: locations.filter(loc => loc.isActive).length,
    inactiveLocationsCount: locations.filter(loc => !loc.isActive).length
  };
}; 