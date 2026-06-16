import { SiteLayout } from "@/components/site-layout";
import { Reveal } from "@/components/reveal";
import portrait from "@/assets/olabisi-portrait.jpg";
import { Briefcase, ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 grid md:grid-cols-12 gap-12 items-start">
        <Reveal direction="right" className="md:col-span-5">
          <div className="relative aspect-[4/5] max-w-sm">
            <div className="absolute -inset-2 border border-gold/40" />
            <img
              src={portrait}
              alt="Olabisi Olaigbe"
              className="relative w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
        <Reveal direction="left" delay={100} className="md:col-span-7">
          <p className="eyebrow">About</p>
          <h1 className="font-display text-4xl md:text-5xl mt-4 leading-tight">
            Numbers-trained. People-obsessed.
          </h1>
          <div className="prose-invert mt-8 space-y-5 text-foreground/80 leading-relaxed">
            <p>
             I’m Olabisi Olaigbe - a Chartered Accountant (ACA) with a decade of cross‑functional experience spanning finance, assurance, operations, and business strategy.

            </p>
            <p>I help professionals and entrepreneurs grow their income by mastering the three levers that actually create results: <span className="text-gold">clarity</span>, {" "}
              <span className="text-gold">structure</span> , and {" "}
              <span className="text-gold">visibility</span>.
</p>
           
            <p>
        My approach combines analytical discipline with the lived realities of building a career or business from the ground up. Practical. Proven. Built for real life.
            </p>
          </div>

          <div className="hairline my-10" />

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="eyebrow mb-3">Credentials</p>
              <ul className="space-y-2 text-sm text-foreground/75">
                <li>ACA — Institute of Chartered Accountants</li>
                <li>10+ years corporate finance & strategy</li>
                <li>Certified Business & Career Coach</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-3">Work with me</p>
              <ul className="space-y-2 text-sm text-foreground/75">
                <li>1:1 private coaching</li>
                <li>Group programs & masterclasses</li>
                <li>Corporate workshops</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* EXPERIENCE / COMPANIES MANAGED */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
          <Reveal>
            <p className="eyebrow">PROJECTS</p>
            <h2 className="font-display text-3xl md:text-4xl mt-3 max-w-2xl">
              Companies <span className="text-gradient-gold">led & managed.</span>
            </h2>
            <p className="text-foreground/70 mt-4 max-w-xl text-sm">
              Beyond coaching, I build and lead ventures that move the needle for African SMEs and professionals.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Reveal delay={100}>
              <a
                href="https://gidira.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-card border border-border/60 hover:border-gold/60 transition-colors p-7 h-full"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="h-11 w-11 rounded-full border border-gold/40 inline-flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-primary-foreground transition-colors">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
                </div>
                <p className="eyebrow mt-5">Founder & Managing Lead</p>
                <h3 className="font-display text-2xl mt-2 leading-tight">
                  Gidira — Trusted Vendors Community
                </h3>
                <p className="text-sm text-foreground/70 mt-3 leading-relaxed">
                  A home for trustworthy, reliable vendors in Nigeria — elevating African SMEs through
                  community, accountability and structured visibility.
                </p>
                <p className="text-xs text-gold mt-5 tracking-[0.16em] uppercase inline-flex items-center gap-2">
                  Visit gidira.com <ExternalLink className="h-3 w-3" />
                </p>
              </a>
            </Reveal>

            <Reveal delay={180}>
              <div className="bg-card border border-border/60 p-7 h-full flex flex-col">
                <div className="h-11 w-11 rounded-full border border-gold/40 inline-flex items-center justify-center text-gold">
                  <Briefcase className="h-5 w-5" />
                </div>
                <p className="eyebrow mt-5">Career Highlights</p>
                <h3 className="font-display text-2xl mt-2 leading-tight">
                  A decade in finance & strategy
                </h3>
                <ul className="text-sm text-foreground/70 mt-4 space-y-2 leading-relaxed list-disc list-inside marker:text-gold">
                  <li>Corporate finance & advisory across Nigeria & the UK</li>
                  <li>Audit, assurance and risk advisory engagements</li>
                  <li>500+ professionals coached into clearer income paths</li>
                  <li>Speaker on career strategy, structure and visibility</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
