import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site-layout";
import { EbookCard } from "@/components/ebook-card";
import { Reveal } from "@/components/reveal";
import { useEbooks } from "@/lib/ebooks";
import { useServices } from "@/lib/services";
import portrait from "@/assets/olabisi-portrait.jpg";
import heroTexture from "@/assets/hero-texture.jpg";
import { ArrowRight, Sparkles, Compass, LineChart } from "lucide-react";
import { ServiceCard } from "@/components/service-card";

export default function HomePage() {
  const { data: ebooks = [] } = useEbooks();
  const { data: services = [] } = useServices();

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <img src={heroTexture} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-20 pb-24 md:pt-28 md:pb-32 grid md:grid-cols-12 gap-12 items-center">
          <Reveal direction="up" className="md:col-span-7">
            <p className="eyebrow">Business & Career Coach · ACA</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] mt-5 tracking-tight">
              Build a career that <span className="text-gradient-gold">compounds</span>,
              an income that <span className="text-gradient-gold">scales</span>.
            </h1>
            <p className="mt-6 text-base md:text-lg text-foreground/75 max-w-xl leading-relaxed">
              I help professionals and entrepreneurs grow their income through clarity,
              structure, and strategic visibility — without burning out or guessing what's next.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase px-7 py-4 hover:bg-gold-deep transition-colors">
                Shop ebooks <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 border border-foreground/30 hover:border-gold hover:text-gold text-xs font-semibold tracking-[0.16em] uppercase px-7 py-4 transition-colors">
                Work with me
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[{ k: "10+", v: "Years experience" }, { k: "500+", v: "Clients coached" }, { k: "ACA", v: "Chartered" }].map((s) => (
                <div key={s.v}>
                  <p className="font-display text-2xl text-gold">{s.k}</p>
                  <p className="text-[11px] tracking-[0.14em] uppercase text-muted-foreground mt-1">{s.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal direction="left" delay={150} className="md:col-span-5">
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              <div className="absolute -inset-2 border border-gold/40" />
              <div className="absolute inset-0 overflow-hidden">
                <img src={portrait} alt="Olabisi Olaigbe, Business & Career Coach" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card border border-gold/30 px-5 py-4 max-w-[220px]">
                <p className="font-display text-sm leading-tight">"Clarity isn't optional — it's the strategy."</p>
                <p className="eyebrow mt-2">— Olabisi</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
        <Reveal className="text-center max-w-2xl mx-auto">
          <p className="eyebrow">How I help</p>
          <h2 className="font-display text-3xl md:text-4xl mt-3">Three pillars. One unfair advantage.</h2>
        </Reveal>
        <div className="hairline mt-10" />
        <div className="grid md:grid-cols-3 gap-10 mt-12">
          {[
            { icon: Compass, title: "Clarity", body: "Stop second-guessing. Define the direction that fits your skills, your season, and your numbers." },
            { icon: LineChart, title: "Structure", body: "Frameworks for pricing, offers and systems so revenue stops being a function of how hard you push." },
            { icon: Sparkles, title: "Visibility", body: "Position your expertise so the right opportunities and clients find you on purpose." },
          ].map((p, i) => (
            <Reveal key={p.title} delay={i * 120} className="group">
              <div className="h-12 w-12 rounded-full border border-gold/40 inline-flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-primary-foreground transition-colors">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl mt-5">{p.title}</h3>
              <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="services" className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
          <Reveal>
            <p className="eyebrow">Services Offered</p>
            <h2 className="font-display text-3xl md:text-4xl mt-3 max-w-2xl">
              Book a service. Get a <span className="text-gradient-gold">real outcome.</span>
            </h2>
            <p className="text-foreground/70 mt-4 max-w-xl text-sm">
              Pick the service that matches where you are.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
          <Reveal className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <p className="eyebrow">The Library</p>
              <h2 className="font-display text-3xl md:text-4xl mt-3 max-w-lg">Ebooks built from real client work.</h2>
            </div>
            <Link to="/shop" className="text-xs tracking-[0.18em] uppercase text-gold hover:text-gold-deep border-b border-gold/40 pb-1 inline-flex items-center gap-2">
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
            {ebooks.slice(0, 3).map((e, i) => (
              <Reveal key={e.id} delay={i * 100}>
                <EbookCard ebook={e} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 sm:px-8 py-24 text-center">
        <Reveal>
          <p className="eyebrow">Client Words</p>
          <blockquote className="font-display text-2xl md:text-3xl leading-snug mt-6">
            "Olabisi gave me the structure I'd been missing for years. Within three months I
            doubled my retainer rates — and stopped feeling guilty about it."
          </blockquote>
          <p className="mt-6 text-sm text-muted-foreground tracking-wider uppercase">— Senior consultant, Lagos</p>
        </Reveal>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl">Ready to make the next move<span className="text-gold"> count?</span></h2>
            <p className="text-foreground/70 mt-4 max-w-xl mx-auto">
              Whether you start with an ebook or a 1:1 conversation, the work begins the moment you decide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/shop" className="bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase px-7 py-4 hover:bg-gold-deep transition-colors">Browse ebooks</Link>
              <Link to="/contact" className="border border-foreground/30 hover:border-gold hover:text-gold text-xs font-semibold tracking-[0.16em] uppercase px-7 py-4 transition-colors">Book a call</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
