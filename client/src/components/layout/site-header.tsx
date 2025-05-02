import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, Menu, Heart, Package, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartContext } from "@/context/cart-context";

// New Documentation component (placeholder - needs further implementation)
const DocumentationPage = () => {
  return (
    <div>
      <h1>Documentation</h1>
      {/* Add content here based on user's requirements */}
      <section>
        <h2>User Journey</h2>
        <ul>
          <li>Account creation walkthrough</li>
          <li>Browsing categories and products demo</li>
          <li>Adding items to cart demonstration</li>
          <li>Checkout process step-by-step</li>
          <li>Order tracking interface</li>
        </ul>
      </section>
      <section>
        <h2>Vendor Journey</h2>
        <ul>
          <li>Store registration process</li>
          <li>Product management interface</li>
          <li>Order processing workflow</li>
          <li>Analytics dashboard overview</li>
          <li>Payment handling system</li>
        </ul>
      </section>
      <section>
        <h2>Platform Features</h2>
        <ul>
          <li>Search functionality demo</li>
          <li>Reviews and ratings system</li>
          <li>Secure payment process</li>
          <li>Customer support access</li>
          <li>Mobile responsiveness showcase</li>
        </ul>
      </section>
    </div>
  );
};


export function SiteHeader() {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { cartItemsCount } = useCartContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getDashboardLink = () => {
    if (!user) return "/auth";

    switch (user.role) {
      case "admin": return "/admin-dashboard";
      case "vendor": return "/vendor-dashboard";
      default: return "/customer-dashboard";
    }
  };

  // Create a properly formatted user object for the UserAvatar component
  const formatAvatarUser = (user: any) => {
    if (!user) return null;
    return {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      avatarUrl: user.avatarUrl || undefined
    };
  };

  return (
    <header className="site-header sticky top-0 z-header w-full">
      <div className="container-responsive flex h-16 md:h-20 items-center justify-between">
        {/* Desktop Logo and Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          <Link to="/" className="hover-lift transition-transform">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">UniMart</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link to="/products">
              <span className={`nav-link ${location === "/products" ? "active" : ""}`}>
                Shop
              </span>
            </Link>
            <Link to="/categories">
              <span className={`nav-link ${location.startsWith("/categories") ? "active" : ""}`}>
                Categories
              </span>
            </Link>
            <Link to="/products">
              <span className={`nav-link ${location === "/wholesale" ? "active" : ""}`}>
                Wholesale
              </span>
            </Link>
            <Link to="/about">
              <span className={`nav-link ${location === "/about" ? "active" : ""}`}>
                About Us
              </span>
            </Link>
            <Link href="/documentation">
              <span className={`nav-link ${location === "/documentation" ? "active" : ""}`}>
                Documentation
              </span>
            </Link>
          </nav>
        </div>

        {/* Mobile logo */}
        <div className="md:hidden flex items-center">
          <Link to="/" className="hover-lift transition-transform">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">UniMart</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-end gap-4">
          <form className="flex-responsive w-full max-w-sm items-center" onSubmit={handleSearch}>
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary/70" />
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="form-input w-full pl-8 border-primary/20 focus-visible:ring-primary/30 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
              />
            </div>
          </form>

          {/* Cart button */}
          <Link to="/cart" className="hover-lift">
            <Button variant="outline" size="icon" className="cta-icon-only relative rounded-full border-primary/20 hover:bg-primary/5">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {cartItemsCount > 0 && (
                <Badge className="badge badge-primary absolute -top-2 -right-2 px-2 py-1 text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User menu or Auth buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-primary/20 hover:bg-primary/5 hover-lift">
                  <UserAvatar user={formatAvatarUser(user)} className="h-9 w-9" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl border-primary/10 shadow-lg">
                <DropdownMenuLabel className="text-primary font-medium p-2">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={getDashboardLink()}>
                  <DropdownMenuItem className="rounded-lg hover:bg-primary/5 focus:bg-primary/5 p-2">
                    <User className="mr-2 h-4 w-4 text-primary" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/wishlist">
                  <DropdownMenuItem className="rounded-lg hover:bg-primary/5 focus:bg-primary/5 p-2">
                    <Heart className="mr-2 h-4 w-4 text-primary" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/orders">
                  <DropdownMenuItem className="rounded-lg hover:bg-primary/5 focus:bg-primary/5 p-2">
                    <Package className="mr-2 h-4 w-4 text-primary" />
                    <span>Orders</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 focus:bg-rose-50 dark:focus:bg-rose-950/20 p-2"
                >
                  <LogOut className="mr-2 h-4 w-4 text-rose-500" />
                  <span className="text-rose-500">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="outline" size="sm" className="btn-secondary rounded-full shadow-sm">
                  Log in
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="btn-primary rounded-full shadow-sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <Link to="/cart" className="hover-lift">
            <Button variant="outline" size="icon" className="cta-icon-only relative rounded-full border-primary/20 hover:bg-primary/5">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {cartItemsCount > 0 && (
                <Badge className="badge badge-primary absolute -top-2 -right-2 px-2 py-1 text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="mobile-menu-toggle rounded-full border-primary/20 hover:bg-primary/5"
                aria-label="Open main menu"
              >
                <Menu className="h-5 w-5 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="mobile-menu-panel w-[85vw] max-w-[400px] border-r-primary/10">
              <div className="mobile-menu-container flex flex-col h-full">
                <div className="mobile-menu-header py-4 border-b border-primary/10">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center justify-center space-x-2">
                      <Package className="h-6 w-6 text-primary" />
                      <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">UniMart</span>
                    </div>
                  </Link>
                </div>

                <div className="mobile-menu-body flex-1 py-6 overflow-y-auto">
                  <form className="flex items-center space-x-2 mb-6 px-4" onSubmit={handleSearch}>
                    <div className="relative w-full">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary/70" />
                      <Input 
                        type="search" 
                        placeholder="Search products..." 
                        className="form-input w-full pl-8 border-primary/20 focus-visible:ring-primary/30 rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      size="sm" 
                      className="btn-primary rounded-lg"
                    >
                      <Search className="h-4 w-4" />
                      <span className="sr-only">Search</span>
                    </Button>
                  </form>

                  <nav className="mobile-menu-nav px-2">
                    <div className="space-y-1">
                      <Link 
                        to="/products" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`mobile-menu-link ${location === "/products" ? "active" : ""}`}
                      >
                        Shop
                      </Link>
                      <Link 
                        to="/categories" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`mobile-menu-link ${location.startsWith("/categories") ? "active" : ""}`}
                      >
                        Categories
                      </Link>
                      <Link 
                        to="/products" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`mobile-menu-link ${location === "/wholesale" ? "active" : ""}`}
                      >
                        Wholesale
                      </Link>
                      <Link 
                        to="/about" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`mobile-menu-link ${location === "/about" ? "active" : ""}`}
                      >
                        About Us
                      </Link>
                      <Link 
                        to="/documentation" 
                        onClick={() => setMobileMenuOpen(false)}
                        href="/documentation"
                        className={`mobile-menu-link ${location === "/documentation" ? "active" : ""}`}
                      >
                        Documentation
                      </Link>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-1">
                      {user ? (
                        <>
                          <Link 
                            to={getDashboardLink()} 
                            onClick={() => setMobileMenuOpen(false)}
                            className="mobile-menu-link"
                          >
                            <User className="menu-icon text-primary" />
                            <span>Dashboard</span>
                          </Link>
                          <Link 
                            to="/wishlist" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="mobile-menu-link"
                          >
                            <Heart className="menu-icon text-primary" />
                            <span>Wishlist</span>
                          </Link>
                          <Link 
                            to="/orders" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="mobile-menu-link"
                          >
                            <Package className="menu-icon text-primary" />
                            <span>Orders</span>
                          </Link>

                          <button 
                            className="mobile-menu-link w-full text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                            onClick={() => {
                              handleLogout();
                              setMobileMenuOpen(false);
                            }}
                          >
                            <LogOut className="menu-icon text-rose-500" />
                            <span>Log out</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col space-y-3 mt-4 px-2">
                          <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full btn-secondary rounded-full">
                              Log in
                            </Button>
                          </Link>
                          <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full btn-primary rounded-full">
                              Sign up
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </nav>
                </div>

                {user && (
                  <div className="mobile-menu-footer p-4 border-t border-primary/10">
                    <div className="flex items-center space-x-3">
                      <UserAvatar user={formatAvatarUser(user)} className="h-10 w-10 ring-2 ring-primary/10 ring-offset-2" />
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}