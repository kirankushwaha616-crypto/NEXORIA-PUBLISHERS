import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { CONFIG } from './server/config.ts';
import { db, generateOrderId, generateSecureToken } from './server/db.ts';
import { paymentService } from './server/payment.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Capture raw body for webhook verification
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true }));

import crypto from 'crypto';

// Stateless HMAC-signed admin tokens
function createAdminToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', CONFIG.ADMIN_SECRET_KEY)
    .update(timestamp)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

function verifyAdminToken(token: string): boolean {
  if (!token) return false;
  // Also allow direct secret key in header for developer flexibility
  if (token === CONFIG.ADMIN_SECRET_KEY) return true;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Max 7 days validity
  if (Date.now() - timestamp > 7 * 24 * 3600 * 1000) return false;

  const expectedSignature = crypto
    .createHmac('sha256', CONFIG.ADMIN_SECRET_KEY)
    .update(timestampStr)
    .digest('hex');

  try {
    const a = Buffer.from(providedSignature, 'hex');
    const b = Buffer.from(expectedSignature, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  const token = authHeader.slice(7);
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
  next();
}

// -------------------------------------------------------------
// PUBLIC & STORE API ROUTES
// -------------------------------------------------------------

// 1. Store Configuration (Authoritative Server Settings)
app.get('/api/config', (_req: Request, res: Response) => {
  res.json({
    productTitle: CONFIG.PRODUCT_TITLE,
    productSubtitle: CONFIG.PRODUCT_SUBTITLE,
    price: CONFIG.PRICE,
    originalPrice: CONFIG.ORIGINAL_PRICE,
    currency: CONFIG.CURRENCY,
    currencySymbol: CONFIG.CURRENCY_SYMBOL,
    isSandbox: CONFIG.SANDBOX_MODE,
    hasApiKey: Boolean(CONFIG.FAMGATEWAY_API_KEY),
    gatewayBaseUrl: CONFIG.FAMGATEWAY_BASE_URL,
    supportEmail: CONFIG.SUPPORT_EMAIL
  });
});

// 2. Create Order & Initiate Payment
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, couponCode } = req.body;

    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      return res.status(400).json({ error: 'Please enter a valid WhatsApp or phone number.' });
    }

    // SERVER-AUTHORITATIVE PRICE: Never trust any price from the browser
    const amount = CONFIG.PRICE;
    const orderId = generateOrderId();

    // Determine host for callback & webhook URLs
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host') || `localhost:${PORT}`;
    const appUrl = process.env.APP_URL || `${protocol}://${host}`;

    // Create Order Record (Status: PENDING)
    const order = db.createOrder({
      orderId,
      customerName: name.trim(),
      customerEmail: email.trim().toLowerCase(),
      customerPhone: cleanPhone,
      couponCode: couponCode ? String(couponCode).trim() : undefined,
      productTitle: CONFIG.PRODUCT_TITLE,
      amount,
      currency: CONFIG.CURRENCY,
      status: 'PENDING',
      isSandbox: CONFIG.SANDBOX_MODE
    });

    // Create Payment Session via FamGateway (or sandbox fallback)
    const session = await paymentService.createPaymentSession(order, appUrl);

    res.status(201).json({
      success: true,
      order: {
        orderId: order.orderId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        createdAt: order.createdAt
      },
      payment: session
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order. Please try again.' });
  }
});

// 3. Query Order Status (Safe, polling-friendly)
app.get('/api/orders/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    let order = db.getOrder(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // If order is still pending, attempt server verification if live
    if (order.status === 'PENDING' && !order.isSandbox) {
      const verifyRes = await paymentService.verifyOrderPayment(orderId);
      if (verifyRes.success && verifyRes.order) {
        order = verifyRes.order;
      }
    }

    // Return safe customer representation
    res.json({
      orderId: order.orderId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      createdAt: order.createdAt,
      paymentVerifiedAt: order.paymentVerifiedAt,
      paymentReference: order.paymentReference,
      downloadToken: order.status === 'SUCCESS' ? order.downloadToken : undefined,
      downloadTokenExpiresAt: order.status === 'SUCCESS' ? order.downloadTokenExpiresAt : undefined,
      downloadCount: order.downloadCount,
      isSandbox: order.isSandbox,
      gatewayCheckoutUrl: order.gatewayCheckoutUrl,
      gatewayQrUrl: order.gatewayQrUrl,
      gatewayUpiUri: order.gatewayUpiUri
    });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Failed to retrieve order status.' });
  }
});

