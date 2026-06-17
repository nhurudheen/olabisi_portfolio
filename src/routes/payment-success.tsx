import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { SiteLayout } from "@/components/site-layout";
import { Loader2, Check, XCircle } from "lucide-react";
import { verifyStripeSession } from "@/lib/stripe";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const orderId = params.get("order_id");
  const [state, setState] = useState<"verifying" | "paid" | "failed">("verifying");

  useEffect(() => {
    if (!sessionId || !orderId) return setState("failed");
    verifyStripeSession(sessionId, orderId)
      .then((r) => setState(r?.status === "paid" ? "paid" : "failed"))
      .catch(() => setState("failed"));
  }, [sessionId, orderId]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-5 sm:px-8 py-28 text-center">
        {state === "verifying" && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-gold mx-auto" />
            <p className="mt-6 text-muted-foreground">Verifying your payment…</p>
          </>
        )}
        {state === "paid" && (
          <>
            <div className="h-16 w-16 rounded-full border border-gold mx-auto inline-flex items-center justify-center text-gold">
              <Check className="h-7 w-7" />
            </div>
            <h1 className="font-display text-4xl mt-6">Payment received.</h1>
            <p className="text-foreground/70 mt-4">Thank you — your order is confirmed.</p>
          </>
        )}
        {state === "failed" && (
          <>
            <div className="h-16 w-16 rounded-full border border-destructive mx-auto inline-flex items-center justify-center text-destructive">
              <XCircle className="h-7 w-7" />
            </div>
            <h1 className="font-display text-4xl mt-6">Payment not verified.</h1>
            <p className="text-foreground/70 mt-4">Please contact us if you were charged.</p>
          </>
        )}
        <Link to="/" className="mt-10 inline-flex bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase px-7 py-4 hover:bg-gold-deep">Back home</Link>
      </section>
    </SiteLayout>
  );
}
