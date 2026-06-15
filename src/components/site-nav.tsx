import { NavLink, Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export function SiteNav() {
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/shop", label: "Ebooks" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-lg tracking-tight">
            Olabisi <span className="text-gold">Olaigbe</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `transition-colors ${isActive ? "text-gold" : "text-foreground/75 hover:text-gold"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open cart"
            className="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-gold text-primary-foreground text-[10px] font-bold inline-flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <button
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-border"
            onClick={() => setMobile((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobile && (
        <div className="md:hidden border-t border-border/60 px-5 py-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobile(false)}
              className="block text-sm text-foreground/80 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
