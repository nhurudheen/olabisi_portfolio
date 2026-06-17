import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "./services";

export type Ebook = {
  id: string;
  slug: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  originalPrice: number | null;
  cover: string;
  pages: number | null;
  badge: string | null;
  isFree: boolean;
  category: Category;
};

const DEFAULT_COVER = "/ebook-1.jpg";

export function mapEbook(row: any): Ebook {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    price: Number(row.price ?? 0),
    originalPrice: row.original_price != null ? Number(row.original_price) : null,
    cover: row.cover_url || DEFAULT_COVER,
    pages: row.pages,
    badge: row.badge,
    isFree: !!row.is_free,
    category: (row.category ?? "business") as Category,
  };
}

export async function fetchEbooks(): Promise<Ebook[]> {
  const { data, error } = await supabase.from("ebooks").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapEbook);
}

export function useEbooks() {
  return useQuery({ queryKey: ["ebooks"], queryFn: fetchEbooks });
}
