
import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
  address: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  phone: String,
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: Number,
  quantity: { type: Number, default: 0 },
  images: [String],
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  imageUrl: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  isSubcategory: { type: Boolean, default: false }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  shippingCity: { type: String, required: true },
  shippingState: { type: String, required: true },
  shippingZipCode: { type: String, required: true },
  shippingCountry: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Product = mongoose.model('Product', productSchema);
export const Category = mongoose.model('Category', categorySchema);
export const Order = mongoose.model('Order', orderSchema);
export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
export const Cart = mongoose.model('Cart', cartSchema);
export const CartItem = mongoose.model('CartItem', cartItemSchema);
export const Review = mongoose.model('Review', reviewSchema);
export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
