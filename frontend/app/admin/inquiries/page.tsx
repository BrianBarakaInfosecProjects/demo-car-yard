'use client';

import { useState, useEffect } from 'react';
import { Mail, Search, CheckCircle, Clock, User, Phone, ChevronDown, Trash2, Filter } from 'lucide-react';
import { api } from '@/lib/api';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  vehicleId?: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
  vehicle?: {
    make: string;
    model: string;
    year: number;
    priceKES: number;
  };
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const data = await api.get('/inquiries');
      setInquiries(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status });
      setInquiries(inquiries.map(i => 
        i.id === id ? { ...i, status } as any : i
      ));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) {
      return;
    }

    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries(inquiries.filter(i => i.id !== id));
    } catch (error) {
      alert('Failed to delete inquiry');
    }
  };

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = 
      `${i.name} ${i.email} ${i.phone}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'RESOLVED':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock size={16} />;
      case 'RESOLVED':
        return <CheckCircle size={16} />;
      default:
        return <Mail size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Inquiries</h1>
          <p className="text-sm text-gray-600">
            {inquiries.length} total inquiry{inquiries.length !== 1 ? 'ies' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
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
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredInquiries.length}</span> inquiry{filteredInquiries.length !== 1 ? 'ies' : ''}
          {searchTerm && <span className="ml-1">matching "{searchTerm}"</span>}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredInquiries.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredInquiries.map((inquiry, index) => (
              <div key={inquiry.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`p-3 rounded-lg ${getStatusColor(inquiry.status)} flex-shrink-0`}>
                    {getStatusIcon(inquiry.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {inquiry.name}
                        </h3>
                        <p className="text-sm text-gray-500">{inquiry.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(inquiry.createdAt)}</span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center gap-6 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={16} className="text-gray-500" />
                        <span className="text-gray-700">{inquiry.phone}</span>
                      </div>
                      <User size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">Customer</span>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {inquiry.message}
                    </p>

                    {/* Vehicle Info */}
                    {inquiry.vehicle && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {inquiry.vehicle.make} {inquiry.vehicle.model} ({inquiry.vehicle.year})
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          KSh {inquiry.vehicle.priceKES.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="PENDING">Mark as Pending</option>
                        <option value="RESOLVED">Mark as Resolved</option>
                      </select>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Mail className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-sm text-gray-600">
              {searchTerm
                ? 'Try adjusting your search or filters'
                : 'No inquiries have been received yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
