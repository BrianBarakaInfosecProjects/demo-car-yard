import Navbar from '@/components/Navbar';
import Footer from '@/components/sections/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--navbar-height)' }} className="min-h-screen flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
