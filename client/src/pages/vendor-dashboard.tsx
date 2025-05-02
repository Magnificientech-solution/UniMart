import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  TrendingUp,
  DollarSign,
  Plus,
  BarChart,
  ArrowUpRight,
  Store,
  Settings,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["/api/products", { vendorId: user?.id }],
    enabled: !!user,
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  if (!user) {
    return null; // This should be handled by ProtectedRoute
  }

  // Filter vendor-specific orders
  const vendorOrders = orders || [];

  // Calculate sales data
  const totalSales = vendorOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = vendorOrders.filter(order => order.status === "pending" || order.status === "processing").length;
  const totalProducts = products?.length || 0;

  return (
    <MainLayout showSidebar>
      <div className="container p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your products and orders
            </p>
          </div>
          <Link href="/vendor/products">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex overflow-auto pb-2 scrollbar-hide">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Growth</p>
                      <h2 className="text-3xl font-bold">+12.5%</h2>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <TrendingUp className="h-6 w-6 text-primary" />
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
                  <Link href="/vendor/orders">
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
                ) : vendorOrders.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No orders have been placed for your products yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vendorOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                            <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                          </div>
                          <Link href={`/vendor/orders/${order.id}`}>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/vendor/products">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Manage Products</h3>
                      <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/vendor/orders">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <PackageCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Process Orders</h3>
                      <p className="text-sm text-muted-foreground">Update order status</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/vendor/analytics">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <BarChart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">View Analytics</h3>
                      <p className="text-sm text-muted-foreground">Track your performance</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Products</CardTitle>
                  <Link href="/vendor/products">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
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
                    <p className="text-muted-foreground">You haven't added any products yet.</p>
                    <Link href="/vendor/products">
                      <Button className="mt-4">Add Your First Product</Button>
                    </Link>
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
                <CardTitle>Orders Management</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : vendorOrders.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No orders have been placed for your products yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vendorOrders.map((order) => (
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
                          <Button size="sm">Update Status</Button>
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
                <CardTitle>Sales Analytics</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Detailed analytics will be available here</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingProducts ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : !products || products.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No products available</p>
                  ) : (
                    <div className="space-y-4">
                      {products.slice(0, 3).map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                              <span className="font-medium">{index + 1}</span>
                            </div>
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <span>{formatCurrency(product.price)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Store Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Conversion Rate</span>
                      <span className="font-medium">3.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg. Order Value</span>
                      <span className="font-medium">{formatCurrency(58.40)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Product Views</span>
                      <span className="font-medium">1,245</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Return Rate</span>
                      <span className="font-medium">2.1%</span>
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