// 4. Verify Payment (Manual trigger from UI or polling)
app.post('/api/orders/:orderId/verify', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const result = await paymentService.verifyOrderPayment(orderId);

    if (result.success && result.order) {
      return res.json({
        success: true,
        status: result.order.status,
        orderId: result.order.orderId,
        downloadToken: result.order.downloadToken,
        downloadTokenExpiresAt: result.order.downloadTokenExpiresAt,
        message: 'Payment successfully verified!'
      });
    }

    res.json({
      success: false,
      status: result.order ? result.order.status : 'PENDING',
      message: result.error || 'Payment not yet detected. Please allow a few seconds for bank confirmation.'
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ error: 'Verification failed. Please retry.' });
  }
});

// 5. FamGateway Official Webhook Handler
app.post('/api/webhook/famgateway', async (req: any, res: Response) => {
  try {
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const signature = req.headers['x-famgateway-signature'] as string | undefined;

    const result = await paymentService.handleWebhook(rawBody, signature);

    if (result.success) {
      return res.status(200).json({ status: 'ok', message: result.message });
    } else {
      return res.status(400).json({ status: 'error', message: result.message });
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// 6. Sandbox Payment Simulation (Development/Testing ONLY)
app.post('/api/sandbox/simulate-payment', (req: Request, res: Response) => {
  if (!CONFIG.SANDBOX_MODE) {
    return res.status(403).json({ error: 'Sandbox simulation is disabled in live production mode.' });
  }

  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'Missing orderId parameter.' });
  }

  const result = paymentService.simulatePaymentSuccess(orderId);
  if (result.success && result.order) {
    return res.json({
      success: true,
      order: {
        orderId: result.order.orderId,
        status: result.order.status,
        downloadToken: result.order.downloadToken,
        downloadTokenExpiresAt: result.order.downloadTokenExpiresAt,
        paymentReference: result.order.paymentReference
      },
      message: 'Sandbox payment simulated successfully!'
    });
  }

  res.status(400).json({ error: result.error || 'Failed to simulate payment.' });
});

// 7. Secure Ebook Delivery Endpoint
// The PDF is NEVER in public/. It requires a valid, unexpired download token for a verified order.
app.get('/api/download/:token', (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token || typeof token !== 'string') {
      return res.status(400).send('Invalid download token.');
    }

    const order = db.getOrderByDownloadToken(token);
    if (!order) {
      return res.status(403).send('Access denied. Invalid download link or token.');
    }

    if (order.status !== 'SUCCESS') {
      return res.status(403).send('Payment has not been confirmed for this purchase.');
    }

    if (order.downloadTokenExpiresAt && new Date() > new Date(order.downloadTokenExpiresAt)) {
      return res.status(410).send('Download link has expired. Please contact support with your Order ID for a renewed link.');
    }

    const pdfPath = path.resolve('server/storage/ebook-100-mini-projects.pdf');
    if (!fs.existsSync(pdfPath)) {
      return res.status(500).send('Ebook file is temporarily unavailable. Please contact support.');
    }

    // Increment download count and record time
    db.updateOrder(order.orderId, {
      downloadCount: order.downloadCount + 1,
      lastDownloadedAt: new Date().toISOString()
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="100-Mini-Projects-You-Can-Build-With-AI.pdf"');
    
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  } catch (err) {
    console.error('Download delivery error:', err);
    res.status(500).send('Internal server error during download.');
  }
});

// -------------------------------------------------------------
// ADMIN DASHBOARD API (Protected with Server-Side Secret)
// -------------------------------------------------------------

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { secretKey } = req.body;
  if (!secretKey || secretKey !== CONFIG.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: 'Incorrect administrator password.' });
  }

  const token = createAdminToken();

  res.json({
    success: true,
    token,
    message: 'Authenticated successfully'
  });
});

// Get Admin Stats and Order List
app.get('/api/admin/orders', requireAdmin, (_req: Request, res: Response) => {
  const stats = db.getStats();
  const orders = db.listOrders();
  res.json({
    stats,
    orders,
    config: {
      price: CONFIG.PRICE,
      originalPrice: CONFIG.ORIGINAL_PRICE,
      isSandbox: CONFIG.SANDBOX_MODE,
      gatewayBaseUrl: CONFIG.FAMGATEWAY_BASE_URL,
      hasApiKey: Boolean(CONFIG.FAMGATEWAY_API_KEY),
      adminSecretKey: CONFIG.ADMIN_SECRET_KEY
    }
  });
});

