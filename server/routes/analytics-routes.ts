import { Router } from 'express';
import { storage } from '../storage';
import { analyticsService } from '../services/analytics-service';
import { log } from '../vite';

// Create router
const router = Router();

/**
 * Analytics dashboard data for admin
 * @route GET /api/analytics/dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Check if user is admin
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const metrics = await analyticsService.getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    log(`Error getting dashboard metrics: ${error instanceof Error ? error.message : String(error)}`, 'analytics');
    res.status(500).json({
      error: 'Unable to retrieve dashboard metrics'
    });
  }
});

/**
 * Revenue analytics with period filter
 * @route GET /api/analytics/revenue?period=monthly
 */
router.get('/revenue', async (req, res) => {
  try {
    // Check if user is admin
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const period = req.query.period as 'daily' | 'weekly' | 'monthly' | 'yearly' || 'monthly';
    const revenueData = await analyticsService.getRevenueAnalytics(period);
    
    res.json(revenueData);
  } catch (error) {
    log(`Error getting revenue analytics: ${error instanceof Error ? error.message : String(error)}`, 'analytics');
    res.status(500).json({
      error: 'Unable to retrieve revenue analytics'
    });
  }
});

/**
 * Vendor analytics - all vendors or specific vendor
 * @route GET /api/analytics/vendors/:vendorId?
 */
router.get('/vendors/:vendorId?', async (req, res) => {
  try {
    // Check if user is admin or the specific vendor
    const vendorId = req.params.vendorId ? parseInt(req.params.vendorId) : undefined;
    
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Only allow vendors to see their own analytics or admins to see all
    if (req.user.role !== 'admin' && (req.user.role !== 'vendor' || req.user.id !== vendorId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const vendorAnalytics = await analyticsService.getVendorAnalytics(vendorId);
    res.json(vendorAnalytics);
  } catch (error) {
    log(`Error getting vendor analytics: ${error instanceof Error ? error.message : String(error)}`, 'analytics');
    res.status(500).json({
      error: 'Unable to retrieve vendor analytics'
    });
  }
});

/**
 * Customer analytics
 * @route GET /api/analytics/customers
 */
router.get('/customers', async (req, res) => {
  try {
    // Check if user is admin
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const customerAnalytics = await analyticsService.getCustomerAnalytics();
    res.json(customerAnalytics);
  } catch (error) {
    log(`Error getting customer analytics: ${error instanceof Error ? error.message : String(error)}`, 'analytics');
    res.status(500).json({
      error: 'Unable to retrieve customer analytics'
    });
  }
});

/**
 * Product analytics
 * @route GET /api/analytics/products
 */
router.get('/products', async (req, res) => {
  try {
    // Check if user is admin or vendor
    if (!req.isAuthenticated() || (req.user.role !== 'admin' && req.user.role !== 'vendor')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const productAnalytics = await analyticsService.getProductAnalytics();
    
    // If user is vendor, filter to only show their products
    if (req.user.role === 'vendor') {
      const vendorId = req.user.id;
      
      // Filter product analytics to only include this vendor's products
      const filteredAnalytics = {
        ...productAnalytics,
        bestSellingProducts: productAnalytics.bestSellingProducts.filter(p => p.vendorId === vendorId),
        trendingProducts: productAnalytics.trendingProducts.filter(p => p.vendorId === vendorId),
        highestRevenueProducts: productAnalytics.highestRevenueProducts.filter(p => p.vendorId === vendorId)
      };
      
      return res.json(filteredAnalytics);
    }
    
    res.json(productAnalytics);
  } catch (error) {
    log(`Error getting product analytics: ${error instanceof Error ? error.message : String(error)}`, 'analytics');
    res.status(500).json({
      error: 'Unable to retrieve product analytics'
    });
  }
});

/**
 * Order analytics with period filter
 * @route GET /api/analytics/orders?period=daily
 */
router.get('/orders', async (req, res) => {
  try {
    // Check if user is admin or vendor
    if (!req.isAuthenticated() || (req.user.role !== 'admin' && req.user.role !== 'vendor')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const period = req.query.period as 'daily' | 'weekly' | 'monthly' || 'daily';
    const orderAnalytics = await analyticsService.getOrderAnalytics(period);
    
    // If user is vendor, we need to filter the data to only show their orders
    if (req.user.role === 'vendor') {
      const vendorId = req.user.id;
      
      // This is a simplified approach - in a real scenario we'd need to calculate
      // vendor-specific order analytics in the service
      const vendorDetails = await analyticsService.getVendorAnalytics(vendorId);
      
      return res.json({
        ...orderAnalytics,
        totalOrders: vendorDetails ? vendorDetails.totalOrders : 0,
        totalRevenue: vendorDetails ? vendorDetails.totalRevenue : 0
      });
    }
    
    res.json(orderAnalytics);
  } catch (error) {
    log(`Error getting order analytics: ${error instanceof Error ? error.message : String(error)}`, 'analytics');
    res.status(500).json({
      error: 'Unable to retrieve order analytics'
    });
  }
});

/**
 * API to get common dashboard widgets data for different user roles
 * @route GET /api/analytics/widgets/:role
 */
router.get('/widgets/:role', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const role = req.params.role;
    const userId = req.user.id;
    
    // Verify that the user can access this role's widgets
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Get metrics based on role
    let metrics: any = {};
    
    switch (role) {
      case 'admin':
        // Basic platform metrics for admin dashboard
        const dashboardMetrics = await analyticsService.getDashboardMetrics();
        metrics = {
          revenueToday: dashboardMetrics.revenue.today,
          revenueChange: dashboardMetrics.revenue.changeDay,
          ordersToday: dashboardMetrics.orders.today,
          ordersChange: dashboardMetrics.orders.changeDay,
          totalCustomers: dashboardMetrics.users.customers,
          newCustomers: dashboardMetrics.users.newCustomersThisMonth,
          totalVendors: dashboardMetrics.users.vendors,
          commissionToday: dashboardMetrics.revenue.today * 0.1, // Simplified
        };
        break;
        
      case 'vendor':
        // Get vendor-specific metrics
        const vendorMetrics = await analyticsService.getVendorAnalytics(userId);
        if (!vendorMetrics) {
          return res.status(404).json({ error: 'Vendor metrics not found' });
        }
        
        metrics = {
          totalRevenue: vendorMetrics.totalRevenue,
          totalOrders: vendorMetrics.totalOrders,
          productsCount: vendorMetrics.productsCount,
          commissionPaid: vendorMetrics.commission,
          pendingPayment: vendorMetrics.pendingPayment,
          topProducts: vendorMetrics.topProducts
        };
        break;
        
      case 'customer':
        // Customer-specific metrics
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        const customerOrders = await storage.getOrdersByUser(userId);
        metrics = {
          totalSpent: customerOrders.reduce((sum, order) => sum + order.totalAmount, 0),
          orderCount: customerOrders.length,
          lastOrderDate: customerOrders.length > 0 
            ? customerOrders
                .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))[0].createdAt 
            : null,
          inProgressOrders: customerOrders.filter(o => 
            o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'returned'
          ).length
        };
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid role specified' });
    }
    
    res.json(metrics);
  } catch (error) {
    log(`Error getting widgets data: ${error instanceof Error ? error.message : String(error)}`, 'analytics');
    res.status(500).json({
      error: 'Unable to retrieve widgets data'
    });
  }
});

