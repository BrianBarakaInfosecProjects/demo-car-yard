'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavigationButtons() {
  const router = useRouter();
  const pathname = usePathname();

  const goBack = () => {
    router.back();
  };

  const goForward = () => {
    router.forward();
  };

  // Check if we can go back/forward
  useEffect(() => {
    const handlePopState = () => {
      // This will be called when back/forward is used
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Don't show on login or admin pages
  if (pathname?.includes('/auth/') || pathname?.includes('/admin/')) {
    return null;
  }

  return (
    <>
      <button
        onClick={goBack}
        className="back-nav-btn back-nav-btn-prev"
        title="Go Back"
        aria-label="Go Back"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goForward}
        className="back-nav-btn back-nav-btn-next"
        title="Go Forward"
        aria-label="Go Forward"
      >
        <ChevronRight size={20} />
      </button>
    </>
  );
}
