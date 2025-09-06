import { useCallback, useRef, useState } from 'react';

export const useRateLimit = (maxAttempts = 5, timeWindow = 60000) => {
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const lastAttemptTime = useRef(0);
  const resetTimeoutRef = useRef(null);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();

    // Reset attempts nếu đã qua time window
    if (now - lastAttemptTime.current > timeWindow) {
      setAttempts(0);
      setIsBlocked(false);
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    }

    // Kiểm tra xem có bị block không
    if (isBlocked) {
      return false;
    }

    // Tăng số lần thử
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    lastAttemptTime.current = now;

    // Block nếu vượt quá giới hạn
    if (newAttempts >= maxAttempts) {
      setIsBlocked(true);

      // Tự động reset sau time window
      resetTimeoutRef.current = setTimeout(() => {
        setAttempts(0);
        setIsBlocked(false);
        resetTimeoutRef.current = null;
      }, timeWindow);

      return false;
    }

    return true;
  }, [attempts, isBlocked, maxAttempts, timeWindow]);

  const resetRateLimit = useCallback(() => {
    setAttempts(0);
    setIsBlocked(false);
    lastAttemptTime.current = 0;
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  }, []);

  const getRemainingTime = useCallback(() => {
    if (!isBlocked) return 0;
    const elapsed = Date.now() - lastAttemptTime.current;
    return Math.max(0, timeWindow - elapsed);
  }, [isBlocked, timeWindow]);

  return {
    checkRateLimit,
    resetRateLimit,
    getRemainingTime,
    attempts,
    isBlocked,
    remainingAttempts: Math.max(0, maxAttempts - attempts),
  };
};
