import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { ShoppingCart, BookOpen, Briefcase, X } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { SummaryCard, StatusBadge } from "./dashboard";

export default function AdminOrders() {
  const { data: orders = [] } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => (await supabase.from("orders").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [tab, setTab] = useState<"ebook" | "service">("ebook");
  const [selected, setSelected] = useState<any | null>(null);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();
  const ebook = orders.filter((o: any) => o.type === "ebook");
  const service = orders.filter((o: any) => o.type === "service");
  const todayCount = orders.filter((o: any) => o.created_at >= todayISO).length;

  const filtered = useMemo(() => orders.filter((o: any) => o.type === tab), [orders, tab]);

  const cols: Column<any>[] = [
    { key: "sn", header: "S/N", render: (row) => filtered.findIndex((item) => item.id === row.id) + 1,},
    { key: "type", header: "Type" },
    { key: "customer_email", header: "Customer", render: (r) => `${r.customer_first_name ?? ""} ${r.customer_last_name ?? ""} ` },
    { key: "amount", header: "Amount", render: (r) => `£${Number(r.amount).toFixed(2)}`, csv: (r) => r.amount },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },

    { key: "created_at", header: "Date", render: (r) => new Date(r.created_at).toLocaleString(), csv: (r) => r.created_at },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={ShoppingCart} label="Total Orders" value={orders.length} />
        <SummaryCard icon={ShoppingCart} label="Today's Orders" value={todayCount} />
        <SummaryCard icon={BookOpen} label="Ebook Orders" value={ebook.length} />
        <SummaryCard icon={Briefcase} label="Service Orders" value={service.length} />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-xl">All orders</h2>
        <div className="inline-flex border border-border rounded-md overflow-hidden text-xs">
          <button onClick={() => setTab("ebook")} className={`px-4 py-2 ${tab === "ebook" ? "bg-gold text-primary-foreground" : "hover:bg-secondary"}`}>Ebook Orders</button>
          <button onClick={() => setTab("service")} className={`px-4 py-2 ${tab === "service" ? "bg-gold text-primary-foreground" : "hover:bg-secondary"}`}>Service Orders</button>
        </div>
      </div>

      <DataTable data={filtered} columns={cols} exportName={`${tab}-orders`} onRowClick={setSelected} />

      {selected && <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function OrderDetailDrawer({ order, onClose }: { order: any; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card border-l border-border overflow-y-auto" style={{ animation: "rise 0.3s ease both" }}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <p className="eyebrow">Order Details</p>
            <p className="font-display text-lg mt-1 capitalize">{order.type} order</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-5 text-sm">
          <Detail label="Customer" value={`${order.customer_first_name ?? ""} ${order.customer_last_name ?? ""}`.trim() || "—"} />
          <Detail label="Email" value={order.customer_email} />
          <Detail label="Phone" value={order.customer_phone || "—"} />
          <Detail label="Status"><StatusBadge status={order.status} /></Detail>
          <Detail label="Amount" value={`£${Number(order.amount).toFixed(2)} ${order.currency}`} />
          <Detail label="Reference" value={order.paystack_reference || "—"} />
          <Detail label="Date" value={new Date(order.created_at).toLocaleString()} />
          {order.type === "service" && (
            <>
              <Detail label="Scheduled date" value={order.scheduled_date || "—"} />
              <Detail label="Scheduled time" value={order.scheduled_time || "—"} />
            </>
          )}
          <div>
            <p className="eyebrow mb-2">Items</p>
            <ul className="space-y-2">
              {(order.items || []).map((it: any, i: number) => (
                <li key={i} className="bg-secondary/40 p-3 rounded text-xs">
                  <p className="font-semibold">{it.title}</p>
                  <p className="text-muted-foreground mt-1">£{Number(it.price ?? 0).toFixed(2)}{it.qty ? ` × ${it.qty}` : ""}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

function Detail({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-1">{label}</p>
      {children ?? <p>{value}</p>}
    </div>
  );
}
