import React from 'react';
import { Calendar, CheckCircle2, ArrowRight, Sparkles, Trophy, Rocket, Target } from 'lucide-react';
import { EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';
import { Link } from '../context/RouterContext.tsx';

interface ChallengePageProps {
  onBuyClick: () => void;
  price?: number;
  currencySymbol?: string;
}

export const ChallengePage: React.FC<ChallengePageProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const weeks = [
    {
      week: 'Week 1',
      title: 'Fast Wins & Foundations',
      days: 'Days 1 to 7',
      focus: 'Build momentum with simple, instant browser apps. No frameworks, just immediate feedback.',
      milestones: [
        'Day 1: Hello Name Greeter & Age in Days',
        'Day 2: Solstice & Countdown Timers',
        'Day 3: Compliment & Quote Generators with CSS transitions',
        'Day 4: Temperature & Weather Mood Translators',
        'Day 5: Palindrome Checker & Word Sorter',
        'Day 6: Tip Calculator with split calculations',
        'Day 7: Dice & Coin Flip Simulators with SVG graphics'
      ]
    },
    {
      week: 'Week 2',
      title: 'Real Web Interactivity',
      days: 'Days 8 to 14',
      focus: 'Master DOM manipulation, responsive layouts, localStorage persistence, and modern components.',
      milestones: [
        'Day 8: Semantic Personal Portfolio with responsive grid',
        'Day 9: Notes Saver with persistent browser localStorage',
        'Day 10: Two-pane split Markdown Previewer with regex parser',
        'Day 11: Real-time Day Progress & Animated Clocks',
        'Day 12: Draggable Sticky Notes Board with coordinate sync',
        'Day 13: Accessible Tabbed & Accordion interfaces',
        'Day 14: Three-Column Drag-and-Drop Kanban Task Board'
      ]
    },
    {
      week: 'Week 3',
      title: 'Chrome Extensions & Games',
      days: 'Days 15 to 21',
      focus: 'Extend into browser extensions with Manifest V3 and interactive 2D HTML5 canvas games.',
      milestones: [
        'Day 15: Word Highlighter & Page Reader Chrome Extension',
        'Day 16: YouTube Floating Notes Overlay Extension',
        'Day 17: Tab Session Saver & One-Click Cleanup Extension',
        'Day 18: Retro Snake Game with custom high-score board',
        'Day 19: Pong & Brick Breaker with physics engine',
        'Day 20: 2D Particle Fireworks Generator with mouse gravity',
        'Day 21: Real-time Whiteboard Canvas with color & brush picker'
      ]
    },
    {
      week: 'Week 4',
      title: 'Full-Stack & Capstone Apps',
      days: 'Days 22 to 30',
      focus: 'Graduate to full-stack Node.js utilities, REST APIs, WebSockets, and production-ready tools.',
      milestones: [
        'Day 22: RESTful Express API with JSON persistence',
        'Day 23: Markdown to HTML static site generator CLI tool',
        'Day 24: Real-time Multi-Room Chat Room with WebSockets',
        'Day 25: Currency Converter with live API caching',
        'Day 26: Flashcard Quiz Studio with Leitner spaced repetition',
        'Day 27: Pomodoro Productivity Suite with ambient audio',
        'Day 28: Interactive CSS Gradient & Palette Studio',
        'Day 29: AI Prompt Library Manager with one-click copy',
        'Day 30: Capstone Project: Personal SaaS Utility Dashboard'
      ]
    }
  ];

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">30-Day Project Challenge</span>
        </div>

        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Target className="w-3.5 h-3.5" />
            <span>Structured Learning Roadmap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            The 30-Day AI Builder Challenge
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Stop endlessly watching video tutorials. Build 1 to 3 real mini-projects every day with AI guidance, commit them to GitHub, and finish the month with a standout portfolio.
          </p>
        </div>

        {/* Challenge Weeks Grid */}
        <div className="space-y-8 mb-16">
          {weeks.map((w, idx) => (
            <div
              key={w.week}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                      {w.week} &bull; {w.days}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {w.title}
                  </h3>
                </div>
                <span className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-semibold shrink-0">
                  {w.days}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <strong className="text-slate-900">Weekly Focus:</strong> {w.focus}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {w.milestones.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50 transition-all text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-800">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Graduation Trophy Box */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center">
            <Trophy className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold">What You Have at Day 30</h2>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto leading-relaxed">
            30+ working web apps deployed on GitHub Pages, 3 Chrome extensions installed in your browser, 5 full-stack backends, and a deep mental model of how to build software with AI.
          </p>
          <div className="pt-2">
            <button
              onClick={onBuyClick}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Start Day 1 Today ({currencySymbol}{price})
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
