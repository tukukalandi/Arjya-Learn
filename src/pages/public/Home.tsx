import React from "react";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Book, Trophy, FileText, ArrowRight } from 'lucide-react';
import { CARD_COLORS, BUTTON_COLORS, TEXT_COLORS, BADGE_COLORS } from '../../utils/colors';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/materials?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const materialTypes = ['Chapter', 'Study Notes', 'Chapter Notes', 'Question Papers', 'Previous Year Papers', 'Model Papers', 'Practice Papers', 'Mock Tests', 'Worksheets', 'Answer Keys', 'Solutions', 'Syllabus'];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Study Smarter. Learn Better. Succeed Together.
          </h1>
          <p className="text-blue-100 text-base mb-8 max-w-2xl mx-auto">
            Free and organized study materials for Classes 1–10 and Olympiad examinations.
          </p>
          
          <form onSubmit={handleSearch} className="flex w-full max-w-xl bg-white rounded-lg shadow-xl overflow-hidden p-1.5 mx-auto">
            <input
              type="text"
              placeholder="Search by Class, Subject, or Topic..."
              className="flex-1 px-4 text-slate-800 outline-none text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-blue-700 transition-all whitespace-nowrap hidden sm:block"
            >
              Search Materials
            </button>
            <button
              type="submit"
              className="bg-blue-600 px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700 transition-all sm:hidden"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-12 bg-[#F8FAFC] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Study Materials by Class</h2>
            <Link to="/classes" className="text-sm text-blue-600 font-semibold hover:underline flex items-center">
              View All Classes
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {classes.map((cls, idx) => (
              <Link
                key={cls}
                to={`/class/Class ${cls}`}
                className={`relative overflow-hidden rounded-sm p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-start justify-center min-h-[140px] group ${CARD_COLORS[idx % CARD_COLORS.length]}`}
              >
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-300">
                  <Book className="w-24 h-24 text-white" strokeWidth={1.5} />
                </div>
                <div className="relative z-10 font-bold text-xl mb-3 text-white">Class {cls}</div>
                <div className="relative z-10 text-white/90 text-[11px] font-bold uppercase tracking-wider">
                  View Materials
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Material Types Section */}
      <section className="py-12 bg-white px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span> 
              Study Materials by Type
            </h2>
            <Link to="/materials" className="text-sm text-blue-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {materialTypes.map((type, idx) => (
              <Link
                key={type}
                to={`/type/${encodeURIComponent(type)}`}
                className={`relative overflow-hidden rounded-sm p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-start justify-center min-h-[140px] group ${CARD_COLORS[(idx + 4) % CARD_COLORS.length]}`}
              >
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-300">
                  <FileText className="w-24 h-24 text-white" strokeWidth={1.5} />
                </div>
                <div className="relative z-10 font-bold text-xl mb-3 text-white">{type}</div>
                <div className="relative z-10 text-white/90 text-[11px] font-bold uppercase tracking-wider">
                  Explore Files
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Olympiad Highlight */}
      <section className="py-12 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span> 
              Prepare for Olympiads
            </h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-lg">
              Get access to previous year papers, mock tests, and specialized study notes for Mathematics, Science, English, and other competitive Olympiad examinations.
            </p>
            <Link
              to="/olympiad"
              className="inline-flex items-center px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-colors shadow-md"
            >
              Explore Olympiad Materials <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {['Mathematics', 'Science', 'English', 'Computer'].map((subject, idx) => (
              <div key={subject} className={`relative overflow-hidden p-6 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[100px] flex flex-col justify-center ${CARD_COLORS[(idx + 6) % CARD_COLORS.length]}`}>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-20">
                  <Trophy className="w-16 h-16 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-lg text-white relative z-10">{subject}</h3>
                <p className="text-xs text-white/80 mt-1 uppercase tracking-wider font-bold relative z-10">Olympiad Prep</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
