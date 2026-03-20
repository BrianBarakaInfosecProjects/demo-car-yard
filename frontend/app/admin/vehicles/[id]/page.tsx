'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Save, ArrowLeft, Upload, X, Image as ImageIcon,
  CheckCircle, XCircle, Clock, Zap, Star, DollarSign, 
  MapPin, Calendar, Truck, Car, Edit3, RefreshCw
} from 'lucide-react';

interface VehicleData {
  id: string;
  make: string;
  model: string;
  year: number;
  priceKES: number;
  mileage: number;
  bodyType: string;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  engine: string;
  vin: string;
  location: string;
  status: string;
  featured: boolean;
  description: string;
  imageUrl: string;
  images?: string[];
  isDraft: boolean;
}

const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available', icon: CheckCircle, color: 'bg-green-500', desc: 'Ready to sell' },
  { value: 'RESERVED', label: 'Reserved', icon: Clock, color: 'bg-yellow-500', desc: 'Held for customer' },
  { value: 'SOLD', label: 'Sold', icon: XCircle, color: 'bg-red-500', desc: 'Purchased' },
  { value: 'NEW', label: 'Brand New', icon: Zap, color: 'bg-blue-500', desc: 'New arrival' },
  { value: 'CERTIFIED_PRE_OWNED', label: 'Certified Pre-Owned', icon: Star, color: 'bg-orange-500', desc: 'Quality checked' },
  { value: 'ON_SALE', label: 'On Sale', icon: DollarSign, color: 'bg-purple-500', desc: 'Special price' },
];

