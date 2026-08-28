import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CARD_COLORS, TEXT_COLORS, BADGE_COLORS } from '../../utils/colors';
import { ArrowLeft, Book } from 'lucide-react';

export function ClassDetails() {
  const { className } = useParams<{ className: string }>();
  
  const materialTypes = [
    'All Materials', 'Chapter', 'Study Notes', 'Chapter Notes', 'Question Papers', 
    'Previous Year Papers', 'Model Papers', 'Practice Papers', 
    'Mock Tests', 'Worksheets', 'Answer Keys', 'Solutions', 'Syllabus'
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span> 
            Study Materials for {className}
          </h1>
          <p className="mt-2 text-sm text-slate-600 ml-3.5">
            Select a material type to view all relevant documents and files.
          </p>
        </div>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {materialTypes.map((type, idx) => (
              <Link
                key={type}
                to={`/materials?classLevel=${encodeURIComponent(className || '')}&materialType=${encodeURIComponent(type === 'All Materials' ? 'All' : type)}`}
                className={`relative overflow-hidden rounded-sm p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-start justify-center min-h-[140px] group ${CARD_COLORS[idx % CARD_COLORS.length]}`}
              >
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-300">
                  <Book className="w-24 h-24 text-white" strokeWidth={1.5} />
                </div>
                <div className="relative z-10 font-bold text-xl mb-3 text-white">{type}</div>
                <div className="relative z-10 text-white/90 text-[11px] font-bold uppercase tracking-wider">
                  View Files
                </div>
              </Link>
            ))}
          </div>
      </div>
    </div>
  );
}
