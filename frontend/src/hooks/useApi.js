import { useCallback, useState } from 'react';

const useApi = (apiMethod, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async params => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiMethod(params);
        setData(response.data);
        return response.data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiMethod]
  );

  const reset = () => {
    setData(null);
    setError(null);
  };

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useApi;
