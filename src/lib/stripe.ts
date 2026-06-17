import { supabase } from "@/integrations/supabase/client";

export type StripeLineItem = { name: string; amount: number; quantity?: number };

export async function startStripeCheckout(params: {
  items: StripeLineItem[];
  email: string;
  orderId: string;
  metadata?: Record<string, string>;
}) {
  const origin = window.location.origin;
  const { data, error } = await supabase.functions.invoke("stripe-checkout", {
    body: {
      items: params.items,
      email: params.email,
      currency: "gbp",
      order_id: params.orderId,
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/payment-cancel`,
      metadata: params.metadata ?? {},
    },
  });
  if (error) throw error;
  if (!data?.url) throw new Error("No checkout URL returned");
  window.location.href = data.url;
}

export async function verifyStripeSession(sessionId: string, orderId: string) {
  const { data, error } = await supabase.functions.invoke("stripe-verify", {
    body: { session_id: sessionId, order_id: orderId },
  });
  if (error) throw error;
  return data;
}
