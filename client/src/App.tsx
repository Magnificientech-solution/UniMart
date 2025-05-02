import { Route, Switch, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/context/cart-context";
import { ProtectedRoute } from "@/lib/protected-route";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";

// Pages
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DocumentationPage from "@/pages/documentation-page";
import AboutPage from "@/pages/about-page";
import CategoriesPage from "@/pages/categories-page";
import ProductsPage from "@/pages/products-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CartPage from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import CustomerDashboard from "@/pages/customer-dashboard";
import VendorDashboard from "@/pages/vendor-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";

// Admin pages
import AdminUsersPage from "@/pages/admin/users-page";
import AdminProductsPage from "@/pages/admin/products-page";
import AdminOrdersPage from "@/pages/admin/orders-page";
import AdminVendorsPage from "@/pages/admin/vendors-page";

// Vendor pages
import VendorProductsPage from "@/pages/vendor/products-page";
import VendorOrdersPage from "@/pages/vendor/orders-page";
import TermsPage from "@/pages/terms-page";

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        {/* Public routes */}
        <Route path="/">
          <PageTransition><HomePage /></PageTransition>
        </Route>
        <Route path="/auth">
          <PageTransition><AuthPage /></PageTransition>
        </Route>
        <Route path="/about">
          <PageTransition><AboutPage /></PageTransition>
        </Route>
        <Route path="/categories">
          <PageTransition><CategoriesPage /></PageTransition>
        </Route>
        <Route path="/categories/:slug">
          <PageTransition><ProductsPage /></PageTransition>
        </Route>
        <Route path="/products">
          <PageTransition><ProductsPage /></PageTransition>
        </Route>
        <Route path="/products/:slug">
          <PageTransition><ProductDetailPage /></PageTransition>
        </Route>
        <Route path="/terms">
          <PageTransition><TermsPage /></PageTransition>
        </Route>
        <Route path="/documentation">
          <PageTransition><DocumentationPage /></PageTransition>
        </Route>
        
        {/* Cart page - accessible to all users */}
        <Route path="/cart">
          <PageTransition><CartPage /></PageTransition>
        </Route>
        {/* Checkout - protected, requires login */}
        <Route path="/checkout">
          <ProtectedRoute>
            <PageTransition><CheckoutPage /></PageTransition>
          </ProtectedRoute>
        </Route>
        <Route path="/customer-dashboard">
          <ProtectedRoute>
            <PageTransition><CustomerDashboard /></PageTransition>
          </ProtectedRoute>
        </Route>
        
        {/* Protected routes - Vendor */}
        <Route path="/vendor-dashboard">
          <ProtectedRoute requiredRole="vendor">
            <PageTransition><VendorDashboard /></PageTransition>
          </ProtectedRoute>
        </Route>
        <Route path="/vendor/products">
          <ProtectedRoute requiredRole="vendor">
            <PageTransition><VendorProductsPage /></PageTransition>
          </ProtectedRoute>
        </Route>
        <Route path="/vendor/orders">
          <ProtectedRoute requiredRole="vendor">
            <PageTransition><VendorOrdersPage /></PageTransition>
          </ProtectedRoute>
        </Route>
        
        {/* Protected routes - Admin */}
        <Route path="/admin-dashboard">
          <ProtectedRoute requiredRole="admin">
            <PageTransition><AdminDashboard /></PageTransition>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/users">
          <ProtectedRoute requiredRole="admin">
            <PageTransition><AdminUsersPage /></PageTransition>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/products">
          <ProtectedRoute requiredRole="admin">
            <PageTransition><AdminProductsPage /></PageTransition>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/orders">
          <ProtectedRoute requiredRole="admin">
            <PageTransition><AdminOrdersPage /></PageTransition>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/vendors">
          <ProtectedRoute requiredRole="admin">
            <PageTransition><AdminVendorsPage /></PageTransition>
          </ProtectedRoute>
        </Route>
        
        {/* Fallback to 404 */}
        <Route path="*">
          <PageTransition><NotFound /></PageTransition>
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <AppRoutes />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
