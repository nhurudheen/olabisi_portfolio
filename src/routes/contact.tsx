import { SiteLayout } from "@/components/site-layout";
import { Reveal } from "@/components/reveal";
import { Mail, MessageCircle, Linkedin } from "lucide-react";
import { useState } from "react";

const CONTACT_EMAIL = "hello@olabisi.co";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || `New message from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
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
            Coaching enquiries, speaking, podcast invites or partnerships — share a few details
            and I'll reply within two business days.
          </p>

          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gold" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gold">{CONTACT_EMAIL}</a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-gold" />
              <a href="#" className="hover:text-gold">WhatsApp</a>
            </li>
            <li className="flex items-center gap-3">
              <Linkedin className="h-4 w-4 text-gold" />
              <a href="#" className="hover:text-gold">LinkedIn</a>
            </li>
          </ul>
        </Reveal>

        <Reveal direction="left" delay={120}>
          <form onSubmit={handleSubmit} className="bg-card border border-border p-8 space-y-5">
            {sent ? (
              <div className="text-center py-10">
                <p className="font-display text-2xl text-gold">Your email is ready.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your email app should have opened with the message pre-filled. Just hit send and
                  it will arrive in my inbox.
                </p>
              </div>
            ) : (
              <>
                <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
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
                <button
                  type="submit"
                  className="w-full bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase py-4 hover:bg-gold-deep transition-colors"
                >
                  Send message
                </button>
                <p className="text-[10px] text-muted-foreground text-center tracking-wider uppercase">
                  Opens your email app with the message pre-filled
                </p>
              </>
            )}
          </form>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
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
