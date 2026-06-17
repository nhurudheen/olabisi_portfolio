import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg">Olabisi Olaigbe <span className="text-gold text-xs tracking-[0.18em] ml-1">ACA</span></p>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs">
            Business & Career Coach  <br />
            Helping professionals grow income through clarity, structure
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
            <li><a href="https://gidira.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gold">Gidira</a></li>
            <li><a href="https://www.linkedin.com/in/olabisi-olaigbe?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer" className="hover:text-gold">LinkedIn</a></li>
            <li><a href="mailto:olabisiolaigbe@gidira.com" className="hover:text-gold">olabisiolaigbe@gidira.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-5 text-xs tracking-[0.18em] uppercase text-muted-foreground flex justify-between">
          <span>© {new Date().getFullYear()} Olabisi Olaigbe</span>
          <span className="text-gold"></span>
        </div>
      </div>
    </footer>
  );
}
