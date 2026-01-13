'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ArrowLeft } from 'lucide-react';

export default function FeaturedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to vehicles page - in a real app this could filter by featured
    router.push('/admin/vehicles');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Featured Vehicles</h2>
        <p className="text-gray-600">Redirecting to vehicle management...</p>
      </div>
    </div>
  );
}
