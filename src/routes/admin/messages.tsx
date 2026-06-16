import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mail, X } from "lucide-react";
import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { SummaryCard } from "./dashboard";

export default function AdminMessages() {
  const qc = useQueryClient();
  const { data: messages = [] } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => (await supabase.from("messages").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [selected, setSelected] = useState<any | null>(null);

  const now = new Date();
  const dayStart = new Date(now); dayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
  const today = messages.filter((m: any) => new Date(m.created_at) >= dayStart).length;
  const week = messages.filter((m: any) => new Date(m.created_at) >= weekStart).length;

  const open = async (m: any) => {
    setSelected(m);
    if (!m.read) {
      await supabase.from("messages").update({ read: true }).eq("id", m.id);
      qc.invalidateQueries({ queryKey: ["admin", "messages"] });
    }
  };

  const cols: Column<any>[] = [
   { key: "sn", header: "S/N", render: (row) =>messages.findIndex((item) => item.id === row.id) + 1, },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "subject", header: "Subject", render: (r) => r.subject || "—" },
    { key: "read", header: "Status", render: (r) => r.read ? <span className="text-muted-foreground text-xs">Read</span> : <span className="text-gold text-xs font-semibold">New</span> },
      { key: "created_at", header: "Date", render: (r) => new Date(r.created_at).toLocaleString(), csv: (r) => r.created_at },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <SummaryCard icon={Mail} label="Total Messages" value={messages.length} />
        <SummaryCard icon={Mail} label="Today" value={today} />
        <SummaryCard icon={Mail} label="This Week" value={week} />
      </div>
      <h2 className="font-display text-xl">All messages</h2>
      <DataTable data={messages} columns={cols} exportName="messages" onRowClick={open} />

      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setSelected(null)} />
          <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card border-l border-border overflow-y-auto" style={{ animation: "rise 0.3s ease both" }}>
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div>
                <p className="eyebrow">Message</p>
                <h3 className="font-display text-lg mt-1">{selected.subject || "(no subject)"}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div>
                <p className="eyebrow mb-1">From</p>
                <p>{selected.name} — <a className="text-gold hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a></p>
              </div>
              <div>
                <p className="eyebrow mb-1">Received</p>
                <p>{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="eyebrow mb-1">Message</p>
                <p className="whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
