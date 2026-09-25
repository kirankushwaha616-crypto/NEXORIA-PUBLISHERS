import React from 'react';
import { Layers, Terminal, Code2, Compass, Calendar, FileText, Sparkles, BookOpen } from 'lucide-react';

export const WhatsInside: React.FC = () => {
  const cards = [
    {
      icon: Layers,
      title: '100 Practical Projects',
      desc: 'Spans 5 progressive parts from simple one-concept widgets to games, utilities, canvas simulations, and a portfolio capstone.'
    },
    {
      icon: Terminal,
      title: '100 Tested AI Prompts',
      desc: 'Every project begins with the exact prompt to paste into ChatGPT, Claude, or Gemini to guide you as a patient coding partner.'
    },
    {
      icon: Code2,
      title: 'Complete Runnable Code',
      desc: 'Pure vanilla HTML, CSS, and JavaScript. No build tools, bundlers, or heavy frameworks needed to run or learn from them.'
    },
    {
      icon: Compass,
      title: 'Difficulty Roadmap',
      desc: 'Clear progression rating (⭐ to ⭐⭐⭐) showing how skills unfold logically from introductory DOM to math and state machines.'
    },
    {
      icon: Calendar,
      title: '30-Day Project Challenge',
      desc: 'A simple daily plan: spend 30–60 minutes a day building something practical. Finish at least 20 projects in your first month.'
    },
    {
      icon: FileText,
      title: 'Final AI Coding Cheat Sheet',
      desc: 'A 7-point framework for describing goals, setting constraints, giving UX details, debugging errors, and iterating with AI.'
    }
  ];

  return (
    <section id="whats-inside" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Curriculum Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-3 tracking-tight">
            What's Inside the Book
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Everything is structured around building real software. You read the prompt, paste it to your AI, examine the clean code, and tweak it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="p-6 bg-slate-50/60 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {c.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
