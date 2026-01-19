'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated as checkAuth, logout } from '@/lib/auth';
import {
  LayoutDashboard, Car, Mail, Star, Settings, Users, LogOut,
  ChevronRight, Home, Menu, X, Search, BarChart3, History
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/vehicles', label: 'Vehicles', icon: Car },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/activity-logs', label: 'Activity Logs', icon: History },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const auth = checkAuth();
    setIsAuthenticated(auth);
    console.log('AdminLayout useEffect - auth:', auth, 'pathname:', pathname);
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    }

    if (!auth && !pathname.includes('/auth/login')) {
      console.log('AdminLayout - Redirecting to login');
      router.push('/auth/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const breadcrumbs = pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 flex items-stretch admin-page">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:inset-y-auto lg:transform-none lg:z-auto lg:flex lg:flex-shrink-0 lg:shadow-none lg:h-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full lg:h-[calc(100vh-64px)]">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Car className="text-white" size={24} />
              </div>
              <span className="text-lg font-bold text-gray-900">TrustAuto Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 font-semibold' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                      {isActive && <ChevronRight size={16} className="ml-auto" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@trustauto.co.ke'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-auto">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Breadcrumbs */}
                <nav className="hidden sm:flex items-center space-x-2 text-sm">
                  <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                    <Home size={16} />
                  </Link>
                  <ChevronRight size={16} className="text-gray-400" />
                      {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                          <React.Fragment key={crumb}>
                            {isLast ? (
                              <span className="text-gray-900 font-medium capitalize">{crumb}</span>
                            ) : (
                              <>
                                <Link 
                                  href={`/${breadcrumbs.slice(0, index + 1).join('/')}`}
                                  className="text-gray-600 hover:text-gray-900 transition-colors capitalize"
                                >
                                  {crumb}
                                </Link>
                                <ChevronRight size={16} className="text-gray-400" />
                              </>
                            )}
                          </React.Fragment>
                        );
                      })}
                </nav>
              </div>

              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-sm"
                  />
                </div>

                {/* Notifications */}
                <NotificationBell />

                 {/* Profile */}
                 <div className="hidden md:flex items-center space-x-2 pl-3 border-l border-gray-200">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
                  </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full min-w-0">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
