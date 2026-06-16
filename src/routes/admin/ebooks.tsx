import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { BookOpen, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { SummaryCard } from "./dashboard";
import { toast } from "sonner";

type EbookRow = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  cover_url: string | null;
  pages: number | null;
  is_free: boolean;
};

const DEFAULT_COVER = "/ebook-1.jpg";

export default function AdminEbooks() {
  const qc = useQueryClient();
  const { data: ebooks = [] } = useQuery({
    queryKey: ["admin", "ebooks"],
    queryFn: async () => (await supabase.from("ebooks").select("*").order("created_at", { ascending: false })).data as EbookRow[] ?? [],
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => (await supabase.from("orders").select("items,type,status")).data ?? [],
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EbookRow | null>(null);

  const total = ebooks.length;
  const totalValue = ebooks.reduce((s, e) => s + Number(e.price), 0);
  const counts = new Map<string, number>();
  orders.filter((o: any) => o.type === "ebook" && o.status === "paid").forEach((o: any) => {
    (o.items || []).forEach((it: any) => counts.set(it.id, (counts.get(it.id) ?? 0) + (it.qty ?? 1)));
  });
  let top = "—", max = 0;
  counts.forEach((v, k) => { if (v > max) { max = v; top = ebooks.find((e) => e.id === k)?.title ?? "—"; } });

  const remove = async (id: string) => {
    if (!confirm("Delete this ebook?")) return;
    const { error } = await supabase.from("ebooks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "ebooks"] });
    qc.invalidateQueries({ queryKey: ["ebooks"] });
  };

  const cols: Column<EbookRow>[] = [
    { key: "title", header: "Title", render: (r) => (
      <div className="flex items-center gap-3">
        <img src={r.cover_url || DEFAULT_COVER} onError={(e) => ((e.currentTarget as HTMLImageElement).src = DEFAULT_COVER)} alt="" className="w-9 h-12 object-cover border border-border" />
        <span>{r.title}</span>
      </div>
    ), csv: (r) => r.title },
    { key: "price", header: "Price", render: (r) => (r.is_free ? "FREE" : `£${r.price}`), csv: (r) => r.price },
    { key: "pages", header: "Pages", render: (r) => r.pages ?? "—" },
    { key: "actions", header: "Actions", render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => { setEditing(r); setOpen(true); }} className="h-8 w-8 inline-flex items-center justify-center border border-border rounded hover:border-gold hover:text-gold"><Pencil className="h-3.5 w-3.5" /></button>
        <button onClick={() => remove(r.id)} className="h-8 w-8 inline-flex items-center justify-center border border-border rounded hover:border-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <SummaryCard icon={BookOpen} label="Total Ebooks" value={total} />
        <SummaryCard icon={BookOpen} label="Total Value" value={`£${totalValue}`} />
        <SummaryCard icon={BookOpen} label="Top Seller" value={top} sub={max ? `${max} sold` : undefined} />
      </div>
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl">Ebooks</h2>
        <button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex items-center gap-2 bg-gold text-primary-foreground text-xs tracking-[0.16em] uppercase font-semibold px-4 py-2.5 hover:bg-gold-deep">
          <Plus className="h-4 w-4" /> Create ebook
        </button>
      </div>
      <DataTable data={ebooks} columns={cols} exportName="ebooks" />
      {open && <EbookForm editing={editing} onClose={() => setOpen(false)} onSaved={() => { qc.invalidateQueries({ queryKey: ["admin", "ebooks"] }); qc.invalidateQueries({ queryKey: ["ebooks"] }); setOpen(false); }} />}
    </div>
  );
}

function EbookForm({ editing, onClose, onSaved }: { editing: EbookRow | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [subtitle, setSubtitle] = useState(editing?.subtitle ?? "");
  const [desc, setDesc] = useState(editing?.description ?? "");
  const [price, setPrice] = useState(editing?.price?.toString() ?? "0");
  const [oldPrice, setOldPrice] = useState(editing?.original_price?.toString() ?? "");
  const [pages, setPages] = useState(editing?.pages?.toString() ?? "");
  const [cover, setCover] = useState(editing?.cover_url ?? "");
  const [isFree, setIsFree] = useState(editing?.is_free ?? false);
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      title,
      subtitle: subtitle || null,
      description: desc || null,
      price: isFree ? 0 : Number(price),
      original_price: !isFree && oldPrice ? Number(oldPrice) : null,
      pages: pages ? Number(pages) : null,
      cover_url: cover || null,
      is_free: isFree,
    };
    const { error } = editing
      ? await supabase.from("ebooks").update(payload).eq("id", editing.id)
      : await supabase.from("ebooks").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Updated" : "Created");
    onSaved();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card border-l border-border overflow-y-auto" style={{ animation: "rise 0.3s ease both" }}>
        <form onSubmit={save} className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg">{editing ? "Edit ebook" : "New ebook"}</h3>
            <button type="button" onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border"><X className="h-4 w-4" /></button>
          </div>
          <F label="Book name" value={title} onChange={setTitle} required />
          <F label="Subtitle" value={subtitle} onChange={setSubtitle} />
          <div>
            <label className="eyebrow block mb-2">Description</label>
            <textarea required rows={5} value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} /> Free ebook</label>
          {!isFree && (
            <>
              <F label="Price (£)" type="number" value={price} onChange={setPrice} required />
              <F label="Old price (£) — optional" type="number" value={oldPrice} onChange={setOldPrice} />
            </>
          )}
          <F label="Pages" type="number" value={pages} onChange={setPages} />
          <F label="Cover image URL (optional)" value={cover} onChange={setCover} placeholder="/ebook-1.jpg or https://..." />
          <button disabled={busy} className="w-full bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase py-3.5 hover:bg-gold-deep disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}Save
          </button>
        </form>
      </aside>
    </>
  );
}

function F({ label, value, onChange, type = "text", required, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="eyebrow block mb-2">{label}</label>
      <input type={type} required={required} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm" />
    </div>
  );
}
