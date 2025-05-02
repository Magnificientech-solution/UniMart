import axios from 'axios';
import { Order } from '@shared/schema';
import { storage } from '../storage';

interface TrackingEvent {
  date: Date;
  status: string;
  location: string;
  description: string;
}

interface TrackingResponse {
  status: string;
  statusDetail: string;
  lastUpdated: Date;
  estimatedDelivery?: Date;
  trackingEvents: TrackingEvent[];
  isDelivered: boolean;
}

class DeliveryTrackingService {
  private isDemo: boolean = true;
  private apiKeys: {
    royalMail?: string;
    dhl?: string;
    fedex?: string;
    ups?: string;
    hermes?: string;
    dpd?: string;
  } = {};

  constructor() {
    // Initialize API keys if they exist in environment variables
    this.apiKeys = {
      royalMail: process.env.ROYAL_MAIL_API_KEY,
      dhl: process.env.DHL_API_KEY,
      fedex: process.env.FEDEX_API_KEY,
      ups: process.env.UPS_API_KEY,
      hermes: process.env.HERMES_API_KEY,
      dpd: process.env.DPD_API_KEY,
    };

    // Check if we're in demo mode
    if (Object.values(this.apiKeys).some(key => key !== undefined)) {
      this.isDemo = false;
    } else {
      console.log('Delivery tracking in demo mode');
    }
  }

  /**
   * Track a shipment by provider and tracking number
   */
  async trackShipment(provider: string, trackingNumber: string): Promise<TrackingResponse> {
    try {
      // Track shipment with the appropriate provider
      switch (provider.toLowerCase()) {
        case 'royal_mail':
          return await this.trackRoyalMail(trackingNumber);
        case 'dhl':
          return await this.trackDHL(trackingNumber);
        case 'fedex':
          return await this.trackFedEx(trackingNumber);
        case 'ups':
          return await this.trackUPS(trackingNumber);
        case 'hermes':
        case 'evri': // Hermes rebranded to Evri, handle both
          return await this.trackHermes(trackingNumber);
        case 'dpd':
          return await this.trackDPD(trackingNumber);
        case 'amazon_logistics':
          return await this.trackAmazonLogistics(trackingNumber);
        default:
          return this.placeholderResponse();
      }
    } catch (error) {
      console.error(`Error tracking shipment: ${error instanceof Error ? error.message : String(error)}`);
      return this.placeholderResponse();
    }
  }

