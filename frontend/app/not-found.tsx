import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-ink flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6">
          <span className="font-serif text-8xl font-bold text-brand-gold">404</span>
        </div>
        <h1 className="font-serif text-3xl text-brand-cream-warm mb-3">Page Not Found</h1>
        <p className="text-text-secondary mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-ink font-bold rounded-lg hover:bg-brand-gold-lt transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
