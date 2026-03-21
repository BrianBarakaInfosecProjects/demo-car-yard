'use client';

import { useState, useEffect } from 'react';
import { Shield, Bell, Palette, User, Plus, Trash2, Key, X, Check } from 'lucide-react';
import { Toast } from '@/components/admin/Toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface SettingsSection {
  id: string;
  title: string;
  description: string;
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', role: 'ADMIN' });
  const [resetPassword, setResetPassword] = useState('');
  const [dealerPhone, setDealerPhone] = useState('0722000000');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  useEffect(() => {
    fetchUsers();
    fetchSettings();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.dealerPhone) setDealerPhone(data.dealerPhone);
      }
    } catch (err: any) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create user');
      showToast('success', 'User created successfully');
      setShowCreateModal(false);
      setNewUser({ email: '', password: '', name: '', role: 'ADMIN' });
      fetchUsers();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete user');
      showToast('success', 'User deleted successfully');
      fetchUsers();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: resetPassword }),
      });
      if (!response.ok) throw new Error('Failed to reset password');
      showToast('success', 'Password reset successfully');
      setShowResetModal(false);
      setResetPassword('');
      setSelectedUser(null);
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/${userId}/role`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error('Failed to update role');
      showToast('success', 'Role updated successfully');
      fetchUsers();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-700';
      case 'EDITOR': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const sections: SettingsSection[] = [
    { id: 'general', title: 'General', description: 'General preferences' },
    { id: 'notifications', title: 'Notifications', description: 'Notification settings' },
    { id: 'security', title: 'Security', description: 'Security settings' },
    { id: 'appearance', title: 'Appearance', description: 'UI preferences' },
    { id: 'users', title: 'Users', description: 'User management' },
  ];

  const sectionIcons: Record<string, JSX.Element> = {
    general: <Palette size={14} />,
    notifications: <Bell size={14} />,
    security: <Shield size={14} />,
    appearance: <Palette size={14} />,
    users: <User size={14} />,
  };

  const [settings, setSettings] = useState({
    siteName: true,
    timezone: true,
    language: true,
    maintenance: false,
    newInquiry: true,
    newVehicle: true,
    dailySummary: false,
    weeklyReport: true,
    twoFactor: false,
    sessionTimeout: true,
    ipWhitelist: false,
    auditLogs: true,
    theme: true,
    sidebarCollapsed: false,
    compactView: false,
    animations: true,
  });

  const toggleSetting = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));
    
    const labelMap: Record<string, string> = {
      siteName: 'Site Name',
      timezone: 'Timezone',
      language: 'Language',
      maintenance: 'Maintenance Mode',
      newInquiry: 'New Inquiries',
      newVehicle: 'New Vehicles',
      dailySummary: 'Daily Summary',
      weeklyReport: 'Weekly Report',
      twoFactor: 'Two-Factor Auth',
      sessionTimeout: 'Session Timeout',
      ipWhitelist: 'IP Whitelist',
      auditLogs: 'Audit Logs',
      theme: 'Theme',
      sidebarCollapsed: 'Collapsed Sidebar',
      compactView: 'Compact View',
      animations: 'Animations',
    };

    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: newValue }),
      });
      showToast('success', `${labelMap[key]} ${newValue ? 'enabled' : 'disabled'}`);
    } catch {
      setSettings((prev) => ({ ...prev, [key]: !newValue }));
      showToast('error', 'Failed to save setting');
    }
  };

  const saveDealerPhone = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('error', 'You are not logged in');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealerPhone }),
      });
      if (!response.ok) throw new Error('Failed to save');
      showToast('success', 'Dealer phone updated');
    } catch {
      showToast('error', 'Failed to update phone');
    } finally {
      setSaving(false);
    }
  };

  const currentSection = sections.find((s) => s.id === activeSection);

  const renderSettingsContent = () => {
    const items = {
      general: [
        { id: 'siteName', key: 'siteName' as const, label: 'Site Name', desc: 'Website name' },
        { id: 'timezone', key: 'timezone' as const, label: 'Timezone', desc: 'Local timezone' },
        { id: 'language', key: 'language' as const, label: 'Language', desc: 'Preferred language' },
        { id: 'maintenance', key: 'maintenance' as const, label: 'Maintenance Mode', desc: 'Put site under maintenance' },
        { id: 'dealerPhone', key: 'dealerPhone' as const, label: 'Dealer Phone', desc: 'Phone on car listings', isPhone: true },
      ],
      notifications: [
        { id: 'newInquiry', key: 'newInquiry' as const, label: 'New Inquiries', desc: 'Email when someone inquires' },
        { id: 'newVehicle', key: 'newVehicle' as const, label: 'New Vehicles', desc: 'Email when vehicle added' },
        { id: 'dailySummary', key: 'dailySummary' as const, label: 'Daily Summary', desc: 'Daily digest of activities' },
        { id: 'weeklyReport', key: 'weeklyReport' as const, label: 'Weekly Report', desc: 'Weekly performance report' },
      ],
      security: [
        { id: 'twoFactor', key: 'twoFactor' as const, label: 'Two-Factor Auth', desc: 'Add extra security layer' },
        { id: 'sessionTimeout', key: 'sessionTimeout' as const, label: 'Session Timeout', desc: 'Auto logout after inactivity' },
        { id: 'ipWhitelist', key: 'ipWhitelist' as const, label: 'IP Whitelist', desc: 'Restrict access by IP' },
        { id: 'auditLogs', key: 'auditLogs' as const, label: 'Audit Logs', desc: 'Track admin activities' },
      ],
      appearance: [
        { id: 'theme', key: 'theme' as const, label: 'Theme', desc: 'Choose your preferred theme' },
        { id: 'sidebarCollapsed', key: 'sidebarCollapsed' as const, label: 'Collapsed Sidebar', desc: 'Show sidebar collapsed' },
        { id: 'compactView', key: 'compactView' as const, label: 'Compact View', desc: 'Show more items per page' },
        { id: 'animations', key: 'animations' as const, label: 'Animations', desc: 'Enable interface animations' },
      ],
    };

    const sectionItems = items[activeSection as keyof typeof items];
    if (!sectionItems) return null;

    return (
      <div className="divide-y divide-gray-50">
        {sectionItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                {activeSection === 'general' && item.id === 'dealerPhone' ? (
                  <Palette size={14} />
                ) : (
                  sectionIcons[activeSection]
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-none">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
            <>
              {(item as any).isPhone ? (
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="tel"
                    value={dealerPhone}
                    onChange={(e) => setDealerPhone(e.target.value)}
                    className="w-32 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                    placeholder="07XXXXXXXX"
                  />
                  <button
                    onClick={saveDealerPhone}
                    disabled={saving}
                    className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 min-w-[50px]"
                  >
                    {saving ? '...' : 'Save'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => toggleSetting(item.key as any)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                    (settings as any)[item.key] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      (settings as any)[item.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              )}
            </>
          </div>
        ))}
      </div>
    );
  };

  const renderUsersContent = () => (
    <div className="overflow-auto max-h-[calc(100vh-280px)]">
      <table className="w-full">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Role</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No users</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{user.email}</td>
                <td className="px-4 py-2.5">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${getRoleColor(user.role)}`}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => { setSelectedUser(user); setShowResetModal(true); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Reset Password"
                    >
                      <Key size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          <Plus size={14} /> Add User
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your admin panel preferences</p>
        </div>
      </div>

      {/* Two-column settings panel */}
      <div className="flex gap-0 flex-1 min-h-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Left tabs */}
        <nav className="w-40 shrink-0 border-r border-gray-100 py-2 flex flex-col bg-gray-50/50">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {sectionIcons[section.id]}
              {section.title}
            </button>
          ))}
        </nav>

        {/* Right content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Section header */}
          <div className="px-5 py-3 border-b border-gray-100 shrink-0">
            <h2 className="text-sm font-semibold text-gray-900">{currentSection?.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{currentSection?.description}</p>
          </div>
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {activeSection === 'users' ? renderUsersContent() : renderSettingsContent()}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-base font-semibold">Create User</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-4 space-y-3">
              <input type="text" required placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input type="email" required placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input type="password" required minLength={6} placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="ADMIN">Admin</option>
                <option value="EDITOR">Editor</option>
                <option value="VIEWER">Viewer</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-base font-semibold">Reset Password</h3>
              <button onClick={() => { setShowResetModal(false); setSelectedUser(null); }} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-4 space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
                Resetting: <strong>{selectedUser.name}</strong>
              </div>
              <input type="password" required minLength={6} placeholder="New password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setShowResetModal(false); setSelectedUser(null); }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Reset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
