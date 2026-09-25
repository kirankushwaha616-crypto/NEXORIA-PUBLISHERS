import React from 'react';
import { SKILLS_GAINED } from '../data/bookData.ts';
import { Award, CheckCircle } from 'lucide-react';

export const BookBenefits: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Transferable Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-3 tracking-tight">
            Skills You Build By Doing
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            By the time you finish project 100, you will have personally built and run 100 small programs.
            Beyond that stack of code, you will build real, practical habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS_GAINED.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-start text-left"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-7">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer Card as supported in the PDF Page 3 */}
        <div className="mt-12 p-5 bg-slate-100/70 border border-slate-200/80 rounded-2xl max-w-3xl mx-auto text-left flex items-start gap-4">
          <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 shrink-0 mt-0.5">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Source Of Truth Note
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No part of this book promises income or employment outcomes. The true value of the book is in the practice, the hands-on building, and the confidence you gain by shipping real projects yourself.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
