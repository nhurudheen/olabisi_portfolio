import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site-layout";

export default function PaymentCancel() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-5 sm:px-8 py-28 text-center">
        <h1 className="font-display text-4xl">Payment cancelled.</h1>
        <p className="text-foreground/70 mt-4">No charge was made. You can try again any time.</p>
        <Link to="/" className="mt-10 inline-flex bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase px-7 py-4 hover:bg-gold-deep">Back home</Link>
      </section>
    </SiteLayout>
  );
}
