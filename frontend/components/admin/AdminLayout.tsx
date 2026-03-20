'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated as checkAuth, logout } from '@/lib/auth';
import { api } from '@/lib/api';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
  { href: '/admin/vehicles', label: 'Vehicles', icon: 'vehicles' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: 'inquiries', badge: true },
  { href: '/admin/activity-logs', label: 'Activity Logs', icon: 'logs' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' },
];

const icons: Record<string, JSX.Element> = {
  dashboard: <svg viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/><rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg>,
  analytics: <svg viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5"><rect x="1" y="8" width="3" height="5"/><rect x="5.5" y="5" width="3" height="8"/><rect x="10" y="2" width="3" height="11"/></svg>,
  vehicles: <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><path d="M2 8l1.5-4h7L12 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><rect x="1" y="8" width="12" height="3" rx="1" fill="currentColor" opacity="0.5"/><circle cx="3.5" cy="11.5" r="1" fill="currentColor"/><circle cx="10.5" cy="11.5" r="1" fill="currentColor"/></svg>,
  inquiries: <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><rect x="1" y="2" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5h6M4 7.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  logs: <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  settings: <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.5 2.5l1.5 1.5M10 10l1.5 1.5M2.5 11.5L4 10M10 4l1.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [stats, setStats] = useState({ totalVehicles: 0, totalInquiries: 0, pendingInquiries: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const chartsInited = useRef(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/export`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sassy-auto-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const auth = checkAuth();
    setIsAuthenticated(auth);
    
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    }

    if (!auth && !pathname.includes('/auth/login')) {
      router.push('/auth/login');
    }

    fetchData();
  }, [pathname, router]);

  const fetchData = async () => {
    try {
      const [vehicles, inquiries] = await Promise.all([
        api.get('/vehicles'),
        api.get('/inquiries'),
      ]);
      
      const vehiclesArray = Array.isArray(vehicles) ? vehicles : vehicles.vehicles || [];
      const inquiriesArray = Array.isArray(inquiries) ? inquiries : inquiries.inquiries || [];
      
      setStats({
        totalVehicles: vehiclesArray.length,
        totalInquiries: inquiriesArray.length,
        pendingInquiries: inquiriesArray.filter((i: any) => i.status === 'PENDING' || i.status === 'NEW').length,
      });

      const activity = [
        { type: 'inquiry', message: 'New inquiry received', detail: 'Toyota Vitz 2021', time: '2 min ago', user: 'James Mwangi' },
        { type: 'sale', message: 'Vehicle marked as sold', detail: 'Subaru Forester 2018', time: '1 hr ago', user: 'Admin' },
        { type: 'testdrive', message: 'Test drive scheduled', detail: 'Honda Fit, 17 Mar', time: '3 hr ago', user: 'Grace Otieno' },
        { type: 'listing', message: 'New vehicle listed', detail: 'Mazda Demio 2020', time: 'Yesterday', user: 'Admin' },
      ];
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const formatDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const getPageTitle = () => {
    const path = pathname.split('/').pop() || 'dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  const getPageSubtitle = () => {
    const path = pathname.split('/').pop() || 'dashboard';
    switch (path) {
      case 'dashboard': return `Welcome back, Admin — ${formatDate()}`;
      case 'analytics': return 'Overview of car yard performance';
      case 'vehicles': return `${stats.totalVehicles} vehicles · ${stats.totalVehicles - 3} available · 2 sold`;
      case 'inquiries': return `${stats.totalInquiries} total · ${stats.pendingInquiries} unread · ${stats.pendingInquiries} pending response`;
      case 'activity-logs': return 'Track all user actions and changes';
      case 'settings': return 'Manage your admin panel preferences';
      default: return '';
    }
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // Skip sidebar/header for routes that have their own layout (e.g., /admin/vehicles)
  const skipLayout = pathname.startsWith('/admin/vehicles');

  if (skipLayout) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-[200px] min-w-[200px] bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#1a56db] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 10l2-5h8l2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="1" y="10" width="14" height="3" rx="1.5" fill="white" opacity="0.9"/>
                <circle cx="4" cy="13" r="1" fill="white"/>
                <circle cx="12" cy="13" r="1" fill="white"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Sassy Auto Trading</div>
              <div className="text-[10px] text-gray-500">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-0 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-4 py-2 text-[12px] transition-all ${
                isActive(item.href)
                  ? 'bg-[#eff6ff] text-[#1a56db] font-medium border-r-2 border-[#1a56db]'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`${isActive(item.href) ? 'opacity-100' : 'opacity-70'}`}>
                {icons[item.icon]}
              </span>
              <span>{item.label}</span>
              {item.badge && stats.pendingInquiries > 0 && (
                <span style={{ marginLeft: 'auto', background: '#1a56db', color: 'white', fontSize: '9px', padding: '1px 5px', borderRadius: '8px' }}>
                  {stats.pendingInquiries}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1a56db] flex items-center justify-center text-white text-[11px] font-medium flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'AU'}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-gray-900 truncate">{user?.name || 'Admin User'}</div>
            <div className="text-[10px] text-gray-500 truncate">{user?.email || 'admin@sassyauto.co.ke'}</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="text-[15px] font-medium text-gray-900">{getPageTitle()}</div>
            <div className="text-[11px] text-gray-500">{getPageSubtitle()}</div>
          </div>
          <div className="flex gap-2">
            {pathname === '/admin/dashboard' && (
              <button 
                onClick={() => window.location.reload()}
                className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              >
                ↻ Refresh
              </button>
            )}
            <button 
              onClick={handleExport}
              disabled={exporting}
              className="px-3 py-1.5 text-[12px] bg-[#1a56db] text-white rounded-md hover:bg-[#1e40af] disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : '↓ Export report'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 pt-4">
          {children}
        </main>
      </div>
    </div>
  );
}
