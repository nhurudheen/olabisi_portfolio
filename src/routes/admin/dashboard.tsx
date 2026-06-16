import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { ShoppingCart, BookOpen, Mail, Briefcase } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default function AdminDashboard() {
  const { data: orders = [] } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => (await supabase.from("orders").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: messages = [] } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => (await supabase.from("messages").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [tab, setTab] = useState<"ebook" | "service">("ebook");

  const today = todayISO();
  const ebookOrders = orders.filter((o: any) => o.type === "ebook");
  const serviceOrders = orders.filter((o: any) => o.type === "service");
  const todayService = serviceOrders.filter((o: any) => o.created_at >= today).length;
  const todayEbook = ebookOrders.filter((o: any) => o.created_at >= today).length;
  const todayMsg = messages.filter((m: any) => m.created_at >= today).length;

  const filtered = useMemo(() => orders.filter((o: any) => o.type === tab), [orders, tab]);

  const cols: Column<any>[] = [
    { key: "created_at", header: "Date", render: (r) => new Date(r.created_at).toLocaleString(), csv: (r) => r.created_at },
    { key: "customer_email", header: "Customer", render: (r) => `${r.customer_first_name ?? ""} ${r.customer_last_name ?? ""} (${r.customer_email})`, csv: (r) => r.customer_email },
    { key: "amount", header: "Amount", render: (r) => `£${Number(r.amount).toFixed(2)}`, csv: (r) => r.amount },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} />, csv: (r) => r.status },
    { key: "paystack_reference", header: "Reference" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={Briefcase} label="Service Orders" value={serviceOrders.length} sub={`${todayService} today`} />
        <SummaryCard icon={BookOpen} label="Ebook Orders" value={ebookOrders.length} sub={`${todayEbook} today`} />
        <SummaryCard icon={Mail} label="Messages" value={messages.length} sub={`${todayMsg} today`} />
        <SummaryCard icon={ShoppingCart} label="Total Orders" value={orders.length} sub={`${todayEbook + todayService} today`} />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-xl">Recent orders</h2>
        <div className="inline-flex border border-border rounded-md overflow-hidden text-xs">
          <button onClick={() => setTab("ebook")} className={`px-4 py-2 ${tab === "ebook" ? "bg-gold text-primary-foreground" : "hover:bg-secondary"}`}>Ebook Orders</button>
          <button onClick={() => setTab("service")} className={`px-4 py-2 ${tab === "service" ? "bg-gold text-primary-foreground" : "hover:bg-secondary"}`}>Service Orders</button>
        </div>
      </div>

      <DataTable data={filtered} columns={cols} exportName={`${tab}-orders`} />
    </div>
  );
}

export function SummaryCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-card border border-border p-5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <p className="font-display text-3xl mt-3">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-gold/15 text-gold border-gold/30",
    pending: "bg-secondary text-muted-foreground border-border",
    failed: "bg-destructive/15 text-destructive border-destructive/30",
    cancelled: "bg-secondary text-muted-foreground border-border",
  };
  return (
    <span className={`inline-block text-[10px] tracking-[0.14em] uppercase font-semibold px-2 py-1 border rounded ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}
