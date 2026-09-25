import React from 'react';
import { BookOpen, ShieldCheck, Lock } from 'lucide-react';
import { EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';

interface HeaderProps {
  onBuyClick: () => void;
  onOpenAdmin: () => void;
  isSandbox?: boolean;
  price?: number;
  currencySymbol?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onBuyClick,
  onOpenAdmin,
  isSandbox,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      {isSandbox && (
        <div className="bg-amber-500 text-slate-950 text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>Sandbox Mode Active: UPI payment simulation is enabled for testing.</span>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <a href="#hero" className="flex items-center gap-2.5 text-slate-900 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-indigo-700 transition-colors">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
            100 Mini Projects AI
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a href="#whats-inside" className="hover:text-slate-900 transition-colors">What's Inside</a>
          <a href="#projects" className="hover:text-slate-900 transition-colors">100 Projects</a>
          <a href="#samples" className="hover:text-slate-900 transition-colors">Inside the Book</a>
          <a href="#challenge" className="hover:text-slate-900 transition-colors">30-Day Plan</a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            title="Admin Dashboard"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Open Admin Dashboard"
          >
            <Lock className="w-4 h-4" />
          </button>
          
          <button
            onClick={onBuyClick}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm active:scale-95 transition-all whitespace-nowrap flex items-center gap-1.5"
          >
            <span>Get Ebook</span>
            <span className="text-indigo-200">·</span>
            <span>{currencySymbol}{price}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
