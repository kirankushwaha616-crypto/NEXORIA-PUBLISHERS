import React from 'react';
import { Calendar, Flame, CheckCircle2 } from 'lucide-react';
import { THIRTY_DAY_CHALLENGE } from '../data/bookData.ts';

export const ThirtyDayChallenge: React.FC = () => {
  return (
    <section id="challenge" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Daily Study Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-3 tracking-tight">
            The 30-Day Project Challenge
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            The rules are simple: spend 30–60 minutes a day, every day, building something from this book.
            You can skip days on weekends, but never two days in a row.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl mb-8 flex items-center gap-3">
            <Flame className="w-5 h-5 text-indigo-600 shrink-0" />
            <p className="text-xs sm:text-sm text-indigo-950 font-medium">
              "By day 30 you will have completed at least twenty projects. By day 100 you will have completed all 100. The challenge is not the projects — the challenge is showing up."
            </p>
          </div>

          <div className="space-y-4">
            {THIRTY_DAY_CHALLENGE.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100/70 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 tabular-nums">
                      {step.days}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {step.focus}
                    </h4>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 sm:max-w-md">
                  {step.goal}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
