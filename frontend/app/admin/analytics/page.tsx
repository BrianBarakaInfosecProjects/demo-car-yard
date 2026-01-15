'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Car, 
  Mail, 
  Users, 
  TrendingUp, 
  Eye, 
  Clock,
  BarChart3,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  totalVehicles: number;
  publishedVehicles: number;
  draftVehicles: number;
  totalInquiries: number;
  pendingInquiries: number;
  resolvedInquiries: number;
  totalUsers: number;
  featuredVehicles: number;
}

interface PopularVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  priceKES: number;
  imageUrl: string;
  viewCount: number;
  status: string;
}

interface InquiryTrend {
  date: string;
  total: number;
  pending: number;
  resolved: number;
}

interface VehicleByStatus {
  status: string;
  count: number;
}

interface VehicleByBodyType {
  bodyType: string;
  count: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [popularVehicles, setPopularVehicles] = useState<PopularVehicle[]>([]);
  const [inquiryTrends, setInquiryTrends] = useState<InquiryTrend[]>([]);
  const [vehiclesByStatus, setVehiclesByStatus] = useState<VehicleByStatus[]>([]);
  const [vehiclesByBodyType, setVehiclesByBodyType] = useState<VehicleByBodyType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [
        statsData,
        popularData,
        trendsData,
        statusData,
        bodyTypeData,
      ] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/popular-vehicles?limit=10'),
        api.get('/analytics/inquiry-trends?days=30'),
        api.get('/analytics/vehicles-by-status'),
        api.get('/analytics/vehicles-by-body-type'),
      ]);

      setStats(statsData);
      setPopularVehicles(popularData);
      setInquiryTrends(trendsData);
      setVehiclesByStatus(statusData);
      setVehiclesByBodyType(bodyTypeData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-green-500';
      case 'USED': return 'bg-blue-500';
      case 'CERTIFIED_PRE_OWNED': return 'bg-purple-500';
      case 'ON_SALE': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getBodyTypeLabel = (bodyType: string) => {
    return bodyType.replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of your car yard performance</p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Car size={24} />
              </div>
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
            <p className="text-sm text-gray-600">Total Vehicles</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">{stats.publishedVehicles}</span> published,{' '}
                <span className="font-semibold text-gray-700">{stats.draftVehicles}</span> drafts
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Mail size={24} />
              </div>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
            <p className="text-sm text-gray-600">Total Inquiries</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-yellow-600">{stats.pendingInquiries}</span> pending,{' '}
                <span className="font-semibold text-green-600">{stats.resolvedInquiries}</span> resolved
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <Users size={24} />
              </div>
              <span className="text-sm text-gray-500 font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600">Total Users</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">{stats.featuredVehicles}</span> featured vehicles
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <span className="text-sm text-green-600 font-medium">+24%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {popularVehicles.length > 0 ? popularVehicles[0].viewCount : 0}
            </p>
            <p className="text-sm text-gray-600">Top Vehicle Views</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 truncate">
                {popularVehicles.length > 0 
                  ? `${popularVehicles[0].make} ${popularVehicles[0].model}`
                  : 'No data'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiry Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inquiry Trends</h3>
          <div className="space-y-2">
            {inquiryTrends.slice(-7).map((trend) => (
              <div key={trend.date} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{formatDate(trend.date)}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500"
                        style={{ width: `${(trend.pending / Math.max(...inquiryTrends.map(t => t.total))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-12">{trend.pending}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${(trend.resolved / Math.max(...inquiryTrends.map(t => t.total))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-12">{trend.resolved}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">{trend.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicles by Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicles by Status</h3>
          <div className="space-y-3">
            {vehiclesByStatus.map((item) => (
              <div key={item.status} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
                <span className="flex-1 text-sm text-gray-700">
                  {item.status.replace(/_/g, ' ')}
                </span>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStatusColor(item.status)}`}
                    style={{ width: `${(item.count / stats!.totalVehicles) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicles by Body Type */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicles by Body Type</h3>
          <div className="space-y-3">
            {vehiclesByBodyType.map((item) => (
              <div key={item.bodyType} className="flex items-center gap-4">
                <Car size={16} className="text-gray-400" />
                <span className="flex-1 text-sm text-gray-700">
                  {getBodyTypeLabel(item.bodyType)}
                </span>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(item.count / stats!.totalVehicles) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Vehicles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Vehicles</h3>
          <div className="space-y-3">
            {popularVehicles.slice(0, 5).map((vehicle) => (
              <div key={vehicle.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <img
                  src={vehicle.imageUrl || 'https://via.placeholder.com/80x60'}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-xs text-gray-500">{formatPrice(vehicle.priceKES)}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Eye size={14} />
                  <span className="font-semibold">{vehicle.viewCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}