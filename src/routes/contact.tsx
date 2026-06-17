import { SiteLayout } from "@/components/site-layout";
import { Reveal } from "@/components/reveal";
import { Mail, MessageCircle, Linkedin, Check, Instagram, Facebook } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1).max(2000),
});

const CONTACT_EMAIL = "olabisi.olaigbe@gidira.com";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!modal) return;
    const t = setTimeout(() => setModal(false), 3500);
    return () => clearTimeout(t);
  }, [modal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Please check your inputs");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("messages").insert(parsed.data);
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm({ name: "", email: "", subject: "", message: "" });
    setModal(true);
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-14">
        <Reveal direction="right">
          <p className="eyebrow">Contact</p>
          <h1 className="font-display text-4xl md:text-5xl mt-4 leading-tight">
            Let's talk about what's <span className="text-gradient-gold">next.</span>
          </h1>
          <p className="text-foreground/70 mt-5 max-w-md">
            Coaching enquiries, speaking, podcast invites or partnerships — share a few details and I'll reply within two business days.
          </p>
          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-gold" /><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gold">{CONTACT_EMAIL}</a></li>
            <li className="flex items-center gap-3"><Instagram className="h-4 w-4 text-gold" />
              <a href="https://www.instagram.com/olabisiolaigbe?igsh=MXNhMmxxcGRqbzQ3Yw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                <span>Olabisi Olaigbe</span>
              </a>
            </li>
            <li className="flex items-center gap-3"><Facebook className="h-4 w-4 text-gold" />
              <a href="https://web.facebook.com/people/Olabisi-Olaigbe/61584993629911/?mibextid=wwXIfr&rdid=7smVxWuhuwdggztb&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1CayqHuv2W%2F%3Fmibextid%3DwwXIfr%26ref%3D1%26_rdc%3D1%26_rdr" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                <span>Olabisi Olaigbe</span>
              </a>
            </li>
            <li className="flex items-center gap-3"><Linkedin className="h-4 w-4 text-gold" />
              <a href="https://www.linkedin.com/in/olabisi-olaigbe?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                <span>Olabisi Olaigbe</span>
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal direction="left" delay={120}>
          <form onSubmit={handleSubmit} className="bg-card border border-border p-8 space-y-5">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required />
            <div>
              <label className="eyebrow block mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase py-4 hover:bg-gold-deep transition-colors disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send message"}
            </button>
          </form>
        </Reveal>
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setModal(false)}>
          <div className="bg-card border border-gold/40 p-8 max-w-sm text-center" style={{ animation: "rise 0.4s ease both" }}>
            <div className="h-12 w-12 rounded-full border border-gold mx-auto inline-flex items-center justify-center text-gold">
              <Check className="h-5 w-5" />
            </div>
            <p className="font-display text-lg mt-4">Message received.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Thank you — your message will be attended to shortly.
            </p>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}

function Field({
  label, value, onChange, type = "text", required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="eyebrow block mb-2">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm"
      />
    </div>
  );
}
