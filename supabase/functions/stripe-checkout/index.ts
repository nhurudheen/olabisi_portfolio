import Stripe from "https://esm.sh/stripe@14?target=denonext";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type LineItem = { name: string; amount: number; quantity?: number };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const key = Deno.env.get("STRIPE_SECRET_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "STRIPE_SECRET_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const stripe = new Stripe(key, { apiVersion: "2024-06-20" });

    const body = await req.json();
    const {
      items,
      email,
      currency = "gbp",
      order_id,
      success_url,
      cancel_url,
      metadata = {},
    }: {
      items: LineItem[];
      email: string;
      currency?: string;
      order_id: string;
      success_url: string;
      cancel_url: string;
      metadata?: Record<string, string>;
    } = body;

    if (!items?.length || !email || !order_id || !success_url || !cancel_url) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: items.map((i) => ({
        price_data: {
          currency,
          product_data: { name: i.name },
          unit_amount: Math.round(i.amount * 100),
        },
        quantity: i.quantity ?? 1,
      })),
      success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}&order_id=${order_id}`,
      cancel_url: `${cancel_url}?order_id=${order_id}`,
      metadata: { order_id, ...metadata },
    });

    return new Response(JSON.stringify({ url: session.url, id: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
