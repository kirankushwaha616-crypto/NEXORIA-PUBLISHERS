import React from 'react';
import { Terminal, Lightbulb, Heart } from 'lucide-react';
import { EBOOK_META } from '../config/ebookConfig.ts';

export const CheatSheetSection: React.FC = () => {
  const steps = [
    {
      step: '1',
      title: 'Describe the goal',
      quote: `'I want a webpage where the user types a temperature in Celsius and the page shows one of five mood messages based on the temperature range.'`
    },
    {
      step: '2',
      title: 'Describe the constraints up-front',
      quote: `'Vanilla HTML, CSS and JavaScript only. One file. No external libraries. Mobile-friendly.'`
    },
    {
      step: '3',
      title: 'Describe the UI in detail',
      quote: `'A large input box, a primary button labelled Tell me the mood, and a result text below it. Use a calm colour palette — light blue background, dark grey text.'`
    },
    {
      step: '4',
      title: 'Describe what should go wrong',
      quote: `'If the input is empty, show Please enter a temperature. If it is not a number, show That does not look like a temperature.'`
    },
    {
      step: '5',
      title: 'Share what you tried',
      quote: `'I tried writing the code myself but my code returns NaN when the input is empty. Here is the snippet I am running. What am I missing?'`
    },
    {
      step: '6',
      title: 'Ask the AI to explain, not just fix',
      quote: `'Explain line 7 of this snippet as if I am a complete beginner. I do not understand the localStorage part.'`
    },
    {
      step: '7',
      title: 'Iterate',
      quote: `'Make the message colour match the temperature range. Use blue for cold, grey for mild, orange for hot. Oh, and use Celsius only — do not bother with Fahrenheit.'`
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Framework from Page 234
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-3 tracking-tight">
            The AI Coding Cheat Sheet
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            How to talk to an AI coding assistant so it acts as an amplifier rather than generating confusing answers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 text-left">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-50/90 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-6 rounded-md bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  {s.step}
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {s.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-700 bg-white p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                {s.quote}
              </p>
            </div>
          ))}
        </div>

        {/* Author Note Quote from Page 235 */}
        <div className="mt-16 p-8 bg-gradient-to-r from-indigo-50/50 via-slate-50 to-indigo-50/50 border border-indigo-100 rounded-3xl max-w-2xl mx-auto text-center">
          <Heart className="w-6 h-6 text-indigo-600 mx-auto mb-3" />
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic mb-4">
            "I wrote this book because I believe the best way to learn anything today is to build, and the best way to build is to start small. Every project in this book is something a complete beginner can finish in an afternoon."
          </p>
          <p className="text-sm font-extrabold text-indigo-900 tracking-wide uppercase">
            {EBOOK_META.authorNote}
          </p>
        </div>

      </div>
    </section>
  );
};
