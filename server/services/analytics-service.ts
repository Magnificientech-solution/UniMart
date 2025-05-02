import { storage } from '../storage';
import { User, Product, Order, OrderItem } from '@shared/schema';
import { addDays, subDays, subMonths, format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

// Types for analytics data
interface RevenueData {
  period: string;
  amount: number;
  date: Date;
  orderCount: number;
}

interface DashboardMetrics {
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
    changeDay: number;  // Percentage change from yesterday
    changeWeek: number; // Percentage change from last week
    changeMonth: number; // Percentage change from last month
    byPeriod: RevenueData[];
  };
  orders: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
    changeDay: number;
    changeWeek: number;
    changeMonth: number;
    byStatus: { [status: string]: number };
  };
  products: {
    total: number;
    trending: Product[];
    outOfStock: number;
    lowStock: number;
  };
  users: {
    total: number;
    customers: number;
    vendors: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    newCustomersThisMonth: number;
  };
}

interface VendorAnalytics {
  id: number;
  name: string;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  topProducts: {
    id: number;
    name: string;
    revenue: number;
    unitsSold: number;
  }[];
  commission: number;
  commissionRate: number;
  pendingPayment: number;
  productsCount: number;
  productCategoryCounts: { [category: string]: number };
  rating: number;
  tier: 'standard' | 'premium' | 'enterprise';
}

interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    percentChangeMonth: number;
  };
  metrics: {
    averageOrderValue: number;
    lifetimeValue: number;
    repeatPurchaseRate: number;
    averageOrdersPerCustomer: number;
  };
  demographics: {
    byCountry: { [country: string]: number };
    byCity: { [city: string]: number };
  };
  topCustomers: {
    id: number;
    name: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: Date;
  }[];
}

interface ProductAnalytics {
  totalProducts: number;
  categories: {
    id: number;
    name: string;
    productCount: number;
    percentageOfTotal: number;
  }[];
  metrics: {
    averagePrice: number;
    averageRating: number;
  };
  inventoryStatus: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
  bestSellingProducts: Product[];
  trendingProducts: Product[];
  highestRevenueProducts: {
    id: number;
    name: string;
    revenue: number;
    unitsSold: number;
  }[];
}

interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  metrics: {
    averageOrderValue: number;
    ordersPerDay: number;
  };
  byStatus: { [status: string]: number };
  byPeriod: {
    period: string;
    count: number;
    revenue: number;
  }[];
  byShippingCountry: { [country: string]: number };
}

