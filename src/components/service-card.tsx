import { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, X, Loader2 } from "lucide-react";
import type { Service } from "@/lib/services";
import { formatPrice } from "@/lib/services";
import { supabase } from "@/integrations/supabase/client";
import { startStripeCheckout } from "@/lib/stripe";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";

export function ServiceCard({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <article className="bg-card border border-border/60 hover:border-gold/60 transition-colors p-6 flex flex-col h-full">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg leading-tight">{service.title}</h3>
          <span className="font-display text-gold text-lg whitespace-nowrap">
            {service.originalPrice ? (
              <span className="text-muted-foreground text-sm line-through mr-2">£{service.originalPrice}</span>
            ) : null}
            {formatPrice(service)}
          </span>
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-gold-deep font-semibold mt-2">
          {service.category}
        </p>
        <p className="text-sm text-foreground/70 mt-2 flex-1 leading-relaxed">{service.description}</p>
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
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("10:00");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return toast.error("Please pick a date");
    setBusy(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          type: "service",
          customer_first_name: form.firstName,
          customer_last_name: form.lastName,
          customer_email: form.email,
          customer_phone: form.phone,
          service_id: service.id,
          scheduled_date: date.toISOString().slice(0, 10),
          scheduled_time: time,
          amount: service.price,
          currency: "GBP",
          status: service.isFree ? "paid" : "pending",
          items: [{ id: service.id, title: service.title, price: service.price }],
        })
        .select()
        .single();
      if (error) throw error;

      if (service.isFree) {
        toast.success("Booking confirmed — we'll be in touch!");
        onClose();
        return;
      }

      await startStripeCheckout({
        items: [{ name: service.title, amount: service.price, quantity: 1 }],
        email: form.email,
        orderId: order.id,
        metadata: { type: "service", service: service.title },
      });
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
      setBusy(false);
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <aside
        className="fixed z-50 bg-card border-gold/30 flex flex-col animate-rise
          inset-x-0 bottom-0 max-h-[92vh] border-t rounded-t-2xl
          sm:top-0 sm:right-0 sm:bottom-0 sm:inset-x-auto sm:max-h-none sm:h-full sm:w-full sm:max-w-md sm:border-t-0 sm:border-l sm:rounded-none sm:animate-slide-in-right"
      >
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <p className="eyebrow">Book Service</p>
            <h3 className="font-display text-lg mt-1 leading-tight">{service.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{formatPrice(service)}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} required />
            <Field label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} required />
          </div>
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
          <div>
            <label className="eyebrow block mb-2">Pick a date</label>
            <div className="border border-border bg-background inline-block">
              <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date(new Date().toDateString())} className="pointer-events-auto" />
            </div>
          </div>
          <div>
            <label className="eyebrow block mb-2">Time</label>
            <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm" />
          </div>
          <button type="submit" disabled={busy} className="w-full bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase py-4 hover:bg-gold-deep transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {service.isFree ? "Confirm booking" : `Pay £${service.price}`}
          </button>
        </form>
      </aside>
    </>,
    document.body
  );
}

function Field({
  label, value, onChange, type = "text", required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="eyebrow block mb-2">{label}</label>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm" />
    </div>
  );
}