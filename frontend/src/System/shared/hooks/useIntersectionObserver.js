import { useCallback, useEffect, useRef, useState } from 'react';

const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);

  const { threshold = 0.1, rootMargin = '50px', root = null, triggerOnce = true } = options;

  const callback = useCallback(
    entries => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (triggerOnce) {
          setHasIntersected(true);
        }
      } else if (!triggerOnce) {
        setIsIntersecting(false);
      }
    },
    [triggerOnce]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(callback, {
      threshold,
      rootMargin,
      root,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [callback, threshold, rootMargin, root]);

  return [elementRef, isIntersecting, hasIntersected];
};

export default useIntersectionObserver;
