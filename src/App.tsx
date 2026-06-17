import { Routes, Route, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "./lib/cart";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "./routes/index";
import AboutPage from "./routes/about";
import ShopPage from "./routes/shop";
import ContactPage from "./routes/contact";
import CheckoutPage from "./routes/checkout";
import AdminLogin from "./routes/admin/login";
import AdminLayout from "./components/admin/admin-layout";
import AdminProtected from "./components/admin/protected-route";
import AdminDashboard from "./routes/admin/dashboard";
import AdminOrders from "./routes/admin/orders";
import AdminServices from "./routes/admin/services";
import AdminMeetings from "./routes/admin/meetings";
import AdminEbooks from "./routes/admin/ebooks";
import AdminMessages from "./routes/admin/messages";
import AdminProfile from "./routes/admin/profile";
import PaymentSuccess from "./routes/payment-success";
import PaymentCancel from "./routes/payment-cancel";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex bg-gold text-primary-foreground font-semibold text-xs tracking-[0.16em] uppercase px-6 py-3">
          Go home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProtected>
                <AdminLayout />
              </AdminProtected>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="ebooks" element={<AdminEbooks />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