export default function VehicleManagementPage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params?.id as string;
  
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newPrice, setNewPrice] = useState('');
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    if (vehicleId) {
      console.log('Fetching vehicle:', vehicleId);
      fetchVehicle();
    }
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      console.log('Fetching vehicle, token present:', !!token);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${vehicleId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log('Fetch response status:', res.status);
      
      const data = await res.json();
      console.log('Fetch response:', data);
      
      if (res.ok) {
        setVehicle(data);
        setNewPrice(data.priceKES?.toString() || '0');
      } else {
        console.error('Failed to fetch vehicle:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async (updates: any) => {
    if (!vehicle || !vehicle.id) {
      setSaving(false);
      alert('Vehicle not loaded yet');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      setSaving(false);
      const relogin = confirm('Session expired. Click OK to login again.');
      if (relogin) window.location.href = '/login';
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const result = await response.json();
      console.log('PUT Response:', response.status, result);
      
      if (response.ok && (result.vehicle || result.success)) {
        setVehicle(result.vehicle || result);
        alert('Updated successfully!');
      } else if (response.status === 401) {
        const relogin = confirm('Session expired. Click OK to login again.');
        if (relogin) window.location.href = '/login';
      } else {
        alert(result.error?.message || result.message || 'Update failed');
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePriceUpdate = async () => {
    const price = parseInt(newPrice.replace(/,/g, ''));
    if (!price || price <= 0) {
      setPriceError('Please enter a valid price');
      return;
    }
    
    if (!vehicle) return;
    
    setSaving(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setSaving(false);
      alert('Please log in again');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceKES: price }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.vehicle) {
        setVehicle({ ...vehicle, priceKES: price });
        alert('Price updated!');
      } else {
        alert(result.error || result.message || 'Failed to update price');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!vehicle || !vehicle.id) return;
    
    setSaving(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setSaving(false);
      alert('Please log in again');
      return;
    }
    
    try {
      // Use dedicated status endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${vehicle.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      const result = await response.json();
      console.log('Status update response:', response.status, result);
      
      if (response.ok) {
        setVehicle({ ...vehicle, status });
        alert(`Status changed to ${status}`);
      } else {
        alert(result.error || result.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !vehicle) return;
    
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    setSaving(true);
    const token = localStorage.getItem('token') || '';
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${vehicle.id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    })
    .then(res => res.json())
    .then(data => {
      if (data.id) {
        setVehicle(data);
        alert('Photos updated successfully!');
      } else {
        alert(data.message || 'Upload failed');
      }
    })
    .catch(() => alert('Upload failed'))
    .finally(() => setSaving(false));
  };

  const formatPrice = (price: number) => `KSh ${price.toLocaleString()}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Vehicle Not Found</h2>
        <Link href="/admin/vehicles" className="text-blue-600 hover:underline mt-4 block">
          Back to Showroom
        </Link>
      </div>
    );
  }

  const currentStatus = STATUS_OPTIONS.find(s => s.value === vehicle.status) || STATUS_OPTIONS[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/vehicles" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-sm text-gray-500">{vehicle.vin || (vehicle.id ? vehicle.id.slice(0, 8) : 'N/A')}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-white font-medium flex items-center gap-2 ${currentStatus.color}`}>
            <currentStatus.icon className="w-4 h-4" />
            {currentStatus.label}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Photo & Price */}
        <div className="space-y-6">
          {/* Photo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Vehicle Photo</h3>
              {vehicle.featured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
            </div>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img 
                src={vehicle.imageUrl || 'https://via.placeholder.com/400x300?text=No+Photo'} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>
            <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Add/Change Photos</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Quick Price Change */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Change Price
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">KSh</span>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setNewPrice(parseInt(val).toLocaleString());
                    setPriceError('');
                  }}
                  className="w-full pl-16 pr-4 py-3 text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              {priceError && <p className="text-red-500 text-sm">{priceError}</p>}
              <button
                onClick={handlePriceUpdate}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Update Price
              </button>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className={`w-6 h-6 ${vehicle.featured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                <div>
                  <p className="font-medium text-gray-900">Featured</p>
                  <p className="text-sm text-gray-500">Show on homepage</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  if (!vehicle) return;
                  setSaving(true);
                  const token = localStorage.getItem('token');
                  if (!token) {
                    setSaving(false);
                    alert('Please log in again');
                    return;
                  }
                  try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${vehicle.id}/featured`, {
                      method: 'PATCH',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ featured: !vehicle.featured }),
                    });
                    const result = await response.json();
                    if (response.ok) {
                      setVehicle({ ...vehicle, featured: !vehicle.featured });
                    } else {
                      alert(result.error || result.message || 'Failed');
                    }
                  } catch (err) {
                    alert('Error');
                  } finally {
                    setSaving(false);
                  }
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${vehicle.featured ? 'bg-yellow-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${vehicle.featured ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Status & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* BIG STATUS BUTTONS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">What do you want to do with this car?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {STATUS_OPTIONS.map((option) => {
                const isActive = vehicle.status === option.value;
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isActive 
                        ? `${option.color} text-white border-transparent` 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <p className="font-bold text-sm">{option.label}</p>
                    {!isActive && <p className="text-xs text-gray-400 mt-1">{option.desc}</p>}
                    {isActive && <p className="text-xs opacity-75 mt-1">Currently Active</p>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicle Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Vehicle Information</h3>
              <Link 
                href={`/admin/vehicles/new?id=${vehicle.id}`}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
              >
                <Edit3 className="w-4 h-4" />
                Edit Details
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Year</span>
                </div>
                <p className="font-semibold">{vehicle.year}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Truck className="w-4 h-4" />
                  <span className="text-xs">Mileage</span>
                </div>
                <p className="font-semibold">{vehicle.mileage?.toLocaleString()} km</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Car className="w-4 h-4" />
                  <span className="text-xs">Body</span>
                </div>
                <p className="font-semibold">{vehicle.bodyType}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs">Fuel</span>
                </div>
                <p className="font-semibold">{vehicle.fuelType}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Truck className="w-4 h-4" />
                  <span className="text-xs">Transmission</span>
                </div>
                <p className="font-semibold">{vehicle.transmission}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs">Location</span>
                </div>
                <p className="font-semibold">{vehicle.location || '—'}</p>
              </div>
            </div>

            {(vehicle.exteriorColor || vehicle.engine) && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4">
                {vehicle.exteriorColor && (
                  <div>
                    <p className="text-xs text-gray-500">Exterior Color</p>
                    <p className="font-medium">{vehicle.exteriorColor}</p>
                  </div>
                )}
                {vehicle.interiorColor && (
                  <div>
                    <p className="text-xs text-gray-500">Interior Color</p>
                    <p className="font-medium">{vehicle.interiorColor}</p>
                  </div>
                )}
                {vehicle.engine && (
                  <div>
                    <p className="text-xs text-gray-500">Engine</p>
                    <p className="font-medium">{vehicle.engine}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <Link 
              href="/admin/vehicles" 
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Back to Showroom
            </Link>
            <Link 
              href={`/admin/vehicles/new?id=${vehicle.id}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Edit3 className="w-4 h-4" />
              Edit All Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}