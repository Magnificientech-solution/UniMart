import { Router } from 'express';
import { storage } from '../storage';
import { deliveryTracking } from '../services/delivery-tracking';
import { log } from '../vite';

// Create router
const router = Router();

/**
 * Track a shipment by tracking number and provider
 * @route GET /api/delivery/track/:provider/:trackingNumber
 */
router.get('/track/:provider/:trackingNumber', async (req, res) => {
  try {
    const { provider, trackingNumber } = req.params;
    
    if (!provider || !trackingNumber) {
      return res.status(400).json({ error: 'Provider and tracking number are required' });
    }
    
    const trackingInfo = await deliveryTracking.trackShipment(provider, trackingNumber);
    
    res.json(trackingInfo);
  } catch (error) {
    log(`Error tracking shipment: ${error instanceof Error ? error.message : String(error)}`, 'delivery');
    res.status(500).json({
      error: 'Unable to track shipment'
    });
  }
});

/**
 * Get tracking info for an order
 * @route GET /api/delivery/order/:orderId
 */
router.get('/order/:orderId', async (req, res) => {
  try {
    // User must be authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const orderId = Number(req.params.orderId);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    
    // Get the order
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if the user is authorized to view this order
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'vendor' &&
      order.userId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Not authorized to track this order' });
    }
    
    // Check if order has tracking info
    if (!order.trackingNumber || !order.deliveryProvider) {
      return res.status(400).json({ error: 'Order does not have tracking information yet' });
    }
    
    // Get tracking information
    const trackingInfo = await deliveryTracking.trackShipment(
      order.deliveryProvider,
      order.trackingNumber
    );
    
    res.json({
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      provider: order.deliveryProvider,
      status: trackingInfo.status,
      statusDetail: trackingInfo.statusDetail,
      lastUpdated: trackingInfo.lastUpdated,
      estimatedDelivery: trackingInfo.estimatedDelivery,
      isDelivered: trackingInfo.isDelivered,
      events: trackingInfo.trackingEvents
    });
  } catch (error) {
    log(`Error getting order tracking: ${error instanceof Error ? error.message : String(error)}`, 'delivery');
    res.status(500).json({
      error: 'Unable to get order tracking information'
    });
  }
});

/**
 * Update order tracking information
 * @route POST /api/delivery/order/:orderId/update
 */
