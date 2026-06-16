import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { reference, order_id } = await req.json();
    if (!reference || !order_id) {
      return new Response(JSON.stringify({ error: "Missing reference or order_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const SECRET = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!SECRET) {
      return new Response(JSON.stringify({ error: "PAYSTACK_SECRET_KEY is not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${SECRET}` },
    });
    const json = await res.json();
    const status = json?.data?.status;

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const newStatus = status === "success" ? "paid" : status === "failed" ? "failed" : "pending";
    await supabase.from("orders").update({ status: newStatus }).eq("id", order_id);

    return new Response(JSON.stringify({ status: newStatus, paystack: json?.data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
