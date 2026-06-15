import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import portrait from "@/assets/olabisi-portrait.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Olabisi Olaigbe ACA" },
      {
        name: "description",
        content:
          "Chartered Accountant turned business & career coach. The story, the philosophy, the method.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] max-w-sm">
            <div className="absolute -inset-2 border border-gold/40" />
            <img
              src={portrait}
              alt="Olabisi Olaigbe"
              className="relative w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div className="md:col-span-7">
          <p className="eyebrow">About</p>
          <h1 className="font-display text-4xl md:text-5xl mt-4 leading-tight">
            Numbers-trained. People-obsessed.
          </h1>
          <div className="prose-invert mt-8 space-y-5 text-foreground/80 leading-relaxed">
            <p>
              I'm Olabisi Olaigbe — a Chartered Accountant (ACA) who spent a decade inside
              boardrooms watching brilliant people stall on the wrong problems.
            </p>
            <p>
              I coach professionals and entrepreneurs through the three things that actually
              move income: <span className="text-gold">clarity</span> on what to build,{" "}
              <span className="text-gold">structure</span> for how to deliver it, and{" "}
              <span className="text-gold">visibility</span> so the right people notice.
            </p>
            <p>
              My work blends financial rigor with the messy realities of career and business
              building. No fluff. No vibes. Just frameworks that hold up in real life.
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
        </div>
      </section>
    </SiteLayout>
  );
}