router.post('/order/:orderId/update', async (req, res) => {
  try {
    // User must be authenticated and be a vendor or admin
    if (!req.isAuthenticated() || (req.user.role !== 'vendor' && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const orderId = Number(req.params.orderId);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    
    const { trackingNumber, deliveryProvider, estimatedDeliveryDate } = req.body;
    
    if (!trackingNumber || !deliveryProvider) {
      return res.status(400).json({ error: 'Tracking number and delivery provider are required' });
    }
    
    // Get the order
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // If user is vendor, check if they are authorized to update this order
    if (req.user.role === 'vendor') {
      const orderItems = await storage.getOrderItems(orderId);
      const vendorProducts = await storage.getProductsByVendor(req.user.id);
      const vendorProductIds = vendorProducts.map(product => product.id);
      
      const vendorHasItemsInOrder = orderItems.some(item => vendorProductIds.includes(item.productId));
      
      if (!vendorHasItemsInOrder) {
        return res.status(403).json({ error: 'Not authorized to update this order' });
      }
    }
    
    // Update order tracking information
    const updatedOrder = await storage.updateOrderTracking(orderId, {
      trackingNumber,
      deliveryProvider,
      estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null,
      lastUpdated: new Date()
    });
    
    // Get updated tracking information
    const trackingInfo = await deliveryTracking.trackShipment(
      deliveryProvider,
      trackingNumber
    );
    
    // Update order status based on tracking info
    if (trackingInfo.isDelivered && order.status !== 'delivered') {
      await storage.updateOrderStatus(orderId, 'delivered');
    } else if (trackingInfo.status === 'out_for_delivery' && order.status !== 'out_for_delivery') {
      await storage.updateOrderStatus(orderId, 'out_for_delivery');
    } else if (trackingInfo.status === 'shipped' && order.status !== 'shipped') {
      await storage.updateOrderStatus(orderId, 'shipped');
    }
    
    res.json({
      orderId,
      trackingNumber,
      provider: deliveryProvider,
      status: trackingInfo.status,
      estimatedDelivery: trackingInfo.estimatedDelivery,
      lastUpdated: new Date()
    });
  } catch (error) {
    log(`Error updating order tracking: ${error instanceof Error ? error.message : String(error)}`, 'delivery');
    res.status(500).json({
      error: 'Unable to update order tracking information'
    });
  }
});

/**
 * Add delivery notes to an order
 * @route POST /api/delivery/order/:orderId/notes
 */
router.post('/order/:orderId/notes', async (req, res) => {
  try {
    // User must be authenticated and be a vendor or admin
    if (!req.isAuthenticated() || (req.user.role !== 'vendor' && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const orderId = Number(req.params.orderId);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    
    const { notes } = req.body;
    
    if (!notes) {
      return res.status(400).json({ error: 'Delivery notes are required' });
    }
    
    // Get the order
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // If user is vendor, check if they are authorized to update this order
    if (req.user.role === 'vendor') {
      const orderItems = await storage.getOrderItems(orderId);
      const vendorProducts = await storage.getProductsByVendor(req.user.id);
      const vendorProductIds = vendorProducts.map(product => product.id);
      
      const vendorHasItemsInOrder = orderItems.some(item => vendorProductIds.includes(item.productId));
      
      if (!vendorHasItemsInOrder) {
        return res.status(403).json({ error: 'Not authorized to update this order' });
      }
    }
    
    // Update order delivery notes
    const updatedOrder = await storage.updateOrderTracking(orderId, {
      deliveryNotes: notes,
      lastUpdated: new Date()
    });
    
    res.json({
      orderId,
      deliveryNotes: notes,
      lastUpdated: new Date()
    });
  } catch (error) {
    log(`Error updating delivery notes: ${error instanceof Error ? error.message : String(error)}`, 'delivery');
    res.status(500).json({
      error: 'Unable to update delivery notes'
    });
  }
});

/**
 * Mark order as delivered
 * @route POST /api/delivery/order/:orderId/delivered
 */
router.post('/order/:orderId/delivered', async (req, res) => {
  try {
    // User must be authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const orderId = Number(req.params.orderId);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    
    // Get the order
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Only the customer who placed the order, admins, or vendors who have items in the order can mark it as delivered
    if (req.user.role !== 'admin' && req.user.id !== order.userId) {
      if (req.user.role === 'vendor') {
        const orderItems = await storage.getOrderItems(orderId);
        const vendorProducts = await storage.getProductsByVendor(req.user.id);
        const vendorProductIds = vendorProducts.map(product => product.id);
        
        const vendorHasItemsInOrder = orderItems.some(item => vendorProductIds.includes(item.productId));
        
        if (!vendorHasItemsInOrder) {
          return res.status(403).json({ error: 'Not authorized to update this order' });
        }
      } else {
        return res.status(403).json({ error: 'Not authorized to update this order' });
      }
    }
    
    // Update order status
    const updatedOrder = await storage.updateOrderStatus(orderId, 'delivered');
    
    res.json({
      orderId,
      status: 'delivered',
      deliveredAt: new Date()
    });
  } catch (error) {
    log(`Error marking order as delivered: ${error instanceof Error ? error.message : String(error)}`, 'delivery');
    res.status(500).json({
      error: 'Unable to mark order as delivered'
    });
  }
});

/**
 * Get delivery providers
 * @route GET /api/delivery/providers
 */
router.get('/providers', (req, res) => {
  try {
    const providers = [
      { id: 'royal_mail', name: 'Royal Mail' },
      { id: 'dhl', name: 'DHL' },
      { id: 'fedex', name: 'FedEx' },
      { id: 'ups', name: 'UPS' },
      { id: 'hermes', name: 'Hermes/Evri' },
      { id: 'dpd', name: 'DPD' },
      { id: 'amazon_logistics', name: 'Amazon Logistics' },
      { id: 'other', name: 'Other' }
    ];
    
    res.json(providers);
  } catch (error) {
    log(`Error getting delivery providers: ${error instanceof Error ? error.message : String(error)}`, 'delivery');
    res.status(500).json({
      error: 'Unable to get delivery providers'
    });
  }
});

export default router;