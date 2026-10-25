import React, { useState } from 'react';
import { Search, Sparkles, Filter, Code2, ArrowRight, BookOpen, Layers, Terminal } from 'lucide-react';
import { BOOK_PARTS, SAMPLE_PROJECTS } from '../data/bookData.ts';
import { EBOOK_PRICE, EBOOK_CURRENCY_SYMBOL } from '../config/ebookConfig.ts';
import { Link } from '../context/RouterContext.tsx';

interface ProjectsPageProps {
  onBuyClick: () => void;
  price?: number;
  currencySymbol?: string;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onBuyClick,
  price = EBOOK_PRICE,
  currencySymbol = EBOOK_CURRENCY_SYMBOL
}) => {
  const [selectedPart, setSelectedPart] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all projects with part metadata
  const allProjects = BOOK_PARTS.flatMap(part =>
    part.projects.map(p => ({
      ...p,
      partNumber: part.number,
      partTitle: part.title,
      partRange: part.range,
      hasSample: SAMPLE_PROJECTS.some(s => s.id === p.id)
    }))
  );

  const filteredProjects = allProjects.filter(p => {
    const matchesPart = selectedPart === 'ALL' || p.partNumber === selectedPart;
    if (!matchesPart) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    return (
      p.id.toString() === q ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.partTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">100 Projects Directory</span>
        </div>

        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Project Index</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            100 Practical Projects
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From single-file vanilla JavaScript utilities to full-stack WebSocket apps and Chrome extensions. Browse all 100 projects included in the book.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by name, number, or keyword..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Results Counter */}
            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900 font-bold">{filteredProjects.length}</strong> of 100 projects
            </div>
          </div>

          {/* Part Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            <button
              onClick={() => setSelectedPart('ALL')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedPart === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All 100 Projects
            </button>
            {BOOK_PARTS.map((part) => (
              <button
                key={part.number}
                onClick={() => setSelectedPart(part.number)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedPart === part.number
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Part {part.number}: {part.title}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center">
                      #{p.id}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Part {p.partNumber}
                    </span>
                  </div>
                  <span className="text-xs" title={`Difficulty: ${p.difficulty}`}>
                    {p.difficulty}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                {p.hasSample ? (
                  <Link
                    to={`/sample/${p.id}`}
                    className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>View Code & Prompt</span>
                  </Link>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    Included in Full Book
                  </span>
                )}

                <button
                  onClick={onBuyClick}
                  className="text-slate-500 hover:text-indigo-600 text-[11px] font-semibold cursor-pointer"
                >
                  Buy Ebook ({currencySymbol}{price})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-indigo-900 rounded-3xl p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Get the complete source code and prompts</h3>
            <p className="text-xs text-indigo-200">
              Download all 100 projects in PDF and standalone code files instantly upon payment.
            </p>
          </div>
          <button
            onClick={onBuyClick}
            className="px-6 py-3 bg-white text-indigo-900 font-bold text-xs rounded-xl hover:bg-indigo-50 transition-all cursor-pointer whitespace-nowrap shadow-md"
          >
            Download 100 Projects ({currencySymbol}{price})
          </button>
        </div>

      </div>
    </div>
  );
};
