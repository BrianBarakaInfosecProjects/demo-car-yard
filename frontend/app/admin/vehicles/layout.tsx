'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
  { href: '/admin/vehicles', label: 'Vehicles', icon: 'vehicles' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: 'inquiries' },
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

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNewPage = pathname === '/admin/vehicles/new';

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

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
            </Link>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1a56db] flex items-center justify-center text-white text-[11px] font-medium flex-shrink-0">
            AU
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-gray-900 truncate">Admin User</div>
            <div className="text-[10px] text-gray-500 truncate">admin@sassyauto.co.ke</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Minimal Topbar - only show page title */}
        <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <div className="text-[15px] font-medium text-gray-900">Vehicles</div>
            <div className="text-[11px] text-gray-500">Manage your vehicle inventory</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
