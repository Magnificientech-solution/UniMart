import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut,
  List,
  Heart,
  Clock,
  Store,
  PieChart
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) return null;

  const isCustomer = user.role === "customer";
  const isVendor = user.role === "vendor";
  const isAdmin = user.role === "admin";

  return (
    <div className={cn("pb-12 border-r h-screen", className)}>
      <div className="py-4 px-4 border-b">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">MarketVerse</span>
          </div>
        </Link>
      </div>
      <div className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <UserAvatar user={user} className="h-10 w-10" />
          <div>
            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-muted-foreground">{user.role}</p>
          </div>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-2">
        <div className="py-2">
          {isCustomer && (
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center">
              <Link href="/customer-dashboard">
                <Button 
                  variant={location === "/customer-dashboard" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/orders">
                <Button 
                  variant={location === "/orders" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button 
                  variant={location === "/wishlist" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
              </Link>
              <Link href="/profile">
                <Button 
                  variant={location === "/profile" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </nav>
          )}

          {isVendor && (
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center">
              <Link href="/vendor-dashboard">
                <Button 
                  variant={location === "/vendor-dashboard" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/vendor/products">
                <Button 
                  variant={location === "/vendor/products" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Products
                </Button>
              </Link>
              <Link href="/vendor/orders">
                <Button 
                  variant={location === "/vendor/orders" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Link href="/vendor/analytics">
                <Button 
                  variant={location === "/vendor/analytics" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link href="/vendor/store">
                <Button 
                  variant={location === "/vendor/store" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Store className="h-4 w-4 mr-2" />
                  Store Settings
                </Button>
              </Link>
            </nav>
          )}

          {isAdmin && (
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center">
              <Link href="/admin-dashboard">
                <Button 
                  variant={location === "/admin-dashboard" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button 
                  variant={location === "/admin/users" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button 
                  variant={location === "/admin/products" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Products
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button 
                  variant={location === "/admin/orders" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Link href="/admin/vendors">
                <Button 
                  variant={location === "/admin/vendors" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Store className="h-4 w-4 mr-2" />
                  Vendors
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button 
                  variant={location === "/admin/analytics" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button 
                  variant={location === "/admin/categories" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <List className="h-4 w-4 mr-2" />
                  Categories
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </ScrollArea>
      <div className="px-3 py-2 mt-auto border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );
}
