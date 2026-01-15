'use client';

import { useState, useEffect, Suspense } from 'react';
import { Vehicle } from '@/lib/types';
import { api } from '@/lib/api';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleModal from '@/components/vehicles/VehicleModal';
import BrandFilter from '@/components/BrandFilter';
import SearchInput from '@/components/SearchInput';
import ScrollPositionManager from '@/components/ScrollPositionManager';
import NavigationButtons from '@/components/NavigationButtons';

function InventoryContent() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(9);
  const [sortBy, setSortBy] = useState('default');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

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
    let filtered = [...allVehicles];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((v) => {
        const searchTerms = `${v.make} ${v.model} ${v.year} ${v.description}`.toLowerCase();
        return searchTerms.includes(query);
      });
    }

    if (selectedBrand) {
      filtered = filtered.filter((v) =>
        v.make.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.priceKES - b.priceKES);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.priceKES - a.priceKES);
    } else if (sortBy === 'year-new') {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'year-old') {
      filtered.sort((a, b) => a.year - b.year);
    } else if (sortBy === 'brand') {
      filtered.sort((a, b) => a.make.localeCompare(b.make));
    }

    setVehicles(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedBrand, sortBy]);

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

          <div className="search-and-filters">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
            <BrandFilter selectedBrand={selectedBrand} onBrandSelect={setSelectedBrand} />
          </div>

          <div className="results-bar">
            <div className="results-count">
              <span>
                Showing {currentVehicles.length} of {vehicles.length} vehicles
                {searchQuery && <span> matching "{searchQuery}"</span>}
                {selectedBrand && <span> - {brands.find(b => b.id === selectedBrand)?.name}</span>}
              </span>
            </div>
            <div className="sort-controls">
              <label className="sort-label">Sort by:</label>
              <select
                id="sortSelect"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest First</option>
                <option value="year-old">Year: Oldest First</option>
                <option value="brand">Brand: A to Z</option>
              </select>
              {(searchQuery || selectedBrand) && (
                <button
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBrand(null);
                  }}
                >
                  <i className="fas fa-times me-1"></i> Clear All
                </button>
              )}
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
              <h3>No vehicles found</h3>
              <p className="text-muted">Try adjusting your search or clearing filters</p>
              {(searchQuery || selectedBrand) && (
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBrand(null);
                  }}
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
