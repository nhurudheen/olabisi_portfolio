import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Video, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { SummaryCard, StatusBadge } from "./dashboard";
import { toast } from "sonner";

type Price = {
  id: string;
  duration_minutes: number;
  price: number;
  original_price: number | null;
  active: boolean;
};

export default function AdminMeetings() {
  const qc = useQueryClient();
  const { data: prices = [] } = useQuery({
    queryKey: ["admin", "meeting-prices"],
    queryFn: async () => (await supabase.from("meeting_prices").select("*").order("duration_minutes")).data as Price[] ?? [],
  });
  const { data: meetings = [] } = useQuery({
    queryKey: ["admin", "meetings"],
    queryFn: async () => (await supabase.from("orders").select("*").eq("type", "meeting").order("created_at", { ascending: false })).data ?? [],
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Price | null>(null);
  const [selected, setSelected] = useState<any | null>(null);

  const total = meetings.length;
  const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
  const today = meetings.filter((m: any) => new Date(m.created_at) >= dayStart).length;
  const pending = meetings.filter((m: any) => m.status === "pending").length;

  const remove = async (id: string) => {
    if (!confirm("Delete this price?")) return;
    const { error } = await supabase.from("meeting_prices").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "meeting-prices"] });
    qc.invalidateQueries({ queryKey: ["meeting-prices"] });
    toast.success("Deleted");
  };

  const cols: Column<any>[] = [
    { key: "created_at", header: "Booked at", render: (r) => new Date(r.created_at).toLocaleString(), csv: (r) => r.created_at },
    { key: "customer_email", header: "Customer", render: (r) => `${r.customer_first_name ?? ""} ${r.customer_last_name ?? ""} <${r.customer_email}>` },
    { key: "duration_minutes", header: "Duration", render: (r) => `${r.duration_minutes ?? "—"} min` },
    { key: "scheduled_date", header: "Date", render: (r) => r.scheduled_date ?? "—" },
    { key: "scheduled_time", header: "Time", render: (r) => r.scheduled_time ?? "—" },
    { key: "amount", header: "Amount", render: (r) => `£${Number(r.amount).toFixed(2)}`, csv: (r) => r.amount },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <SummaryCard icon={Video} label="Total Meetings" value={total} />
        <SummaryCard icon={Video} label="Today" value={today} />
        <SummaryCard icon={Video} label="Pending" value={pending} />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Meeting Price</h2>
          <button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex items-center gap-2 bg-gold text-primary-foreground text-xs tracking-[0.16em] uppercase font-semibold px-4 py-2.5 hover:bg-gold-deep">
            <Plus className="h-4 w-4" /> Set meeting price
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prices.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-full">No prices yet. Create one to enable bookings.</p>
          ) : (
            prices.map((p) => (
              <div key={p.id} className="group bg-card border border-border p-5 rounded-md relative">
                <p className="font-display text-2xl">{p.duration_minutes} min</p>
                <p className="mt-2">
                  {p.original_price && <span className="text-muted-foreground line-through mr-2">£{p.original_price}</span>}
                  <span className="text-gold font-display text-xl">£{p.price}</span>
                </p>
                <div className="absolute inset-0 bg-card/95 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
                  <button onClick={() => { setEditing(p); setOpen(true); }} className="px-4 py-2 border border-border rounded text-xs hover:border-gold hover:text-gold inline-flex items-center gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                  <button onClick={() => remove(p.id)} className="px-4 py-2 border border-border rounded text-xs hover:border-destructive hover:text-destructive inline-flex items-center gap-1.5"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl mb-4">Bookings</h2>
        <DataTable data={meetings} columns={cols} exportName="meetings" onRowClick={setSelected} />
      </section>

      {open && <PriceForm editing={editing} onClose={() => setOpen(false)} onSaved={() => { qc.invalidateQueries({ queryKey: ["admin", "meeting-prices"] }); qc.invalidateQueries({ queryKey: ["meeting-prices"] }); setOpen(false); }} />}

      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setSelected(null)} />
          <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card border-l border-border overflow-y-auto" style={{ animation: "rise 0.3s ease both" }}>
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div>
                <p className="eyebrow">Meeting Booking</p>
                <h3 className="font-display text-lg mt-1">{selected.customer_first_name} {selected.customer_last_name}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <D label="Email" value={selected.customer_email} />
              <D label="Phone" value={selected.customer_phone || "—"} />
              <D label="Duration" value={`${selected.duration_minutes ?? "—"} min`} />
              <D label="Date" value={selected.scheduled_date || "—"} />
              <D label="Time" value={selected.scheduled_time || "—"} />
              <D label="Amount" value={`£${Number(selected.amount).toFixed(2)}`} />
              <D label="Purpose"><p className="whitespace-pre-wrap">{selected.purpose || "—"}</p></D>
              <D label="Payment Status"><StatusBadge status={selected.status} /></D>
              <D label="Payment Reference" value={selected.paystack_reference || "—"} />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function D({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-1">{label}</p>
      {children ?? <p>{value}</p>}
    </div>
  );
}

function PriceForm({ editing, onClose, onSaved }: { editing: Price | null; onClose: () => void; onSaved: () => void }) {
  const [duration, setDuration] = useState(editing?.duration_minutes?.toString() ?? "30");
  const [price, setPrice] = useState(editing?.price?.toString() ?? "");
  const [old, setOld] = useState(editing?.original_price?.toString() ?? "");
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = { duration_minutes: Number(duration), price: Number(price), original_price: old ? Number(old) : null };
    const { error } = editing
      ? await supabase.from("meeting_prices").update(payload).eq("id", editing.id)
      : await supabase.from("meeting_prices").insert(payload);
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
            <h3 className="font-display text-lg">{editing ? "Edit price" : "Set meeting price"}</h3>
            <button type="button" onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border"><X className="h-4 w-4" /></button>
          </div>
          <F label="Duration (minutes)" type="number" value={duration} onChange={setDuration} required />
          <F label="Price (£)" type="number" value={price} onChange={setPrice} required />
          <F label="Discounted from (£) — optional slash price" type="number" value={old} onChange={setOld} />
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
