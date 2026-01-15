'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { History, Search, User, Car, Mail, Clock } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  changes?: string;
  createdAt: string;
  ipAddress?: string;
  user: {
    name: string;
    email: string;
  };
  vehicle?: {
    make: string;
    model: string;
  };
  inquiry?: {
    name: string;
    email: string;
  };
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [entityFilter, setEntityFilter] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await api.get('/analytics/audit-logs?limit=100');
      setLogs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'ALL' || log.entityType === entityFilter;
    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-700';
      case 'UPDATE': return 'bg-blue-100 text-blue-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      case 'UPDATE_STATUS': return 'bg-yellow-100 text-yellow-700';
      case 'BULK_DELETE': return 'bg-red-200 text-red-800';
      case 'BULK_UPDATE_STATUS': return 'bg-purple-100 text-purple-700';
      case 'BULK_PUBLISH': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'VEHICLE': return <Car size={16} />;
      case 'INQUIRY': return <Mail size={16} />;
      case 'USER': return <User size={16} />;
      default: return <History size={16} />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUniqueActions = () => {
    return ['ALL', ...new Set(logs.map((log) => log.action))];
  };

  const getUniqueEntities = () => {
    return ['ALL', ...new Set(logs.map((log) => log.entityType))];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-sm text-gray-600">
            Track all user actions and changes
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
              placeholder="Search by user, action, or entity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            {getUniqueActions().map((action) => (
              <option key={action} value={action}>
                {action === 'ALL' ? 'All Actions' : action.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          {/* Entity Filter */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            {getUniqueEntities().map((entity) => (
              <option key={entity} value={entity}>
                {entity === 'ALL' ? 'All Entities' : entity}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{filteredLogs.length}</span> of{' '}
        <span className="font-semibold text-gray-900">{logs.length}</span> logs
      </p>

      {/* Logs List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredLogs.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${getActionColor(log.action)}`}>
                    {getEntityIcon(log.entityType)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {log.action.replace(/_/g, ' ')}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                            {log.entityType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">{log.user.name}</span> (
                          {log.user.email})
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 text-xs text-gray-500">
                        <Clock size={14} />
                        <span>{formatDate(log.createdAt)}</span>
                      </div>
                    </div>

                    {/* Entity Info */}
                    {log.vehicle && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {log.vehicle.make} {log.vehicle.model}
                        </p>
                      </div>
                    )}

                    {log.inquiry && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {log.inquiry.name} ({log.inquiry.email})
                        </p>
                      </div>
                    )}

                    {/* Changes */}
                    {log.changes && (
                      <details className="group">
                        <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                          View changes
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 rounded-lg p-3 overflow-auto max-h-32">
                          {log.changes}
                        </pre>
                      </details>
                    )}

                    {/* IP Address */}
                    {log.ipAddress && (
                      <p className="text-xs text-gray-500 mt-2">
                        IP: {log.ipAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <History className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity logs found</h3>
            <p className="text-sm text-gray-600">
              {searchTerm || actionFilter !== 'ALL' || entityFilter !== 'ALL'
                ? 'Try adjusting your filters'
                : 'No activity recorded yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}