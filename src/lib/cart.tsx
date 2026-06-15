import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ebooks, type Ebook } from "./ebooks";

type CartItem = { id: string; qty: number };

type CartContextValue = {
  items: CartItem[];
  detailed: (CartItem & { ebook: Ebook })[];
  count: number;
  subtotal: number;
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "olabisi.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const detailed = items
      .map((i) => {
        const ebook = ebooks.find((b) => b.id === i.id);
        return ebook ? { ...i, ebook } : null;
      })
      .filter((x): x is CartItem & { ebook: Ebook } => Boolean(x));
    const count = detailed.reduce((s, i) => s + i.qty, 0);
    const subtotal = detailed.reduce((s, i) => s + i.qty * i.ebook.price, 0);
    return {
      items,
      detailed,
      count,
      subtotal,
      open,
      setOpen,
      add: (id) =>
        setItems((prev) => {
          const existing = prev.find((p) => p.id === id);
          if (existing) return prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p));
          return [...prev, { id, qty: 1 }];
        }),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p)),
        ),
      clear: () => setItems([]),
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
