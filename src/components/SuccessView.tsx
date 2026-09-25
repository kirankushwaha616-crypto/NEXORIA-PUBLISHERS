import React, { useState } from 'react';
import { CheckCircle2, Download, ShieldCheck, ArrowLeft, FileText, Clock, HelpCircle, ExternalLink } from 'lucide-react';
import { Order } from '../types.ts';
import { EBOOK_CURRENCY_SYMBOL, EBOOK_META } from '../config/ebookConfig.ts';

interface SuccessViewProps {
  order: Order;
  onBackToHome: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ order, onBackToHome }) => {
  const [downloadStarted, setDownloadStarted] = useState(false);

  const downloadUrl = order.downloadToken ? `/api/download/${order.downloadToken}` : '';

  const handleDownload = () => {
    if (!downloadUrl) return;
    setDownloadStarted(true);
    window.location.href = downloadUrl;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-left">
        
        {/* Top Green Accent Banner */}
        <div className="p-8 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Payment Verified &amp; Confirmed!
          </h2>
          <p className="text-emerald-100 text-sm mt-1">
            Thank you for your purchase. Your digital ebook is ready for download.
          </p>
        </div>

        {/* Order Details Receipt */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-200">
              <span className="font-semibold text-slate-700">Order ID:</span>
              <span className="font-mono font-bold text-slate-900">{order.orderId}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-200">
              <span className="font-semibold text-slate-700">Product:</span>
              <span className="font-medium text-slate-900 text-right max-w-xs">{order.productTitle || EBOOK_META.title}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-200">
              <span className="font-semibold text-slate-700">Customer:</span>
              <span className="font-medium text-slate-900">{order.customerName}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-200">
              <span className="font-semibold text-slate-700">Email:</span>
              <span className="font-medium text-slate-900">{order.customerEmail}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-200">
              <span className="font-semibold text-slate-700">Amount Paid:</span>
              <span className="font-bold text-emerald-700 tabular-nums">
                {EBOOK_CURRENCY_SYMBOL}{order.amount.toFixed(2)} (Verified)
              </span>
            </div>

            {order.paymentReference && (
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Payment Ref / UTR:</span>
                <span className="font-mono text-slate-700">{order.paymentReference}</span>
              </div>
            )}
          </div>

          {/* Secure Download Card */}
          <div className="p-6 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-950">
                  100 Mini Projects You Can Build With AI (PDF)
                </h4>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Complete 235 Pages · High Resolution · All 100 Projects &amp; Prompts
                </p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>{downloadStarted ? 'Downloading Ebook...' : 'Download Ebook (PDF)'}</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Link valid for 48 hours</span>
              </span>
              <span>Downloads: {order.downloadCount}</span>
            </div>
          </div>

          {/* Post Purchase Tips */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>How to start learning:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Save the downloaded PDF to your device or Google Drive.</li>
              <li>Keep your Order ID (<strong>{order.orderId}</strong>) safe for customer support.</li>
              <li>Open Project 1 (Hello Name Greeter), copy the AI prompt, and paste it into ChatGPT, Claude or Gemini.</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={onBackToHome}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Store Home</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
