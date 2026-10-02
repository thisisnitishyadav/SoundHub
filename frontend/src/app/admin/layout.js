'use client';
import { AdminAuthProvider } from '@/lib/AdminAuthContext';

export default function AdminRootLayout({ children }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
