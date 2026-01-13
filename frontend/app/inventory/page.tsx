'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Vehicle } from '@/lib/types';
import { api } from '@/lib/api';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleModal from '@/components/vehicles/VehicleModal';

function InventoryContent() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(9);
  const [filters, setFilters] = useState({
    make: 'all',
    priceRange: 'all',
    bodyType: 'all',
    fuelType: 'all',
    sortBy: 'default',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      const data = await api.get('/vehicles');
      setVehicles(data);
      setAllVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const make = searchParams.get('make');
    const priceRange = searchParams.get('priceRange');
    const bodyType = searchParams.get('bodyType');
    const fuelType = searchParams.get('fuelType');

    let filtered = [...allVehicles];

    if (make && make !== 'all') {
      filtered = filtered.filter((v) =>
        v.make.toLowerCase() === make.toLowerCase()
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

    setVehicles(filtered);
    setFilters({
      make: make || 'all',
      priceRange: priceRange || 'all',
      bodyType: bodyType || 'all',
      fuelType: fuelType || 'all',
      sortBy: filters.sortBy,
    });
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
    setFilters({ ...filters, sortBy });
  };

  const handleClearFilters = () => {
    window.location.href = '/inventory';
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

        <div className="ms-4 text-gray-600 font-semibold">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section id="inventory" className="vehicles-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Featured Vehicles</h2>
          <p className="text-muted mt-4 fs-5">
            Browse our hand-picked selection of quality used cars
          </p>
        </div>

        {/* Filter and Sort Bar */}
        <div className="filter-sort-bar">
          <div className="results-info">
            <div className="results-count">
              <i className="fas fa-car me-2"></i>
              <span>
                Showing {currentVehicles.length} of {vehicles.length} vehicles (Page {currentPage} of {totalPages})
              </span>
            </div>
            <div className="sort-controls">
              <label className="sort-label">Sort by:</label>
              <select
                id="sortSelect"
                className="sort-select"
                value={filters.sortBy}
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
                filters.priceRange !== 'all' ||
                filters.bodyType !== 'all' ||
                filters.fuelType !== 'all') && (
                <button
                  id="clearFilters"
                  className="clear-filters-btn"
                  onClick={handleClearFilters}
                >
                  <i className="fas fa-times me-1"></i> Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="row g-4" id="vehicleGrid">
          {currentVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onDetailsClick={setSelectedVehicle}
            />
          ))}
        </div>

        {currentVehicles.length === 0 && vehicles.length > 0 && currentPage > 1 && (
          <div className="text-center py-5">
            <h3>No vehicles on this page</h3>
            <button
              className="btn btn-primary mt-3"
              onClick={() => paginate(1)}
            >
              Go to First Page
            </button>
          </div>
        )}

        {vehicles.length === 0 && (
          <div className="text-center py-5">
            <h3>No vehicles found matching your criteria</h3>
            <button
              className="btn btn-primary mt-3"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}

        {vehicles.length > 0 && renderPageNumbers()}

        <div className="text-center mt-5">
          <a href="#inventory" className="btn btn-primary btn-lg px-5 py-3">
            View All 24+ Vehicles <i className="fas fa-arrow-right ms-2"></i>
          </a>
        </div>
      </div>

      <VehicleModal
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        vehicle={selectedVehicle}
      />
    </section>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InventoryContent />
    </Suspense>
  );
}
