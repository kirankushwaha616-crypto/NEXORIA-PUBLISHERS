import crypto from 'crypto';
import QRCode from 'qrcode';
import { CONFIG } from './config.ts';
import { db, Order, generateSecureToken } from './db.ts';

export interface PaymentSessionResult {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  checkoutUrl?: string;
  qrUrl?: string;
  qrData?: string; // Base64 data URL
  upiUri?: string;
  upiId?: string;
  gatewayOrderId?: string;
  isSandbox: boolean;
  expiresInMinutes: number;
}

export const paymentService = {
  /**
   * Initiates payment for an order.
   * If FamGateway API key is available, calls FamGateway API.
   * Also generates a local QR fallback / sandbox session for seamless testing.
   */
  async createPaymentSession(order: Order, appUrl: string): Promise<PaymentSessionResult> {
    const isSandbox = CONFIG.SANDBOX_MODE;
    const expectedAmount = CONFIG.PRICE;

    // Check if we can make a live call to FamGateway
    if (!isSandbox && CONFIG.FAMGATEWAY_API_KEY) {
      try {
        const apiKey = CONFIG.FAMGATEWAY_API_KEY;
        const payload = {
          api_key: apiKey,
          amount: expectedAmount,
          customer_name: order.customerName,
          customer_email: order.customerEmail,
          customer_mobile: order.customerPhone,
          order_id: order.orderId,
          custom_id: order.orderId,
          redirect_url: `${appUrl}/?order_id=${order.orderId}&view=status`,
          webhook_url: `${appUrl}/api/webhook/famgateway`,
          remark: `Ebook Purchase: ${order.orderId}`
        };

        // Try primary API endpoint, then fallback to .php endpoint
        const endpoints = [
          `${CONFIG.FAMGATEWAY_BASE_URL}/api/create-order`,
          `${CONFIG.FAMGATEWAY_BASE_URL}/api/create-order.php`
        ];

        let res: any = null;
        for (const ep of endpoints) {
          try {
            const candidate = await fetch(ep, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Api-Key': apiKey,
                'User-Agent': 'Nexora-Ebook-Client/2.0'
              },
              body: JSON.stringify(payload),
              signal: AbortSignal.timeout(6000)
            });
            if (candidate.ok) {
              res = candidate;
              break;
            }
          } catch {
            // try next endpoint
          }
        }

        if (res && res.ok) {
          const raw = await res.json();
          const info = raw.data || raw;
          
          const gatewayOrderId = info.order_id || raw.order_id || info.id || `FAM-${Date.now()}`;
          const checkoutUrl = info.checkout_url || raw.checkout_url || info.payment_url;
          const qrUrl = info.qr_url || raw.qr_url || info.qr_code;
          const upiUri = info.upi_intent || info.upi_url || raw.upi_intent || info.upi_uri;
          const upiId = info.upi_id || raw.upi_id || info.vpa || '';

          let qrData = qrUrl || '';
          if (upiUri) {
            qrData = await QRCode.toDataURL(upiUri, { margin: 1, width: 340 });
          } else if (qrUrl && !qrUrl.startsWith('http') && qrUrl.startsWith('data:image')) {
            qrData = qrUrl;
          }

          db.updateOrder(order.orderId, {
            gatewayOrderId,
            gatewayCheckoutUrl: checkoutUrl,
            gatewayQrUrl: qrUrl,
            gatewayUpiUri: upiUri,
            status: 'PENDING',
            isSandbox: false
          });

          return {
            orderId: order.orderId,
            amount: expectedAmount,
            currency: 'INR',
            status: 'PENDING',
            checkoutUrl,
            qrUrl,
            qrData,
            upiUri,
            upiId,
            gatewayOrderId,
            isSandbox: false,
            expiresInMinutes: 5
          };
        } else if (res) {
          console.warn('FamGateway create-order non-200 response:', res.status, await res.text());
        }
      } catch (err) {
        console.error('FamGateway live API error:', err);
      }
    }

    // Fallback or Sandbox Mode:
    // Generate standard UPI Intent URI and QR code
    // Using merchant handle or developer test handle
    const payeeVpa = CONFIG.MERCHANT_UPI_ID;
    const payeeName = 'NEXORA AESTHETIC MART';
    const upiUri = `upi://pay?pa=${encodeURIComponent(payeeVpa)}&pn=${encodeURIComponent(payeeName)}&am=${expectedAmount.toFixed(2)}&cu=INR&tr=${order.orderId}&tn=${encodeURIComponent(`Order ${order.orderId}`)}`;
    
    // Generate QR code base64 image data URL
    const qrData = await QRCode.toDataURL(upiUri, {
      margin: 1,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });

    const gatewayOrderId = `TEST-${order.orderId}`;
    db.updateOrder(order.orderId, {
      gatewayOrderId,
      gatewayUpiUri: upiUri,
      isSandbox: true,
      status: 'PENDING'
    });

    return {
      orderId: order.orderId,
      amount: expectedAmount,
      currency: 'INR',
      status: 'PENDING',
      qrData,
      upiUri,
      upiId: payeeVpa,
      gatewayOrderId,
      isSandbox: true,
      expiresInMinutes: 10
    };
  },

  /**
   * Verifies an order's status server-to-server.
   * Calls FamGateway verify-order endpoint if active.
   */
  async verifyOrderPayment(orderId: string): Promise<{ success: boolean; order?: Order; error?: string }> {
    const order = db.getOrder(orderId);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (order.status === 'SUCCESS') {
      return { success: true, order };
    }

    // If pure sandbox without API key and without gateway ID, check if manually simulated
    if (order.isSandbox && !order.gatewayOrderId && !CONFIG.FAMGATEWAY_API_KEY) {
      return { success: false, order, error: 'Payment is pending (Sandbox)' };
    }

    // Live FamGateway verification
    if (CONFIG.FAMGATEWAY_API_KEY && (order.gatewayOrderId || order.orderId)) {
      try {
        const apiKey = CONFIG.FAMGATEWAY_API_KEY;
        const targetIds = [order.gatewayOrderId, order.orderId].filter(Boolean) as string[];

        for (const checkId of targetIds) {
          // 1. Check via verify-order.php
          try {
            const verifyUrl = `${CONFIG.FAMGATEWAY_BASE_URL}/api/verify-order.php?api_key=${encodeURIComponent(apiKey)}&order_id=${encodeURIComponent(checkId)}`;
            const res = await fetch(verifyUrl, {
              headers: {
                'X-Api-Key': apiKey,
                'User-Agent': 'Nexora-Ebook-Client/2.0'
              },
              signal: AbortSignal.timeout(3500)
            });

            if (res.ok) {
              const raw = await res.json();
              const info = raw.data || raw;
              
              const isPaid = raw.status === 'success' || raw.payment_status === 'success' || info.status === 'success' || raw.success === true;
              const paidAmount = parseFloat(info.amount || info.paid_amount || raw.amount || String(CONFIG.PRICE));

              if (isPaid) {
                const expectedAmount = order.amount || CONFIG.PRICE;
                if (paidAmount < expectedAmount) {
                  console.error(`Amount mismatch: expected ${expectedAmount}, got ${paidAmount}`);
                  db.updateOrder(orderId, {
                    status: 'MANUAL_REVIEW',
                    paymentReference: info.utr || info.transaction_id || raw.utr,
                    verifiedAmount: paidAmount
                  });
                  return { success: false, error: 'Payment amount mismatch. Marked for manual review.' };
                }

                const token = generateSecureToken();
                const expiresAt = new Date(Date.now() + CONFIG.DOWNLOAD_TOKEN_EXPIRY_HOURS * 3600 * 1000).toISOString();

                const updated = db.updateOrder(orderId, {
                  status: 'SUCCESS',
                  paymentReference: info.utr || info.transaction_id || raw.utr || `UTR-${Date.now()}`,
                  paymentVerifiedAt: new Date().toISOString(),
                  verifiedAmount: paidAmount || CONFIG.PRICE,
                  downloadToken: token,
                  downloadTokenExpiresAt: expiresAt
                });

                return { success: true, order: updated };
              } else if (raw.status === 'expired') {
                db.updateOrder(orderId, { status: 'EXPIRED' });
                return { success: false, error: 'Payment session expired' };
              }
            }
          } catch {}

          // 2. Check via check-order-status.php (POST JSON)
          try {
            const checkStatusUrl = `${CONFIG.FAMGATEWAY_BASE_URL}/api/check-order-status.php`;
            const checkRes = await fetch(checkStatusUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': apiKey,
                'User-Agent': 'Nexora-Ebook-Client/2.0'
              },
              body: JSON.stringify({ api_key: apiKey, order_id: checkId }),
              signal: AbortSignal.timeout(3500)
            });

            if (checkRes.ok) {
              const checkData = await checkRes.json();
              const checkInfo = checkData.data || checkData;
              const isPaid =
                checkData.status === 'success' ||
                checkData.status === 'SUCCESS' ||
                checkInfo.status === 'success' ||
                checkInfo.status === 'SUCCESS' ||
                checkData.paid === true;

              if (isPaid) {
                const token = generateSecureToken();
                const expiresAt = new Date(Date.now() + CONFIG.DOWNLOAD_TOKEN_EXPIRY_HOURS * 3600 * 1000).toISOString();
                const updated = db.updateOrder(orderId, {
                  status: 'SUCCESS',
                  paymentReference: checkInfo.utr || checkData.utr || checkInfo.transaction_id || `UTR-${Date.now()}`,
                  paymentVerifiedAt: new Date().toISOString(),
                  verifiedAmount: order.amount || CONFIG.PRICE,
                  downloadToken: token,
                  downloadTokenExpiresAt: expiresAt
                });
                return { success: true, order: updated };
              }
            }
          } catch {}

          // 3. Fallback check: checkout-status.php
          try {
            const statusCheckUrl = `${CONFIG.FAMGATEWAY_BASE_URL}/api/checkout-status.php?order_id=${encodeURIComponent(checkId)}`;
            const statusRes = await fetch(statusCheckUrl);
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              if (statusData.status === 'success' || statusData.status === 'SUCCESS') {
                const token = generateSecureToken();
                const expiresAt = new Date(Date.now() + CONFIG.DOWNLOAD_TOKEN_EXPIRY_HOURS * 3600 * 1000).toISOString();
                const updated = db.updateOrder(orderId, {
                  status: 'SUCCESS',
                  paymentReference: statusData.utr || `UTR-${Date.now()}`,
                  paymentVerifiedAt: new Date().toISOString(),
                  verifiedAmount: CONFIG.PRICE,
                  downloadToken: token,
                  downloadTokenExpiresAt: expiresAt
                });
                return { success: true, order: updated };
              }
            }
          } catch {}
        }
      } catch (err) {
        console.error('Error verifying payment with FamGateway:', err);
      }
    }

    return { success: false, order, error: 'Payment not yet verified' };
  },

  /**
   * Handles incoming FamGateway webhook.
   * Verifies HMAC-SHA256 signature using the active FamGateway API Key.
   */
  async handleWebhook(rawBody: string, signatureHeader?: string): Promise<{ success: boolean; message: string }> {
    // Webhook verification using HMAC-SHA256
    if (CONFIG.FAMGATEWAY_API_KEY && signatureHeader) {
      const hmac = crypto.createHmac('sha256', CONFIG.FAMGATEWAY_API_KEY);
      hmac.update(rawBody);
      const computedSignature = hmac.digest('hex');

      // Timing-safe comparison
      try {
        const sigBuffer = Buffer.from(signatureHeader, 'hex');
        const compBuffer = Buffer.from(computedSignature, 'hex');
        if (sigBuffer.length !== compBuffer.length || !crypto.timingSafeEqual(sigBuffer, compBuffer)) {
          console.warn('Webhook signature mismatch');
          return { success: false, message: 'Invalid webhook signature' };
        }
      } catch {
        console.warn('Invalid signature header encoding');
        return { success: false, message: 'Invalid signature encoding' };
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return { success: false, message: 'Invalid JSON payload' };
    }

    // FamGateway sends custom_id (our orderId) or order_id
    const customId = payload.custom_id;
    const gatewayOrderId = payload.order_id;
    const paidAmount = parseFloat(payload.amount || '0');
    const utr = payload.utr || payload.transaction_id;

    let order = customId ? db.getOrder(customId) : undefined;
    if (!order && gatewayOrderId) {
      order = db.getOrderByGatewayOrderId(gatewayOrderId);
    }

    if (!order) {
      return { success: false, message: 'Matching order not found' };
    }

    // Idempotency: if already processed, return 200 OK immediately
    if (order.status === 'SUCCESS') {
      return { success: true, message: 'Order already fulfilled (idempotent)' };
    }

    // Check amount
    const expectedAmount = order.amount || CONFIG.PRICE;
    if (paidAmount < expectedAmount) {
      db.updateOrder(order.orderId, {
        status: 'MANUAL_REVIEW',
        paymentReference: utr,
        verifiedAmount: paidAmount
      });
      return { success: false, message: 'Amount mismatch, set to manual review' };
    }

    // Issue download token
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + CONFIG.DOWNLOAD_TOKEN_EXPIRY_HOURS * 3600 * 1000).toISOString();

    db.updateOrder(order.orderId, {
      status: 'SUCCESS',
      paymentReference: utr || `UTR-WH-${Date.now()}`,
      paymentVerifiedAt: new Date().toISOString(),
      verifiedAmount: paidAmount || CONFIG.PRICE,
      downloadToken: token,
      downloadTokenExpiresAt: expiresAt
    });

    console.log(`[Webhook] Order ${order.orderId} verified and completed via FamGateway!`);
    return { success: true, message: 'Order successfully marked as paid' };
  },

  /**
   * For Development / Sandbox Testing Only:
   * Simulates payment completion when in sandbox mode.
   */
  simulatePaymentSuccess(orderId: string): { success: boolean; order?: Order; error?: string } {
    if (!CONFIG.SANDBOX_MODE) {
      return { success: false, error: 'Sandbox simulation is disabled in live production mode.' };
    }

    const order = db.getOrder(orderId);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + CONFIG.DOWNLOAD_TOKEN_EXPIRY_HOURS * 3600 * 1000).toISOString();

    const updated = db.updateOrder(orderId, {
      status: 'SUCCESS',
      paymentReference: `SBX-UTR-${Date.now().toString().slice(-8)}`,
      paymentVerifiedAt: new Date().toISOString(),
      verifiedAmount: CONFIG.PRICE,
      downloadToken: token,
      downloadTokenExpiresAt: expiresAt
    });

    return { success: true, order: updated };
  }
};
