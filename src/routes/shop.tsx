import { SiteLayout } from "@/components/site-layout";
import { EbookCard } from "@/components/ebook-card";
import { Reveal } from "@/components/reveal";
import { ebooks } from "@/lib/ebooks";

export default function ShopPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 text-center">
          <Reveal>
            <p className="eyebrow">The Library</p>
            <h1 className="font-display text-4xl md:text-5xl mt-4 max-w-2xl mx-auto leading-tight">
              Ebooks for the work you're <span className="text-gradient-gold">actually doing.</span>
            </h1>
            <p className="text-foreground/70 mt-5 max-w-xl mx-auto">
              Field-tested frameworks from coaching hundreds of professionals and founders.
              Instant digital delivery.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {ebooks.map((e, i) => (
            <Reveal key={e.id} delay={i * 100}>
              <EbookCard ebook={e} />
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
