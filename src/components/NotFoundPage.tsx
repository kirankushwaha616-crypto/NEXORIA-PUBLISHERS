import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-2xl">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The page you are looking for does not exist, has been removed, or the address is incorrect.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleGoHome}
            className="w-full py-3.5 px-5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
