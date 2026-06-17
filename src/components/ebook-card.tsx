import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Ebook } from "@/lib/ebooks";

export function EbookCard({ ebook }: { ebook: Ebook }) {
  const { add, setOpen } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(ebook);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="group bg-card border border-border/60 hover:border-gold/60 transition-colors animate-rise overflow-hidden flex flex-col">
      <div className="relative aspect-[3/4] bg-background overflow-hidden">
        <img
          src={ebook.cover}
          alt={ebook.title}
          loading="lazy"
          onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/ebook-1.jpg")}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        {ebook.badge && (
          <span className="absolute top-4 left-4 bg-gold text-primary-foreground text-[10px] font-bold tracking-[0.16em] uppercase px-2.5 py-1">
            {ebook.badge}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gold-deep font-semibold">
          {ebook.category} · Ebook{ebook.pages ? ` · ${ebook.pages} pages` : ""}
        </p>
        <h3 className="font-display text-xl mt-2 leading-tight">{ebook.title}</h3>
        {ebook.subtitle && <p className="text-sm text-muted-foreground mt-1">{ebook.subtitle}</p>}
        <p className="text-sm text-foreground/70 mt-3 line-clamp-3 flex-1">{ebook.description}</p>
        <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between">
          <div>
            <p className="font-display text-lg">
              {ebook.originalPrice && (
                <span className="text-muted-foreground text-sm line-through mr-2">
                  £{ebook.originalPrice}
                </span>
              )}
              <span className="text-gold">{ebook.isFree ? "FREE" : `£${ebook.price}`}</span>
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-foreground/95 text-background hover:bg-gold hover:text-primary-foreground text-xs font-bold tracking-[0.14em] uppercase px-4 py-3 transition-colors"
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" /> Added
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> Add
              </>
            )}
          </button>
        </div>
        {added && (
          <button
            onClick={() => setOpen(true)}
            className="mt-3 text-[11px] tracking-[0.16em] uppercase text-gold hover:text-gold-deep self-end"
          >
            View cart →
          </button>
        )}
      </div>
    </article>
  );
}
