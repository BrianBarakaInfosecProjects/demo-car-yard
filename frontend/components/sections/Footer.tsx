import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{ borderTop: '0.5px solid var(--border-color)' }}
      className="bg-bg-card mt-auto">

      <div className="max-w-7xl mx-auto px-6 py-6">

        <div className="flex flex-col md:flex-row
                        items-center md:items-start
                        justify-between gap-6">

          <div>
            <p className="font-heading text-lg font-semibold
                           text-gold">
              Sassy Auto Trading
            </p>
            <p className="text-stone text-xs mt-0.5">
              Nairobi · Est. 2001
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/inventory"
                 className="text-stone text-sm
                            hover:text-gold transition-colors">
              Inventory
            </Link>
            <Link href="/#about"
                 className="text-stone text-sm
                            hover:text-gold transition-colors">
              About
            </Link>
            <Link href="/#visit-us"
                 className="text-stone text-sm
                            hover:text-gold transition-colors">
              Visit Us
            </Link>
          </div>

          <div className="flex flex-col items-center
                          md:items-end gap-1">
            <a href="tel:+254704416897"
               className="text-stone text-sm
                          hover:text-gold transition-colors">
              +254 704 416 897
            </a>
            <div className="flex items-center gap-4 mt-1">
              <Link href="/privacy"
                 className="text-stone text-xs
                            hover:text-gold transition-colors">
                Privacy
              </Link>
              <Link href="/terms"
                 className="text-stone text-xs
                            hover:text-gold transition-colors">
                Terms
              </Link>
            </div>
          </div>

        </div>

        <div
          style={{ borderTop: '0.5px solid var(--border-color)' }}
          className="mt-5 pt-4">
          <p className="text-stone text-xs text-center">
            © {new Date().getFullYear()} Sassy Auto Trading Kenya.
            All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
