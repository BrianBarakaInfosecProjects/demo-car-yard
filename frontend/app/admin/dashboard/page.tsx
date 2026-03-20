'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    featuredVehicles: 0,
    soldThisMonth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [agingVehicles, setAgingVehicles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const chartsInited = useRef(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      
      // Fetch real analytics data
      const [analytics, vehicles, inquiries, auditLogs] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/vehicles'),
        api.get('/inquiries'),
        api.get('/analytics/audit-logs?limit=5').catch(() => ({ logs: [] })),
      ]);
      
      const vehiclesArray = Array.isArray(vehicles) ? vehicles : vehicles.vehicles || [];
      const inquiriesArray = Array.isArray(inquiries) ? inquiries : inquiries.inquiries || [];
      
      // Calculate aging vehicles (60+ days listed)
      const now = new Date();
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      
      const aging = vehiclesArray.filter((v: any) => {
        const created = new Date(v.createdAt || Date.now());
        return created < sixtyDaysAgo;
      }).slice(0, 2);

      // Use analytics data for stats
      setStats({
        totalVehicles: analytics?.totalVehicles || vehiclesArray.length,
        totalInquiries: analytics?.totalInquiries || inquiriesArray.length,
        pendingInquiries: analytics?.pendingInquiries || inquiriesArray.filter((i: any) => i.status === 'PENDING' || i.status === 'NEW').length,
        featuredVehicles: analytics?.featuredVehicles || vehiclesArray.filter((v: any) => v.featured).length,
        soldThisMonth: analytics?.soldThisMonth || 0,
      });

      setAgingVehicles(aging);

      // Use real audit logs if available, otherwise empty
      const activity = (auditLogs?.logs || auditLogs || []).map((log: any) => ({
        type: log.action || 'info',
        color: '#1a56db',
        message: log.description || log.action || 'Activity recorded',
        time: log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent',
      }));
      
      if (activity.length === 0) {
        // Fallback empty state
        setRecentActivity([]);
      } else {
        setRecentActivity(activity);
      }

      initCharts();
    } catch (err: any) {
      console.error('Error fetching data:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load dashboard data';
      setError(errorMessage);
    }
  };

  const initCharts = () => {
    if (chartsInited.current) return;
    chartsInited.current = true;

    const loadChart = () => {
      if (typeof window === 'undefined') return;
      
      const Chart = (window as any).Chart;
      if (!Chart) {
        setTimeout(loadChart, 100);
        return;
      }

      const blue = '#1a56db', green = '#10b981', amber = '#f59e0b';
      const gridColor = 'rgba(0,0,0,0.06)';
      const textColor = '#6b7280';

      const baseOpts = { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { display: false }, tooltip: { bodyFont: { size: 11 } } } 
      };

      const salesChartEl = document.getElementById('salesChart');
      if (salesChartEl) {
        new Chart(salesChartEl, {
          type: 'bar',
          data: { 
            labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], 
            datasets: [{ data: [3,5,2,4,6, stats.soldThisMonth], backgroundColor: blue, borderRadius: 4, barThickness: 20 }] 
          },
          options: { 
            ...baseOpts, 
            scales: { 
              x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } }, 
              y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 }, stepSize: 2 }, beginAtZero: true } 
            } 
          }
        });
      }

      const sparkConfigs = [
        { id: 'spark1', data: [2,5,3,7,6, stats.totalVehicles], color: green },
        { id: 'spark2', data: [1,4,2,6,3, stats.totalInquiries], color: amber },
        { id: 'spark3', data: [0,1,0,2,3, stats.soldThisMonth], color: blue },
      ];

      sparkConfigs.forEach(({ id, data, color }) => {
        const el = document.getElementById(id);
        if (el) {
          new Chart(el, { 
            type: 'line', 
            data: { 
              labels: ['','','','','',''], 
              datasets: [{ data, borderColor: color, borderWidth: 1.5, pointRadius: 0, tension: 0.4, fill: false }] 
            }, 
            options: { 
              ...baseOpts, 
              scales: { x: { display: false }, y: { display: false } } 
            } 
          });
        }
      });
    };

    if (document.readyState === 'complete') {
      loadChart();
    } else {
      window.addEventListener('load', loadChart);
    }
  };

  useEffect(() => {
    initCharts();
  }, [stats]);

  const quickActions = [
    { label: 'Add vehicle', icon: '+', href: '/admin/vehicles/new' },
    { label: 'View inquiries', icon: '✉', href: '/admin/inquiries' },
    { label: 'Manage featured', icon: '★', href: '/admin/featured' },
    { label: 'Analytics', icon: '↗', href: '/admin/analytics' },
  ];

  return (
    <div>
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4 text-[11px] text-red-800 flex items-center justify-between">
          <span>Error: {error}</span>
          <button onClick={fetchData} className="underline">Retry</button>
        </div>
      )}

      {/* Alert Bar */}
      {(stats.pendingInquiries > 0 || agingVehicles.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4 text-[11px] text-amber-800 flex items-center gap-2">
          ⚠ {agingVehicles.length} vehicles aging 60+ days · {stats.pendingInquiries} test drives pending confirmation · 
          <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>View all alerts</span>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-2.5 mb-4">
        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-gray-500">Total vehicles</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">+13%</span>
          </div>
          <div className="text-[22px] font-medium text-gray-900 mb-1">{stats.totalVehicles}</div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span>+3 this month</span>
            <canvas id="spark1" className="w-20 h-7"></canvas>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-gray-500">Total inquiries</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">{stats.pendingInquiries} pending</span>
          </div>
          <div className="text-[22px] font-medium text-gray-900 mb-1">{stats.totalInquiries}</div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span>8 this week</span>
            <canvas id="spark2" className="w-20 h-7"></canvas>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-gray-500">Vehicles sold</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">+8%</span>
          </div>
          <div className="text-[22px] font-medium text-gray-900 mb-1">{stats.soldThisMonth}</div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span>this month</span>
            <canvas id="spark3" className="w-20 h-7"></canvas>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-gray-500">Featured listings</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">Active</span>
          </div>
          <div className="text-[22px] font-medium text-gray-900 mb-1">{stats.featuredVehicles}</div>
          <div className="text-[11px] text-gray-500">1 expiring soon</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wide mb-2 mt-4">Quick actions</div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {quickActions.map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="bg-white border border-gray-200 rounded-md py-3 text-center cursor-pointer text-[11px] text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <div className="text-[16px] mb-1">{action.icon}</div>
            {action.label}
          </Link>
        ))}
      </div>

      {/* Two Column: Sales Chart + Activity */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="text-[12px] font-medium text-gray-900 mb-3 flex items-center justify-between">
            Monthly sales <span className="text-[10px] font-normal text-gray-500">last 6 months</span>
          </div>
          <div className="relative h-40"><canvas id="salesChart"></canvas></div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="text-[12px] font-medium text-gray-900 mb-3">Recent activity</div>
          <div className="space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, i) => (
                <div key={i} className="flex gap-2.5 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: item.color }}></div>
                  <div>
                    <div className="text-[11px] text-gray-900">{item.message}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{item.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[11px] text-gray-500 py-4 text-center">No recent activity</div>
            )}
          </div>
        </div>
      </div>

      {/* Aging Showroom */}
      <div className="bg-white border border-gray-200 rounded-lg p-3.5">
        <div className="text-[12px] font-medium text-gray-900 mb-3 flex items-center justify-between">
          Aging inventory 
          {agingVehicles.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">{agingVehicles.length} flagged</span>
          )}
        </div>
        {agingVehicles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr>
                  <th className="text-left py-2 px-2.5 text-gray-500 font-medium border-b border-gray-100">Vehicle</th>
                  <th className="text-left py-2 px-2.5 text-gray-500 font-medium border-b border-gray-100">Listed date</th>
                  <th className="text-left py-2 px-2.5 text-gray-500 font-medium border-b border-gray-100">Days listed</th>
                  <th className="text-left py-2 px-2.5 text-gray-500 font-medium border-b border-gray-100">Views</th>
                  <th className="text-left py-2 px-2.5 text-gray-500 font-medium border-b border-gray-100">Price</th>
                  <th className="text-left py-2 px-2.5 text-gray-500 font-medium border-b border-gray-100">Action</th>
                </tr>
              </thead>
              <tbody>
                {agingVehicles.map((v: any, i: number) => (
                  <tr key={i}>
                    <td className="py-2 px-2.5 font-medium">{v.year} {v.make} {v.model}</td>
                    <td className="py-2 px-2.5">{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-2.5 text-red-600 font-medium">72 days</td>
                    <td className="py-2 px-2.5">{v.viewCount || 0}</td>
                    <td className="py-2 px-2.5">KES {(v.priceKES / 1000000).toFixed(1)}M</td>
                    <td className="py-2 px-2.5">
                      <button className="px-2 py-1 text-[10px] border border-gray-300 rounded bg-white hover:bg-gray-50">Feature</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-[11px] text-gray-500 py-4 text-center">No aging vehicles</div>
        )}
      </div>

      {/* Load Chart.js */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
    </div>
  );
}
