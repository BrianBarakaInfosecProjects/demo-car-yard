'use client';

import { useState } from 'react';
import { Save, Shield, Bell, Palette, User, ChevronDown, Check } from 'lucide-react';
import React from 'react';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  items: {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
  }[];
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [showNotifications, setShowNotifications] = useState(false);

  const settingsData: Record<string, SettingsSection> = {
    general: {
      id: 'general',
      title: 'General Settings',
      description: 'Manage your general preferences',
      items: [
        {
          id: 'site-name',
          label: 'Site Name',
          description: 'The name of your website',
          enabled: true,
        },
        {
          id: 'timezone',
          label: 'Timezone',
          description: 'Your local timezone',
          enabled: true,
        },
        {
          id: 'language',
          label: 'Language',
          description: 'Preferred language',
          enabled: true,
        },
        {
          id: 'maintenance',
          label: 'Maintenance Mode',
          description: 'Put site under maintenance',
          enabled: false,
        },
      ],
    },
    notifications: {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification preferences',
      items: [
        {
          id: 'new-inquiry',
          label: 'New Inquiries',
          description: 'Email when someone inquires',
          enabled: true,
        },
        {
          id: 'new-vehicle',
          label: 'New Vehicles',
          description: 'Email when vehicle added',
          enabled: true,
        },
        {
          id: 'daily-summary',
          label: 'Daily Summary',
          description: 'Daily digest of activities',
          enabled: false,
        },
        {
          id: 'weekly-report',
          label: 'Weekly Report',
          description: 'Weekly performance report',
          enabled: true,
        },
      ],
    },
    security: {
      id: 'security',
      title: 'Security Settings',
      description: 'Manage your account security',
      items: [
        {
          id: '2fa',
          label: 'Two-Factor Authentication',
          description: 'Add extra layer of security',
          enabled: false,
        },
        {
          id: 'session-timeout',
          label: 'Session Timeout',
          description: 'Auto logout after inactivity',
          enabled: true,
        },
        {
          id: 'ip-whitelist',
          label: 'IP Whitelist',
          description: 'Restrict access by IP',
          enabled: false,
        },
        {
          id: 'audit-logs',
          label: 'Audit Logs',
          description: 'Track all admin activities',
          enabled: true,
        },
      ],
    },
    appearance: {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize the look and feel',
      items: [
        {
          id: 'theme',
          label: 'Theme',
          description: 'Choose your preferred theme',
          enabled: true,
        },
        {
          id: 'sidebar-collapsed',
          label: 'Collapsed Sidebar',
          description: 'Show sidebar in collapsed mode',
          enabled: false,
        },
        {
          id: 'compact-view',
          label: 'Compact View',
          description: 'Show more items per page',
          enabled: false,
        },
        {
          id: 'animations',
          label: 'Animations',
          description: 'Enable interface animations',
          enabled: true,
        },
      ],
    },
  };

  const toggleSetting = (sectionId: string, itemId: string) => {
    console.log(`Toggling ${sectionId}:${itemId}`);
    setSaving(true);
    setTimeout(() => setSaving(false), 500);
  };

  const sections = Object.values(settingsData);
  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600">
            Manage your admin panel preferences
          </p>
        </div>
        <button
          onClick={() => {
            setSaving(true);
            setTimeout(() => setSaving(false), 1000);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={saving}
        >
          <Save size={18} />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Settings Categories */}
        <div className="space-y-2">
          {sections.map((section) => {
            const Icon = section.id === 'general' ? Palette :
                       section.id === 'notifications' ? Bell :
                       section.id === 'security' ? Shield :
                       User;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{section.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Settings Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Section Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {currentSection?.title}
            </h2>
            <p className="text-sm text-gray-600">
              {currentSection?.description}
            </p>
          </div>

          {/* Settings Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {currentSection?.items.map((item, index) => (
              <div
                key={item.id}
                className={`p-6 border-b border-gray-200 last:border-b-0 ${
                  index % 2 === 0 && index !== 0 ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0">
                      {index % 2 === 0 ? (
                        index === 0 ? <Palette size={18} /> : <Bell size={18} />
                      ) : (
                        index === 2 ? <Shield size={18} /> : <User size={18} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleSetting(currentSection.id, item.id)}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      item.enabled
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                        item.enabled ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                    {item.enabled && (
                      <Check size={14} className="absolute right-0.5 top-0.5 text-blue-600" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Check size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Changes Saved Successfully
                </h4>
                <p className="text-xs text-blue-700">
                  Your settings have been updated. Changes will take effect immediately unless otherwise noted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
