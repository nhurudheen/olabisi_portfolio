import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Briefcase, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { SummaryCard } from "./dashboard";
import { toast } from "sonner";

type ServiceRow = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  is_free: boolean;
  booking_count: number;
};

export default function AdminServices() {
  const qc = useQueryClient();
  const { data: services = [] } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: async () => (await supabase.from("services").select("*").order("created_at")).data as ServiceRow[] ?? [],
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => (await supabase.from("orders").select("service_id,type")).data ?? [],
  });
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [open, setOpen] = useState(false);

  const total = services.length;
  const totalPrice = services.reduce((s, x) => s + Number(x.price), 0);
  // highest booked
  const counts = new Map<string, number>();
  orders.filter((o: any) => o.type === "service" && o.service_id).forEach((o: any) => {
    counts.set(o.service_id, (counts.get(o.service_id) ?? 0) + 1);
  });
  let highest = "—";
  let max = 0;
  counts.forEach((v, k) => { if (v > max) { max = v; highest = services.find((s) => s.id === k)?.title ?? "—"; } });

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  const cols: Column<ServiceRow>[] = [
    { key: "sn", header: "S/N", render: (row) =>services.findIndex((item) => item.id === row.id) + 1, },
    { key: "title", header: "Title" },
    { key: "price", header: "Price", render: (r) => (r.is_free ? "FREE" : `£${r.price}`), csv: (r) => r.price },
    { key: "original_price", header: "Old price", render: (r) => (r.original_price ? `£${r.original_price}` : "—") },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => { setEditing(r); setOpen(true); }} className="h-8 w-8 inline-flex items-center justify-center border border-border rounded hover:border-gold hover:text-gold"><Pencil className="h-3.5 w-3.5" /></button>
          <button onClick={() => remove(r.id)} className="h-8 w-8 inline-flex items-center justify-center border border-border rounded hover:border-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <SummaryCard icon={Briefcase} label="Total Services" value={total} />
        <SummaryCard icon={Briefcase} label="Total Value" value={`£${totalPrice}`} />
        <SummaryCard icon={Briefcase} label="Most Booked" value={highest} sub={max ? `${max} bookings` : undefined} />
      </div>
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl">Services</h2>
        <button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex items-center gap-2 bg-gold text-primary-foreground text-xs tracking-[0.16em] uppercase font-semibold px-4 py-2.5 hover:bg-gold-deep">
          <Plus className="h-4 w-4" /> Create service
        </button>
      </div>
      <DataTable data={services} columns={cols} exportName="services" />
      {open && <ServiceForm editing={editing} onClose={() => setOpen(false)} onSaved={() => { qc.invalidateQueries({ queryKey: ["admin", "services"] }); qc.invalidateQueries({ queryKey: ["services"] }); setOpen(false); }} />}
    </div>
  );
}

function ServiceForm({ editing, onClose, onSaved }: { editing: ServiceRow | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [desc, setDesc] = useState(editing?.description ?? "");
  const [price, setPrice] = useState(editing?.price?.toString() ?? "0");
  const [oldPrice, setOldPrice] = useState(editing?.original_price?.toString() ?? "");
  const [isFree, setIsFree] = useState(editing?.is_free ?? false);
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      title,
      description: desc,
      price: isFree ? 0 : Number(price),
      original_price: oldPrice ? Number(oldPrice) : null,
      is_free: isFree,
    };
    const { error } = editing
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);
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
            <h3 className="font-display text-lg">{editing ? "Edit service" : "New service"}</h3>
            <button type="button" onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border"><X className="h-4 w-4" /></button>
          </div>
          <F label="Service name" value={title} onChange={setTitle} required />
          <div>
            <label className="eyebrow block mb-2">Description</label>
            <textarea required rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} /> Free service</label>
          {!isFree && (
            <>
              <F label="Price (£)" type="number" value={price} onChange={setPrice} required />
              <F label="Old price (£) — optional" type="number" value={oldPrice} onChange={setOldPrice} />
            </>
          )}
          <button disabled={busy} className="w-full bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase py-3.5 hover:bg-gold-deep disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}Save
          </button>
        </form>
      </aside>
    </>
  );
}

function F({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="eyebrow block mb-2">{label}</label>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm" />
    </div>
  );
}