  /**
   * Update order tracking information
   */
  async updateOrderTrackingInfo(order: Order): Promise<void> {
    // Skip if there's no tracking number or provider
    if (!order.trackingNumber || !order.deliveryProvider) {
      return;
    }

    try {
      // Get tracking info
      const trackingInfo = await this.trackShipment(
        order.deliveryProvider, 
        order.trackingNumber
      );

      // Update order status based on tracking info
      if (trackingInfo.isDelivered && order.status !== 'delivered') {
        await storage.updateOrderStatus(order.id, 'delivered');
      } else if (trackingInfo.status === 'out_for_delivery' && order.status !== 'out_for_delivery') {
        await storage.updateOrderStatus(order.id, 'out_for_delivery');
      } else if (trackingInfo.status === 'shipped' && order.status !== 'shipped') {
        await storage.updateOrderStatus(order.id, 'shipped');
      }

      // Update estimated delivery date if available
      if (trackingInfo.estimatedDelivery) {
        await storage.updateOrderTracking(order.id, {
          estimatedDeliveryDate: trackingInfo.estimatedDelivery,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      console.error(`Error updating order tracking: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate tracking information for demo purposes
   */
  private generateDemoTrackingData(provider: string, trackingNumber: string): TrackingResponse {
    const now = new Date();
    const events: TrackingEvent[] = [];
    const trackedDays = 3 + Math.floor(Math.random() * 5); // 3-7 days
    
    // Status options 
    const statusOptions = [
      'Order placed',
      'Processing',
      'Ready for shipment',
      'Picked up',
      'In transit',
      'At delivery center',
      'Out for delivery',
      'Delivered'
    ];
    
    // Locations based on provider
    let locations = ['London Sorting Center', 'Birmingham Hub', 'Manchester Distribution Center', 'Edinburgh Facility'];
    if (provider === 'royal_mail') {
      locations = ['Royal Mail London', 'Royal Mail Birmingham', 'Royal Mail Manchester', 'Royal Mail Edinburgh'];
    } else if (provider === 'dhl') {
      locations = ['DHL Gateway London', 'DHL Hub Birmingham', 'DHL Express Manchester', 'DHL Center Edinburgh'];
    } else if (provider === 'fedex') {
      locations = ['FedEx London Center', 'FedEx Birmingham', 'FedEx Manchester', 'FedEx Edinburgh'];
    }
    
    // If tracking number ends with 9, simulate a delivered package
    const isDelivered = trackingNumber.endsWith('9');
    
    // Generate events
    for (let i = 0; i < (isDelivered ? statusOptions.length : Math.min(4, statusOptions.length)); i++) {
      const daysAgo = trackedDays - i;
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0);
      
      events.push({
        date,
        status: statusOptions[i],
        location: locations[Math.min(i, locations.length - 1)],
        description: statusOptions[i]
      });
    }
    
    // Sort events by date
    events.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Determine current status
    const currentStatus = events[events.length - 1].status;
    
    // Estimated delivery date
    let estimatedDelivery: Date | undefined;
    if (!isDelivered) {
      estimatedDelivery = new Date(now);
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);
      estimatedDelivery.setHours(9 + Math.floor(Math.random() * 8), 0, 0);
    }
    
    return {
      status: this.mapDemoStatusToStandardized(currentStatus),
      statusDetail: currentStatus,
      lastUpdated: events[events.length - 1].date,
      estimatedDelivery,
      trackingEvents: events,
      isDelivered: isDelivered
    };
  }
  
  /**
   * Map demo status to standardized status
   */
  private mapDemoStatusToStandardized(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'delivered';
      case 'Out for delivery':
        return 'out_for_delivery';
      case 'At delivery center':
      case 'In transit':
      case 'Picked up':
        return 'shipped';
      case 'Ready for shipment':
      case 'Processing':
      case 'Order placed':
        return 'processing';
      default:
        return 'processing';
    }
  }

  /**
   * Track a Royal Mail shipment
   */
  private async trackRoyalMail(trackingNumber: string): Promise<TrackingResponse> {
    if (!this.apiKeys.royalMail) {
      return this.placeholderResponse();
    }
    
    // For now, return demo data
    return this.generateDemoTrackingData('royal_mail', trackingNumber);
  }

  private mapRoyalMailStatus(status: string): string {
    // Map Royal Mail statuses to our standardized statuses
    switch (status) {
      case 'Delivered':
        return 'delivered';
      case 'On its way':
      case 'It\'s on its way':
        return 'shipped';
      case 'We have your item':
        return 'processing';
      case 'Out for delivery today':
        return 'out_for_delivery';
      default:
        return 'processing';
    }
  }

  private async trackDHL(trackingNumber: string): Promise<TrackingResponse> {
    if (!this.apiKeys.dhl) {
      return this.placeholderResponse();
    }
    
    return this.generateDemoTrackingData('dhl', trackingNumber);
  }

  private async trackFedEx(trackingNumber: string): Promise<TrackingResponse> {
    if (!this.apiKeys.fedex) {
      return this.placeholderResponse();
    }
    
    return this.generateDemoTrackingData('fedex', trackingNumber);
  }

  private async trackUPS(trackingNumber: string): Promise<TrackingResponse> {
    return this.generateDemoTrackingData('ups', trackingNumber);
  }

  private async trackHermes(trackingNumber: string): Promise<TrackingResponse> {
    return this.generateDemoTrackingData('hermes', trackingNumber);
  }

  private async trackDPD(trackingNumber: string): Promise<TrackingResponse> {
    return this.generateDemoTrackingData('dpd', trackingNumber);
  }

  private async trackAmazonLogistics(trackingNumber: string): Promise<TrackingResponse> {
    return this.generateDemoTrackingData('amazon_logistics', trackingNumber);
  }

  private placeholderResponse(): TrackingResponse {
    return {
      status: 'processing',
      statusDetail: 'Tracking information not available',
      lastUpdated: new Date(),
      trackingEvents: [],
      isDelivered: false
    };
  }
}

export const deliveryTracking = new DeliveryTrackingService();