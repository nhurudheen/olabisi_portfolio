import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = "business" | "career";

export type Service = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  isFree: boolean;
  category: Category;
};

export function formatPrice(s: { price: number; originalPrice?: number | null; isFree: boolean }) {
  if (s.isFree) return "FREE";
  return `£${s.price}`;
}

export function mapService(row: any): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    price: Number(row.price ?? 0),
    originalPrice: row.original_price != null ? Number(row.original_price) : null,
    isFree: !!row.is_free,
    category: (row.category ?? "business") as Category,
  };
}

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapService);
}

export function useServices() {
  return useQuery({ queryKey: ["services"], queryFn: fetchServices });
}
