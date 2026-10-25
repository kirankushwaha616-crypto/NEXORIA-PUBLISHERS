import React, { useState } from 'react';
import { Copy, Check, Sparkles, Terminal, FileCode, ArrowRight } from 'lucide-react';
import { EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';
import { Link } from '../context/RouterContext.tsx';

interface CheatSheetPageProps {
  onBuyClick: () => void;
  price?: number;
  currencySymbol?: string;
}

export const CheatSheetPage: React.FC<CheatSheetPageProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const formulas = [
    {
      title: '1. The 5-Part Master Prompt Formula',
      desc: 'Use this structure whenever asking ChatGPT, Claude, or Gemini to write production code:',
      prompt: `[ROLE]: You are an expert senior frontend engineer specializing in clean, modern vanilla JavaScript and accessible HTML5.
[GOAL]: Build a single-file interactive tip and bill split calculator.
[STACK]: HTML5, modern vanilla JavaScript, responsive Tailwind CSS classes.
[CONSTRAINTS]:
- Single file with internal CSS and JS
- Zero external dependencies or npm packages
- Mobile responsive and keyboard navigable
- Handle edge cases: 0 or negative bill values
[OUTPUT]: Return ONLY the complete, copy-pasteable HTML file.`
    },
    {
      title: '2. The "Explain My Bug" Debugging Prompt',
      desc: 'When code throws an error or behaves unexpectedly, use this diagnostic framework:',
      prompt: `Here is my code:
\`\`\`javascript
// [paste your code here]
\`\`\`
It is currently giving this behavior/error: "[describe what went wrong]".
Please:
1. Explain in 2 sentences why the bug happens
2. Provide the corrected code snippet
3. Share 1 preventative rule so I never make this mistake again`
    },
    {
      title: '3. The Step-by-Step Refactor Prompt',
      desc: 'Transform working beginner code into modular, senior-grade architecture:',
      prompt: `Review the working code below:
\`\`\`javascript
// [paste code]
\`\`\`
Refactor it to:
1. Extract helper functions for readability
2. Use modern ES6+ syntax (destructuring, arrow functions, template literals)
3. Add defensive input validation
4. Keep comments explaining the architectural decisions`
    }
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">AI Prompt Cheat Sheet</span>
        </div>

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Exclusive Developer Cheat Sheet
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-4 mb-3">
            AI Prompt Engineering Cheat Sheet
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            The exact prompt formulas that force AI to write clean, bug-free, production-grade code on the very first try.
          </p>
        </div>

        {/* Formulas list */}
        <div className="space-y-8 mb-16">
          {formulas.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {item.desc}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(item.prompt, idx)}
                  className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIdx === idx ? 'Copied Prompt!' : 'Copy Formula'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 text-xs sm:text-sm font-mono text-slate-300 leading-relaxed select-all whitespace-pre-wrap">
                {item.prompt}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Want all 100 project master prompts?
            </h3>
            <p className="text-xs text-slate-600">
              The full ebook includes the exact tailored prompt for every single one of the 100 projects.
            </p>
          </div>
          <button
            onClick={onBuyClick}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Get Complete Ebook ({currencySymbol}{price})
          </button>
        </div>

      </div>
    </div>
  );
};
