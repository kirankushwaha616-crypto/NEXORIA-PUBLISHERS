import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code, Sparkles, BookOpen, Flag } from 'lucide-react';
import { SAMPLE_PROJECTS } from '../data/bookData.ts';

interface SamplePreviewModalProps {
  projectId: number | null;
  onClose: () => void;
  onBuyClick: () => void;
}

export const SamplePreviewModal: React.FC<SamplePreviewModalProps> = ({
  projectId,
  onClose,
  onBuyClick
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'code' | 'guide'>('prompt');

  if (!projectId) return null;

  const project = SAMPLE_PROJECTS.find(p => p.id === projectId) || SAMPLE_PROJECTS[0];

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(project.aiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-0.5">
              <span>Project #{project.id}</span>
              <span aria-hidden="true">·</span>
              <span>{project.part}</span>
              <span aria-hidden="true">·</span>
              <span>{project.difficulty}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-4 bg-white">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'prompt'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" /> AI Prompt to Paste
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" /> Project Code
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" /> How It Works &amp; Challenge
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-left">
          
          {/* Summary Banner */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              What You Will Build
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {project.whatYouWillBuild}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Skills learned:</span>
              <span>{project.skills.join(' · ')}</span>
            </div>
          </div>

          {/* TAB 1: AI Prompt */}
          {activeTab === 'prompt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Exact Prompt from Page {project.id * 2 + 10} of the Ebook:
                </span>
                <button
                  onClick={handleCopyPrompt}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Prompt
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl text-indigo-950 font-sans text-sm leading-relaxed whitespace-pre-wrap">
                {project.aiPrompt}
              </div>

              <p className="text-xs text-slate-500 italic">
                Tip: Paste this prompt into ChatGPT, Claude, or Gemini. The book explains how to specify constraints and ask for step-by-step explanations.
              </p>
            </div>
          )}

          {/* TAB 2: Code */}
          {activeTab === 'code' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-slate-600">{project.fileStructure}</span>
                <span>Vanilla HTML/CSS/JS</span>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-96">
                <code>{project.code}</code>
              </pre>
            </div>
          )}

          {/* TAB 3: Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  How It Works
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {project.howItWorks}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Customization Ideas
                </h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  {project.customizationIdeas.map((idea, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                  <Flag className="w-3.5 h-3.5 text-amber-600" />
                  Upgrade Challenge
                </div>
                <p className="text-xs text-amber-900 font-medium">
                  {project.upgradeChallenge}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Want access to all 100 complete projects &amp; runnable code?</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBuyClick();
              }}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Get Complete Ebook (₹29)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
