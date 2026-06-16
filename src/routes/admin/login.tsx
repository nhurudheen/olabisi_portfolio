import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import portrait from "@/assets/olabisi-portrait.jpg";
import heroTexture from "@/assets/hero-texture.jpg";

export default function AdminLogin() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user && isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }
    // Verify admin role
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) {
        await supabase.auth.signOut();
        toast.error("This account is not an admin.");
        setBusy(false);
        return;
      }
    }
    toast.success("Welcome back");
    nav("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      {/* Left visual side */}
      <div className="relative hidden md:flex items-end overflow-hidden">
        <img src={heroTexture} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-transparent" />
        <div className="absolute top-10 left-10 right-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-gold/40 inline-flex items-center justify-center text-gold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="eyebrow">Admin Portal · Secure</p>
        </div>
        <div className="relative z-10 p-12 max-w-md">
          <div className="aspect-[4/5] max-w-xs mb-8 border border-gold/40 p-2">
            <img src={portrait} alt="Olabisi" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display text-4xl leading-tight">
            The <span className="text-gradient-gold">command room</span> for your brand.
          </h1>
          <p className="text-foreground/70 mt-4 text-sm leading-relaxed">
            Manage your ebooks, services, orders and messages — all in one quiet, focused workspace.
          </p>
          <p className="mt-12 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            © {new Date().getFullYear()} Olabisi Olaigbe
          </p>
        </div>
      </div>

      {/* Right form side */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-7">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2 className="font-display text-3xl mt-3">Sign in to admin</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Use your admin credentials to access the dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="eyebrow block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full bg-background border border-border focus:border-gold outline-none pl-10 pr-4 py-3.5 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="eyebrow block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full bg-background border border-border focus:border-gold outline-none pl-10 pr-4 py-3.5 text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-gold text-primary-foreground font-semibold text-xs tracking-[0.18em] uppercase py-4 hover:bg-gold-deep transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>

          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground text-center">
            Encrypted · Role-based access
          </p>
        </form>
      </div>
    </div>
  );
}
