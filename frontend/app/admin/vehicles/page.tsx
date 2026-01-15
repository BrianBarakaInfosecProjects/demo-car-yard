'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Car, Plus, Search, Edit, Trash2, Filter, Grid, List, ChevronDown } from 'lucide-react';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  priceKES: number;
  imageUrl: string;
  status: string;
  featured: boolean;
  vin: string;
  createdAt: string;
  isDraft: boolean;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await api.get('/vehicles');
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (error) {
      alert('Failed to delete vehicle');
    }
  };

  const toggleSelectVehicle = (id: string) => {
    const newSelected = new Set(selectedVehicles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedVehicles(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const toggleSelectAll = () => {
    if (selectedVehicles.size === filteredVehicles.length) {
      setSelectedVehicles(new Set());
    } else {
      setSelectedVehicles(new Set(filteredVehicles.map(v => v.id)));
    }
    setShowBulkActions(selectedVehicles.size !== filteredVehicles.length);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedVehicles.size} vehicle(s)?`)) {
      return;
    }

    try {
      const apiURL = typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:5000`
        : 'http://localhost:5000';
      
      await fetch(`${apiURL}/api/bulk/vehicles`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: Array.from(selectedVehicles) }),
      });
      
      setVehicles(vehicles.filter(v => !selectedVehicles.has(v.id)));
      setSelectedVehicles(new Set());
      setShowBulkActions(false);
    } catch (error) {
      alert('Failed to delete vehicles');
    }
  };

  const handleBulkUpdateStatus = async (status: string) => {
    try {
      await api.patch('/bulk/vehicles/status', { ids: Array.from(selectedVehicles), status });
      setVehicles(vehicles.map(v => selectedVehicles.has(v.id) ? { ...v, status } : v));
      setSelectedVehicles(new Set());
      setShowBulkActions(false);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleBulkUpdateLocation = async (location: string) => {
    try {
      await api.patch('/bulk/vehicles/location', { ids: Array.from(selectedVehicles), location });
      setVehicles(vehicles.map(v => selectedVehicles.has(v.id) ? { ...v, location } : v));
      setSelectedVehicles(new Set());
      setShowBulkActions(false);
    } catch (error) {
      alert('Failed to update location');
    }
  };

  const handleBulkPublish = async () => {
    try {
      await api.patch('/bulk/vehicles/publish', { ids: Array.from(selectedVehicles) });
      setVehicles(vehicles.map(v => selectedVehicles.has(v.id) ? { ...v, isDraft: false } : v));
      setSelectedVehicles(new Set());
      setShowBulkActions(false);
    } catch (error) {
      alert('Failed to publish vehicles');
    }
  };

  const handleBulkUnpublish = async () => {
    try {
      await api.patch('/bulk/vehicles/unpublish', { ids: Array.from(selectedVehicles) });
      setVehicles(vehicles.map(v => selectedVehicles.has(v.id) ? { ...v, isDraft: true } : v));
      setSelectedVehicles(new Set());
      setShowBulkActions(false);
    } catch (error) {
      alert('Failed to unpublish vehicles');
    }
  };

  const handleBulkSetFeatured = async (featured: boolean) => {
    try {
      await api.patch('/bulk/vehicles/featured', { ids: Array.from(selectedVehicles), featured });
      setVehicles(vehicles.map(v => selectedVehicles.has(v.id) ? { ...v, featured } : v));
      setSelectedVehicles(new Set());
      setShowBulkActions(false);
    } catch (error) {
      alert('Failed to update featured status');
    }
  };

  const filteredVehicles = vehicles
    .filter(v => {
      const matchesSearch = `${v.make} ${v.model} ${v.vin}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'price-low') return a.priceKES - b.priceKES;
      if (sortBy === 'price-high') return b.priceKES - a.priceKES;
      if (sortBy === 'name') return a.make.localeCompare(b.make);
      return 0;
    });

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-green-100 text-green-700';
      case 'ON_SALE':
        return 'bg-yellow-100 text-yellow-700';
      case 'CERTIFIED_PRE_OWNED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-blue-900">
            {selectedVehicles.size} vehicle{selectedVehicles.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkPublish}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Publish
            </button>
            <button
              onClick={handleBulkUnpublish}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Unpublish
            </button>
            <button
              onClick={() => handleBulkSetFeatured(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
            >
              Feature
            </button>
            <button
              onClick={() => handleBulkSetFeatured(false)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Unfeature
            </button>
            <select
              onChange={(e) => handleBulkUpdateStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Set Status...</option>
              <option value="NEW">New</option>
              <option value="USED">Used</option>
              <option value="CERTIFIED_PRE_OWNED">Certified</option>
              <option value="ON_SALE">On Sale</option>
            </select>
            <select
              onChange={(e) => handleBulkUpdateLocation(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Set Location...</option>
              <option value="Nairobi Showroom">Nairobi Showroom</option>
              <option value="Mombasa Road">Mombasa Road</option>
              <option value="Westlands">Westlands</option>
              <option value="Industrial Area">Industrial Area</option>
              <option value="Karen">Karen</option>
            </select>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              onClick={() => {
                setSelectedVehicles(new Set());
                setShowBulkActions(false);
              }}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Vehicles</h1>
          <p className="text-sm text-gray-600">
            {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} in inventory
          </p>
        </div>
        <Link
          href="/admin/vehicles/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Add Vehicle</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by make, model, or VIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Select All */}
          {filteredVehicles.length > 0 && (
            <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedVehicles.size === filteredVehicles.length && filteredVehicles.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Select All</span>
            </label>
          )}

          {/* Status Filter */}
          <div className="relative min-w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="NEW">New</option>
              <option value="USED">Used</option>
              <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned</option>
              <option value="ON_SALE">On Sale</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredVehicles.length}</span> vehicle{filteredVehicles.length !== 1 ? 's' : ''}
          {searchTerm && <span className="ml-1">matching "{searchTerm}"</span>}
        </p>
      </div>

      {/* Vehicles List - Grid View */}
      {viewMode === 'grid' ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative"
            >
              {/* Checkbox */}
              <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                  type="checkbox"
                  checked={selectedVehicles.has(vehicle.id)}
                  onChange={() => toggleSelectVehicle(vehicle.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Image */}
              <div className="relative h-48 bg-gray-100 cursor-pointer" onClick={() => router.push(`/admin/vehicles/new/${vehicle.id}`)}>
                <img
                  src={vehicle.imageUrl || 'https://via.placeholder.com/400x300'}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  {vehicle.isDraft && (
                    <span className="mr-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-400 text-white">
                      Draft
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                    {getStatusLabel(vehicle.status)}
                  </span>
                </div>

                {/* Featured Badge */}
                {vehicle.featured && (
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-400 text-yellow-900 rounded-full">
                      ★ Featured
                    </span>
                  </div>
                )}

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/admin/vehicles/new/${vehicle.id}`}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(vehicle.id);
                    }}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 cursor-pointer" onClick={() => router.push(`/admin/vehicles/new/${vehicle.id}`)}>
                <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{vehicle.vin}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-blue-600">
                    {formatPrice(vehicle.priceKES)}
                  </p>
                  <p className="text-xs text-gray-500">{vehicle.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectedVehicles.size === filteredVehicles.length && filteredVehicles.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => (
                  <tr 
                    key={vehicle.id} 
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedVehicles.has(vehicle.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => router.push(`/admin/vehicles/new/${vehicle.id}`)}
                  >
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedVehicles.has(vehicle.id)}
                        onChange={() => toggleSelectVehicle(vehicle.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.imageUrl || 'https://via.placeholder.com/100x80'}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {vehicle.make} {vehicle.model}
                            {vehicle.isDraft && <span className="ml-2 px-2 py-0.5 text-xs bg-gray-400 text-white rounded">Draft</span>}
                          </p>
                          <p className="text-xs text-gray-500">{vehicle.vin}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{vehicle.year}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {formatPrice(vehicle.priceKES)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                        {getStatusLabel(vehicle.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {vehicle.featured ? (
                        <span className="text-yellow-600">
                          ★ Featured
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/vehicles/new/${vehicle.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-sm text-gray-600 mb-6">
            {searchTerm
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first vehicle'
            }
          </p>
          <Link
            href="/admin/vehicles/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            <span>Add Your First Vehicle</span>
          </Link>
        </div>
      )}
    </div>
  );
}
