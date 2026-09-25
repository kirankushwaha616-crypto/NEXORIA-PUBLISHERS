import dotenv from 'dotenv';
dotenv.config();
import { db } from './db.ts';

export const CONFIG = {
  // Authoritative Ebook Product Details
  PRODUCT_ID: 'ebook_100_mini_projects',
  PRODUCT_TITLE: '100 Mini Projects You Can Build With AI',
  PRODUCT_SUBTITLE: 'From Beginner to Builder — Practical Projects, AI Prompts & Complete Code',
  
  // Single central configuration variable for price (persisted in DB/settings.json)
  get PRICE(): number {
    return db.getSettings().price;
  },
  set PRICE(val: number) {
    if (val > 0) db.updateSettings({ price: Math.round(val) });
  },

  get ORIGINAL_PRICE(): number {
    return db.getSettings().originalPrice;
  },
  set ORIGINAL_PRICE(val: number) {
    if (val > 0) db.updateSettings({ originalPrice: Math.round(val) });
  },

  CURRENCY: 'INR',
  CURRENCY_SYMBOL: '₹',

  // FamGateway API Configuration (server-side only, NEVER sent to client)
  FAMGATEWAY_API_KEY: process.env.FAMGATEWAY_API_KEY || 'fam_7410279d16badc49ee26980cbd680bcd3079a141',
  FAMGATEWAY_BASE_URL: process.env.FAMGATEWAY_BASE_URL || 'https://famgateway.in',
  
  // Admin Dashboard Secret (persisted in DB/settings.json, with env fallback)
  get ADMIN_SECRET_KEY(): string {
    return db.getSettings().adminSecretKey || process.env.ADMIN_SECRET_KEY || 'admin2026';
  },
  set ADMIN_SECRET_KEY(val: string) {
    if (val && val.trim().length > 0) db.updateSettings({ adminSecretKey: val.trim() });
  },

  // Sandbox / Test Mode
  // When FamGateway API Key is present, live mode is active.
  // Sandbox mode can only be enabled if explicitly requested via ENABLE_SANDBOX=true or if API key is missing.
  SANDBOX_MODE: process.env.ENABLE_SANDBOX === 'true' || !process.env.FAMGATEWAY_API_KEY,

  // Secure Delivery Token Validity (hours)
  DOWNLOAD_TOKEN_EXPIRY_HOURS: 48,

  // App URL (used for redirect and webhook URLs)
  APP_URL: process.env.APP_URL || 'http://localhost:3000',

  // Support / Contact email
  SUPPORT_EMAIL: 'support@ebooks.local'
};
