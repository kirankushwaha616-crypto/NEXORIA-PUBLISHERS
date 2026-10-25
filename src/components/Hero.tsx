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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Authentic Copy (Shown below cover on mobile, left on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-start text-left">
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

          {/* Cover Image Showcase (Order 1 on Mobile: Shown FIRST on phones) */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center mb-6 lg:mb-0">
            <div className="relative w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[390px] group flex flex-col items-center">
              
              {/* Soft atmospheric gradient glow behind the 3D book */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-blue-600/20 via-indigo-500/20 to-purple-500/10 rounded-full filter blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              {/* 3D Realistic Floating Book Container */}
              <div className="relative z-10 w-full flex justify-center">
                <img
                  src={EBOOK_META.coverImage}
                  alt="100 Mini Projects You Can Build With AI - 3D Ebook Edition"
                  className="w-full h-auto max-h-[460px] object-contain drop-shadow-[0_20px_25px_rgba(15,23,42,0.30)] group-hover:drop-shadow-[0_30px_35px_rgba(37,99,235,0.35)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://lh3.googleusercontent.com/d/1chKM1M4Lqb84SUvxNsKDBX7pjULCp84J';
                  }}
                />
              </div>

              {/* Realistic Ground Shadow Oval */}
              <div className="w-3/4 h-4 bg-slate-900/15 rounded-[100%] blur-md mt-2 group-hover:scale-90 group-hover:opacity-60 transition-all duration-500" />

              {/* Floating Ebook Badges Card */}
              <div className="mt-4 w-full bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Digital PDF · 235 Pages
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Instant Access
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
