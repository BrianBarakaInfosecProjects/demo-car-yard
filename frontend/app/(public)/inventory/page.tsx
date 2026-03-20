'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Vehicle } from '@/lib/types';
import { api } from '@/lib/api';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleModal from '@/components/vehicles/VehicleModal';
import Link from 'next/link';
import { useURLFilters } from '@/lib/useURLFilters';
import ScrollPositionManager from '@/components/ScrollPositionManager';
import NavigationButtons from '@/components/NavigationButtons';
import FindYourPerfectCar from '@/components/sections/FindYourPerfectCar';

function InventoryContent() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(9);
  const [sortBy, setSortBy] = useState('default');
  const { filters, updateFilter, clearFilters } = useURLFilters();

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (!loading && allVehicles.length > 0) {
      applyFilters();
    }
  }, [filters, allVehicles, loading]);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      const vehiclesData = response.vehicles || response.data || response || [];
      setVehicles(vehiclesData);
      setAllVehicles(vehiclesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const make = filters.make;
    const model = filters.model;
    const priceRange = filters.priceRange;
    const bodyType = filters.bodyType;
    const fuelType = filters.fuelType;
    const yearFrom = filters.yearFrom;
    const yearTo = filters.yearTo;
    const location = filters.location;

    let filtered = [...allVehicles];

    if (make && make !== 'all') {
      filtered = filtered.filter((v) =>
        v.make.toLowerCase() === make.toLowerCase()
      );
    }

    if (model && model !== 'all') {
      filtered = filtered.filter((v) =>
        v.model.toLowerCase() === model.toLowerCase()
      );
    }

    if (bodyType && bodyType !== 'all') {
      filtered = filtered.filter(
        (v) => v.bodyType.toLowerCase() === bodyType.toLowerCase()
      );
    }

    if (fuelType && fuelType !== 'all') {
      filtered = filtered.filter(
        (v) => v.fuelType.toLowerCase() === fuelType.toLowerCase()
      );
    }

    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-');
      if (max) {
        filtered = filtered.filter(
          (v) => v.priceKES >= parseInt(min) && v.priceKES <= parseInt(max)
        );
      } else if (priceRange === '12000000+') {
        filtered = filtered.filter((v) => v.priceKES > 12000000);
      }
    }

    if (yearFrom) {
      filtered = filtered.filter((v) => v.year >= parseInt(yearFrom));
    }

    if (yearTo) {
      filtered = filtered.filter((v) => v.year <= parseInt(yearTo));
    }

    if (location && location !== 'all') {
      filtered = filtered.filter((v) => v.location === location);
    }

    setVehicles(filtered);
    setCurrentPage(1);
  };

  const handleSort = (sortBy: string) => {
    let sorted = [...vehicles];

    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.priceKES - b.priceKES);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.priceKES - a.priceKES);
        break;
      case 'year-new':
        sorted.sort((a, b) => b.year - a.year);
        break;
      case 'year-old':
        sorted.sort((a, b) => a.year - b.year);
        break;
      case 'brand':
        sorted.sort((a, b) => a.make.localeCompare(b.make));
        break;
      default:
        sorted = [...allVehicles];
        applyFilters();
    }

    setVehicles(sorted);
    setSortBy(sortBy);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-container">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        {startPage > 1 && (
          <>
            <button onClick={() => paginate(1)} className="pagination-btn">
              1
            </button>
            {startPage > 2 && <span className="pagination-btn">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-btn">...</span>}
            <button onClick={() => paginate(totalPages)} className="pagination-btn">
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="flex items-center gap-3 text-text-secondary text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-bg-page min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollPositionManager />
      <NavigationButtons />
      <FindYourPerfectCar />
      <section id="inventory" className="bg-bg-page min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 pt-8">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-text-primary">Featured Vehicles</h2>
            <p className="text-text-secondary mt-4 text-base">
              Browse our hand-picked selection of quality used cars
            </p>
          </div>

          {/* Filter and Sort Bar */}
          <div className="bg-bg-card border border-border-subtle rounded-xl p-4 mb-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="text-text-secondary text-sm font-medium">
                <i className="fas fa-car me-2"></i>
                <span>
                  Showing {currentVehicles.length} of {vehicles.length} vehicles (Page {currentPage} of {totalPages})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-text-secondary text-xs font-semibold uppercase tracking-widest">Sort by:</label>
                <select
                  id="sortSelect"
                  className="bg-bg-card border border-border-subtle text-text-primary text-sm rounded-lg px-3 py-1.5 focus:border-accent focus:outline-none"
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="year-new">Year: Newest First</option>
                  <option value="year-old">Year: Oldest First</option>
                  <option value="brand">Brand: A to Z</option>
                </select>
                {(filters.make !== 'all' ||
                  filters.model !== 'all' ||
                  filters.priceRange !== 'all' ||
                  filters.bodyType !== 'all' ||
                  filters.fuelType !== 'all') && (
                  <button
                    id="clearFilters"
                    className="py-1.5 px-3.5 text-[13px] font-semibold rounded-lg border border-danger text-danger hover:bg-danger hover:text-white transition-colors"
                    onClick={handleClearFilters}
                  >
                    <i className="fas fa-times me-1"></i> Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="vehicleGrid">
            {currentVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onDetailsClick={setSelectedVehicle}
              />
            ))}
          </div>

          {currentVehicles.length === 0 && vehicles.length > 0 && currentPage > 1 && (
            <div className="text-text-secondary text-base text-center py-20">
              <h3>No vehicles on this page</h3>
              <button
                className="mt-4 bg-accent text-text-on-accent rounded-lg py-2 px-5 text-sm font-semibold hover:bg-accent-hover transition-colors"
                onClick={() => paginate(1)}
              >
                Go to First Page
              </button>
            </div>
          )}

          {vehicles.length === 0 && (
            <div className="text-text-secondary text-base text-center py-20">
              <h3>No vehicles found matching your criteria</h3>
              <button
                className="mt-4 bg-accent text-text-on-accent rounded-lg py-2 px-5 text-sm font-semibold hover:bg-accent-hover transition-colors"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}

          {vehicles.length > 0 && renderPageNumbers()}

          <div className="text-center mt-8">
            <Link href="/inventory" className="inline-flex items-center gap-2 bg-accent text-text-on-accent rounded-lg py-2 px-5 text-sm font-semibold hover:bg-accent-hover transition-colors">
              View All Vehicles <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      <VehicleModal
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        vehicle={selectedVehicle}
      />
    </>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InventoryContent />
    </Suspense>
  );
}
