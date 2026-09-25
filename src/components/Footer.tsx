import React from 'react';
import { BookOpen, ShieldCheck, Mail, ArrowUp } from 'lucide-react';
import { EBOOK_META, EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';

interface FooterProps {
  onBuyClick: () => void;
  onOpenAdmin: () => void;
  price?: number;
  currencySymbol?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onBuyClick,
  onOpenAdmin,
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
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight">
                100 Mini Projects You Can Build With AI
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              From Beginner to Builder — A practical, build-it-today book for complete beginners, students, self-learners and developers curious about putting AI to work on real web projects.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>© 2026 All Rights Reserved</span>
              <span>·</span>
              <span>Official Digital Ebook Edition</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#whats-inside" className="hover:text-white transition-colors">What's Inside</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">100 Project List</a></li>
              <li><a href="#challenge" className="hover:text-white transition-colors">30-Day Plan</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Col 3: Legal & Support */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Security &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>FamGateway 256-bit UPI</span>
              </li>
              <li><span>Direct Digital PDF Delivery</span></li>
              <li><span>For Educational &amp; Personal Use</span></li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-slate-500 hover:text-slate-300 transition-colors text-left"
                >
                  Merchant / Admin Portal
                </button>
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
