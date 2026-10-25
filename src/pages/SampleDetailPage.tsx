import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, ArrowLeft, ArrowRight, Sparkles, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { SAMPLE_PROJECTS, BOOK_PARTS } from '../data/bookData.ts';
import { EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';
import { Link, useRouter } from '../context/RouterContext.tsx';

interface SampleDetailPageProps {
  onBuyClick: () => void;
  price?: number;
  currencySymbol?: string;
}

export const SampleDetailPage: React.FC<SampleDetailPageProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const { params } = useRouter();
  const projectId = parseInt(params.id || '1', 10);

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Find sample in detailed samples or general catalog
  const sample = SAMPLE_PROJECTS.find(s => s.id === projectId);
  
  // Find project in book parts
  const catalogProject = BOOK_PARTS.flatMap(p => p.projects.map(proj => ({ ...proj, part: `Part ${p.number} — ${p.title}` }))).find(p => p.id === projectId);

  const title = sample?.title || catalogProject?.title || `Project #${projectId}`;
  const partTitle = sample?.part || catalogProject?.part || '100 Mini Projects';
  const difficulty = sample?.difficulty || catalogProject?.difficulty || '⭐';

  const handleCopyPrompt = () => {
    if (!sample) return;
    navigator.clipboard.writeText(sample.aiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyCode = () => {
    if (!sample) return;
    navigator.clipboard.writeText(sample.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to 100 Projects Directory</span>
          </Link>

          <button
            onClick={onBuyClick}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Get Entire Ebook ({currencySymbol}{price})
          </button>
        </div>

        {/* Project Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Project #{projectId} &bull; {partTitle}
            </span>
            <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg font-medium text-slate-700">
              Difficulty: {difficulty}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mb-3">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {sample?.whatYouWillBuild || catalogProject?.summary || 'Full project implementation included in the book.'}
          </p>

          {sample?.skills && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400">Core Concepts:</span>
              {sample.skills.map((s) => (
                <span key={s} className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {sample ? (
          <div className="space-y-8">
            {/* AI Master Prompt */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Exact AI Master Prompt (Copy &amp; Paste)</span>
                </div>
                <button
                  onClick={handleCopyPrompt}
                  className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Copied Prompt!' : 'Copy Prompt'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm font-mono text-slate-300 leading-relaxed select-all whitespace-pre-wrap">
                {sample.aiPrompt}
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                Paste this prompt directly into ChatGPT, Claude, or Gemini to recreate this project or customize it.
              </p>
            </div>

            {/* Architecture & How It Works */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>How It Works</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sample.howItWorks}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>File Structure</span>
                </h3>
                <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {sample.fileStructure}
                </p>
              </div>
            </div>

            {/* Source Code */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>{sample.fileStructure}</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-6 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
                <code>{sample.code}</code>
              </pre>
            </div>

            {/* Customization & Upgrades */}
            {sample.customizationIdeas && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Customization Ideas to Try:
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {sample.customizationIdeas.map((idea, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          /* Locked Project Notice */
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Full Source Code &amp; Prompts in Ebook
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              This project is part of the complete 100-project curriculum. Unlock the exact prompt, step-by-step tutorial, and source code by purchasing the ebook for only {currencySymbol}{price}.
            </p>
            <div className="pt-2">
              <button
                onClick={onBuyClick}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Unlock All 100 Projects ({currencySymbol}{price})
              </button>
            </div>
          </div>
        )}

        {/* Next / Previous Project Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-200 mt-8 text-xs font-semibold">
          {projectId > 1 ? (
            <Link
              to={`/sample/${projectId - 1}`}
              className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Project #{projectId - 1}</span>
            </Link>
          ) : <div />}

          {projectId < 100 && (
            <Link
              to={`/sample/${projectId + 1}`}
              className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5"
            >
              <span>Project #{projectId + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};
