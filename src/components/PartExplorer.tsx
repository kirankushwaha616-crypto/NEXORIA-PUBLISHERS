import React, { useState } from 'react';
import { Search, ChevronRight, Check } from 'lucide-react';
import { BOOK_PARTS } from '../data/bookData.ts';

interface PartExplorerProps {
  onSelectSample: (projectId: number) => void;
}

export const PartExplorer: React.FC<PartExplorerProps> = ({ onSelectSample }) => {
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPart = BOOK_PARTS[activePartIndex];

  // If user searched, search across all 100 projects
  const isSearching = searchQuery.trim().length > 0;
  const filteredProjects = isSearching
    ? BOOK_PARTS.flatMap(p => p.projects.map(proj => ({ ...proj, partTitle: p.title, partNum: p.number })))
        .filter(proj =>
          proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proj.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(proj.id).includes(searchQuery)
        )
    : currentPart.projects.map(proj => ({ ...proj, partTitle: currentPart.title, partNum: currentPart.number }));

  // Sample projects that have full previews available
  const sampleIds = [1, 10, 42, 45, 61, 82];

  return (
    <section id="projects" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Complete Table of Contents
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-2 tracking-tight">
              Explore All 100 Projects
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Organized across five progressive parts. Click any featured project with a preview badge to see inside.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Part Tabs (Interactive segmented buttons) */}
        {!isSearching && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {BOOK_PARTS.map((part, index) => {
              const isActive = activePartIndex === index;
              return (
                <button
                  key={part.number}
                  onClick={() => setActivePartIndex(index)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                    isActive ? 'bg-slate-800 text-indigo-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {part.number}
                  </span>
                  <span>{part.title}</span>
                  <span className="text-xs opacity-60">({part.projectCount})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Part Summary Header if not searching */}
        {!isSearching && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
                <span>Part {currentPart.number}</span>
                <span aria-hidden="true">·</span>
                <span>{currentPart.range}</span>
                <span aria-hidden="true">·</span>
                <span>{currentPart.badge}</span>
              </div>
              <p className="text-sm text-slate-700 font-medium">
                {currentPart.description}
              </p>
            </div>
            <div className="text-xs text-slate-500 shrink-0 font-medium">
              20 Runnable Projects Included
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProjects.map((proj) => {
            const hasSample = sampleIds.includes(proj.id);
            return (
              <div
                key={proj.id}
                onClick={() => hasSample && onSelectSample(proj.id)}
                className={`p-4 bg-white rounded-xl border transition-all text-left flex flex-col justify-between ${
                  hasSample
                    ? 'border-indigo-300 ring-1 ring-indigo-500/10 hover:shadow-md hover:border-indigo-500 cursor-pointer bg-gradient-to-b from-indigo-50/30 to-white'
                    : 'border-slate-200/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 tabular-nums">
                      #{proj.id}
                    </span>
                    <span className="text-xs font-medium text-amber-500">
                      {proj.difficulty}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-1">
                    {proj.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {proj.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  {hasSample ? (
                    <span className="text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
                      Preview Code <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal">
                      Full Code in Ebook
                    </span>
                  )}
                  {isSearching && (
                    <span className="text-[11px] text-slate-400">Part {proj.partNum}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500">No projects match "{searchQuery}". Try a different keyword.</p>
          </div>
        )}

      </div>
    </section>
  );
};
