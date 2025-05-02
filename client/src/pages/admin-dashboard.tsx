import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import {
  Users,
  ShoppingBag,
  PackageCheck,
  DollarSign,
  PieChart,
  BarChart,
  Settings,
  Store,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/users"],
    enabled: !!user && user.role === "admin",
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["/api/orders"],
    enabled: !!user && user.role === "admin",
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["/api/products"],
    enabled: !!user && user.role === "admin",
  });

  if (!user || user.role !== "admin") {
    return null; // This should be handled by ProtectedRoute
  }

  // Calculate dashboard stats
  const totalSales = orders ? orders.reduce((sum, order) => sum + order.totalAmount, 0) : 0;
  const totalProducts = products?.length || 0;
  const totalUsers = users?.length || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders ? orders.filter(order => order.status === "pending").length : 0;
  const totalVendors = users ? users.filter(user => user.role === "vendor").length : 0;

  return (
    <MainLayout showSidebar>
      <div className="container p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, products, and orders
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/settings">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex overflow-auto pb-2 scrollbar-hide">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                      {isLoadingOrders ? (
                        <Skeleton className="h-8 w-24 mt-1" />
                      ) : (
                        <h2 className="text-3xl font-bold">{formatCurrency(totalSales)}</h2>
                      )}
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      {isLoadingUsers ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <h2 className="text-3xl font-bold">{totalUsers}</h2>
                      )}
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Products</p>
                      {isLoadingProducts ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <h2 className="text-3xl font-bold">{totalProducts}</h2>
                      )}
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                      {isLoadingOrders ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <h2 className="text-3xl font-bold">{pendingOrders}</h2>
                      )}
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <PackageCheck className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-yellow-100 p-3">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-yellow-800">Vendor Approvals Pending</h3>
                      <p className="text-sm text-yellow-600 mt-1">
                        There are 3 new vendor applications that need your review.
                      </p>
                      <Button size="sm" variant="outline" className="mt-3 border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                        Review Applications
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 p-3">
                      <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800">System Status</h3>
                      <p className="text-sm text-blue-600 mt-1">
                        All systems are running smoothly. Last backup: 2 hours ago.
                      </p>
                      <Button size="sm" variant="outline" className="mt-3 border-blue-300 text-blue-800 hover:bg-blue-100">
                        View Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/admin/orders">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
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
                    <p className="text-muted-foreground">No orders have been placed yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <span className="text-sm px-2 py-0.5 bg-muted rounded-full capitalize">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                          </div>
                          <Link href={`/admin/orders/${order.id}`}>
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/users">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Manage Users</h3>
                      <p className="text-sm text-muted-foreground">{totalUsers} total users</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/products">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Products</h3>
                      <p className="text-sm text-muted-foreground">{totalProducts} products</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/orders">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <PackageCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Orders</h3>
                      <p className="text-sm text-muted-foreground">{totalOrders} total orders</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/vendors">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Vendors</h3>
                      <p className="text-sm text-muted-foreground">{totalVendors} active vendors</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Users</CardTitle>
                  <Link href="/admin/users">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : !users || users.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No users found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                            {user.firstName ? user.firstName[0] : user.username[0]}
                          </div>
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Products</CardTitle>
                  <Link href="/admin/products">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingProducts ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : !products || products.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No products found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-md bg-muted overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
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
                <div className="flex items-center justify-between">
                  <CardTitle>All Orders</CardTitle>
                  <Link href="/admin/orders">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
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
                    <p className="text-muted-foreground">No orders found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <span className="text-sm px-2 py-0.5 bg-muted rounded-full capitalize">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                          </div>
                          <Button size="sm">Update</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Detailed analytics dashboard will be available here</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <BarChart className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">New Users (Last 7 Days)</span>
                      <span className="font-medium">+24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Conversion Rate</span>
                      <span className="font-medium">3.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg. Order Value</span>
                      <span className="font-medium">{formatCurrency(64.50)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Active Vendors</span>
                      <span className="font-medium">{totalVendors}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
