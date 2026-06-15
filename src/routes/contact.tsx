import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Mail, MessageCircle, Linkedin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Olabisi Olaigbe" },
      { name: "description", content: "Get in touch about coaching, speaking and collaborations." },
    ],
  }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-14">
        <div>
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
              <a href="mailto:hello@olabisi.co" className="hover:text-gold">hello@olabisi.co</a>
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
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="bg-card border border-border p-8 space-y-5"
        >
          {sent ? (
            <div className="text-center py-10">
              <p className="font-display text-2xl text-gold">Thank you.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your message has been received. I'll be in touch shortly.
              </p>
            </div>
          ) : (
            <>
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Subject" name="subject" />
              <div>
                <label className="eyebrow block mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase py-4 hover:bg-gold-deep transition-colors"
              >
                Send message
              </button>
            </>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
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
