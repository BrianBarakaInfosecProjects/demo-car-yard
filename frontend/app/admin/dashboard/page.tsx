'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Car, Mail, Star, Plus, List, RefreshCw, TrendingUp, TrendingDown, Calendar, X, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalInquiries: 0,
    featuredVehicles: 0,
    recentVehicles: 0,
    soldThisMonth: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [vehicles, inquiries] = await Promise.all([
        api.get('/vehicles'),
        api.get('/inquiries'),
      ]);

      setStats({
        totalVehicles: vehicles.length,
        totalInquiries: inquiries.length,
        featuredVehicles: vehicles.filter((v: any) => v.featured).length,
        recentVehicles: vehicles.filter((v: any) => {
          const createdAt = new Date(v.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdAt > weekAgo;
        }).length,
        soldThisMonth: Math.floor(Math.random() * 5),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
    setTimeout(() => setLoading(false), 1000);
  };

  const handleExport = () => {
    alert('Exporting dashboard report...');
  };

  const statsData = [
    { 
      label: 'Total Vehicles', 
      value: stats.totalVehicles.toString(), 
      trend: 'up', 
      change: '+3',
      percentage: '+13%',
      period: 'this month',
      badge: '2 aging 60+ days',
      badgeColor: 'bg-orange-100 text-orange-700',
      link: '/admin/vehicles',
      icon: Car,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    { 
      label: 'Total Inquiries', 
      value: stats.totalInquiries.toString(), 
      trend: 'neutral', 
      change: stats.totalInquiries.toString(),
      percentage: '',
      period: 'pending',
      badge: 'Hot Leads',
      badgeColor: 'bg-red-100 text-red-700',
      link: '/admin/inquiries',
      icon: Mail,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    { 
      label: 'Featured Vehicles', 
      value: stats.featuredVehicles.toString(), 
      trend: 'up', 
      change: '+1',
      percentage: '',
      period: 'active listings',
      badge: 'High Views',
      badgeColor: 'bg-green-100 text-green-700',
      link: '/admin/vehicles',
      icon: Star,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    }
  ];

  const recentActivities = [
    { type: 'inquiry', message: 'New inquiry received', detail: 'Toyota Harrier 2019', time: '2 hours ago', icon: Mail },
    { type: 'sale', message: 'Vehicle sold', detail: 'Honda Fit 2018', time: '5 hours ago', icon: Car },
    { type: 'featured', message: 'Vehicle featured', detail: 'Mercedes C200 2020', time: '1 day ago', icon: Star }
  ];

  const quickStats = [
    { label: `${stats.recentVehicles} vehicles added`, period: 'this week' },
    { label: `${stats.soldThisMonth} sold`, period: 'this month' },
    { label: '3 pending test drives', period: 'scheduled' }
  ];

  const upcomingAppointments = [
    { title: 'Test Drive - BMW X5', date: 'Today', time: '3:00 PM', customer: 'John Kamau' },
    { title: 'Vehicle Viewing', date: 'Tomorrow', time: '10:00 AM', customer: 'Mary Wanjiru' },
    { title: 'Service Inspection', date: 'Jan 15', time: '2:00 PM', customer: 'Land Cruiser' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-600">Welcome back, Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
        <div className="flex items-center justify-center flex-wrap gap-4 text-sm">
          {quickStats.map((stat, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="font-semibold text-blue-900">{stat.label}</span>
              <span className="text-blue-600">{stat.period}</span>
              {index < quickStats.length - 1 && <span className="text-blue-300 ml-4">|</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              href={stat.link}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group block"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  <Icon className={stat.iconColor} size={20} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${stat.badgeColor}`}>
                  {stat.badge}
                </span>
              </div>

              <h3 className="text-gray-600 text-xs font-medium mb-1">{stat.label}</h3>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' ? (
                      <div className="flex items-center text-green-600 text-xs">
                        <TrendingUp size={14} />
                        <span className="ml-1 font-semibold">{stat.change}</span>
                        {stat.percentage && <span className="ml-1">{stat.percentage}</span>}
                      </div>
                    ) : (
                      <span className="text-gray-600 text-xs font-semibold">{stat.change}</span>
                    )}
                    <span className="text-gray-500 text-xs">{stat.period}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link 
            href="/admin/vehicles/new"
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Plus size={18} className="mr-2" />
            Add New Vehicle
          </Link>
          <Link 
            href="/admin/inquiries"
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Mail size={18} className="mr-2" />
            View Inquiries
          </Link>
          <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
            <Star size={18} className="mr-2" />
            Manage Featured
          </button>
          <Link 
            href="/admin/inquiries"
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <List size={18} className="mr-2" />
            View All Inquiries
          </Link>
        </div>
      </div>

      {/* Activity Feed + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Live</span>
          </div>
          <div className="space-y-2">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'inquiry' ? 'bg-green-100' :
                    activity.type === 'sale' ? 'bg-blue-100' :
                    'bg-orange-100'
                  }`}>
                    <Icon className={`${
                      activity.type === 'inquiry' ? 'text-green-600' :
                      activity.type === 'sale' ? 'text-blue-600' :
                      'text-orange-600'
                    }`} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{activity.detail}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Widget */}
        {showCalendar && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Upcoming</h3>
              <button 
                onClick={() => setShowCalendar(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {upcomingAppointments.map((apt, index) => (
                <div 
                  key={index}
                  className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-2">
                    <Calendar className="text-blue-600 mt-0.5 flex-shrink-0" size={14} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{apt.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5 truncate">{apt.customer}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">{apt.date} • {apt.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium rounded-lg transition-colors">
              View Full Calendar
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Car size={24} className="text-blue-400" />
              <span className="text-lg font-bold">TrustAuto Kenya</span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">Your trusted partner for quality used cars in Kenya. Over 12 years providing customers with transparent pricing and excellent service.</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/inventory" className="hover:text-blue-400 transition-colors">Browse Cars</Link></li>
              <li><Link href="/services" className="hover:text-blue-400 transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Contact Us</h3>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li>📍 Mombasa Road, Nairobi</li>
              <li>📞 0722 000 000</li>
              <li>✉️ info@trustauto.co.ke</li>
              <li>💬 WhatsApp Us</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Business Hours</h3>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li>Mon - Fri: 8:00 AM - 6:00 PM</li>
              <li>Saturday: 9:00 AM - 4:00 PM</li>
              <li>Sunday: 10:00 AM - 2:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2026 TrustAuto Kenya. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}