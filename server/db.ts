import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'EXPIRED'
  | 'REFUNDED'
  | 'MANUAL_REVIEW';

export interface Order {
  orderId: string; // e.g. NXE-20260925-A3F8B1
  customerName: string;
  customerEmail: string;
  customerPhone: string; // WhatsApp
  couponCode?: string;
  productTitle: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  
  // FamGateway specific tracking
  gatewayOrderId?: string;
  gatewayCheckoutUrl?: string;
  gatewayQrUrl?: string;
  gatewayUpiUri?: string;
  paymentReference?: string; // Bank UTR or Transaction ID
  paymentVerifiedAt?: string;
  verifiedAmount?: number;
  
  // Secure Delivery
  downloadToken?: string;
  downloadTokenExpiresAt?: string;
  downloadCount: number;
  lastDownloadedAt?: string;
  
  // Simulation / Test tracking
  isSandbox: boolean;
}

const isServerless = process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? path.join('/tmp', 'nexora_data') : path.resolve('data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure directory exists safely without throwing in read-only environments
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  // Gracefully ignored in read-only environments; in-memory cache is used
}

export interface AppSettings {
  price: number;
  originalPrice: number;
  adminSecretKey: string;
}

let settingsCache: AppSettings = {
  price: parseInt(process.env.EBOOK_PRICE || '29', 10),
  originalPrice: parseInt(process.env.EBOOK_ORIGINAL_PRICE || '299', 10),
  adminSecretKey: process.env.ADMIN_SECRET_KEY || 'admin2026'
};

function loadSettings(): void {
  try {
    const candidateFile = fs.existsSync(SETTINGS_FILE)
      ? SETTINGS_FILE
      : fs.existsSync(path.resolve('data/settings.json'))
      ? path.resolve('data/settings.json')
      : null;

    if (candidateFile && fs.existsSync(candidateFile)) {
      const data = fs.readFileSync(candidateFile, 'utf8');
      const loaded = JSON.parse(data);
      if (typeof loaded.price === 'number' && loaded.price > 0) {
        settingsCache.price = loaded.price;
      }
      if (typeof loaded.originalPrice === 'number' && loaded.originalPrice > 0) {
        settingsCache.originalPrice = loaded.originalPrice;
      }
      if (typeof loaded.adminSecretKey === 'string' && loaded.adminSecretKey.trim().length > 0 && loaded.adminSecretKey !== 'ADMIN_SECRET_KEY') {
        settingsCache.adminSecretKey = loaded.adminSecretKey.trim();
      } else {
        settingsCache.adminSecretKey = 'admin2026';
      }
    } else {
      saveSettings();
    }
  } catch (err) {
    console.warn('Notice loading settings from disk:', err);
  }
}

function saveSettings(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settingsCache, null, 2), 'utf8');
  } catch (err) {
    console.warn('Notice saving settings to disk (using in-memory cache):', err);
  }
}

// In-memory cache synced with disk
let ordersCache: Map<string, Order> = new Map();

function loadOrders(): void {
  try {
    const candidateFile = fs.existsSync(ORDERS_FILE)
      ? ORDERS_FILE
      : fs.existsSync(path.resolve('data/orders.json'))
      ? path.resolve('data/orders.json')
      : null;

    if (candidateFile && fs.existsSync(candidateFile)) {
      const data = fs.readFileSync(candidateFile, 'utf8');
      const list: Order[] = JSON.parse(data);
      ordersCache.clear();
      for (const order of list) {
        ordersCache.set(order.orderId, order);
      }
    }
  } catch (err) {
    console.warn('Notice loading orders from disk:', err);
  }
}

function saveOrders(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const list = Array.from(ordersCache.values());
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.warn('Notice saving orders to disk (using in-memory cache):', err);
  }
}

// Initial load
loadSettings();
loadOrders();

export function generateOrderId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `NXE-${dateStr}-${randomSuffix}`;
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export const db = {
  createOrder(orderData: Omit<Order, 'createdAt' | 'updatedAt' | 'downloadCount'>): Order {
    const now = new Date().toISOString();
    const order: Order = {
      ...orderData,
      createdAt: now,
      updatedAt: now,
      downloadCount: 0
    };
    ordersCache.set(order.orderId, order);
    saveOrders();
    return order;
  },

  getOrder(orderId: string): Order | undefined {
    return ordersCache.get(orderId);
  },

  getOrderByGatewayOrderId(gatewayOrderId: string): Order | undefined {
    for (const order of ordersCache.values()) {
      if (order.gatewayOrderId === gatewayOrderId) {
        return order;
      }
    }
    return undefined;
  },

  getOrderByDownloadToken(token: string): Order | undefined {
    if (!token) return undefined;
    for (const order of ordersCache.values()) {
      if (order.downloadToken === token) {
        return order;
      }
    }
    return undefined;
  },

  updateOrder(orderId: string, updates: Partial<Order>): Order | undefined {
    const order = ordersCache.get(orderId);
    if (!order) return undefined;

    const updated: Order = {
      ...order,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    ordersCache.set(orderId, updated);
    saveOrders();
    return updated;
  },

  listOrders(): Order[] {
    return Array.from(ordersCache.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getStats() {
    const all = Array.from(ordersCache.values());
    const successful = all.filter(o => o.status === 'SUCCESS');
    const pending = all.filter(o => o.status === 'PENDING' || o.status === 'PAYMENT_PROCESSING');
    const failed = all.filter(o => o.status === 'FAILED' || o.status === 'EXPIRED');
    const totalRevenue = successful.reduce((sum, o) => sum + (o.verifiedAmount || o.amount), 0);
    const totalDownloads = successful.reduce((sum, o) => sum + o.downloadCount, 0);

    return {
      totalOrders: all.length,
      successfulOrders: successful.length,
      pendingOrders: pending.length,
      failedOrders: failed.length,
      totalRevenue,
      totalDownloads
    };
  },

  getSettings(): AppSettings {
    return { ...settingsCache };
  },

  updateSettings(updates: Partial<AppSettings>): AppSettings {
    if (typeof updates.price === 'number' && updates.price > 0) {
      settingsCache.price = Math.round(updates.price);
    }
    if (typeof updates.originalPrice === 'number' && updates.originalPrice > 0) {
      settingsCache.originalPrice = Math.round(updates.originalPrice);
    }
    if (typeof updates.adminSecretKey === 'string' && updates.adminSecretKey.trim().length > 0) {
      settingsCache.adminSecretKey = updates.adminSecretKey.trim();
    }
    saveSettings();
    return { ...settingsCache };
  }
};
