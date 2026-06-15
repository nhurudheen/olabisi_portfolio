import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { Lock, CreditCard } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [{ title: "Checkout — Olabisi Olaigbe" }],
  }),
});

function CheckoutPage() {
  const { detailed, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      clear();
    }, 1400);
  };

  if (done) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-5 sm:px-8 py-28 text-center">
          <div className="h-16 w-16 rounded-full border border-gold mx-auto inline-flex items-center justify-center text-gold">
            ✓
          </div>
          <h1 className="font-display text-4xl mt-6">Order received.</h1>
          <p className="text-foreground/70 mt-4 max-w-md mx-auto">
            Your ebooks would be on their way to your inbox. (Payment processing is not yet
            connected — this is a UI preview.)
          </p>
          <button
            onClick={() => navigate({ to: "/shop" })}
            className="mt-10 bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase px-7 py-4 hover:bg-gold-deep transition-colors"
          >
            Keep browsing
          </button>
        </section>
      </SiteLayout>
    );
  }

  if (detailed.length === 0) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-5 sm:px-8 py-28 text-center">
          <p className="eyebrow">Checkout</p>
          <h1 className="font-display text-4xl mt-4">Your cart is empty.</h1>
          <Link
            to="/shop"
            className="mt-8 inline-flex bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase px-7 py-4 hover:bg-gold-deep"
          >
            Browse ebooks
          </Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid lg:grid-cols-5 gap-12">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-10">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2 className="font-display text-2xl mt-2">Contact details</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Input label="First name" required />
              <Input label="Last name" required />
              <div className="sm:col-span-2">
                <Input label="Email" type="email" required placeholder="ebooks delivered here" />
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow">Step 2</p>
            <h2 className="font-display text-2xl mt-2 flex items-center gap-2">
              Payment <Lock className="h-4 w-4 text-gold" />
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="eyebrow block mb-2">Card number</label>
                <div className="relative">
                  <input
                    required
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm pr-10"
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry" placeholder="MM / YY" required />
                <Input label="CVC" placeholder="•••" required />
              </div>
              <Input label="Name on card" required />
            </div>
            <p className="text-[11px] text-muted-foreground mt-4 tracking-wider">
              Demo checkout — no card is charged.
            </p>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase py-4 hover:bg-gold-deep transition-colors disabled:opacity-60"
          >
            {processing ? "Processing..." : `Pay $${subtotal.toFixed(2)}`}
          </button>
        </form>

        <aside className="lg:col-span-2">
          <div className="bg-card border border-border p-6 sticky top-24">
            <p className="eyebrow">Order summary</p>
            <ul className="mt-5 space-y-4">
              {detailed.map((i) => (
                <li key={i.id} className="flex gap-3">
                  <img
                    src={i.ebook.cover}
                    alt={i.ebook.title}
                    className="w-12 h-16 object-cover border border-border"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <p className="font-display text-sm leading-tight">{i.ebook.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Qty {i.qty}</p>
                  </div>
                  <p className="text-sm">${(i.qty * i.ebook.price).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-border mt-5 pt-5 space-y-2 text-sm">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Delivery" value="Instant · Digital" muted />
              <div className="border-t border-border pt-3 mt-3 flex justify-between items-baseline">
                <span className="eyebrow">Total</span>
                <span className="font-display text-2xl text-gold">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="eyebrow block mb-2">{label}</label>
      <input
        {...props}
        className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm"
      />
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={muted ? "text-muted-foreground" : "text-foreground/80"}>{label}</span>
      <span className={muted ? "text-muted-foreground" : ""}>{value}</span>
    </div>
  );
}