class AnalyticsService {
  /**
   * Get dashboard metrics for admin
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const endOfToday = endOfDay(now);
    const startOfYesterday = startOfDay(subDays(now, 1));
    const endOfYesterday = endOfDay(subDays(now, 1));
    const startOfThisWeek = startOfWeek(now);
    const startOfLastWeek = startOfWeek(subDays(now, 7));
    const endOfLastWeek = endOfWeek(subDays(now, 7));
    const startOfThisMonth = startOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));

    // Get all orders
    const allOrders = await storage.getOrders();
    
    // Total revenue calculations
    const todayOrders = allOrders.filter(order => 
      order.createdAt && order.createdAt >= startOfToday && order.createdAt <= endOfToday
    );
    const yesterdayOrders = allOrders.filter(order => 
      order.createdAt && order.createdAt >= startOfYesterday && order.createdAt <= endOfYesterday
    );
    const thisWeekOrders = allOrders.filter(order => 
      order.createdAt && order.createdAt >= startOfThisWeek
    );
    const lastWeekOrders = allOrders.filter(order => 
      order.createdAt && order.createdAt >= startOfLastWeek && order.createdAt <= endOfLastWeek
    );
    const thisMonthOrders = allOrders.filter(order => 
      order.createdAt && order.createdAt >= startOfThisMonth
    );
    const lastMonthOrders = allOrders.filter(order => 
      order.createdAt && order.createdAt >= startOfLastMonth && order.createdAt <= endOfLastMonth
    );

    // Calculate revenue
    const revenueToday = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const revenueYesterday = yesterdayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const revenueThisWeek = thisWeekOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const revenueLastWeek = lastWeekOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const revenueThisMonth = thisMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const revenueLastMonth = lastMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate percentage changes
    const revenueDayChange = revenueYesterday ? ((revenueToday - revenueYesterday) / revenueYesterday) * 100 : 0;
    const revenueWeekChange = revenueLastWeek ? ((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100 : 0;
    const revenueMonthChange = revenueLastMonth ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 : 0;

    // Order counts and changes
    const ordersDayChange = yesterdayOrders.length ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100 : 0;
    const ordersWeekChange = lastWeekOrders.length ? ((thisWeekOrders.length - lastWeekOrders.length) / lastWeekOrders.length) * 100 : 0;
    const ordersMonthChange = lastMonthOrders.length ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 : 0;

    // Order status counts
    const ordersByStatus: { [status: string]: number } = {};
    allOrders.forEach(order => {
      if (!ordersByStatus[order.status]) {
        ordersByStatus[order.status] = 0;
      }
      ordersByStatus[order.status]++;
    });

    // Revenue by period (last 30 days)
    const revenueByPeriod: RevenueData[] = [];
    for (let i = 30; i >= 0; i--) {
      const date = subDays(now, i);
      const startOfDate = startOfDay(date);
      const endOfDate = endOfDay(date);
      
      const ordersOnDate = allOrders.filter(order => 
        order.createdAt && order.createdAt >= startOfDate && order.createdAt <= endOfDate
      );
      
      const revenue = ordersOnDate.reduce((sum, order) => sum + order.totalAmount, 0);
      
      revenueByPeriod.push({
        period: format(date, 'yyyy-MM-dd'),
        amount: revenue,
        date,
        orderCount: ordersOnDate.length
      });
    }

    // Product metrics
    const allProducts = await storage.getProducts();
    const trendingProducts = [...allProducts]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
    
    const outOfStockCount = allProducts.filter(p => p.quantity === 0).length;
    const lowStockCount = allProducts.filter(p => p.quantity > 0 && p.quantity <= 5).length;

    // User metrics
    const allUsers = await storage.getUsers();
    const customers = allUsers.filter(user => user.role === 'customer');
    const vendors = allUsers.filter(user => user.role === 'vendor');
    
    const newUsersToday = allUsers.filter(user => 
      user.createdAt && user.createdAt >= startOfToday && user.createdAt <= endOfToday
    ).length;
    
    const newUsersThisWeek = allUsers.filter(user => 
      user.createdAt && user.createdAt >= startOfThisWeek
    ).length;
    
    const newUsersThisMonth = allUsers.filter(user => 
      user.createdAt && user.createdAt >= startOfThisMonth
    ).length;
    
    const newCustomersThisMonth = allUsers.filter(user => 
      user.role === 'customer' && user.createdAt && user.createdAt >= startOfThisMonth
    ).length;

    // Build the dashboard metrics
    return {
      revenue: {
        today: revenueToday,
        thisWeek: revenueThisWeek,
        thisMonth: revenueThisMonth,
        total: totalRevenue,
        changeDay: Math.round(revenueDayChange * 100) / 100,
        changeWeek: Math.round(revenueWeekChange * 100) / 100,
        changeMonth: Math.round(revenueMonthChange * 100) / 100,
        byPeriod: revenueByPeriod
      },
      orders: {
        today: todayOrders.length,
        thisWeek: thisWeekOrders.length,
        thisMonth: thisMonthOrders.length,
        total: allOrders.length,
        changeDay: Math.round(ordersDayChange * 100) / 100,
        changeWeek: Math.round(ordersWeekChange * 100) / 100,
        changeMonth: Math.round(ordersMonthChange * 100) / 100,
        byStatus: ordersByStatus
      },
      products: {
        total: allProducts.length,
        trending: trendingProducts,
        outOfStock: outOfStockCount,
        lowStock: lowStockCount
      },
      users: {
        total: allUsers.length,
        customers: customers.length,
        vendors: vendors.length,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        newCustomersThisMonth
      }
    };
  }

  /**
   * Get revenue analytics with period filter
   */
  async getRevenueAnalytics(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<RevenueData[]> {
    const now = new Date();
    const allOrders = await storage.getOrders();
    const revenueData: RevenueData[] = [];

    // Handle different period types
    switch (period) {
      case 'daily':
        // Last 30 days
        for (let i = 30; i >= 0; i--) {
          const date = subDays(now, i);
          const startOfDate = startOfDay(date);
          const endOfDate = endOfDay(date);
          
          const ordersOnDate = allOrders.filter(order => 
            order.createdAt && order.createdAt >= startOfDate && order.createdAt <= endOfDate
          );
          
          const revenue = ordersOnDate.reduce((sum, order) => sum + order.totalAmount, 0);
          
          revenueData.push({
            period: format(date, 'yyyy-MM-dd'),
            amount: revenue,
            date,
            orderCount: ordersOnDate.length
          });
        }
        break;
        
      case 'weekly':
        // Last 12 weeks
        for (let i = 12; i >= 0; i--) {
          const endDate = subDays(now, i * 7);
          const startDate = subDays(endDate, 6);
          const startOfPeriod = startOfDay(startDate);
          const endOfPeriod = endOfDay(endDate);
          
          const ordersInPeriod = allOrders.filter(order => 
            order.createdAt && order.createdAt >= startOfPeriod && order.createdAt <= endOfPeriod
          );
          
          const revenue = ordersInPeriod.reduce((sum, order) => sum + order.totalAmount, 0);
          
          revenueData.push({
            period: `Week ${format(startDate, 'MM/dd')} - ${format(endDate, 'MM/dd')}`,
            amount: revenue,
            date: startDate,
            orderCount: ordersInPeriod.length
          });
        }
        break;
        
      case 'monthly':
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = subMonths(now, i);
          const startOfMth = startOfMonth(date);
          const endOfMth = endOfMonth(date);
          
          const ordersInMonth = allOrders.filter(order => 
            order.createdAt && order.createdAt >= startOfMth && order.createdAt <= endOfMth
          );
          
          const revenue = ordersInMonth.reduce((sum, order) => sum + order.totalAmount, 0);
          
          revenueData.push({
            period: format(date, 'MMM yyyy'),
            amount: revenue,
            date: startOfMth,
            orderCount: ordersInMonth.length
          });
        }
        break;
        
      case 'yearly':
        // Last 5 years
        const currentYear = now.getFullYear();
        for (let i = 4; i >= 0; i--) {
          const year = currentYear - i;
          const startDate = new Date(year, 0, 1);
          const endDate = new Date(year, 11, 31, 23, 59, 59);
          
          const ordersInYear = allOrders.filter(order => 
            order.createdAt && order.createdAt >= startDate && order.createdAt <= endDate
          );
          
          const revenue = ordersInYear.reduce((sum, order) => sum + order.totalAmount, 0);
          
          revenueData.push({
            period: year.toString(),
            amount: revenue,
            date: startDate,
            orderCount: ordersInYear.length
          });
        }
        break;
    }

    return revenueData;
  }

