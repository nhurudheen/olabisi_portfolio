import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, ShoppingCart, Briefcase, BookOpen, MessageSquare, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/ebooks", label: "Ebooks", icon: BookOpen },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  const greet = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const handleLogout = async () => {
    await signOut();
    nav("/admin/login", { replace: true });
  };

  const initials = (user?.email ?? "A")[0].toUpperCase();
  const pageLabel = navItems.find((i) => (i.end ? loc.pathname === i.to : loc.pathname.startsWith(i.to)))?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-6 flex items-center border-b border-border">
          <p className="font-display text-lg">Olabisi <span className="text-gold">Admin</span></p>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive ? "bg-gold/15 text-gold" : "text-foreground/75 hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <i.icon className="h-4 w-4" />
              {i.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)} />}

      {/* Topbar + main */}
      <div className="md:pl-64">
        <header className="h-16 sticky top-0 z-20 bg-background/85 backdrop-blur border-b border-border flex items-center px-4 sm:px-6 justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen((v) => !v)} className="md:hidden h-9 w-9 inline-flex items-center justify-center border border-border rounded-md">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div>
              <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">{pageLabel}</p>
              <p className="font-display text-base">{greet}, Olabisi</p>
            </div>
          </div>
          <div className="relative" onMouseLeave={() => setMenu(false)}>
            <button
              onMouseEnter={() => setMenu(true)}
              onClick={() => setMenu((v) => !v)}
              className="h-10 w-10 rounded-full bg-gold text-primary-foreground font-bold inline-flex items-center justify-center hover:opacity-90"
              aria-label="Profile menu"
            >
              {initials}
            </button>
            {menu && (
              <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-md shadow-xl py-1 z-30">
                <button
                  onClick={() => { setMenu(false); nav("/admin/profile"); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary inline-flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary text-destructive inline-flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
