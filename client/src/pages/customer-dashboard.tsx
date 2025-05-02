import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  ShoppingCart,
  ArrowUpRight,
  Heart,
  History,
  Settings
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  const { data: wishlist, isLoading: isLoadingWishlist } = useQuery({
    queryKey: ["/api/wishlist"],
    enabled: !!user,
  });

  if (!user) {
    return null; // This should be handled by ProtectedRoute
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "processing": return <ShoppingBag className="h-4 w-4" />;
      case "shipped": return <Package className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout showSidebar>
      <div className="container p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.firstName || user.username}!
            </p>
          </div>
          <Link href="/products">
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shop Now
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex overflow-auto pb-2 scrollbar-hide">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            {/* Order Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    {isLoadingOrders ? (
                      <Skeleton className="h-8 w-16 mx-auto" />
                    ) : (
                      <h2 className="text-3xl font-bold">{orders?.length || 0}</h2>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                    {isLoadingOrders ? (
                      <Skeleton className="h-8 w-16 mx-auto" />
                    ) : (
                      <h2 className="text-3xl font-bold">
                        {orders?.filter(o => o.status === "pending" || o.status === "processing").length || 0}
                      </h2>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
                    {isLoadingWishlist ? (
                      <Skeleton className="h-8 w-16 mx-auto" />
                    ) : (
                      <h2 className="text-3xl font-bold">{wishlist?.length || 0}</h2>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Cart Items</p>
                    <Link href="/cart">
                      <Button variant="outline" size="sm">
                        View Cart <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/orders">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                    <Link href="/products">
                      <Button variant="outline" className="mt-4">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:flex h-12 w-12 rounded-md bg-primary/10 items-center justify-center">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                            <Badge className={`${getOrderStatusColor(order.status)} flex items-center gap-1`}>
                              {getOrderStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </Badge>
                          </div>
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="ghost" size="icon">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                    <Link href="/products">
                      <Button variant="outline" className="mt-4">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:flex h-12 w-12 rounded-md bg-primary/10 items-center justify-center">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                            <Badge className={`${getOrderStatusColor(order.status)} flex items-center gap-1`}>
                              {getOrderStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </Badge>
                          </div>
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="ghost" size="icon">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingWishlist ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : !wishlist || wishlist.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Your wishlist is empty.</p>
                    <Link href="/products">
                      <Button variant="outline" className="mt-4">Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-md bg-muted overflow-hidden">
                            {item.product?.images && item.product.images.length > 0 ? (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                          <div>
                            <Link href={`/products/${item.product?.slug}`}>
                              <p className="font-medium hover:text-primary cursor-pointer">{item.product?.name}</p>
                            </Link>
                            <p className="text-sm text-muted-foreground">${item.product?.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button variant="ghost" size="icon">
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="bg-primary/10 p-6 rounded-full">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">{user.firstName} {user.lastName}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Account Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Username:</span>
                          <span>{user.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Type:</span>
                          <span className="capitalize">{user.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Joined:</span>
                          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span>{user.phone || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Address:</span>
                          <span>{user.address || "Not provided"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button className="gap-2">
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <History className="h-4 w-4" />
                      Activity Log
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