  /**
   * Get vendor analytics
   */
  async getVendorAnalytics(vendorId?: number): Promise<VendorAnalytics | VendorAnalytics[]> {
    // Get all vendors
    const allUsers = await storage.getUsers();
    const vendors = allUsers.filter(user => user.role === 'vendor');
    
    // Get all products
    const allProducts = await storage.getProducts();
    
    // Get all orders and order items
    const allOrders = await storage.getOrders();
    const allOrderItems = await storage.getAllOrderItems();
    
    // Process vendor-specific analytics
    const vendorAnalytics: VendorAnalytics[] = [];
    
    for (const vendor of vendors) {
      // Skip if a specific vendor ID is requested and this isn't it
      if (vendorId !== undefined && vendor.id !== vendorId) continue;
      
      // Get vendor's products
      const vendorProducts = allProducts.filter(product => product.vendorId === vendor.id);
      
      // Get product IDs for this vendor
      const vendorProductIds = vendorProducts.map(product => product.id);
      
      // Find order items for this vendor's products
      const vendorOrderItems = allOrderItems.filter(item => 
        vendorProductIds.includes(item.productId)
      );
      
      // Calculate total revenue for this vendor
      const totalRevenue = vendorOrderItems.reduce((sum, item) => 
        sum + item.price * item.quantity, 0
      );
      
      // Get unique order IDs for this vendor
      const vendorOrderIds = new Set(vendorOrderItems.map(item => item.orderId));
      const totalOrders = vendorOrderIds.size;
      
      // Calculate average order value
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Calculate commission rate based on vendor tier
      let commissionRate = 0.1; // default 10%
      let tier: 'standard' | 'premium' | 'enterprise' = 'standard';
      
      if (vendor.vendorTier === 'premium') {
        commissionRate = 0.08; // 8% for premium
        tier = 'premium';
      } else if (vendor.vendorTier === 'enterprise') {
        commissionRate = 0.05; // 5% for enterprise
        tier = 'enterprise';
      }
      
      // Calculate commission amount
      const commission = totalRevenue * commissionRate;
      
      // Mock pending payment (in a real system this would come from payment provider)
      const pendingPayment = totalRevenue * 0.1 * Math.random();
      
      // Calculate product category counts
      const productCategoryCounts: { [category: string]: number } = {};
      for (const product of vendorProducts) {
        const category = product.categoryId.toString();
        if (!productCategoryCounts[category]) {
          productCategoryCounts[category] = 0;
        }
        productCategoryCounts[category]++;
      }
      
      // Calculate top products
      const productSales = new Map<number, { sales: number; revenue: number }>();
      
      for (const item of vendorOrderItems) {
        if (!productSales.has(item.productId)) {
          productSales.set(item.productId, { sales: 0, revenue: 0 });
        }
        
        const productData = productSales.get(item.productId);
        if (productData) {
          productData.sales += item.quantity;
          productData.revenue += item.price * item.quantity;
        }
      }
      
      // Sort products by revenue and get top 5
      const topProducts = vendorProducts
        .filter(product => productSales.has(product.id))
        .map(product => {
          const salesData = productSales.get(product.id);
          return {
            id: product.id,
            name: product.name,
            revenue: salesData?.revenue || 0,
            unitsSold: salesData?.sales || 0
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      
      // Calculate average rating
      const productsWithRatings = vendorProducts.filter(p => p.rating !== null);
      const avgRating = productsWithRatings.length > 0 
        ? productsWithRatings.reduce((sum, p) => sum + (p.rating || 0), 0) / productsWithRatings.length 
        : 0;
      
      // Add to analytics array
      vendorAnalytics.push({
        id: vendor.id,
        name: vendor.firstName + ' ' + vendor.lastName,
        totalRevenue,
        totalOrders,
        avgOrderValue,
        topProducts,
        commission,
        commissionRate,
        pendingPayment,
        productsCount: vendorProducts.length,
        productCategoryCounts,
        rating: Math.round(avgRating * 10) / 10,
        tier
      });
    }
    
    // Return single vendor or array
    if (vendorId !== undefined) {
      return vendorAnalytics[0] || {
        id: vendorId,
        name: 'Unknown Vendor',
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        topProducts: [],
        commission: 0,
        commissionRate: 0.1,
        pendingPayment: 0,
        productsCount: 0,
        productCategoryCounts: {},
        rating: 0,
        tier: 'standard'
      };
    }
    
    return vendorAnalytics;
  }

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics(): Promise<CustomerAnalytics> {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const startOfThisWeek = startOfWeek(now);
    const startOfThisMonth = startOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));
    
    // Get all users and filter for customers
    const allUsers = await storage.getUsers();
    const customers = allUsers.filter(user => user.role === 'customer');
    
    // Calculate new customers
    const newCustomersToday = customers.filter(user => 
      user.createdAt && user.createdAt >= startOfToday
    ).length;
    
    const newCustomersThisWeek = customers.filter(user => 
      user.createdAt && user.createdAt >= startOfThisWeek
    ).length;
    
    const newCustomersThisMonth = customers.filter(user => 
      user.createdAt && user.createdAt >= startOfThisMonth
    ).length;
    
    const newCustomersLastMonth = customers.filter(user => 
      user.createdAt && user.createdAt >= startOfLastMonth && user.createdAt <= endOfLastMonth
    ).length;
    
    // Calculate percent change in new customers
    const percentChangeMonth = newCustomersLastMonth > 0 
      ? ((newCustomersThisMonth - newCustomersLastMonth) / newCustomersLastMonth) * 100 
      : 0;
    
    // Get all orders
    const allOrders = await storage.getOrders();
    
    // Calculate metrics
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Count orders per customer
    const ordersByCustomer = new Map<number, number>();
    const spendByCustomer = new Map<number, number>();
    const lastOrderByCustomer = new Map<number, Date>();
    
    for (const order of allOrders) {
      // Count orders
      const currentOrders = ordersByCustomer.get(order.userId) || 0;
      ordersByCustomer.set(order.userId, currentOrders + 1);
      
      // Sum spending
      const currentSpend = spendByCustomer.get(order.userId) || 0;
      spendByCustomer.set(order.userId, currentSpend + order.totalAmount);
      
      // Track last order date
      const currentLastOrder = lastOrderByCustomer.get(order.userId);
      if (!currentLastOrder || (order.createdAt && currentLastOrder < order.createdAt)) {
        lastOrderByCustomer.set(order.userId, order.createdAt || new Date());
      }
    }
    
    // Calculate customers with more than one order (repeat purchasers)
    const repeatPurchasers = Array.from(ordersByCustomer.values()).filter(count => count > 1).length;
    const repeatPurchaseRate = customers.length > 0 ? repeatPurchasers / customers.length : 0;
    
    // Calculate average orders per customer
    const averageOrdersPerCustomer = customers.length > 0 ? totalOrders / customers.length : 0;
    
    // Calculate average lifetime value
    const lifetimeValue = customers.length > 0 ? totalRevenue / customers.length : 0;
    
    // Count customers by location
    const customersByCountry: { [country: string]: number } = {};
    const customersByCity: { [city: string]: number } = {};
    
    for (const customer of customers) {
      // By country
      if (customer.country) {
        if (!customersByCountry[customer.country]) {
          customersByCountry[customer.country] = 0;
        }
        customersByCountry[customer.country]++;
      }
      
      // By city
      if (customer.city) {
        if (!customersByCity[customer.city]) {
          customersByCity[customer.city] = 0;
        }
        customersByCity[customer.city]++;
      }
    }
    
    // Get top customers by spend
    const topCustomers = customers
      .map(customer => {
        const totalSpent = spendByCustomer.get(customer.id) || 0;
        const orderCount = ordersByCustomer.get(customer.id) || 0;
        const lastOrderDate = lastOrderByCustomer.get(customer.id) || new Date(0);
        
        return {
          id: customer.id,
          name: customer.firstName + ' ' + customer.lastName,
          totalSpent,
          orderCount,
          lastOrderDate
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
    
    return {
      totalCustomers: customers.length,
      newCustomers: {
        today: newCustomersToday,
        thisWeek: newCustomersThisWeek,
        thisMonth: newCustomersThisMonth,
        percentChangeMonth: Math.round(percentChangeMonth * 100) / 100
      },
      metrics: {
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        lifetimeValue: Math.round(lifetimeValue * 100) / 100,
        repeatPurchaseRate: Math.round(repeatPurchaseRate * 100) / 100,
        averageOrdersPerCustomer: Math.round(averageOrdersPerCustomer * 100) / 100
      },
      demographics: {
        byCountry: customersByCountry,
        byCity: customersByCity
      },
      topCustomers
    };
  }

  /**
   * Get product analytics
   */
  async getProductAnalytics(): Promise<ProductAnalytics> {
    // Get all products
    const allProducts = await storage.getProducts();
    
    // Get all categories
    const allCategories = await storage.getCategories();
    
    // Get all order items
    const allOrderItems = await storage.getAllOrderItems();
    
    // Calculate average price
    const productsWithPrice = allProducts.filter(p => p.price !== null);
    const averagePrice = productsWithPrice.length > 0 
      ? productsWithPrice.reduce((sum, p) => sum + p.price, 0) / productsWithPrice.length 
      : 0;
    
    // Calculate average rating
    const productsWithRatings = allProducts.filter(p => p.rating !== null);
    const averageRating = productsWithRatings.length > 0 
      ? productsWithRatings.reduce((sum, p) => sum + (p.rating || 0), 0) / productsWithRatings.length 
      : 0;
    
    // Count products by category
    const productsByCategory = new Map<number, number>();
    for (const product of allProducts) {
      const count = productsByCategory.get(product.categoryId) || 0;
      productsByCategory.set(product.categoryId, count + 1);
    }
    
    // Format category data
    const categories = allCategories.map(category => {
      const productCount = productsByCategory.get(category.id) || 0;
      const percentageOfTotal = allProducts.length > 0 
        ? (productCount / allProducts.length) * 100 
        : 0;
      
      return {
        id: category.id,
        name: category.name,
        productCount,
        percentageOfTotal: Math.round(percentageOfTotal * 10) / 10
      };
    }).sort((a, b) => b.productCount - a.productCount);
    
    // Count inventory status
    const inStock = allProducts.filter(p => p.quantity > 5).length;
    const lowStock = allProducts.filter(p => p.quantity > 0 && p.quantity <= 5).length;
    const outOfStock = allProducts.filter(p => p.quantity === 0).length;
    
    // Calculate product sales
    const productSales = new Map<number, { sales: number; revenue: number }>();
    
    for (const item of allOrderItems) {
      if (!productSales.has(item.productId)) {
        productSales.set(item.productId, { sales: 0, revenue: 0 });
      }
      
      const productData = productSales.get(item.productId);
      if (productData) {
        productData.sales += item.quantity;
        productData.revenue += item.price * item.quantity;
      }
    }
    
    // Get bestselling products (by units sold)
    const bestSellingProducts = allProducts
      .filter(product => productSales.has(product.id))
      .sort((a, b) => (productSales.get(b.id)?.sales || 0) - (productSales.get(a.id)?.sales || 0))
      .slice(0, 5);
    
    // Get trending products (by rating and recent sales)
    const trendingProducts = allProducts
      .filter(product => product.rating !== null)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
    
    // Get highest revenue products
    const highestRevenueProducts = allProducts
      .filter(product => productSales.has(product.id))
      .map(product => {
        const salesData = productSales.get(product.id);
        return {
          id: product.id,
          name: product.name,
          revenue: salesData?.revenue || 0,
          unitsSold: salesData?.sales || 0
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return {
      totalProducts: allProducts.length,
      categories,
      metrics: {
        averagePrice: Math.round(averagePrice * 100) / 100,
        averageRating: Math.round(averageRating * 10) / 10,
      },
      inventoryStatus: {
        inStock,
        lowStock,
        outOfStock
      },
      bestSellingProducts,
      trendingProducts,
      highestRevenueProducts
    };
  }

  /**
   * Get order analytics
   */
  async getOrderAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<OrderAnalytics> {
    const now = new Date();
    
    // Get all orders
    const allOrders = await storage.getOrders();
    
    // Calculate total metrics
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate orders per day (based on last 30 days)
    const thirtyDaysAgo = subDays(now, 30);
    const ordersLast30Days = allOrders.filter(
      order => order.createdAt && order.createdAt >= thirtyDaysAgo
    ).length;
    const ordersPerDay = ordersLast30Days / 30;
    
    // Count orders by status
    const ordersByStatus: { [status: string]: number } = {};
    allOrders.forEach(order => {
      if (!ordersByStatus[order.status]) {
        ordersByStatus[order.status] = 0;
      }
      ordersByStatus[order.status]++;
    });
    
    // Count orders by shipping country
    const ordersByCountry: { [country: string]: number } = {};
    allOrders.forEach(order => {
      if (!ordersByCountry[order.shippingCountry]) {
        ordersByCountry[order.shippingCountry] = 0;
      }
      ordersByCountry[order.shippingCountry]++;
    });
    
    // Get orders by period
    const ordersByPeriod = [];
    
    switch (period) {
      case 'daily':
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = subDays(now, i);
          const startOfDate = startOfDay(date);
          const endOfDate = endOfDay(date);
          
          const ordersOnDate = allOrders.filter(order => 
            order.createdAt && order.createdAt >= startOfDate && order.createdAt <= endOfDate
          );
          
          const revenue = ordersOnDate.reduce((sum, order) => sum + order.totalAmount, 0);
          
          ordersByPeriod.push({
            period: format(date, 'yyyy-MM-dd'),
            count: ordersOnDate.length,
            revenue
          });
        }
        break;
        
      case 'weekly':
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const endDate = subDays(now, i * 7);
          const startDate = subDays(endDate, 6);
          const startOfPeriod = startOfDay(startDate);
          const endOfPeriod = endOfDay(endDate);
          
          const ordersInPeriod = allOrders.filter(order => 
            order.createdAt && order.createdAt >= startOfPeriod && order.createdAt <= endOfPeriod
          );
          
          const revenue = ordersInPeriod.reduce((sum, order) => sum + order.totalAmount, 0);
          
          ordersByPeriod.push({
            period: `Week ${format(startDate, 'MM/dd')}-${format(endDate, 'MM/dd')}`,
            count: ordersInPeriod.length,
            revenue
          });
        }
        break;
        
      case 'monthly':
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = subMonths(now, i);
          const startOfMth = startOfMonth(date);
          const endOfMth = endOfMonth(date);
          
          const ordersInMonth = allOrders.filter(order => 
            order.createdAt && order.createdAt >= startOfMth && order.createdAt <= endOfMth
          );
          
          const revenue = ordersInMonth.reduce((sum, order) => sum + order.totalAmount, 0);
          
          ordersByPeriod.push({
            period: format(date, 'MMM yyyy'),
            count: ordersInMonth.length,
            revenue
          });
        }
        break;
    }
    
    return {
      totalOrders,
      totalRevenue,
      metrics: {
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        ordersPerDay: Math.round(ordersPerDay * 100) / 100
      },
      byStatus: ordersByStatus,
      byPeriod: ordersByPeriod,
      byShippingCountry: ordersByCountry
    };
  }
}

export const analyticsService = new AnalyticsService();