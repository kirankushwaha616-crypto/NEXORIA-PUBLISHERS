import React from 'react';
import { ArrowRight, BookOpen, Layers, CheckCircle2, Terminal, Code2, Globe, Cpu, Puzzle, Sparkles, Compass } from 'lucide-react';
import { BOOK_PARTS } from '../data/bookData.ts';
import { EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';
import { Link } from '../context/RouterContext.tsx';

interface WhatsInsidePageProps {
  onBuyClick: () => void;
  price?: number;
  currencySymbol?: string;
}

export const WhatsInsidePage: React.FC<WhatsInsidePageProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">What's Inside</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Complete Curriculum & Structure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            What's Inside The Book?
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            100 complete, step-by-step projects structured into 6 progressive parts. Every single project includes what you build, the exact AI prompt, architecture breakdown, and full copy-pasteable code.
          </p>
        </div>

        {/* 6 Parts Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {BOOK_PARTS.map((part) => (
            <div
              key={part.number}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                    Part {part.number} &bull; {part.range}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded-md text-slate-600">
                    {part.projectCount} Projects
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {part.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {part.description}
                </p>

                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Featured Highlights:
                  </span>
                  {part.projects.slice(0, 3).map((p) => (
                    <div key={p.id} className="text-xs text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                      <span className="truncate font-medium">{p.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/projects"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
                >
                  <span>Explore all {part.projectCount} projects</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed What Every Project Includes */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 mb-16 shadow-xs">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              The 6-Layer Anatomy of Every Project
            </h2>
            <p className="text-sm text-slate-600">
              No missing steps, no half-finished snippets. Every one of the 100 projects in the book follows a proven, pedagogical blueprint:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">What You Will Build</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear visual brief of the end result, the problem it solves, and the real-world utility.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Exact AI Master Prompt</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Battle-tested prompt you can paste directly into ChatGPT, Claude, or Gemini to produce working code.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Architecture & File Layout</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear directory structure showing exactly which files to create and how they link together.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">How The Code Works</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plain English breakdown of key methods, state management, event listeners, and logic.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">
                5
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Customization Ideas</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                3 to 5 fun ideas to personalize the app and make it truly your own creation.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">
                6
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Upgrade Challenge</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                A bonus stretch goal to test your newfound skills and prepare you for client or workplace work.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to start building?</h3>
            <p className="text-sm text-indigo-200">
              Get all 100 projects, complete prompts, and downloadable source code for only {currencySymbol}{price}.
            </p>
          </div>
          <button
            onClick={onBuyClick}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all shrink-0 cursor-pointer"
          >
            Get Complete Ebook ({currencySymbol}{price})
          </button>
        </div>

      </div>
    </div>
  );
};
