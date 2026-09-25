import React from 'react';
import { Check, ShieldCheck, ArrowRight, Download, Zap } from 'lucide-react';
import { EBOOK_PRICE, EBOOK_ORIGINAL_PRICE, EBOOK_CURRENCY_SYMBOL, EBOOK_META } from '../config/ebookConfig.ts';

interface PricingSectionProps {
  onBuyClick: () => void;
  price?: number;
  originalPrice?: number;
  currencySymbol?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  originalPrice = EBOOK_ORIGINAL_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const discountPercent = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const perks = [
    'Complete 235-Page High-Res PDF Ebook',
    '100 Hands-on Practical Projects (Parts 1 to 5)',
    '100 Tested AI Prompts for ChatGPT, Claude & Gemini',
    'Full Vanilla HTML, CSS & JavaScript Code',
    'Structured 30-Day Project Challenge Plan',
    'Project Difficulty Roadmap & Skills Guide',
    'Final AI Coding Cheat Sheet (Page 234)',
    'Instant Digital Download immediately upon payment',
    'One-time payment — zero recurring fees'
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            One-Time Purchase
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-3 tracking-tight">
            Get the Complete Ebook Today
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Instant digital access with full runnable source code and prompts for all 100 projects.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left relative">
          
          <div className="p-8 sm:p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gradient-to-br from-white via-indigo-50/20 to-white">
            <div className="max-w-md">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Full Digital Edition
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1 mb-2">
                {EBOOK_META.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {EBOOK_META.subtitle}
              </p>
            </div>

            {/* Pricing Box */}
            <div className="flex flex-col md:items-end shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-950 tabular-nums">
                  {currencySymbol}{price}
                </span>
                <span className="text-lg text-slate-400 line-through tabular-nums">
                  {currencySymbol}{originalPrice}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-1 rounded-md mt-1">
                Save {discountPercent}% · One-time payment
              </span>
            </div>
          </div>

          <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Everything Included:
              </h4>
              {perks.map((perk, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Instant Delivery via FamGateway UPI</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pay securely with any UPI app (GPay, PhonePe, Paytm, BHIM, FamPay).
                  Once verified, your download button unlocks immediately on the page.
                </p>
              </div>

              <div>
                <button
                  onClick={onBuyClick}
                  className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Buy Now for {currencySymbol}{price}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>256-bit secure payment · Authorised digital delivery</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
