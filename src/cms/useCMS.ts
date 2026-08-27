import { useState, useEffect } from 'react';

/**
 * Custom React hook for consuming CMS content with instant fallback
 *
 * Guarantees:
 * - Synchronous initial render using static fallback (0 layout shift, instant first paint)
 * - If explicit initialData / props are provided (e.g. tests or SSR), respects them immediately
 * - Updates smoothly when live CMS API responds
 * - Gracefully contains network errors without throwing or blanking the screen
 */
export function useCMSPage<T>(
  queryFn: () => Promise<T>,
  fallback: T,
  initialData?: T
): T {
  const [data, setData] = useState<T>(initialData || fallback);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      return;
    }

    let isMounted = true;
    queryFn()
      .then((result) => {
        if (isMounted && result) {
          setData(result);
        }
      })
      .catch((err) => {
        console.warn('[useCMSPage] Error fetching live content, retaining fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [queryFn, initialData]);

  return data;
}
