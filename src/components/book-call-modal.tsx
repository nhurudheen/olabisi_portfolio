import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startStripeCheckout } from "@/lib/stripe";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";

type MeetingPrice = {
  id: string;
  duration_minutes: number;
  price: number;
  original_price: number | null;
};

export function BookCallModal({ onClose }: { onClose: () => void }) {
  const { data: prices = [] } = useQuery({
    queryKey: ["meeting-prices"],
    queryFn: async () => {
      const { data } = await supabase.from("meeting_prices").select("*").eq("active", true).order("duration_minutes");
      return (data ?? []) as MeetingPrice[];
    },
  });

  const [form, setForm] = useState({ name: "", email: "", purpose: "" });
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("10:00");
  const [priceId, setPriceId] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const selected = prices.find((p) => p.id === priceId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return toast.error("Please pick a date");
    if (!selected) return toast.error("Please pick a duration");
    setBusy(true);
    try {
      const orderId = crypto.randomUUID(); 
      const [firstName, ...rest] = form.name.trim().split(" ");
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          type: "meeting",
          customer_first_name: firstName,
          customer_last_name: rest.join(" "),
          customer_email: form.email,
          duration_minutes: selected.duration_minutes,
          purpose: form.purpose,
          scheduled_date: date.toISOString().slice(0, 10),
          scheduled_time: time,
          amount: selected.price,
          currency: "GBP",
          status: "pending",
          items: [{ id: selected.id, title: `${selected.duration_minutes} min session`, price: selected.price }],
        })
        .select()
        .single();
      if (error) throw error;

      await startStripeCheckout({
        items: [{ name: `${selected.duration_minutes} min strategy session`, amount: selected.price, quantity: 1 }],
        email: form.email,
        orderId: orderId,
        metadata: { type: "meeting", duration: String(selected.duration_minutes) },
      });
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <aside
        className="fixed z-50 bg-card border-gold/30 flex flex-col
          inset-x-0 bottom-0 max-h-[92vh] border-t rounded-t-2xl
          sm:top-0 sm:right-0 sm:bottom-0 sm:inset-x-auto sm:max-h-none sm:h-full sm:w-full sm:max-w-md sm:border-t-0 sm:border-l sm:rounded-none"
        style={{ animation: "rise 0.3s ease both" }}
      >
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <p className="eyebrow">Book a call</p>
            <h3 className="font-display text-lg mt-1 leading-tight">Schedule a strategy session</h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <F label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <F label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
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
          <div>
            <label className="eyebrow block mb-2">Purpose of session</label>
            <textarea required rows={3} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="eyebrow block mb-2">Duration</label>
            {prices.length === 0 ? (
              <p className="text-xs text-muted-foreground">No durations available yet. Please check back soon.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {prices.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPriceId(p.id)}
                    className={`p-3 border text-left transition-colors ${priceId === p.id ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"}`}
                  >
                    <p className="font-display text-sm">{p.duration_minutes} min</p>
                    <p className="text-xs mt-1">
                      {p.original_price && <span className="text-muted-foreground line-through mr-2">£{p.original_price}</span>}
                      <span className="text-gold font-semibold">£{p.price}</span>
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={busy || !selected} className="w-full bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase py-4 hover:bg-gold-deep transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Book session{selected ? ` · £${selected.price}` : ""}
          </button>
        </form>
      </aside>
    </>
  );
}

function F({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="eyebrow block mb-2">{label}</label>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm" />
    </div>
  );
}
