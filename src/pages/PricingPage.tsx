import React from 'react';
import { Check, ShieldCheck, Zap, Download, Sparkles, Clock, ArrowRight, Lock } from 'lucide-react';
import { EBOOK_PRICE, EBOOK_ORIGINAL_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';
import { Link } from '../context/RouterContext.tsx';

interface PricingPageProps {
  onBuyClick: () => void;
  price?: number;
  originalPrice?: number;
  currencySymbol?: string;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  originalPrice = EBOOK_ORIGINAL_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const discountPercent = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const features = [
    'Complete 100 Mini Projects Book (High-res PDF)',
    '100 Copy-Paste Ready AI Master Prompts',
    'Full Clean Source Code for all 100 Projects',
    '30-Day Project Challenge Calendar & Roadmap',
    'Prompt Engineering Developer Cheat Sheet',
    'Direct Google Drive Mirror for Phone / Tablet / Kindle',
    'Free Lifetime Updates as new editions release',
    'Instant 1-Click FamGateway Direct UPI QR Payment'
  ];

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Pricing &amp; Instant Access</span>
        </div>

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Launch Special Offer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-4 mb-3">
            One Single Investment. Lifetime Access.
          </h1>
          <p className="text-base text-slate-600">
            No subscriptions, no hidden upsells. Get the complete 100 Mini Projects package with instant digital delivery right now.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white border-2 border-indigo-600 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          
          {/* Discount Badge */}
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
            {discountPercent}% OFF Special Launch
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Pricing & CTA */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Complete Ebook Edition
                </span>
                <h3 className="text-2xl font-bold text-slate-950 mt-1">
                  100 Mini Projects With AI
                </h3>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-slate-950 tabular-nums">
                  {currencySymbol}{price}
                </span>
                <span className="text-xl text-slate-400 line-through tabular-nums">
                  {currencySymbol}{originalPrice}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                  Save {currencySymbol}{originalPrice - price}
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Pay once with any UPI app (GPay, PhonePe, Paytm, FamPay). Download immediately after payment.
              </p>

              <button
                onClick={onBuyClick}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buy Now · {currencySymbol}{price}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>FamGateway Verified</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-indigo-500" />
                  <span>Instant PDF Delivery</span>
                </span>
              </div>
            </div>

            {/* Right: Feature Checklist */}
            <div className="md:col-span-6 border-t md:border-t-0 md:border-l border-slate-200 md:pl-8 pt-6 md:pt-0 space-y-3.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-4">
                What's included in your purchase:
              </span>
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* 100% Satisfaction Guarantee */}
        <div className="mt-8 bg-slate-100/80 border border-slate-200 rounded-2xl p-6 flex items-center gap-4 text-xs text-slate-600">
          <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-slate-900 block font-bold text-sm mb-0.5">
              Risk-Free Guarantee
            </strong>
            <span>
              If you have any difficulty accessing your ebook or need any technical support, our team ensures you get your download file or replacement link within minutes.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
