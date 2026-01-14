'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterState {
  make?: string;
  bodyType?: string;
  fuelType?: string;
  priceRange?: string;
  model?: string;
  location?: string;
  yearFrom?: string;
  yearTo?: string;
}

export function useURLFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({});

  useEffect(() => {
    // Read filters from URL
    const newFilters: FilterState = {};
    
    if (searchParams.get('make')) {
      newFilters.make = searchParams.get('make')!;
    }
    if (searchParams.get('model')) {
      newFilters.model = searchParams.get('model')!;
    }
    if (searchParams.get('bodyType')) {
      newFilters.bodyType = searchParams.get('bodyType')!;
    }
    if (searchParams.get('fuelType')) {
      newFilters.fuelType = searchParams.get('fuelType')!;
    }
    if (searchParams.get('priceRange')) {
      newFilters.priceRange = searchParams.get('priceRange')!;
    }
    if (searchParams.get('location')) {
      newFilters.location = searchParams.get('location')!;
    }
    if (searchParams.get('yearFrom')) {
      newFilters.yearFrom = searchParams.get('yearFrom')!;
    }
    if (searchParams.get('yearTo')) {
      newFilters.yearTo = searchParams.get('yearTo')!;
    }

    setFilters(newFilters);
  }, [searchParams]);

  const updateFilter = (key: keyof FilterState, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'all' && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const newUrl = `/inventory?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const clearFilters = () => {
    router.push('/inventory');
  };

  const updateMultipleFilters = (newFilters: Partial<FilterState>) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    const newUrl = queryString ? `/inventory?${queryString}` : '/inventory';
    router.push(newUrl, { scroll: false });
  };

  return {
    filters,
    updateFilter,
    updateMultipleFilters,
    clearFilters,
  };
}
