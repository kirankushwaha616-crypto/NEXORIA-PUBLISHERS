import React from 'react';
import { ArrowRight, CheckCircle2, Download, Zap, Smartphone, Sparkles } from 'lucide-react';
import { EBOOK_PRICE, EBOOK_ORIGINAL_PRICE, EBOOK_CURRENCY_SYMBOL, EBOOK_META } from '../config/ebookConfig.ts';

interface HeroProps {
  onBuyClick: () => void;
  onExploreClick: () => void;
  price?: number;
  originalPrice?: number;
  currencySymbol?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onBuyClick,
  onExploreClick,
  price = EBOOK_PRICE,
  originalPrice = EBOOK_ORIGINAL_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const discountPercent = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Authentic Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Quiet metadata line without pills */}
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-4 tracking-wide uppercase">
              <span>Official Digital Ebook</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>2026 Edition</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Instant PDF</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15] mb-5">
              100 Mini Projects <br className="hidden sm:inline" />
              <span className="text-indigo-600">You Can Build With AI</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-700 mb-4 leading-snug">
              From Beginner to Builder — Practical Projects, AI Prompts &amp; Complete Code
            </p>

            <p className="text-base text-slate-600 mb-8 max-w-xl leading-relaxed">
              A practical, build-it-today book for complete beginners — students, self-learners,
              and anyone curious about what AI can do when you put it to work on real, runnable projects.
              Zero prior coding required.
            </p>

            {/* Price & CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <div className="flex items-baseline gap-2.5 bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  {currencySymbol}{price}
                </span>
                <span className="text-base text-slate-400 line-through tabular-nums">
                  {currencySymbol}{originalPrice}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  {discountPercent}% OFF
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onBuyClick}
                  className="flex-1 sm:flex-none px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Buy Now — Instant Download</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={onExploreClick}
                  className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Explore What's Inside
                </button>
              </div>
            </div>

            {/* Supported Book Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full border-t border-slate-200/80 pt-6">
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100 Practical Projects</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100 Tested AI Prompts</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complete Runnable Code</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>30-Day Challenge</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Difficulty Roadmap</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI Coding Cheat Sheet</span>
              </div>
            </div>
          </div>

          {/* Right Column: Genuine Cover Image Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] group">
              {/* Soft decorative shadow backdrop */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-sky-400/20 to-purple-500/10 rounded-2xl filter blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />
              
              {/* Ebook Card Wrapper */}
              <div className="relative bg-white p-3 rounded-2xl shadow-2xl border border-slate-200/80 transition-transform duration-300 group-hover:-translate-y-1">
                <img
                  src={EBOOK_META.coverImage}
                  alt="100 Mini Projects You Can Build With AI - Ebook Cover"
                  className="w-full h-auto aspect-[3/4] object-cover rounded-xl shadow-inner border border-slate-100"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                <div className="mt-3.5 px-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Digital PDF · 235 Pages</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Instant Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
