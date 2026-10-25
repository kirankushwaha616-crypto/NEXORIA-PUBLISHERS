import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  QrCode,
  Smartphone,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Download,
  BookOpen,
  Lock,
  ChevronRight,
  Search,
  MoreHorizontal,
  User,
  Sparkles,
  Info
} from 'lucide-react';
import { Order } from '../types.ts';
import { EBOOK_CURRENCY_SYMBOL, GDRIVE_EBOOK_URL, GDRIVE_DIRECT_DOWNLOAD_URL } from '../config/ebookConfig.ts';

interface PaymentModalProps {
  order: Order;
  paymentSession: any;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (verifiedOrder: Order) => void;
  onNewPayment?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  paymentSession,
  isOpen,
  onClose,
  onPaymentSuccess,
  onNewPayment
}) => {
  const [pollingStatus, setPollingStatus] = useState<
    'waiting' | 'detected' | 'verifying' | 'verified' | 'failed' | 'expired'
  >('waiting');
  const [statusMessage, setStatusMessage] = useState('Waiting for payment...');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedUpiId, setCopiedUpiId] = useState(false);
  const [verifiedOrder, setVerifiedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'qr' | 'apps'>('qr');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // 5-minute countdown (300 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(300);

  if (!isOpen || !order) return null;

  const isSandbox = order.isSandbox || paymentSession?.isSandbox;
  const qrImageSrc = paymentSession?.qrData || paymentSession?.qrUrl || order.gatewayQrUrl;
  const upiUri = paymentSession?.upiUri || order.gatewayUpiUri;

  // Extract clean UPI ID if available
  const extractUpiId = (): string => {
    if (paymentSession?.upiId) return paymentSession.upiId;
    if (upiUri) {
      try {
        const match = upiUri.match(/[?&]pa=([^&]+)/);
        if (match && match[1]) {
          return decodeURIComponent(match[1]);
        }
      } catch {
        // fallback
      }
    }
    return 'ashishkk@fam';
  };

  const upiId = extractUpiId();

  // Dynamic order amount
  const displayAmount = Number.isInteger(order.amount)
    ? order.amount.toString()
    : order.amount.toFixed(2);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPollingStatus('expired');
          setStatusMessage('Payment session expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTimer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Copy helpers
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleCopyUpiId = () => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopiedUpiId(true);
    setTimeout(() => setCopiedUpiId(false), 2000);
  };

  // Fast Automatic Live Payment Verification (Auto-detects & delivers in 2-5s)
  useEffect(() => {
    if (pollingStatus === 'verified' || pollingStatus === 'expired') return;

    let isPolling = false;
    const intervalId = setInterval(async () => {
      if (secondsRemaining <= 0) {
        clearInterval(intervalId);
        return;
      }

      if (isPolling) return;
      isPolling = true;

      try {
        // 1. Actively verify against FamGateway via server
        const verifyRes = await fetch(`/api/orders/${order.orderId}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          if (verifyData.success && verifyData.status === 'SUCCESS') {
            clearInterval(intervalId);
            setPollingStatus('detected');
            setStatusMessage('Payment detected!');

            // Fetch complete order with verified download token
            const fullOrderRes = await fetch(`/api/orders/${order.orderId}`);
            const fullOrder = fullOrderRes.ok ? await fullOrderRes.json() : null;
            const finalOrder = fullOrder || {
              ...order,
              status: 'SUCCESS',
              downloadToken: verifyData.downloadToken,
              downloadTokenExpiresAt: verifyData.downloadTokenExpiresAt
            };

            setVerifiedOrder(finalOrder);
            setPollingStatus('verified');
            setStatusMessage('✓ Payment verified! Your ebook is ready.');
            
            // Immediately notify parent so book is unlocked everywhere
            onPaymentSuccess(finalOrder);
            return;
          }
        }

        // 2. Secondary check via order status lookup
        const res = await fetch(`/api/orders/${order.orderId}`);
        if (res.ok) {
          const data: Order = await res.json();
          if (data.status === 'SUCCESS') {
            clearInterval(intervalId);
            setVerifiedOrder(data);
            setPollingStatus('verified');
            setStatusMessage('✓ Payment verified! Your ebook is ready.');
            onPaymentSuccess(data);
          }
        }
      } catch {
        // Silent retry on background poll
      } finally {
        isPolling = false;
      }
    }, 2500);

    return () => clearInterval(intervalId);
  }, [order, secondsRemaining, pollingStatus, onPaymentSuccess]);

  // Authoritative manual verify button
  const handleManualVerify = async () => {
    if (isVerifying || secondsRemaining <= 0) return;
    setIsVerifying(true);
    setErrorMessage('');
    setPollingStatus('verifying');
    setStatusMessage('Verifying payment with payment gateway...');

    try {
      const res = await fetch(`/api/orders/${order.orderId}/verify`, {
        method: 'POST'
      });
      const data = await res.json();

      if (data.success && data.status === 'SUCCESS') {
        setPollingStatus('verified');
        setStatusMessage('Payment verified successfully!');
        
        const fullOrderRes = await fetch(`/api/orders/${order.orderId}`);
        const fullOrder = await fullOrderRes.json();
        setVerifiedOrder(fullOrder);
      } else {
        setPollingStatus('waiting');
        setStatusMessage('Waiting for payment...');
        setErrorMessage(
          data.message ||
            'Payment not detected yet. If you have already paid, wait a few seconds and click Verify Payment again.'
        );
      }
    } catch {
      setPollingStatus('failed');
      setStatusMessage('Payment could not be verified.');
      setErrorMessage('Unable to check payment status. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Sandbox simulation trigger for development/testing
  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    setStatusMessage('Simulating verified payment in Sandbox Mode...');
    try {
      const res = await fetch('/api/sandbox/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.orderId })
      });
      const data = await res.json();
      if (data.success && data.order) {
        setPollingStatus('verified');
        setStatusMessage('Payment verified successfully!');
        const fullOrderRes = await fetch(`/api/orders/${order.orderId}`);
        const fullOrder = await fullOrderRes.json();
        setVerifiedOrder(fullOrder);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to simulate sandbox payment.');
    } finally {
      setIsSimulating(false);
    }
  };

  // Mobile UPI Intent opener
  const handleOpenUpiIntent = (appScheme?: string) => {
    if (!upiUri) return;
    if (!appScheme) {
      window.location.href = upiUri;
      return;
    }
    const customUri = upiUri.replace('upi://pay', `${appScheme}/pay`).replace('upi://', `${appScheme}/`);
    window.location.href = customUri;
  };

  // Complete Payment Success Handlers
  const handleDownloadPdf = () => {
    const token = verifiedOrder?.downloadToken || order.downloadToken;
    if (token) {
      window.location.href = `/api/download/${token}`;
    } else {
      window.location.href = GDRIVE_DIRECT_DOWNLOAD_URL;
    }
  };

  const handleOpenDrive = () => {
    window.open(GDRIVE_EBOOK_URL, '_blank', 'noopener,noreferrer');
  };

  const handleSuccessFinished = () => {
    if (verifiedOrder) {
      onPaymentSuccess(verifiedOrder);
    } else {
      onClose();
    }
  };

  // Suggested UPI apps list
  const suggestedApps = [
    {
      id: 'pop',
      name: 'POP UPI',
      scheme: 'pop://upi',
      badge: 'POP',
      badgeBg: 'bg-orange-50 text-orange-600 border border-orange-200'
    },
    {
      id: 'gpay',
      name: 'Google Pay',
      scheme: 'tez://upi',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
      )
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      scheme: 'phonepe:',
      icon: (
        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
          पे
        </div>
      )
    },
    {
      id: 'paytm',
      name: 'PayTM',
      scheme: 'paytmmp:',
      icon: (
        <span className="text-[11px] font-black tracking-tighter text-sky-600">
          Pay<span className="text-blue-700">tm</span>
        </span>
      )
    },
    {
      id: 'navi',
      name: 'Navi',
      scheme: 'navi://upi',
      icon: (
        <div className="w-5 h-5 rounded-md bg-indigo-900 flex items-center justify-center text-white text-[10px] font-bold">
          n
        </div>
      )
    },
    {
      id: 'cred',
      name: 'CRED UPI',
      scheme: 'cred://upi',
      icon: (
        <div className="w-5 h-5 rounded-md bg-slate-900 flex items-center justify-center text-white text-[9px] font-mono font-bold">
          C
        </div>
      )
    },
    {
      id: 'supermoney',
      name: 'Super.Money',
      scheme: 'supermoney://upi',
      icon: (
        <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
          $
        </div>
      )
    },
    {
      id: 'bhim',
      name: 'BHIM',
      scheme: 'upi://pay',
      icon: (
        <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white text-[9px] font-bold">
          UPI
        </div>
      )
    },
    {
      id: 'mobikwik',
      name: 'MobiKwik',
      scheme: 'mobikwik://upi',
      icon: (
        <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
          M
        </div>
      )
    },
    {
      id: 'others',
      name: 'Others',
      scheme: 'upi://pay',
      icon: (
        <Smartphone className="w-4 h-4 text-slate-500" />
      )
    }
  ];

  const filteredApps = suggestedApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-900 my-auto flex flex-col md:flex-row min-h-[580px]">
        
        {/* ================================================== */}
        {/* LEFT PANEL: VIBRANT ROYAL BLUE (Price Summary & Art) */}
        {/* ================================================== */}
        <div className="w-full md:w-[320px] lg:w-[350px] bg-gradient-to-b from-[#1A62E8] via-[#1656D6] to-[#0E44B5] text-white p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shrink-0">
          
          {/* Subtle background decorative shapes */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/3 -right-16 w-56 h-56 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top User/Store Info */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Official Logo"
                className="w-11 h-11 rounded-2xl bg-white p-1 object-contain shadow-md border border-white/40"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://lh3.googleusercontent.com/d/17T4S4IHGf926JS3R5JhwTL_bv1kGL4IT';
                }}
              />
              <div>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-blue-100/80 block">
                  Official Store
                </span>
                <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight leading-tight">
                  NEXORA AESTHETIC MART
                </h3>
              </div>
            </div>

            {/* Price Summary White Card */}
            <div className="bg-white/95 text-slate-900 rounded-2xl p-5 shadow-lg shadow-blue-950/15 backdrop-blur-sm border border-white">
              <span className="text-xs font-semibold text-slate-500 block">
                Price Summary
              </span>
              <div className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight mt-1 tabular-nums">
                {EBOOK_CURRENCY_SYMBOL}{displayAmount}
              </div>
            </div>

            {/* User / Order Reference Pill */}
            <div
              onClick={handleCopyOrderId}
              className="bg-white/95 text-slate-800 rounded-2xl p-3.5 shadow-md flex items-center justify-between text-xs cursor-pointer hover:bg-white transition-all group"
              title="Click to copy Order ID"
            >
              <div className="flex items-center gap-2.5 truncate pr-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 block font-medium">Order Reference</span>
                  <span className="font-mono font-bold text-slate-800 text-xs truncate">
                    {order.orderId}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600">
                {copiedOrderId ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Bottom Modern 3D Shopping Illustration (Matching Reference Art) */}
          <div className="relative z-10 mt-8 pt-4">
            <svg
              className="w-full h-40 max-h-44 object-contain mx-auto drop-shadow-md select-none pointer-events-none"
              viewBox="0 0 320 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="160" cy="175" rx="140" ry="20" fill="#0A368F" fillOpacity="0.3" />
              
              {/* Back Box */}
              <path d="M40 130L90 105L150 120L100 150L40 130Z" fill="#1E52B7" />
              <path d="M40 130L100 150V180L40 160V130Z" fill="#154299" />
              <path d="M100 150L150 120V150L100 180V150Z" fill="#2464D9" />

              {/* Shopping Bag 1 */}
              <path d="M125 75L175 60L215 80L165 98L125 75Z" fill="#E2EDFF" />
              <path d="M125 75L165 98V175L125 150V75Z" fill="#C5DCFE" />
              <path d="M165 98L215 80V155L165 175V98Z" fill="#FFFFFF" />
              <path d="M150 55C150 45 160 38 170 38C180 38 190 45 190 55" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

              {/* Front Parcel Box */}
              <path d="M190 125L245 105L295 125L240 145L190 125Z" fill="#2970EF" />
              <path d="M190 125L240 145V185L190 165V125Z" fill="#1A51B7" />
              <path d="M240 145L295 125V165L240 185V145Z" fill="#528BFF" />
              
              {/* Parcel Ribbon / Tape */}
              <path d="M215 115L270 135L265 142L210 122L215 115Z" fill="#FFFFFF" fillOpacity="0.85" />
              <path d="M238 144V184H244V144H238Z" fill="#FFFFFF" fillOpacity="0.85" />

              {/* Discount Tag Starburst */}
              <g transform="translate(210, 85) rotate(-10)">
                <path d="M25 0L30.9 9.8L42.1 7.6L43.8 18.9L54.4 23.1L50.7 34L58.5 42.4L50.4 50.4L53.7 61.4L42.5 64.6L40.3 75.8L29.6 72.9L23.1 82.3L14.7 75.6L5.3 79.9L1.9 69L-8.4 67.8L-7.8 56.4L-17.6 50.5L-12.8 40.2L-20.7 31.7L-12.7 23.7L-16 12.7L-4.8 9.5L-2.6-1.7L8.1 1.2L14.6-8.2L23-1.5L25 0Z" fill="#2464D9" />
                <path d="M22 6L26.9 14.2L36.2 12.4L37.6 21.8L46.4 25.3L43.3 34.4L49.8 41.4L43.1 48L45.8 57.2L36.5 59.8L34.6 69.2L25.7 66.7L20.3 74.6L13.3 69L5.5 72.6L2.6 63.5L-5.9 62.5L-5.4 53L-13.6 48.1L-9.6 39.5L-16.2 32.4L-9.5 25.8L-12.3 16.6L-2.9 14L-1.1 4.7L7.8 7.1L13.2-0.7L20.2 4.9L22 6Z" fill="#528BFF" />
                <text x="14" y="44" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">%</text>
              </g>
            </svg>
          </div>

        </div>

        {/* ================================================== */}
        {/* RIGHT PANEL: PAYMENT OPTIONS (Clean White / Light) */}
        {/* ================================================== */}
        <div className="flex-1 bg-white p-5 sm:p-7 flex flex-col justify-between overflow-y-auto">
          
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Payment Options
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
                title="Options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sandbox Notice Banner */}
          {isSandbox && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Sandbox Test Mode</span>
              </div>
              <button
                onClick={handleSimulatePayment}
                disabled={isSimulating || pollingStatus === 'verified'}
                className="px-2.5 py-0.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-md text-[11px] cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? 'Simulating...' : 'Simulate Success'}
              </button>
            </div>
          )}

          {/* ================================================== */}
          {/* VIEW: SUCCESS CARD (If Verified) */}
          {/* ================================================== */}
          {pollingStatus === 'verified' ? (
            <div className="py-8 sm:py-12 text-center space-y-6 max-w-md mx-auto animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                  ✓ Payment Verified Successfully!
                </h3>
                <p className="text-xs text-slate-500">
                  Your transaction has been verified. Download your ebook below.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Order ID:</span>
                  <span className="font-mono font-bold text-slate-900">{order.orderId}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Amount Paid:</span>
                  <span className="font-bold text-emerald-600 text-sm">{EBOOK_CURRENCY_SYMBOL}{displayAmount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">PAID</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleDownloadPdf}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Ebook</span>
                </button>

                <button
                  onClick={handleOpenDrive}
                  className="w-full py-3 px-6 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span>Open Ebook in Google Drive</span>
                </button>
              </div>

              <button
                onClick={handleSuccessFinished}
                className="text-xs text-slate-500 hover:text-blue-600 font-semibold cursor-pointer underline"
              >
                Go to Order Receipt &amp; Details &rarr;
              </button>
            </div>
          ) : (
            /* ================================================== */
            /* VIEW: ACTIVE PAYMENT WITH EXACT SCREENSHOT LAYOUT */
            /* ================================================== */
            <div className="space-y-5 pt-3">
              
              {/* UPI Header & Search Bar Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm tracking-wide">
                    UPI
                  </span>
                  <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] text-slate-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Instant UPI</span>
                  </div>
                </div>

                {/* Search UPI Apps Input */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search UPI apps"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Main Split Body: UPI QR Card & Suggested Apps */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* 1. UPI QR SECTION (Left Side / Center) */}
                <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 text-center space-y-3.5">
                  <div className="flex items-center justify-between text-left">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">UPI QR</h4>
                      <p className="text-[11px] text-slate-500">Scan QR to pay</p>
                    </div>
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <QrCode className="w-4 h-4" />
                    </div>
                  </div>

                  {/* REAL QR Code from FamGateway */}
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs inline-block mx-auto">
                    {qrImageSrc ? (
                      <img
                        src={qrImageSrc}
                        alt={`Scan QR to pay ${EBOOK_CURRENCY_SYMBOL}${displayAmount}`}
                        className="w-44 h-44 sm:w-48 sm:h-48 mx-auto rounded-lg object-contain"
                      />
                    ) : (
                      <div className="w-44 h-44 sm:w-48 sm:h-48 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-2 rounded-lg">
                        <QrCode className="w-10 h-10" />
                        <span className="text-[11px]">Generating FamGateway QR...</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full font-bold text-xs tracking-wide">
                      Pay exactly {EBOOK_CURRENCY_SYMBOL}{displayAmount}
                    </div>

                    {upiId && (
                      <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-500">
                        <span className="font-mono truncate max-w-[170px]">{upiId}</span>
                        <button
                          onClick={handleCopyUpiId}
                          className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-0.5"
                        >
                          {copiedUpiId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUpiId ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Timer & Status */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Expires:</span>
                      <span className="font-mono font-bold text-slate-800">{formattedTimer}</span>
                    </div>

                    <div className="flex items-center gap-1 text-blue-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                      <span>Auto-detecting</span>
                    </div>
                  </div>
                </div>

                {/* 2. SUGGESTED APPS SECTION (Right Side Grid) */}
                <div className="lg:col-span-6 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                      Suggested Apps
                    </h4>
                    <span className="text-[10px] text-slate-400">Tap to pay</span>
                  </div>

                  {/* 2-Column App Grid (Exactly like screenshot) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {filteredApps.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => handleOpenUpiIntent(app.scheme)}
                        className="flex items-center gap-2.5 p-3 bg-white hover:bg-slate-50 active:bg-blue-50/50 border border-slate-200 hover:border-blue-400 rounded-2xl transition-all cursor-pointer text-left shadow-2xs group"
                      >
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0">
                          {app.icon ? (
                            app.icon
                          ) : (
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${app.badgeBg || 'bg-slate-100 text-slate-700'}`}>
                              {app.badge || 'UPI'}
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                          {app.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {filteredApps.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                      No UPI apps match your search.
                    </div>
                  )}

                  {/* Status Card & Verify Button */}
                  <div className="pt-2 space-y-2.5">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        {pollingStatus === 'verifying' ? (
                          <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        )}
                        <span className="font-medium text-[11px] sm:text-xs">{statusMessage}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">256-bit UPI</span>
                    </div>

                    {errorMessage && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button
                      onClick={handleManualVerify}
                      disabled={isVerifying || secondsRemaining <= 0}
                      className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Payment...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>I've Done the Payment — Verify Payment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Footer Security Badges */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>FamGateway 256-bit Encrypted UPI</span>
            </div>
            <span>Instant Digital Delivery</span>
          </div>

        </div>

      </div>
    </div>
  );
};
