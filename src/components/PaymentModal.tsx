import React, { useState, useEffect } from 'react';
import { X, QrCode, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck, Smartphone, Loader2 } from 'lucide-react';
import { Order } from '../types.ts';
import { EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';

interface PaymentModalProps {
  order: Order;
  paymentSession: any;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (verifiedOrder: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  paymentSession,
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const [pollingStatus, setPollingStatus] = useState<
    'waiting' | 'checking' | 'verified' | 'failed'
  >('waiting');
  const [statusMessage, setStatusMessage] = useState('Waiting for payment...');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 min countdown

  if (!isOpen || !order) return null;

  const isSandbox = order.isSandbox || paymentSession?.isSandbox;
  const qrData = paymentSession?.qrData || paymentSession?.qrUrl;
  const upiUri = paymentSession?.upiUri;
  const checkoutUrl = paymentSession?.checkoutUrl;

  // Countdown timer for 5-minute session
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatusMessage('Payment session expired. Please create a new order.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Safe periodic polling every 4 seconds
  useEffect(() => {
    let intervalId: any;
    let pollCount = 0;
    const maxPolls = 75; // 5 minutes max

    const checkStatus = async () => {
      if (pollCount >= maxPolls || secondsRemaining <= 0) {
        clearInterval(intervalId);
        return;
      }
      pollCount++;

      try {
        setPollingStatus('checking');
        setStatusMessage('Checking payment status...');

        const res = await fetch(`/api/orders/${order.orderId}`);
        if (res.ok) {
          const data: Order = await res.json();
          if (data.status === 'SUCCESS') {
            setPollingStatus('verified');
            setStatusMessage('Payment received & verified!');
            clearInterval(intervalId);
            setTimeout(() => {
              onPaymentSuccess(data);
            }, 1000);
            return;
          }
        }
        setPollingStatus('waiting');
        setStatusMessage('Waiting for UPI payment confirmation...');
      } catch (err) {
        setPollingStatus('waiting');
        setStatusMessage('Waiting for UPI payment confirmation...');
      }
    };

    intervalId = setInterval(checkStatus, 4000);
    return () => clearInterval(intervalId);
  }, [order.orderId, secondsRemaining, onPaymentSuccess]);

  // Manual Check Trigger
  const handleManualVerify = async () => {
    setIsVerifying(true);
    setStatusMessage('Verifying payment with payment gateway...');
    try {
      const res = await fetch(`/api/orders/${order.orderId}/verify`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.status === 'SUCCESS') {
        setPollingStatus('verified');
        setStatusMessage('Payment verified successfully!');
        // Fetch full verified order
        const fullOrderRes = await fetch(`/api/orders/${order.orderId}`);
        const fullOrder = await fullOrderRes.json();
        setTimeout(() => {
          onPaymentSuccess(fullOrder);
        }, 800);
      } else {
        setStatusMessage(data.message || 'Payment not yet detected. If you just completed it, wait 5–10 seconds and check again.');
      }
    } catch {
      setStatusMessage('Network check failed. Please retry.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Sandbox simulation trigger
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
        setStatusMessage('Sandbox payment simulation confirmed!');
        setTimeout(() => {
          onPaymentSuccess({ ...order, ...data.order });
        }, 900);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to simulate sandbox payment.');
    } finally {
      setIsSimulating(false);
    }
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="text-left">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              FamGateway UPI Payment
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Scan &amp; Pay
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sandbox Notice Banner */}
        {isSandbox && (
          <div className="bg-amber-500/10 border-b border-amber-200 px-4 py-2 text-xs font-semibold text-amber-900 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Developer Sandbox Mode Active</span>
          </div>
        )}

        <div className="p-6 space-y-5">
          
          {/* Amount & Order ID */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block font-medium">Order Reference</span>
              <span className="text-xs font-mono font-bold text-slate-800">{order.orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Amount Due</span>
              <span className="text-xl font-black text-slate-950 tabular-nums">
                {EBOOK_CURRENCY_SYMBOL}{order.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="relative inline-block p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-sm mx-auto">
            {qrData ? (
              <img
                src={qrData}
                alt={`Scan QR to pay ${EBOOK_CURRENCY_SYMBOL}${order.amount}`}
                className="w-56 h-56 mx-auto rounded-lg object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-2">
                <QrCode className="w-12 h-12" />
                <span className="text-xs">Generating UPI QR...</span>
              </div>
            )}
            
            {/* Live Scan indicator */}
            <div className="mt-2 text-[11px] font-medium text-slate-500">
              Scan with GPay, PhonePe, Paytm, FamPay, or any UPI app
            </div>
          </div>

          {/* UPI ID with One-Click Copy */}
          {(paymentSession?.upiId || '7380673813@fam') && (
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="text-left truncate mr-2">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">UPI ID</span>
                <span className="font-mono font-semibold text-slate-800 select-all">
                  {paymentSession?.upiId || '7380673813@fam'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(paymentSession?.upiId || '7380673813@fam');
                  setCopiedUpi(true);
                  setTimeout(() => setCopiedUpi(false), 2000);
                }}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-slate-100 text-indigo-600 border border-slate-200 rounded-lg shrink-0 transition-colors shadow-2xs cursor-pointer"
              >
                {copiedUpi ? 'Copied!' : 'Copy UPI ID'}
              </button>
            </div>
          )}

          {/* Mobile UPI Deep Link */}
          {upiUri && (
            <div className="space-y-2">
              <a
                href={upiUri}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open in UPI App on Phone</span>
              </a>
            </div>
          )}

          {/* Hosted Checkout Link if provided by FamGateway */}
          {checkoutUrl && (
            <div>
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:underline font-semibold flex items-center justify-center gap-1"
              >
                <span>Or open FamGateway Hosted Checkout</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Real-time Polling Status Banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-left">
              {pollingStatus === 'checking' ? (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
              ) : pollingStatus === 'verified' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <RefreshCw className="w-4 h-4 text-slate-400 animate-spin shrink-0" style={{ animationDuration: '3s' }} />
              )}
              <span className="text-slate-700 font-medium">{statusMessage}</span>
            </div>
            <span className="text-slate-400 tabular-nums font-mono text-[11px] shrink-0">
              {timeFormatted}
            </span>
          </div>

          {/* Manual Verify Button */}
          <div className="pt-1 flex flex-col gap-2">
            <button
              onClick={handleManualVerify}
              disabled={isVerifying || secondsRemaining <= 0}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>I Have Paid · Check Status</span>
                </>
              )}
            </button>

            {/* Sandbox Simulation Button */}
            {isSandbox && (
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isSimulating}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isSimulating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                )}
                <span>Simulate UPI Payment Success (Sandbox Test)</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Payment verified server-to-server. Do not close until confirmed.</span>
        </div>

      </div>
    </div>
  );
};
