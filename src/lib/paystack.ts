// Paystack inline checkout helper
// Public key must be set in .env as VITE_PAYSTACK_PUBLIC_KEY
import { supabase } from "@/integrations/supabase/client";

export const PAYSTACK_PUBLIC_KEY: string =
  (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string) || "";

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

let loadingPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.PaystackPop) return Promise.resolve();
  if (loadingPromise) return loadingPromise;
  loadingPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Paystack"));
    document.body.appendChild(s);
  });
  return loadingPromise;
}

export type PayParams = {
  email: string;
  amountGBP: number;
  reference: string;
  metadata?: Record<string, any>;
  onSuccess: (ref: string) => void;
  onClose?: () => void;
};

export async function payWithPaystack(p: PayParams) {
  if (!PAYSTACK_PUBLIC_KEY) {
    throw new Error("Paystack public key is not configured. Add VITE_PAYSTACK_PUBLIC_KEY to your .env");
  }
  await loadScript();
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: p.email,
    amount: Math.round(p.amountGBP * 100), // minor units
    currency: "GBP",
    ref: p.reference,
    metadata: p.metadata ?? {},
    callback: (response: any) => p.onSuccess(response.reference),
    onClose: () => p.onClose?.(),
  });
  handler.openIframe();
}

export async function verifyPayment(reference: string, orderId: string) {
  const { data, error } = await supabase.functions.invoke("paystack-verify", {
    body: { reference, order_id: orderId },
  });
  if (error) throw error;
  return data;
}

export function newRef(prefix = "olb") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
