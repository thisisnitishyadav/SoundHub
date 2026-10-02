'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/layouts/navbar/Navbar';
import Footer from '@/components/footer/Footer';

export default function CustomerLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
