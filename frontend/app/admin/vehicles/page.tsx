'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Car, Plus, Search, Edit, Trash2, Filter, Grid, List, ChevronDown, Archive, RotateCcw, Camera, DollarSign, Star, Check, X } from 'lucide-react';
import { adminThumbnail } from '@/lib/cloudinary';
import ShareButton from '@/components/ShareButton';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  priceKES: number;
  imageUrl: string;
  images?: string[];
  status: string;
  featured: boolean;
  vin: string;
  createdAt: string;
  isDraft: boolean;
  deletedAt?: string | null;
}

const getAuthHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Quick edit modal state
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editFeatured, setEditFeatured] = useState<boolean>(false);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/vehicles?limit=1000&includeDrafts=true', {
        headers: getAuthHeader(),
      });
      const data = await response.json();
      // Filter out deleted vehicles for display
      const activeVehicles = data.vehicles?.filter((v: Vehicle) => !v.deletedAt) || [];
      setVehicles(activeVehicles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle? It will be archived and can be restored later.')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (response.ok) {
        setVehicles(vehicles.filter(v => v.id !== id));
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete vehicle');
      }
    } catch (error) {
      alert('Failed to delete vehicle');
    }
  };

  const handleToggleFeatured = async (vehicle: Vehicle) => {
    try {
      // Use PUT endpoint for better compatibility
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ featured: !vehicle.featured }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setVehicles(vehicles.map(v =>
          v.id === vehicle.id ? { ...v, featured: !v.featured } : v
        ));
      } else {
        console.error('Featured update failed:', data);
        alert(data.error?.message || data.message || 'Failed to update featured status');
      }
    } catch (error) {
      console.error('Featured update error:', error);
      alert('Failed to update featured status');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      // Use PUT endpoint for better compatibility
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setVehicles(vehicles.map(v =>
          v.id === id ? { ...v, status } : v
        ));
      } else {
        console.error('Status update failed:', data);
        alert(data.error?.message || data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status');
    }
  };

  const openQuickEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setEditPrice(vehicle.priceKES);
    setEditStatus(vehicle.status);
    setEditFeatured(vehicle.featured);
  };

  const closeQuickEdit = () => {
    setEditingVehicle(null);
    setEditPrice(0);
    setEditStatus('');
    setEditFeatured(false);
  };

  const saveQuickEdit = async () => {
    if (!editingVehicle) return;
    setSavingEdit(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({
          priceKES: editPrice,
          status: editStatus,
          featured: editFeatured,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVehicles(vehicles.map(v =>
          v.id === editingVehicle.id
            ? { ...v, priceKES: editPrice, status: editStatus, featured: editFeatured }
            : v
        ));
        closeQuickEdit();
      } else {
        console.error('Quick edit failed:', data);
        alert(data.error?.message || data.message || 'Failed to update vehicle');
      }
    } catch (error) {
      console.error('Quick edit error:', error);
      alert('Failed to update vehicle');
    } finally {
      setSavingEdit(false);
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
      await fetch('${process.env.NEXT_PUBLIC_API_URL}/bulk/vehicles', {
        method: 'DELETE',
        headers: getAuthHeader(),
        body: JSON.stringify({ ids: Array.from(selectedVehicles) }),
      });

      setVehicles(vehicles.filter(v => !selectedVehicles.has(v.id)));
      setSelectedVehicles(new Set());
      setShowBulkActions(false);
    } catch (error) {
      alert('Failed to delete vehicles');
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
      case 'AVAILABLE':
        return 'bg-green-100 text-green-700';
      case 'SOLD':
        return 'bg-red-100 text-red-700';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-700';
      case 'NEW':
        return 'bg-blue-100 text-blue-700';
      case 'ON_SALE':
        return 'bg-purple-100 text-purple-700';
      case 'CERTIFIED_PRE_OWNED':
        return 'bg-orange-100 text-orange-700';
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
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Showroom</h1>
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

          {/* Status Filter */}
          <div className="relative min-w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="SOLD">Sold</option>
              <option value="RESERVED">Reserved</option>
              <option value="NEW">New</option>
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

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {vehicles.length === 0 ? 'Your inventory is empty' : 'No vehicles found'}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {vehicles.length === 0
              ? 'Add your first vehicle to get started'
              : 'Try adjusting your search or filters'
            }
          </p>
          <Link
            href="/admin/vehicles/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            <span>{vehicles.length === 0 ? 'Add Your First Vehicle' : 'Add Vehicle'}</span>
          </Link>
        </div>
      )}

      {/* Vehicles List - Grid View */}
      {viewMode === 'grid' && filteredVehicles.length > 0 && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100 cursor-pointer">
                <Link href={`/admin/vehicles/${vehicle.id}`}>
                  <Image
                    src={adminThumbnail(vehicle.imageUrl || 'https://via.placeholder.com/400x300')}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    quality={80}
                  />
                </Link>

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
                  {(vehicle.status === 'AVAILABLE' || vehicle.status === 'ON_SALE') && (
                    <ShareButton
                      car={{
                        make: vehicle.make,
                        model: vehicle.model,
                        year: vehicle.year,
                        price: vehicle.priceKES,
                        imageUrl: vehicle.images?.[0] ?? vehicle.imageUrl ?? '',
                        slug: vehicle.slug || '',
                        mileage: undefined,
                        fuelType: undefined,
                      }}
                      variant="icon-only"
                    />
                  )}
                  <Link
                    href={`/admin/vehicles/${vehicle.id}`}
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    title="Manage Vehicle"
                  >
                    <Edit size={20} />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(vehicle.id);
                    }}
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
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

                {/* Quick Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleFeatured(vehicle)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      vehicle.featured
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {vehicle.featured ? '★ Featured' : '☆ Feature'}
                  </button>
                  <select
                    value={vehicle.status}
                    onChange={(e) => handleUpdateStatus(vehicle.id, e.target.value)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${getStatusColor(vehicle.status)}`}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="SOLD">Sold</option>
                    <option value="NEW">New</option>
                    <option value="CERTIFIED_PRE_OWNED">CPO</option>
                    <option value="ON_SALE">On Sale</option>
                  </select>
                  <Link
                    href={`/admin/vehicles/${vehicle.id}`}
                    className="text-xs px-3 py-1.5 rounded-full font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-1"
                  >
                    <Edit size={12} />
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vehicles List - List View */}
      {viewMode === 'list' && filteredVehicles.length > 0 && (
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
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVehicles.has(vehicle.id)}
                        onChange={() => toggleSelectVehicle(vehicle.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/vehicles/${vehicle.id}`} className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          <Image
                            src={adminThumbnail(vehicle.imageUrl || 'https://via.placeholder.com/100x80')}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                            quality={80}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 hover:text-blue-600">
                            {vehicle.make} {vehicle.model}
                            {vehicle.isDraft && <span className="ml-2 px-2 py-0.5 text-xs bg-gray-400 text-white rounded">Draft</span>}
                          </p>
                          <p className="text-xs text-gray-500">{vehicle.vin}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{vehicle.year}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openQuickEdit(vehicle)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {formatPrice(vehicle.priceKES)}
                        <Edit size={12} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={vehicle.status}
                        onChange={(e) => handleUpdateStatus(vehicle.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${getStatusColor(vehicle.status)}`}
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="RESERVED">Reserved</option>
                        <option value="SOLD">Sold</option>
                        <option value="NEW">New</option>
                        <option value="CERTIFIED_PRE_OWNED">CPO</option>
                        <option value="ON_SALE">On Sale</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(vehicle)}
                        className={`text-sm ${vehicle.featured ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
                      >
                        {vehicle.featured ? '★ Featured' : '☆'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(vehicle.status === 'AVAILABLE' || vehicle.status === 'ON_SALE') && (
                          <ShareButton
                            car={{
                              make: vehicle.make,
                              model: vehicle.model,
                              year: vehicle.year,
                              price: vehicle.priceKES,
                              imageUrl: vehicle.images?.[0] ?? vehicle.imageUrl ?? '',
                              slug: vehicle.slug || '',
                              mileage: undefined,
                              fuelType: undefined,
                            }}
                            variant="icon-only"
                          />
                        )}
                        <button
                          onClick={() => openQuickEdit(vehicle)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Quick Edit"
                        >
                          <DollarSign size={18} />
                        </button>
                        <Link
                          href={`/admin/vehicles/new?id=${vehicle.id}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Full Edit"
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

      {/* Quick Edit Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Edit: {editingVehicle.make} {editingVehicle.model}
              </h3>
              <button
                onClick={closeQuickEdit}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Price Edit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (KSh)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">KSh</span>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="SOLD">Sold</option>
                  <option value="NEW">New</option>
                  <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned</option>
                  <option value="ON_SALE">On Sale</option>
                </select>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star size={18} className={editFeatured ? 'text-yellow-500' : 'text-gray-400'} />
                  <span className="text-sm font-medium text-gray-700">Featured Vehicle</span>
                </div>
                <button
                  onClick={() => setEditFeatured(!editFeatured)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    editFeatured ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      editFeatured ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Current Image Preview */}
              {editingVehicle.imageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Photo
                  </label>
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image
                      src={adminThumbnail(editingVehicle.imageUrl)}
                      alt={`${editingVehicle.make} ${editingVehicle.model}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={80}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <Link
                href={`/admin/vehicles/${editingVehicle.id}`}
                className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Car size={18} />
                <span>Full Management</span>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={closeQuickEdit}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveQuickEdit}
                  disabled={savingEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {savingEdit ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
