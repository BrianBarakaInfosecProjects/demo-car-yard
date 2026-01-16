'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { History, Search, User, Car, Mail, Clock, Shield, LogOut, LogIn, AlertCircle, ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from 'lucide-react';

interface SessionLog {
  id: string;
  eventType: string;
  userId?: string;
  username?: string;
  role?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionStart?: string;
  sessionEnd?: string;
  sessionDuration?: number;
  createdAt: string;
}

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  changes?: string;
  beforeState?: string;
  afterState?: string;
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

interface LogData {
  logs?: any[];
  sessionLogs?: SessionLog[];
  auditLogs?: AuditLog[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminLogsPage() {
  const [logType, setLogType] = useState<'session' | 'audit' | 'all'>('all');
  const [data, setData] = useState<LogData>({});
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    username: '',
    action: 'ALL',
    eventType: 'ALL',
    entityType: 'ALL',
    entityId: '',
    ipAddress: '',
    dateFrom: '',
    dateTo: '',
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLogs();
  }, [logType, page, limit]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
      };

      if (logType !== 'audit') {
        Object.assign(params, {
          username: filters.username || undefined,
          eventType: filters.eventType !== 'ALL' ? filters.eventType : undefined,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          ipAddress: filters.ipAddress || undefined,
        });
      }

      if (logType !== 'session') {
        Object.assign(params, {
          username: filters.username || undefined,
          action: filters.action !== 'ALL' ? filters.action : undefined,
          entityType: filters.entityType !== 'ALL' ? filters.entityType : undefined,
          entityId: filters.entityId || undefined,
          ipAddress: filters.ipAddress || undefined,
        });
      }

      params.logType = logType;

