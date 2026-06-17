import { Link, useNavigate } from "react-router-dom";
import { SiteLayout } from "@/components/site-layout";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { startStripeCheckout } from "@/lib/stripe";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          type: "ebook",
          customer_first_name: form.firstName,
          customer_last_name: form.lastName,
          customer_email: form.email,
          customer_phone: form.phone,
          items: items.map((i) => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })),
          amount: subtotal,
          currency: "GBP",
          status: "pending",
        })
        .select()
        .single();
      if (error) throw error;

      // Clear cart locally — payment will be verified on success page
      clear();

      await startStripeCheckout({
        items: items.map((i) => ({ name: i.title, amount: i.price, quantity: i.qty })),
        email: form.email,
        orderId: order.id,
        metadata: { type: "ebook" },
      });
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
      setBusy(false);
    }
  };

  // unused removed
  void done; void setDone;

  if (done) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-5 sm:px-8 py-28 text-center">
          <div className="h-16 w-16 rounded-full border border-gold mx-auto inline-flex items-center justify-center text-gold">✓</div>
          <h1 className="font-display text-4xl mt-6">Order received.</h1>
          <p className="text-foreground/70 mt-4 max-w-md mx-auto">
            Your ebooks are on their way to your inbox.
          </p>
          <button onClick={() => navigate("/shop")} className="mt-10 bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase px-7 py-4 hover:bg-gold-deep transition-colors">
            Keep browsing
          </button>
        </section>
      </SiteLayout>
    );
  }

  if (items.length === 0) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-5 sm:px-8 py-28 text-center">
          <p className="eyebrow">Checkout</p>
          <h1 className="font-display text-4xl mt-4">Your cart is empty.</h1>
          <Link to="/shop" className="mt-8 inline-flex bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase px-7 py-4 hover:bg-gold-deep">
            Browse ebooks
          </Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid lg:grid-cols-5 gap-12">
        <form onSubmit={submit} className="lg:col-span-3 space-y-10">
          <div>
            <p className="eyebrow">Your details</p>
            <h2 className="font-display text-2xl mt-2 flex items-center gap-2">Secure checkout <Lock className="h-4 w-4 text-gold" /></h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Input label="First name" required value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
              <Input label="Last name" required value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
              <div className="sm:col-span-2">
                <Input label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="ebooks delivered here" />
              </div>
              <div className="sm:col-span-2">
                <Input label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-4 tracking-wider">Card payment is handled securely via Stripe.</p>
          </div>

          <button type="submit" disabled={busy} className="w-full bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase py-4 hover:bg-gold-deep transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Pay £{subtotal.toFixed(2)}
          </button>
        </form>

        <aside className="lg:col-span-2">
          <div className="bg-card border border-border p-6 sticky top-24">
            <p className="eyebrow">Order summary</p>
            <ul className="mt-5 space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3">
                  <img src={i.cover} alt={i.title} className="w-12 h-16 object-cover border border-border" />
                  <div className="flex-1">
                    <p className="font-display text-sm leading-tight">{i.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Qty {i.qty}</p>
                  </div>
                  <p className="text-sm">£{(i.qty * i.price).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-border mt-5 pt-5 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-muted-foreground">Instant · Digital</span></div>
              <div className="border-t border-border pt-3 mt-3 flex justify-between items-baseline">
                <span className="eyebrow">Total</span>
                <span className="font-display text-2xl text-gold">£{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

type InputProps = {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};
function Input({ label, value, onChange, type = "text", required, placeholder }: InputProps) {
  return (
    <div>
      <label className="eyebrow block mb-2">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm"
      />
    </div>
  );
}
