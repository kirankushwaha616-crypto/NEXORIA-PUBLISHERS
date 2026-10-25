import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Copy, Check, ExternalLink, ShieldCheck, ArrowLeft, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { Order } from '../types.ts';
import { EBOOK_CURRENCY_SYMBOL, GDRIVE_EBOOK_URL, GDRIVE_DIRECT_DOWNLOAD_URL } from '../config/ebookConfig.ts';
import { Link, useRouter } from '../context/RouterContext.tsx';

interface DownloadPageProps {
  verifiedOrder?: Order | null;
  onOpenPayment?: (order: Order) => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({
  verifiedOrder: initialVerifiedOrder,
  onOpenPayment
}) => {
  const { params, searchParams } = useRouter();
  const orderIdFromRoute = params.orderId || searchParams.get('order_id') || '';

  const [orderIdInput, setOrderIdInput] = useState(orderIdFromRoute);
  const [order, setOrder] = useState<Order | null>(initialVerifiedOrder || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  useEffect(() => {
    if (orderIdFromRoute && (!order || order.orderId !== orderIdFromRoute)) {
      fetchOrder(orderIdFromRoute);
    }
  }, [orderIdFromRoute]);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${id.trim()}`);
      if (!res.ok) {
        throw new Error('Order not found. Please verify your Order ID.');
      }
      const data: Order = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve order details.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderIdInput);
  };

  const handleCopyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Download Ebook</span>
        </div>

        {order && order.status === 'SUCCESS' ? (
          /* SUCCESSFUL DOWNLOAD CARD */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Payment Verified &bull; Ebook Ready!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Thank you for your purchase. Your digital ebook edition is ready for immediate download.
              </p>
            </div>

            {/* Order Details Mini Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Order ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 select-all">{order.orderId}</span>
                  <button
                    onClick={handleCopyOrderId}
                    className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                    title="Copy Order ID"
                  >
                    {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-slate-900">{EBOOK_CURRENCY_SYMBOL}{order.amount}</span>
              </div>

              {order.paymentReference && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Payment Reference:</span>
                  <span className="font-mono text-slate-700">{order.paymentReference}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                  VERIFIED PAID
                </span>
              </div>
            </div>

            {/* Direct Download Options */}
            <div className="space-y-3 pt-2">
              {order.downloadToken ? (
                <a
                  href={`/api/download?token=${order.downloadToken}&order_id=${order.orderId}`}
                  download
                  className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete PDF Ebook Now</span>
                </a>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs text-center">
                  Your secure token has refreshed. Use the Google Drive mirror below for instant access.
                </div>
              )}

              <a
                href={GDRIVE_EBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-2xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-indigo-600" />
                <span>Open in Google Drive / Save to Phone</span>
              </a>
            </div>

            <div className="text-center pt-2">
              <Link to="/" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
                &larr; Return to Homepage
              </Link>
            </div>
          </div>
        ) : order && order.status !== 'SUCCESS' ? (
          /* PENDING ORDER CARD */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-950">Payment Pending</h1>
            <p className="text-xs text-slate-600">
              Order <strong className="font-mono">{order.orderId}</strong> is awaiting UPI confirmation.
            </p>
            {onOpenPayment && (
              <button
                onClick={() => onOpenPayment(order)}
                className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Complete Payment Now
              </button>
            )}
          </div>
        ) : (
          /* LOOKUP FORM */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-950">Retrieve Ebook Order</h1>
              <p className="text-xs text-slate-600">
                Enter your Order ID (e.g. NXE-20260925-A3F8B1) to re-download your ebook.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="NXE-2026..."
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Find My Ebook</span>}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
