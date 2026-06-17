import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { EbookCard } from "@/components/ebook-card";
import { Reveal } from "@/components/reveal";
import { useEbooks } from "@/lib/ebooks";
import type { Category } from "@/lib/services";
import { CategoryTabs } from "./index";
import { Search } from "lucide-react";

type Filter = "all" | "free" | "under20" | "20to50" | "over50";

export default function ShopPage() {
  const { data: ebooks = [], isLoading } = useEbooks();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [tab, setTab] = useState<Category>("business");

  const filtered = useMemo(() => {
    return ebooks.filter((e) => {
      if (e.category !== tab) return false;
      if (q && !(`${e.title} ${e.subtitle ?? ""} ${e.description ?? ""}`.toLowerCase().includes(q.toLowerCase())))
        return false;
      if (filter === "free") return e.isFree || e.price === 0;
      if (filter === "under20") return !e.isFree && e.price < 20;
      if (filter === "20to50") return !e.isFree && e.price >= 20 && e.price <= 50;
      if (filter === "over50") return !e.isFree && e.price > 50;
      return true;
    });
  }, [ebooks, q, filter, tab]);

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
              Field-tested frameworks from coaching hundreds of professionals and founders. Instant digital delivery.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search ebooks..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-background border border-border focus:border-gold outline-none pl-10 pr-4 py-3 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs items-center">
            {([
              { v: "all", l: "All" },
              { v: "free", l: "Free" },
              { v: "under20", l: "Under £20" },
              { v: "20to50", l: "£20 – £50" },
              { v: "over50", l: "Over £50" },
            ] as { v: Filter; l: string }[]).map((b) => (
              <button
                key={b.v}
                onClick={() => setFilter(b.v)}
                className={`px-3 py-2 border tracking-[0.14em] uppercase font-semibold transition-colors ${
                  filter === b.v ? "bg-gold text-primary-foreground border-gold" : "border-border hover:border-gold"
                }`}
              >
                {b.l}
              </button>
            ))}
            <CategoryTabs value={tab} onChange={setTab} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-16">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-20">Loading ebooks…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No ebooks match your filter.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((e, i) => (
              <Reveal key={e.id} delay={i * 80}>
                <EbookCard ebook={e} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
