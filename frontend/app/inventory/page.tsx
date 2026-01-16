'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Vehicle } from '@/lib/types';
import { api } from '@/lib/api';
import VehicleCard from '@/components/vehicles/VehicleCard';
import InventoryFilters from '@/components/inventory/InventoryFilters';
import ScrollPositionManager from '@/components/ScrollPositionManager';
import NavigationButtons from '@/components/NavigationButtons';

function InventoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(9);
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'default');
  const [make, setMake] = useState(searchParams.get('make') || '');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: vehiclesPerPage,
      };
      if (search) params.search = search;
      if (make) params.make = make;
      if (minPrice) params.priceMin = parseInt(minPrice);
      if (maxPrice) params.priceMax = parseInt(maxPrice);
      if (sortBy && sortBy !== 'default') params.sortBy = sortBy;

      const response = await api.get('/vehicles', params);
      setVehicles(response.vehicles || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (make) params.set('make', make);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy && sortBy !== 'default') params.set('sortBy', sortBy);
    
    const queryString = params.toString();
    const path = queryString ? `/inventory?${queryString}` : '/inventory';
    
    router.push(path);
  }, [search, make, minPrice, maxPrice, sortBy, router]);

  useEffect(() => {
    fetchVehicles();
  }, [search, make, minPrice, maxPrice, sortBy]);

  const totalPages = vehicles.length > 0 ? Math.ceil(vehicles.length / vehiclesPerPage) : 1;
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

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    setCurrentPage(1);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleMakeClear = () => {
    setMake('');
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearch('');
    setMake('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
    setSortBy('default');
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
    <>
      <ScrollPositionManager />
      <NavigationButtons />

      <section id="inventory" className="vehicles-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Featured Vehicles</h2>
            <p className="text-muted mt-4 fs-5">
              Browse our hand-picked selection of quality used cars
            </p>
          </div>

          <InventoryFilters
            search={search}
            make={make}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onSearchChange={handleSearchChange}
            onMakeClear={handleMakeClear}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
            onClearAll={handleClearAll}
          />

          <div className="results-bar">
            <div className="results-count">
              <span>
                Showing {currentVehicles.length} of {vehicles.length} vehicles
                {search && <span> matching "{search}"</span>}
              </span>
            </div>
            <div className="sort-controls">
              <label className="sort-label">Sort by:</label>
              <select
                id="sortSelect"
                className="sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest First</option>
                <option value="year-old">Year: Oldest First</option>
                <option value="brand">Brand: A to Z</option>
              </select>
            </div>
          </div>

          <div className="row g-4" id="vehicleGrid">
            {currentVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={vehicle.slug ? `/vehicles/${vehicle.slug}` : `/inventory`}
                className="col-lg-4 col-md-6"
              >
                <VehicleCard vehicle={vehicle} />
              </Link>
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
              <h3>No vehicles found</h3>
              <p className="text-muted">Try adjusting your search or clearing filters</p>
              {(search || minPrice || maxPrice) && (
                <button
                  className="btn btn-primary mt-3"
                  onClick={handleClearAll}
                >
                  Clear All
                </button>
              )}
            </div>
          )}

          {vehicles.length > 0 && renderPageNumbers()}

          <div className="text-center mt-5">
            <a href="/inventory" className="btn btn-primary btn-lg px-5 py-3">
              View All Vehicles <i className="fas fa-arrow-right ms-2"></i>
            </a>
          </div>
        </div>
      </section>
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
