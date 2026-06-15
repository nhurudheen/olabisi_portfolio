import { useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import type { Service } from "@/lib/services";
import { SERVICE_RECIPIENT } from "@/lib/services";

export function ServiceCard({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <article className="bg-card border border-border/60 hover:border-gold/60 transition-colors p-6 flex flex-col h-full">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg leading-tight">{service.title}</h3>
          <span className={`font-display whitespace-nowrap ${service.free ? "text-gold text-sm tracking-[0.16em]" : "text-gold text-lg"}`}>
            {service.price}
          </span>
        </div>
        <p className="text-sm text-foreground/70 mt-3 flex-1 leading-relaxed">{service.description}</p>
        <button
          onClick={() => setOpen(true)}
          className="mt-5 inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground font-semibold text-[11px] tracking-[0.18em] uppercase px-5 py-3 hover:bg-gold-deep transition-colors"
        >
          Book this service <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </article>
      {open && <ServiceBookingModal service={service} onClose={() => setOpen(false)} />}
    </>
  );
}

function ServiceBookingModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(service.title);
    const body = encodeURIComponent(
      `Hi Olabisi,\n\n${form.name} needs the service: ${service.title}.\n\n` +
        `Service details: ${service.description}\n` +
        `Listed price: ${service.price}\n\n` +
        `Contact details:\n` +
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n` +
        `Phone: ${form.phone}\n\n` +
        `Please reach out to confirm next steps.\n\nThank you.`,
    );
    window.location.href = `mailto:${SERVICE_RECIPIENT}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-gold/30 w-full max-w-md p-7 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "rise 0.3s ease both" }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 h-8 w-8 inline-flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="eyebrow">Book Service</p>
        <h3 className="font-display text-xl mt-2 leading-tight">{service.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{service.price}</p>

        {sent ? (
          <div className="mt-8 text-center py-6">
            <div className="h-12 w-12 rounded-full border border-gold mx-auto inline-flex items-center justify-center text-gold">
              <Check className="h-5 w-5" />
            </div>
            <p className="font-display text-lg mt-4">Your email is ready.</p>
            <p className="text-xs text-muted-foreground mt-2">
              Your email app should have opened with a pre-filled message. Just hit send.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Field label="Phone number" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
            <button
              type="submit"
              className="w-full bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase py-3.5 hover:bg-gold-deep transition-colors"
            >
              Send
            </button>
            <p className="text-[10px] text-muted-foreground text-center tracking-wider uppercase">
              Opens your email app with the request pre-filled
            </p>
          </form>
        )}
      </div>
    </div>
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