/**
 * Analytics data export for admin
 * @route GET /api/analytics/export/:type
 */
router.get('/export/:type', async (req, res) => {
  try {
    // Check if user is admin
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const exportType = req.params.type;
    let data: any = null;
    
    // Get data based on export type
    switch (exportType) {
      case 'revenue':
        data = await analyticsService.getRevenueAnalytics('monthly');
        break;
      case 'customers':
        data = await analyticsService.getCustomerAnalytics();
        break;
      case 'vendors':
        data = await analyticsService.getVendorAnalytics();
        break;
      case 'products':
        data = await analyticsService.getProductAnalytics();
        break;
      case 'orders':
        data = await analyticsService.getOrderAnalytics('monthly');
        break;
      case 'dashboard':
        data = await analyticsService.getDashboardMetrics();
        break;
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }
    
    // Set the appropriate headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=unimart-${exportType}-export-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Convert data to CSV format
    // This is a simplified version - in a real app we'd use a CSV library
    const csvData = convertToCSV(data);
    
    res.send(csvData);
  } catch (error) {
    log(`Error exporting analytics data: ${error instanceof Error ? error.message : String(error)}`, 'analytics');
    res.status(500).json({
      error: 'Unable to export analytics data'
    });
  }
});

/**
 * Helper function to convert data to CSV
 */
function convertToCSV(data: any): string {
  // Handle different data structures
  if (Array.isArray(data)) {
    // Array of objects
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => {
      return Object.values(item).map(value => {
        // Handle different value types
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') {
          if (value instanceof Date) {
            return value.toISOString();
          }
          return JSON.stringify(value).replace(/,/g, ';');
        }
        return String(value).replace(/,/g, ';');
      }).join(',');
    }).join('\n');
    
    return `${headers}\n${rows}`;
  } else {
    // Single object
    const rows: string[] = [];
    
    // Recursively process object properties
    function processObject(obj: any, prefix = '') {
      for (const [key, value] of Object.entries(obj)) {
        const propName = prefix ? `${prefix}.${key}` : key;
        
        if (value !== null && typeof value === 'object' && !(value instanceof Date) && !Array.isArray(value)) {
          // Recursively process nested objects
          processObject(value, propName);
        } else {
          // Format the value
          let formattedValue = '';
          if (value === null || value === undefined) {
            formattedValue = '';
          } else if (value instanceof Date) {
            formattedValue = value.toISOString();
          } else if (Array.isArray(value)) {
            formattedValue = JSON.stringify(value).replace(/,/g, ';');
          } else {
            formattedValue = String(value).replace(/,/g, ';');
          }
          
          rows.push(`${propName},${formattedValue}`);
        }
      }
    }
    
    processObject(data);
    return rows.join('\n');
  }
}

export default router;