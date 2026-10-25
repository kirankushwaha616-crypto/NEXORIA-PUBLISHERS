import dotenv from 'dotenv';
dotenv.config();
import { db } from './db.ts';

let runtimeSandboxOverride: boolean | null = null;

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
  get FAMGATEWAY_API_KEY(): string {
    let rawKey =
      process.env.FAMGATEWAY_API_KEY ||
      process.env.FAM_GATEWAY_API_KEY ||
      process.env.FAMGATEWAY_KEY ||
      process.env.FAM_GATEWAY_KEY ||
      process.env.FAMEGATEWAY_API_KEY ||
      process.env.FAME_GATEWAY_API_KEY ||
      process.env.FAMEGATEWAY_KEY ||
      process.env.FAME_GATEWAY_KEY ||
      process.env.FAMGATEWAY_TOKEN ||
      process.env.FAM_GATEWAY_TOKEN ||
      process.env.FAMEGATEWAY_TOKEN ||
      process.env.FAME_GATEWAY_TOKEN ||
      '';

    if (!rawKey) {
      for (const [key, val] of Object.entries(process.env)) {
        if (/^(fam|fame).*gateway.*(key|token|api)$/i.test(key) || /^gateway.*(key|token|api)$/i.test(key)) {
          if (val && typeof val === 'string' && val.trim().length > 5) {
            rawKey = val;
            break;
          }
        }
      }
    }

    const cleaned = rawKey.replace(/^["']|["']$/g, '').trim();
    return cleaned || 'fam_7410279d16badc49ee26980cbd680bcd3079a141';
  },

  get FAMGATEWAY_BASE_URL(): string {
    const rawUrl = process.env.FAMGATEWAY_BASE_URL || 'https://famgateway.in';
    return rawUrl.trim().replace(/\/+$/, '');
  },

  get MERCHANT_UPI_ID(): string {
    const raw = process.env.MERCHANT_UPI_ID || process.env.UPI_ID || process.env.PAYEE_UPI || '';
    return raw.trim() || 'ashishkk@fam';
  },
  
  // Admin Dashboard Secret (persisted in DB/settings.json, with env fallback)
  get ADMIN_SECRET_KEY(): string {
    return db.getSettings().adminSecretKey || process.env.ADMIN_SECRET_KEY || 'admin2026';
  },
  set ADMIN_SECRET_KEY(val: string) {
    if (val && val.trim().length > 0) db.updateSettings({ adminSecretKey: val.trim() });
  },

  // Sandbox / Test Mode
  // If user sets a FamGateway API Key, live mode is active by default.
  get SANDBOX_MODE(): boolean {
    if (runtimeSandboxOverride !== null) return runtimeSandboxOverride;
    if (process.env.ENABLE_SANDBOX === 'true') return true;
    const key = this.FAMGATEWAY_API_KEY;
    // Live mode when a real key is present
    return !key || key.length < 10;
  },
  set SANDBOX_MODE(val: boolean) {
    runtimeSandboxOverride = Boolean(val);
  },

  // Secure Delivery Token Validity (hours)
  DOWNLOAD_TOKEN_EXPIRY_HOURS: 48,

  // App URL (used for redirect and webhook URLs)
  APP_URL: process.env.APP_URL || 'http://localhost:3000',

  // Support / Contact email
  SUPPORT_EMAIL: 'support@ebooks.local',

  // Google Drive Verified Ebook Access
  GDRIVE_EBOOK_URL: 'https://drive.google.com/file/d/1lf3YJue6sx1257giWYZ-XFrj6ORU9qTI/view?usp=drivesdk',
  GDRIVE_DIRECT_DOWNLOAD_URL: 'https://drive.google.com/uc?export=download&id=1lf3YJue6sx1257giWYZ-XFrj6ORU9qTI'
};
