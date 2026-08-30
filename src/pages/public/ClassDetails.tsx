import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CARD_COLORS, TEXT_COLORS, BADGE_COLORS } from '../../utils/colors';
import { ArrowLeft, Book } from 'lucide-react';

export function ClassDetails() {
  const { className } = useParams<{ className: string }>();
  const navigate = useNavigate();
  
  const subjects = [
    'All Subjects', 'Mathematics', 'Science', 'English', 'Hindi', 'Odia', 
    'Social Science', 'Computer', 'General Knowledge', 'Reasoning', 'Environmental Studies'
  ];

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 mb-6 transition-colors uppercase tracking-wide">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </button>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-600 rounded-full"></span> 
            Study Materials for {className}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 ml-3.5">
            Select a subject to view available materials.
          </p>
        </div>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subjects.map((subject, idx) => (
              <Link
                key={subject}
                to={subject === 'All Subjects' 
                  ? `/materials?classLevel=${encodeURIComponent(className || '')}`
                  : `/class/${encodeURIComponent(className || '')}/${encodeURIComponent(subject)}`
                }
                className={`relative overflow-hidden rounded-sm p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-start justify-center min-h-[140px] group ${CARD_COLORS[idx % CARD_COLORS.length]}`}
              >
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-300">
                  <Book className="w-24 h-24 text-white" strokeWidth={1.5} />
                </div>
                <div className="relative z-10 font-bold text-xl mb-3 text-white">{subject}</div>
                <div className="relative z-10 text-white text-[11px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded w-full text-center hover:bg-white/30 transition-colors mt-auto">
                  View Materials
                </div>
              </Link>
            ))}
          </div>

      </div>
    </div>
  );
}
