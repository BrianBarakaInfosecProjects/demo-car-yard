// Admin layout — isolated from public Sassy dark theme
// Do not import public Navbar or public CSS variables here

import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
