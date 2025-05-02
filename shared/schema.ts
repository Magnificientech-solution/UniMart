import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision, pgEnum, uniqueIndex, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Role enum for user types
export const userRoleEnum = pgEnum('user_role', ['customer', 'vendor', 'admin']);

// Vendor tier enum for commission rates
export const vendorTierEnum = pgEnum('vendor_tier', ['standard', 'premium', 'enterprise']);

// User model with payment processing fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").notNull().default('customer'),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  
  // Customer payment fields
  stripeCustomerId: text("stripe_customer_id"),
  paypalCustomerId: text("paypal_customer_id"),
  defaultPaymentMethod: text("default_payment_method"),
  
  // Vendor payment fields
  stripeAccountId: text("stripe_account_id"),
  paypalMerchantId: text("paypal_merchant_id"),
  vendorTier: vendorTierEnum("vendor_tier").default('standard'),
  commissionRate: doublePrecision("commission_rate").default(0.1),
  accountVerified: boolean("account_verified").default(false),
  bankAccountVerified: boolean("bank_account_verified").default(false),
  
  // Shared fields
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

// Define user relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  orders: many(orders),
  carts: many(carts),
  reviews: many(reviews),
  wishlists: many(wishlists),
}));

// Main categories with better organization
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  parentId: integer("parent_id"),
  isSubcategory: boolean("is_subcategory").default(false),
  // New fields for better organization
  displayOrder: integer("display_order").default(0), // For ordering on frontend
  iconName: text("icon_name"), // To store icon reference
  featuredInHomepage: boolean("featured_in_homepage").default(false),
  bannerImageUrl: text("banner_image_url"), // For category banners
  titleFontSize: text("title_font_size").default('large'), // small, medium, large
  titleFontWeight: text("title_font_weight").default('bold'), // normal, bold
  colorScheme: text("color_scheme"), // Store hex color for category theming
  isActive: boolean("is_active").default(true),
});

// Define category relations
export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  subcategories: many(categories, {
    relationName: "subcategories",
  }),
}));

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  compareAtPrice: doublePrecision("compare_at_price"),
  quantity: integer("quantity").notNull().default(0),
  images: json("images").$type<string[]>().default([]),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  featured: boolean("featured").default(false),
  rating: doublePrecision("rating").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  // New fields for better organization
  brand: text("brand"),
  tags: json("tags").$type<string[]>().default([]),
  specifications: json("specifications").$type<Record<string, string>>(),
  isActive: boolean("is_active").default(true),
  weight: doublePrecision("weight"), // For shipping calculation
  dimensions: json("dimensions").$type<{length: number, width: number, height: number}>(),
});

// Define product relations
export const productsRelations = relations(products, ({ one, many }) => ({
  vendor: one(users, {
    fields: [products.vendorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
  reviews: many(reviews),
  wishlists: many(wishlists),
}));

// Order status enum with more detailed tracking states
export const orderStatusEnum = pgEnum('order_status', [
  'pending', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'
]);

// Delivery provider enum
export const deliveryProviderEnum = pgEnum('delivery_provider', [
  'royal_mail', 'dhl', 'fedex', 'ups', 'hermes', 'dpd', 'amazon_logistics', 'other'
]);

// Order model with enhanced tracking capabilities
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: orderStatusEnum("status").notNull().default('pending'),
  totalAmount: doublePrecision("total_amount").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingState: text("shipping_state").notNull(),
  shippingZipCode: text("shipping_zip_code").notNull(),
  shippingCountry: text("shipping_country").notNull(),
  paymentMethod: text("payment_method").notNull(),
  // New tracking fields
  trackingNumber: text("tracking_number"),
  deliveryProvider: deliveryProviderEnum("delivery_provider"),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  actualDeliveryDate: timestamp("actual_delivery_date"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  deliveryNotes: text("delivery_notes"),
  signatureRequired: boolean("signature_required").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define order relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

// Order Item model
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
});

// Define order item relations
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// Cart model
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    userIdx: uniqueIndex("carts_user_id_idx").on(table.userId),
  }
});

// Define cart relations
export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  cartItems: many(cartItems),
}));

// Cart Item model
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull().references(() => carts.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
});

// Define cart item relations
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

// Review model
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define review relations
export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

// Wishlist model
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    uniqueUserProduct: uniqueIndex("wishlist_user_product_idx").on(
      table.userId,
      table.productId
    ),
  };
});

// Define wishlist relations
export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertWishlistSchema = createInsertSchema(wishlists).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Cart = typeof carts.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Wishlist = typeof wishlists.$inferSelect;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
