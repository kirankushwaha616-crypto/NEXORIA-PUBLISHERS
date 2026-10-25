import React from 'react';
import { BookOpen, ShieldCheck, Mail, ArrowUp } from 'lucide-react';
import { EBOOK_META, EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';
import { Link } from '../context/RouterContext.tsx';

interface FooterProps {
  onBuyClick: () => void;
  price?: number;
  currencySymbol?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-16 text-left border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Info */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-white group">
              <img
                src="/logo.png"
                alt="NEXORA AESTHETIC MART Logo"
                className="w-8 h-8 object-contain rounded-lg bg-white/10 p-0.5 border border-white/20"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://lh3.googleusercontent.com/d/17T4S4IHGf926JS3R5JhwTL_bv1kGL4IT';
                }}
              />
              <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                NEXORA AESTHETIC MART
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              From Beginner to Builder — A practical, build-it-today book for complete beginners, students, self-learners and developers curious about putting AI to work on real web projects.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>© 2026 All Rights Reserved</span>
              <span>·</span>
              <span>Official Digital Ebook Edition</span>
            </div>
          </div>

          {/* Col 2: Navigation Pages */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Explore Pages
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <div>
                <ul className="space-y-2">
                  <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                  <li><Link to="/whats-inside" className="hover:text-white transition-colors">What's Inside</Link></li>
                  <li><Link to="/projects" className="hover:text-white transition-colors">100 Projects</Link></li>
                  <li><Link to="/challenge" className="hover:text-white transition-colors">30-Day Plan</Link></li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link to="/cheat-sheet" className="hover:text-white transition-colors">Prompt Cheat Sheet</Link></li>
                  <li><Link to="/benefits" className="hover:text-white transition-colors">Why Build</Link></li>
                  <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Col 3: Legal & Support */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Security &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund" className="hover:text-white transition-colors">Refund &amp; Delivery</Link></li>
              <li><Link to="/download" className="hover:text-white transition-colors">Lookup Order &amp; Download</Link></li>
              <li className="flex items-center gap-1.5 pt-1 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>FamGateway 256-bit UPI</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            No part of this publication promises income, employment or specific outcome. Learning happens by doing.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onBuyClick}
              className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Get Ebook ({currencySymbol}{price})
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
