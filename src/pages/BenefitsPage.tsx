import React from 'react';
import { Sparkles, Zap, Brain, Rocket, Code2, CheckCircle2, ArrowRight } from 'lucide-react';
import { EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';
import { Link } from '../context/RouterContext.tsx';

interface BenefitsPageProps {
  onBuyClick: () => void;
  price?: number;
  currencySymbol?: string;
}

export const BenefitsPage: React.FC<BenefitsPageProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const benefits = [
    {
      icon: Rocket,
      title: 'Escape Tutorial Hell Forever',
      desc: 'Most people spend months watching video courses without writing a single line of original code. This book forces you into active creation from minute one with tangible project outputs.'
    },
    {
      icon: Brain,
      title: 'Develop Real Intuition, Not Copy-Pasting',
      desc: 'Learn how to prompt AI like a senior architect: breaking problems down, setting strict boundary conditions, debugging edge cases, and understanding every generated line.'
    },
    {
      icon: Code2,
      title: 'Build a Proof-of-Work Portfolio',
      desc: 'Graduating with 30–50 live web projects on your personal GitHub will place you miles ahead of peers who only have a generic todo list app.'
    },
    {
      icon: Zap,
      title: 'Learn Across 6 Critical Modern Domains',
      desc: 'You do not just learn HTML buttons. You build Chrome extensions with Manifest V3, WebSockets for multi-user chat, HTML5 canvas games, and Node.js REST backends.'
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Book Benefits</span>
        </div>

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Why This Book Works
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-4 mb-3">
            Why 100 Mini Projects Beat Video Tutorials
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            The difference between people who learn to build and people who get stuck is daily, bite-sized creation.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-16 shadow-xs overflow-x-auto">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
            Passive Learning vs. The 100 Projects Method
          </h3>

          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4 text-slate-500">Traditional Tutorials</th>
                <th className="py-3 px-4 text-indigo-600">100 Mini Projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-800">Time to first runnable app</td>
                <td className="py-3.5 px-4 text-slate-500">Days of lectures</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">5 minutes (Day 1)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-800">AI Prompting Skills</td>
                <td className="py-3.5 px-4 text-slate-500">None taught</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">100 Tested Master Prompts</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-800">Portfolio Proof</td>
                <td className="py-3.5 px-4 text-slate-500">1 generic clone</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">Up to 100 custom creations</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-800">Retention &amp; Muscle Memory</td>
                <td className="py-3.5 px-4 text-slate-500">Low (forgotten in weeks)</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">Permanent (built by hands)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-1">Start building your portfolio today</h3>
            <p className="text-xs sm:text-sm text-indigo-200">
              Get all 100 projects, complete prompts, and downloadable PDF for {currencySymbol}{price}.
            </p>
          </div>
          <button
            onClick={onBuyClick}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all shrink-0 cursor-pointer"
          >
            Get The Ebook ({currencySymbol}{price})
          </button>
        </div>

      </div>
    </div>
  );
};
