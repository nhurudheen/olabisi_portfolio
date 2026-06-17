import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useEffect } from "react";

export function CartDrawer() {
  const { open, setOpen, items, subtotal, setQty, remove } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);


  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-card border-l border-border shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <p className="eyebrow">Your Cart</p>
            <h2 className="font-display text-xl mt-1">
              {items.length} {items.length === 1 ? "item" : "items"}
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="h-9 w-9 rounded-full border border-border hover:border-gold hover:text-gold inline-flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">Your cart is empty.</p>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex text-xs tracking-[0.18em] uppercase text-gold hover:text-gold-deep border-b border-gold/40 pb-1"
              >
                Browse ebooks
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-sm border border-border"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm leading-tight">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">£{item.price.toFixed(2)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-sm">
                        <button
                          className="h-7 w-7 inline-flex items-center justify-center hover:text-gold"
                          onClick={() => setQty(item.id, item.qty - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs w-6 text-center">{item.qty}</span>
                        <button
                          className="h-7 w-7 inline-flex items-center justify-center hover:text-gold"
                          onClick={() => setQty(item.id, item.qty + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-muted-foreground hover:text-destructive text-xs inline-flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-display text-sm">£{(item.qty * item.price).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4 bg-background/60">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-display text-lg">£{subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setOpen(false)}
              className="block text-center bg-gold text-primary-foreground font-semibold text-sm tracking-[0.14em] uppercase py-3.5 hover:bg-gold-deep transition-colors"
            >
              Checkout
            </Link>
            <p className="text-[10px] text-muted-foreground text-center tracking-wider uppercase">
              Secure checkout · Stripe Payment · Digital delivery
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