// Admin Update Ebook Price
app.post('/api/admin/price', requireAdmin, (req: Request, res: Response) => {
  const { price, originalPrice } = req.body;
  const parsedPrice = parseInt(String(price), 10);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ error: 'Please enter a valid price in rupees (must be greater than 0).' });
  }

  CONFIG.PRICE = parsedPrice;

  if (originalPrice !== undefined) {
    const parsedOrig = parseInt(String(originalPrice), 10);
    if (!isNaN(parsedOrig) && parsedOrig >= parsedPrice) {
      CONFIG.ORIGINAL_PRICE = parsedOrig;
    }
  }

  console.log(`[Admin] Ebook price updated to ₹${CONFIG.PRICE} (Original: ₹${CONFIG.ORIGINAL_PRICE})`);

  res.json({
    success: true,
    price: CONFIG.PRICE,
    originalPrice: CONFIG.ORIGINAL_PRICE,
    currency: CONFIG.CURRENCY,
    currencySymbol: CONFIG.CURRENCY_SYMBOL,
    message: `Ebook price successfully updated to ${CONFIG.CURRENCY_SYMBOL}${CONFIG.PRICE}`
  });
});

// Admin Update Password
app.post('/api/admin/password', requireAdmin, (req: Request, res: Response) => {
  const { newPassword } = req.body;
  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 4) {
    return res.status(400).json({ error: 'New password must be at least 4 characters long.' });
  }

  CONFIG.ADMIN_SECRET_KEY = newPassword.trim();
  console.log(`[Admin] Admin password updated successfully.`);

  res.json({
    success: true,
    message: 'Admin password successfully updated.'
  });
});

// Admin Order Action (Renew token, Manual verify, Refund)
app.post('/api/admin/orders/:orderId/action', requireAdmin, (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { action, utr } = req.body;

  const order = db.getOrder(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (action === 'mark_success') {
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + CONFIG.DOWNLOAD_TOKEN_EXPIRY_HOURS * 3600 * 1000).toISOString();
    const updated = db.updateOrder(orderId, {
      status: 'SUCCESS',
      paymentReference: utr ? String(utr).trim() : `ADMIN-MANUAL-${Date.now().toString().slice(-6)}`,
      paymentVerifiedAt: new Date().toISOString(),
      verifiedAmount: order.amount || CONFIG.PRICE,
      downloadToken: token,
      downloadTokenExpiresAt: expiresAt
    });
    return res.json({ success: true, order: updated, message: 'Order manually marked as SUCCESS' });
  }

  if (action === 'renew_token') {
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + CONFIG.DOWNLOAD_TOKEN_EXPIRY_HOURS * 3600 * 1000).toISOString();
    const updated = db.updateOrder(orderId, {
      downloadToken: token,
      downloadTokenExpiresAt: expiresAt
    });
    return res.json({ success: true, order: updated, message: 'Download token renewed for 48 hours' });
  }

  if (action === 'mark_refunded') {
    const updated = db.updateOrder(orderId, { status: 'REFUNDED' });
    return res.json({ success: true, order: updated, message: 'Order marked as REFUNDED' });
  }

  res.status(400).json({ error: 'Unknown action' });
});

// Admin Update Settings (Sandbox mode, Price, Password)
app.post('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const { sandboxMode, price, originalPrice, adminSecretKey } = req.body;

  if (typeof sandboxMode === 'boolean') {
    CONFIG.SANDBOX_MODE = sandboxMode;
  }
  if (typeof price === 'number' && price > 0) {
    CONFIG.PRICE = Math.round(price);
  }
  if (typeof originalPrice === 'number' && originalPrice > 0) {
    CONFIG.ORIGINAL_PRICE = Math.round(originalPrice);
  }
  if (typeof adminSecretKey === 'string' && adminSecretKey.trim().length >= 4) {
    CONFIG.ADMIN_SECRET_KEY = adminSecretKey.trim();
  }

  res.json({
    success: true,
    isSandbox: CONFIG.SANDBOX_MODE,
    price: CONFIG.PRICE,
    originalPrice: CONFIG.ORIGINAL_PRICE,
    message: 'Settings updated successfully'
  });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC ASSET SERVING
// -------------------------------------------------------------

async function startServer() {
  if (!isProduction) {
    // In dev: Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production: Serve dist directory
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (mode: ${isProduction ? 'production' : 'development'}, sandbox: ${CONFIG.SANDBOX_MODE})`);
  });
}

if (process.env.VERCEL !== '1') {
  startServer().catch(err => {
    console.error('Fatal error starting server:', err);
  });
}

export default app;
