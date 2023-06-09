import { useEffect, useState } from 'react';

export default function useWindowSize() {
  const [size, setSize] = useState<{ w: number; h: number }>(initialValue);

  useEffect(() => {
    const handler = (e: UIEvent) => {
      const target = e.target as typeof window;
      const w = target.innerWidth,
        h = target.innerHeight;
      setSize({ w, h });
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return {
    windowX: size.w,
    windowY: size.h,
  };
}

const initialValue = {
  w: window.innerWidth,
  h: window.innerHeight,
};
