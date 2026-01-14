'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface ScrollPosition {
  [key: string]: number;
}

const SCROLL_POSITION_KEY = 'trustauto-scroll-positions';

export function useScrollPosition() {
  const pathname = usePathname();
  const scrollPositions = useRef<ScrollPosition>({});

  // Save scroll position before navigation
  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositions.current[pathname] = window.scrollY;
      sessionStorage.setItem(SCROLL_POSITION_KEY, JSON.stringify(scrollPositions.current));
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    return () => window.removeEventListener('beforeunload', saveScrollPosition);
  }, [pathname]);

  // Restore scroll position on mount
  useEffect(() => {
    const savedPositions = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (savedPositions) {
      const positions = JSON.parse(savedPositions);
      if (positions[pathname] !== undefined) {
        setTimeout(() => {
          window.scrollTo({
            top: positions[pathname],
            behavior: 'smooth',
          });
        }, 100);
      }
    }
  }, [pathname]);
}

export default function ScrollPositionManager() {
  useScrollPosition();
  return null;
}
