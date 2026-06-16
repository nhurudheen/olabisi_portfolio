import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";

export default function AdminProfile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle().then(({ data }) => {
      setFullName(data?.full_name ?? "");
    });
  }, [user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, full_name: fullName, email: user.email });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd !== pwd2) return toast.error("Passwords do not match");
    if (pwd.length < 8) return toast.error("Password must be at least 8 characters");
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setSavingPwd(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setPwd(""); setPwd2("");
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-card border border-border p-6 rounded-md">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gold text-primary-foreground inline-flex items-center justify-center">
            <User className="h-7 w-7" />
          </div>
          <div>
            <p className="eyebrow">Admin</p>
            <h2 className="font-display text-2xl mt-1">{user?.email}</h2>
          </div>
        </div>
      </div>

      <form onSubmit={saveProfile} className="bg-card border border-border p-6 rounded-md space-y-4">
        <h3 className="font-display text-lg">Profile</h3>
        <div>
          <label className="eyebrow block mb-2">Full name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm" />
        </div>
        <button disabled={busy} className="bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase px-5 py-3 hover:bg-gold-deep disabled:opacity-60 inline-flex items-center gap-2">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}Save profile
        </button>
      </form>

      <form onSubmit={updatePassword} className="bg-card border border-border p-6 rounded-md space-y-4">
        <h3 className="font-display text-lg">Update password</h3>
        <div>
          <label className="eyebrow block mb-2">New password</label>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm" required />
        </div>
        <div>
          <label className="eyebrow block mb-2">Confirm new password</label>
          <input type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm" required />
        </div>
        <button disabled={savingPwd} className="bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase px-5 py-3 hover:bg-gold-deep disabled:opacity-60 inline-flex items-center gap-2">
          {savingPwd && <Loader2 className="h-4 w-4 animate-spin" />}Update password
        </button>
      </form>
    </div>
  );
}
