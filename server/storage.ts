import {
  users, products, categories, orders, orderItems,
  carts, cartItems, reviews, wishlists,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Category, type InsertCategory,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Cart, type InsertCart,
  type CartItem, type InsertCartItem,
  type Review, type InsertReview,
  type Wishlist, type InsertWishlist
} from "@shared/schema";

// Define Transaction type used by payment operations
interface Transaction {
  id: string;
  orderId: number;
  amount: number;
  status: string;
  paymentProvider: string;
  refundId?: string;
  createdAt: Date;
  vendorId?: number;
}
import createMemoryStore from "memorystore";
import session from "express-session";

// SESSION STORE
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(filter?: Partial<User>): Promise<User[]>;  // Added for analytics
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  updateUserStripeInfo(id: number, stripeData: { stripeCustomerId?: string, stripeAccountId?: string }): Promise<User | undefined>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProducts(filter?: Partial<Product>): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getProductsByVendor(vendorId: number): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrders(filter?: Partial<Order>): Promise<Order[]>;  // Added for analytics
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrdersByVendor(vendorId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  updateOrderTracking(id: number, trackingData: {
    trackingNumber?: string,
    deliveryProvider?: string,
    estimatedDeliveryDate?: Date,
    lastUpdated?: Date,
    deliveryNotes?: string
  }): Promise<Order | undefined>;
  
  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  getAllOrderItems(): Promise<OrderItem[]>;  // Added for analytics
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Cart operations
  getCart(userId: number): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  
  // Cart item operations
  getCartItems(cartId: number): Promise<CartItem[]>;
  getCartItemsByUser(userId: number): Promise<CartItem[]>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(cartId: number, productId: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(cartId: number, productId: number): Promise<boolean>;
  clearCart(cartId: number): Promise<boolean>;
  
  // Review operations
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Wishlist operations
  getUserWishlist(userId: number): Promise<Wishlist[]>;
  addToWishlist(wishlist: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(userId: number, productId: number): Promise<boolean>;
  
  // Payment & transaction operations
  getTransaction(id: string): Promise<any>;
  createTransaction(transaction: any): Promise<any>;
  updateTransactionStatus(id: string, status: string): Promise<any>;
  getTransactionsByVendor(vendorId: number): Promise<any[]>;
  getTransactionsByOrder(orderId: number): Promise<any[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private carts: Map<number, Cart>;
  private cartItems: Map<number, CartItem>;
  private reviews: Map<number, Review>;
  private wishlists: Map<number, Wishlist>;
  
  currentUserId: number;
  currentProductId: number;
  currentCategoryId: number;
  currentOrderId: number;
  currentOrderItemId: number;
  currentCartId: number;
  currentCartItemId: number;
  currentReviewId: number;
  currentWishlistId: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.reviews = new Map();
    this.wishlists = new Map();
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCategoryId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentCartId = 1;
    this.currentCartItemId = 1;
    this.currentReviewId = 1;
    this.currentWishlistId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize with some starter data
    this.initializeData();
  }
  
  private initializeData() {
    // Add main categories with images
    const mainCategories = [
      { name: "Electronics", slug: "electronics", description: "Electronic devices and gadgets", imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2301&auto=format&fit=crop" },
      { name: "Fashion", slug: "fashion", description: "Fashion and apparel for men and women", imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" },
      { name: "Phones & Tablets", slug: "phones-tablets", description: "Smartphones, tablets and accessories", imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=2065&auto=format&fit=crop" },
      { name: "Computing", slug: "computing", description: "Computers, laptops and accessories", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" },
      { name: "Grocery", slug: "grocery", description: "Grocery items including food and beverages", imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop" },
      { name: "Food", slug: "food", description: "Fresh and packaged food products", imageUrl: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=2070&auto=format&fit=crop" }
    ];
    
    // Add main categories first
    mainCategories.forEach(category => this.createCategory(category));

    // Map of subcategories with their parent slugs
    const subcategories = {
      'electronics': [
        { name: "Television", slug: "television", description: "QLED, Smart TVs and more", imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=2070&auto=format&fit=crop" },
        { name: "Home Audio", slug: "home-audio", description: "Home theatre systems, sound bars and speakers", imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2070&auto=format&fit=crop" },
        { name: "Cameras", slug: "cameras", description: "Digital cameras, DSLRs and accessories", imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop" }
      ],
      'fashion': [
        { name: "Men's Clothing", slug: "mens-clothing", description: "Shirts, jeans, underwear and traditional wear for men", imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop" },
        { name: "Women's Clothing", slug: "womens-clothing", description: "Dresses, tops, jeans and traditional wear for women", imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop" },
        { name: "Jewelry", slug: "jewelry", description: "Earrings, necklaces, bracelets and more", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop" },
        { name: "Bags", slug: "bags", description: "Handbags, wallets, backpacks and luggage", imageUrl: "https://images.unsplash.com/photo-1575844611599-b8f615a2a9a6?q=80&w=1835&auto=format&fit=crop" },
        { name: "Shoes", slug: "shoes", description: "Footwear for men and women", imageUrl: "https://images.unsplash.com/photo-1518049362265-d5b2a6b00b37?q=80&w=1974&auto=format&fit=crop" },
        { name: "Traditional Wear", slug: "traditional-wear", description: "Cultural and traditional clothing", imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1974&auto=format&fit=crop" }
      ],
      'phones-tablets': [
        { name: "Smartphones", slug: "smartphones", description: "Latest smartphones from top brands", imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2027&auto=format&fit=crop" },
        { name: "Basic Phones", slug: "basic-phones", description: "Feature phones and basic mobile phones", imageUrl: "https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?q=80&w=2034&auto=format&fit=crop" },
        { name: "Tablets", slug: "tablets", description: "Android tablets, iPads and educational tablets", imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1915&auto=format&fit=crop" },
        { name: "Mobile Accessories", slug: "mobile-accessories", description: "Chargers, cases, screen protectors and more", imageUrl: "https://images.unsplash.com/photo-1609692814859-2cb9ed6b6bb3?q=80&w=1974&auto=format&fit=crop" }
      ],
      'computing': [
        { name: "Laptops", slug: "laptops", description: "Notebooks, ultrabooks and gaming laptops", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop" },
        { name: "Desktops", slug: "desktops", description: "Desktop computers and all-in-ones", imageUrl: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?q=80&w=1974&auto=format&fit=crop" },
        { name: "Monitors", slug: "monitors", description: "Computer monitors and displays", imageUrl: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?q=80&w=2070&auto=format&fit=crop" },
        { name: "Printers", slug: "printers", description: "Inkjet and laser printers, scanners and supplies", imageUrl: "https://images.unsplash.com/photo-1612815292258-f4471648ede7?q=80&w=1933&auto=format&fit=crop" },
        { name: "Computer Accessories", slug: "computer-accessories", description: "Keyboards, mice, webcams and peripherals", imageUrl: "https://images.unsplash.com/photo-1563770660941-10a63a9ed39d?q=80&w=2070&auto=format&fit=crop" }
      ],
      'grocery': [
        { name: "Beer, Wine & Spirits", slug: "beer-wine-spirits", description: "Guinness, Star, Gulder and other alcoholic beverages", imageUrl: "https://images.unsplash.com/photo-1583227122027-89c48cad9b71?q=80&w=2070&auto=format&fit=crop" },
        { name: "Food Cupboard", slug: "food-cupboard", description: "Essential food cupboard items", imageUrl: "https://images.unsplash.com/photo-1618681342880-5df27fa167c5?q=80&w=2071&auto=format&fit=crop" },
        { name: "Breakfast Foods", slug: "breakfast-foods", description: "Cereals, porridge, and breakfast essentials", imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2080&auto=format&fit=crop" },
        { name: "Cooking Oil", slug: "cooking-oil", description: "Cooking oils and vinegars", imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=2070&auto=format&fit=crop" },
        { name: "Pasta & Noodles", slug: "pasta-noodles", description: "Pasta, noodles, and related products", imageUrl: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=1974&auto=format&fit=crop" },
        { name: "Household Cleaning", slug: "household-cleaning", description: "Cleaning products and supplies", imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=2070&auto=format&fit=crop" }
      ],
      'food': [
        { name: "Rice & Grains", slug: "rice-grains", description: "Rice, garri, beans, and other grains", imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e8c9?q=80&w=2070&auto=format&fit=crop" },
        { name: "Cassava Products", slug: "cassava-products", description: "Elubo, cassava, poundo yam", imageUrl: "https://images.unsplash.com/photo-1604700083248-e1273bdc819a?q=80&w=1974&auto=format&fit=crop" },
        { name: "Poultry & Meat", slug: "poultry-meat", description: "Chicken, beef, shaki, pomo, and assorted meats", imageUrl: "https://images.unsplash.com/photo-1602470521006-aaea8b2f5d58?q=80&w=1933&auto=format&fit=crop" },
        { name: "Seafood", slug: "seafood", description: "Fish and other seafood products", imageUrl: "https://images.unsplash.com/photo-1580557781126-b9a5fd76a318?q=80&w=1974&auto=format&fit=crop" }
      ]
    };

    // Add subcategories
    Object.entries(subcategories).forEach(([parentSlug, items]) => {
      // Find parent category
      const parentCategory = Array.from(this.categories.values()).find(c => c.slug === parentSlug);
      if (parentCategory) {
        // Add each subcategory with the parent ID
        items.forEach(item => {
          this.createCategory({
            ...item,
            parentId: parentCategory.id,
            isSubcategory: true
          });
        });
      }
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug,
    );
  }
  
  async getProducts(filter?: Partial<Product>): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (filter) {
      products = products.filter(product => {
        for (const [key, value] of Object.entries(filter)) {
          if (product[key as keyof Product] !== value) {
            return false;
          }
        }
        return true;
      });
    }
    
    return products;
  }
  
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const featuredProducts = Array.from(this.products.values())
      .filter(product => product.featured);
    
    return limit ? featuredProducts.slice(0, limit) : featuredProducts;
  }
  
  async getProductsByVendor(vendorId: number): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.vendorId === vendorId);
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.categoryId === categoryId);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id, createdAt: new Date() };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = await this.getProduct(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId);
  }
  
  async getOrdersByVendor(vendorId: number): Promise<Order[]> {
    // Get all products by vendor
    const vendorProducts = await this.getProductsByVendor(vendorId);
    const vendorProductIds = vendorProducts.map(product => product.id);
    
    // Get all order items containing vendor products
    const allOrderItems = Array.from(this.orderItems.values());
    const relevantOrderIds = new Set(
      allOrderItems
        .filter(item => vendorProductIds.includes(item.productId))
        .map(item => item.orderId)
    );
    
    // Get orders with those IDs
    return Array.from(this.orders.values())
      .filter(order => relevantOrderIds.has(order.id));
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { ...insertOrder, id, createdAt: new Date() };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status: status as any };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }
  
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
  
  // Cart operations
  async getCart(userId: number): Promise<Cart | undefined> {
    return Array.from(this.carts.values())
      .find(cart => cart.userId === userId);
  }
  
  async createCart(insertCart: InsertCart): Promise<Cart> {
    const id = this.currentCartId++;
    const cart: Cart = { ...insertCart, id, createdAt: new Date() };
    this.carts.set(id, cart);
    return cart;
  }
  
  // Cart item operations
  async getCartItems(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values())
      .filter(item => item.cartId === cartId);
  }
  
  async getCartItemsByUser(userId: number): Promise<CartItem[]> {
    const cart = await this.getCart(userId);
    if (!cart) return [];
    
    return this.getCartItems(cart.id);
  }
  
  async addCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const existingItems = await this.getCartItems(insertCartItem.cartId);
    const existingItem = existingItems.find(item => 
      item.cartId === insertCartItem.cartId && 
      item.productId === insertCartItem.productId
    );
    
    if (existingItem) {
      // Update quantity
      return this.updateCartItemQuantity(
        insertCartItem.cartId,
        insertCartItem.productId,
        existingItem.quantity + insertCartItem.quantity
      ) as Promise<CartItem>;
    }
    
    // Create new item
    const id = this.currentCartItemId++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItemQuantity(cartId: number, productId: number, quantity: number): Promise<CartItem | undefined> {
    const items = await this.getCartItems(cartId);
    const item = items.find(item => item.productId === productId);
    
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(item.id, updatedItem);
    return updatedItem;
  }
  
  async removeCartItem(cartId: number, productId: number): Promise<boolean> {
    const items = await this.getCartItems(cartId);
    const item = items.find(item => item.productId === productId);
    
    if (!item) return false;
    
    return this.cartItems.delete(item.id);
  }
  
  async clearCart(cartId: number): Promise<boolean> {
    const items = await this.getCartItems(cartId);
    
    for (const item of items) {
      this.cartItems.delete(item.id);
    }
    
    return true;
  }
  
  // Review operations
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.productId === productId);
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { ...insertReview, id, createdAt: new Date() };
    this.reviews.set(id, review);
    
    // Update product rating
    const product = await this.getProduct(insertReview.productId);
    if (product) {
      const reviews = await this.getProductReviews(product.id);
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      await this.updateProduct(product.id, { rating: averageRating });
    }
    
    return review;
  }
  
  // Wishlist operations
  async getUserWishlist(userId: number): Promise<Wishlist[]> {
    return Array.from(this.wishlists.values())
      .filter(wishlist => wishlist.userId === userId);
  }
  
  async addToWishlist(insertWishlist: InsertWishlist): Promise<Wishlist> {
    // Check if already in wishlist
    const existingItems = await this.getUserWishlist(insertWishlist.userId);
    const exists = existingItems.some(item => 
      item.userId === insertWishlist.userId && 
      item.productId === insertWishlist.productId
    );
    
    if (exists) {
      return existingItems.find(item => 
        item.userId === insertWishlist.userId && 
        item.productId === insertWishlist.productId
      ) as Wishlist;
    }
    
    // Add to wishlist
    const id = this.currentWishlistId++;
    const wishlist: Wishlist = { ...insertWishlist, id, createdAt: new Date() };
    this.wishlists.set(id, wishlist);
    return wishlist;
  }
  
  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const wishlistItems = await this.getUserWishlist(userId);
    const item = wishlistItems.find(item => item.productId === productId);
    
    if (!item) return false;
    
    return this.wishlists.delete(item.id);
  }

  // Added methods for analytics, delivery tracking, and payment processing

  async getUsers(filter?: Partial<User>): Promise<User[]> {
    if (!filter) {
      return Array.from(this.users.values());
    }
    
    return Array.from(this.users.values()).filter(user => {
      for (const [key, value] of Object.entries(filter)) {
        if (user[key as keyof User] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  async updateUserStripeInfo(id: number, stripeData: { stripeCustomerId?: string, stripeAccountId?: string }): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: stripeData.stripeCustomerId || user.stripeCustomerId,
      stripeAccountId: stripeData.stripeAccountId || user.stripeAccountId
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getOrders(filter?: Partial<Order>): Promise<Order[]> {
    if (!filter) {
      return Array.from(this.orders.values());
    }
    
    return Array.from(this.orders.values()).filter(order => {
      for (const [key, value] of Object.entries(filter)) {
        if (order[key as keyof Order] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  async updateOrderTracking(id: number, trackingData: {
    trackingNumber?: string,
    deliveryProvider?: string,
    estimatedDeliveryDate?: Date,
    lastUpdated?: Date,
    deliveryNotes?: string
  }): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { 
      ...order,
      trackingNumber: trackingData.trackingNumber || order.trackingNumber,
      deliveryProvider: trackingData.deliveryProvider || order.deliveryProvider,
      estimatedDeliveryDate: trackingData.estimatedDeliveryDate || order.estimatedDeliveryDate,
      lastUpdated: trackingData.lastUpdated || new Date(),
      deliveryNotes: trackingData.deliveryNotes || order.deliveryNotes
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getAllOrderItems(): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values());
  }

  // Transaction storage
  private transactions: Map<string, Transaction> = new Map();

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, status };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async getTransactionsByVendor(vendorId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.vendorId === vendorId);
  }

  async getTransactionsByOrder(orderId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.orderId === orderId);
  }
}

export const storage = new MemStorage();
