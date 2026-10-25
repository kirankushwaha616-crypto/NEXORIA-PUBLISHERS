import React, { useState } from 'react';
import { BookOpen, Menu, X, ArrowRight } from 'lucide-react';
import { EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';
import { Link, useRouter } from '../context/RouterContext.tsx';

interface HeaderProps {
  onBuyClick: () => void;
  isSandbox?: boolean;
  price?: number;
  currencySymbol?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onBuyClick,
  isSandbox,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { path } = useRouter();

  const navLinks = [
    { label: "What's Inside", href: '/whats-inside' },
    { label: '100 Projects', href: '/projects' },
    { label: '30-Day Plan', href: '/challenge' },
    { label: 'Prompt Cheat Sheet', href: '/cheat-sheet' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {isSandbox && (
        <div className="bg-amber-500 text-slate-950 text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>Sandbox Mode Active: UPI payment simulation is enabled for testing.</span>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand wordmark -> links to '/' */}
        <Link to="/" className="flex items-center gap-2.5 text-slate-900 group">
          <img
            src="/logo.png"
            alt="NEXORA AESTHETIC MART Logo"
            className="w-9 h-9 object-contain rounded-xl bg-slate-50 border border-slate-200/80 p-0.5 shadow-2xs group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://lh3.googleusercontent.com/d/17T4S4IHGf926JS3R5JhwTL_bv1kGL4IT';
            }}
          />
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
              NEXORA AESTHETIC MART
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase hidden sm:block">
              Official Digital Store
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`hover:text-indigo-600 transition-colors py-1 ${
                path === link.href ? 'text-indigo-600 font-bold border-b-2 border-indigo-600' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBuyClick}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm active:scale-95 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <span>Get Ebook</span>
            <span className="text-indigo-200">·</span>
            <span>{currencySymbol}{price}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                path === link.href ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              Why Learn By Building
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