      const result = await api.get('/logs/all', params);
      setData(result);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const getSessionEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'LOGIN_SUCCESS': return <LogIn className="text-green-600" size={18} />;
      case 'LOGIN_FAILED': return <AlertCircle className="text-red-600" size={18} />;
      case 'LOGOUT': return <LogOut className="text-blue-600" size={18} />;
      case 'SESSION_EXPIRED': return <Shield className="text-yellow-600" size={18} />;
      default: return <History size={18} />;
    }
  };

  const getSessionEventColor = (eventType: string) => {
    switch (eventType) {
      case 'LOGIN_SUCCESS': return 'bg-green-100 text-green-700';
      case 'LOGIN_FAILED': return 'bg-red-100 text-red-700';
      case 'LOGOUT': return 'bg-blue-100 text-blue-700';
      case 'SESSION_EXPIRED': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAuditActionColor = (action: string) => {
    switch (action) {
      case 'VEHICLE_CREATED': return 'bg-green-100 text-green-700';
      case 'VEHICLE_UPDATED': return 'bg-blue-100 text-blue-700';
      case 'VEHICLE_DELETED': return 'bg-red-100 text-red-700';
      case 'VEHICLE_PUBLISHED': return 'bg-green-200 text-green-800';
      case 'VEHICLE_UNPUBLISHED': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const allLogs = [
    ...(data.sessionLogs?.map(log => ({ ...log, type: 'session' })) || []),
    ...(data.auditLogs?.map(log => ({ ...log, type: 'audit' })) || []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const paginatedLogs = allLogs.slice((page - 1) * limit, page * limit);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Logs</h1>
          <p className="text-sm text-gray-600">
            Authentication events and admin actions
          </p>
        </div>
      </div>

      {/* Log Type Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setLogType('all'); setPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              logType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => { setLogType('session'); setPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              logType === 'session'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Session Logs
          </button>
          <button
            onClick={() => { setLogType('audit'); setPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              logType === 'audit'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Admin Actions
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Username */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Username/Email..."
              value={filters.username}
              onChange={(e) => handleFilterChange('username', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Type (Audit) */}
          {logType !== 'session' && (
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              <option value="VEHICLE_CREATED">Vehicle Created</option>
              <option value="VEHICLE_UPDATED">Vehicle Updated</option>
              <option value="VEHICLE_PUBLISHED">Vehicle Published</option>
              <option value="VEHICLE_UNPUBLISHED">Vehicle Unpublished</option>
              <option value="VEHICLE_DELETED">Vehicle Deleted</option>
            </select>
          )}

          {/* Event Type (Session) */}
          {logType !== 'audit' && (
            <select
              value={filters.eventType}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="ALL">All Events</option>
              <option value="LOGIN_SUCCESS">Login Success</option>
              <option value="LOGIN_FAILED">Login Failed</option>
              <option value="LOGOUT">Logout</option>
              <option value="SESSION_EXPIRED">Session Expired</option>
            </select>
          )}

          {/* Entity Type (Audit) */}
          {logType !== 'session' && (
            <select
              value={filters.entityType}
              onChange={(e) => handleFilterChange('entityType', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="ALL">All Entities</option>
              <option value="VEHICLE">Vehicle</option>
              <option value="INQUIRY">Inquiry</option>
            </select>
          )}

          {/* Entity ID */}
          {logType !== 'session' && (
            <input
              type="text"
              placeholder="Entity ID..."
              value={filters.entityId}
              onChange={(e) => handleFilterChange('entityId', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}

          {/* IP Address */}
          <input
            type="text"
            placeholder="IP Address..."
            value={filters.ipAddress}
            onChange={(e) => handleFilterChange('ipAddress', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Date From */}
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Date To */}
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={fetchLogs}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              setFilters({
                username: '',
                action: 'ALL',
                eventType: 'ALL',
                entityType: 'ALL',
                entityId: '',
                ipAddress: '',
                dateFrom: '',
                dateTo: '',
              });
              setPage(1);
            }}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{paginatedLogs.length}</span> of{' '}
        <span className="font-semibold text-gray-900">{allLogs.length}</span> logs
      </p>

      {/* Logs List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {paginatedLogs.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {paginatedLogs.map((log: any) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${log.type === 'session' ? getSessionEventColor(log.eventType) : getAuditActionColor(log.action)}`}>
                    {log.type === 'session' ? getSessionEventIcon(log.eventType) : <Car size={18} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {log.type === 'session' ? log.eventType : log.action}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            log.type === 'session' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {log.type === 'session' ? 'SESSION' : 'AUDIT'}
                          </span>
                          {log.type === 'audit' && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700`}>
                              {log.entityType}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">
                            {log.type === 'session' ? log.username || 'N/A' : log.user?.name || 'N/A'}
                          </span>
                          {log.role && <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">({log.role})</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 text-xs text-gray-500">
                        <Clock size={14} />
                        <span>{formatDate(log.createdAt)}</span>
                      </div>
                    </div>

                    {/* Vehicle Info */}
                    {log.type === 'audit' && log.vehicle && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {log.vehicle.make} {log.vehicle.model}
                        </p>
                      </div>
                    )}

                    {/* Session Duration */}
                    {log.type === 'session' && log.sessionDuration && (
                      <p className="text-xs text-gray-600 mb-2">
                        Duration: <span className="font-medium">{formatDuration(log.sessionDuration)}</span>
                      </p>
                    )}

                    {/* Expandable Details */}
                    <div>
                      <button
                        onClick={() => toggleLogExpansion(log.id)}
                        className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 flex items-center gap-1"
                      >
                        {expandedLogs.has(log.id) ? (
                          <>
                            <ChevronUp size={14} /> Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} /> View Details
                          </>
                        )}
                      </button>
                      {expandedLogs.has(log.id) && (
                        <div className="mt-2 space-y-2">
                          {log.type === 'session' && (
                            <>
                              {log.sessionStart && (
                                <div className="bg-gray-50 rounded-lg p-2">
                                  <p className="text-xs text-gray-500">Session Start</p>
                                  <p className="text-sm text-gray-900">{formatDate(log.sessionStart)}</p>
                                </div>
                              )}
                              {log.sessionEnd && (
                                <div className="bg-gray-50 rounded-lg p-2">
                                  <p className="text-xs text-gray-500">Session End</p>
                                  <p className="text-sm text-gray-900">{formatDate(log.sessionEnd)}</p>
                                </div>
                              )}
                              {log.userAgent && (
                                <div className="bg-gray-50 rounded-lg p-2">
                                  <p className="text-xs text-gray-500">User Agent</p>
                                  <p className="text-xs text-gray-900 break-all">{log.userAgent}</p>
                                </div>
                              )}
                            </>
                          )}
                          {log.type === 'audit' && (
                            <>
                              {log.beforeState && (
                                <details className="group">
                                  <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                                    Before State
                                  </summary>
                                  <pre className="mt-2 text-xs bg-gray-100 rounded-lg p-3 overflow-auto max-h-32">
                                    {JSON.stringify(JSON.parse(log.beforeState), null, 2)}
                                  </pre>
                                </details>
                              )}
                              {log.afterState && (
                                <details className="group">
                                  <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                                    After State
                                  </summary>
                                  <pre className="mt-2 text-xs bg-gray-100 rounded-lg p-3 overflow-auto max-h-32">
                                    {JSON.stringify(JSON.parse(log.afterState), null, 2)}
                                  </pre>
                                </details>
                              )}
                              {log.changes && (
                                <details className="group">
                                  <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                                    Request Changes
                                  </summary>
                                  <pre className="mt-2 text-xs bg-gray-100 rounded-lg p-3 overflow-auto max-h-32">
                                    {log.changes}
                                  </pre>
                                </details>
                              )}
                            </>
                          )}
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-xs text-gray-500">IP Address</p>
                            <p className="text-sm text-gray-900">{log.ipAddress || 'N/A'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <History className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No logs found</h3>
            <p className="text-sm text-gray-600">
              {Object.values(filters).some(f => f && f !== 'ALL')
                ? 'Try adjusting your filters'
                : 'No logs recorded yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">
            Page {page} of {data.pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">{page}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === data.pagination.totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
