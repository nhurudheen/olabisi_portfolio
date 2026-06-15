import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg">Olabisi Olaigbe <span className="text-gold text-xs tracking-[0.18em] ml-1">ACA</span></p>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs">
            Business & Career Coach helping professionals grow income through clarity, structure
            and strategic visibility.
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Explore</p>
          <ul className="space-y-2 text-foreground/75">
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/shop" className="hover:text-gold">Ebooks</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Work with me</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Elsewhere</p>
          <ul className="space-y-2 text-foreground/75">
            <li><a href="#" className="hover:text-gold">LinkedIn</a></li>
            <li><a href="#" className="hover:text-gold">Instagram</a></li>
            <li><a href="mailto:hello@olabisi.co" className="hover:text-gold">hello@olabisi.co</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-5 text-xs tracking-[0.18em] uppercase text-muted-foreground flex justify-between">
          <span>© {new Date().getFullYear()} Olabisi Olaigbe</span>
          <span className="text-gold">Made with intent</span>
        </div>
      </div>
    </footer>
  );
}
