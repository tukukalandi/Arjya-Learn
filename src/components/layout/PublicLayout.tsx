import React, { useState, useEffect, useRef } from "react";
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, Search, UserCircle, Calendar, Clock, Globe, Moon, Sun, ChevronDown } from 'lucide-react';

import { Footer } from './Footer';

export function PublicLayout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('English');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.lang-dropdown-container')) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'HI', name: 'Hindi' },
    { code: 'OD', name: 'Odia' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/materials?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden transition-colors duration-200">
      {/* Top Utility Bar */}
      <div className="bg-[#5c1619] dark:bg-[#4a1014] border-b border-[#4a1014] dark:border-[#2d0a0c] px-4 sm:px-8 py-2.5 flex justify-between items-center text-[11px] sm:text-[12px] font-bold text-white/90 uppercase tracking-wider shrink-0 relative z-50 hidden sm:flex shadow-inner">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-white/80" /> {formattedDate}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-white/80" /> {formattedTime}</span>
        </div>
        <div className="flex items-center gap-5">
           <div className="relative lang-dropdown-container">
             <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none">
               <Globe className="w-4 h-4 text-white/80"/> {language} <ChevronDown className="w-3.5 h-3.5" />
             </button>
             {isLangMenuOpen && (
               <div className="absolute right-0 top-full mt-3 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-md py-1 text-slate-700 dark:text-slate-300">
                 {languages.map((lang) => (
                   <button
                     key={lang.code}
                     onClick={() => { setLanguage(lang.name); setIsLangMenuOpen(false); }}
                     className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-red-600 transition-colors"
                   >
                     {lang.name}
                   </button>
                 ))}
               </div>
             )}
           </div>
           <button onClick={toggleTheme} className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none">
             {theme === 'light' ? <Moon className="w-4 h-4 text-white/80"/> : <Sun className="w-4 h-4 text-white/80"/>} Theme
           </button>
        </div>
      </div>
      {/* Mobile Top Utility Bar */}
      <div className="bg-[#5c1619] dark:bg-[#4a1014] border-b border-[#4a1014] dark:border-[#2d0a0c] px-4 py-2 flex justify-between items-center text-[10px] font-bold text-white/90 uppercase tracking-wider shrink-0 relative z-50 sm:hidden shadow-inner">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-white/80" /> {formattedTime}</span>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative lang-dropdown-container">
             <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none">
               <Globe className="w-3.5 h-3.5 text-white/80"/> {languages.find(l => l.name === language)?.code}
             </button>
             {isLangMenuOpen && (
               <div className="absolute right-0 top-full mt-2 w-28 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-md py-1 text-slate-700 dark:text-slate-300">
                 {languages.map((lang) => (
                   <button
                     key={lang.code}
                     onClick={() => { setLanguage(lang.name); setIsLangMenuOpen(false); }}
                     className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-red-600 transition-colors"
                   >
                     {lang.name}
                   </button>
                 ))}
               </div>
             )}
           </div>
           <button onClick={toggleTheme} className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none">
             {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-white/80"/> : <Sun className="w-3.5 h-3.5 text-white/80"/>}
           </button>
        </div>
      </div>
      
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-sm sticky top-0 z-40 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Edu<span className="text-red-600 dark:text-red-500">Portal</span></span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
          <Link to="/classes" className="hover:text-red-600 transition-colors">Classes</Link>
          <Link to="/olympiad" className="hover:text-red-600 transition-colors">Olympiad</Link>
          <Link to="/materials" className="hover:text-red-600 transition-colors">Study Materials</Link>
          <Link to="/video-corner" className="hover:text-red-600 transition-colors">Video Corner</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search materials..."
              className="pl-9 pr-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-48 lg:w-64 dark:placeholder-slate-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </form>
          <Link to="/admin" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md transition-all">
            Admin Login
          </Link>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 absolute top-16 left-0 right-0 shadow-md">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-500">Home</Link>
            <Link to="/classes" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-500">Classes</Link>
            <Link to="/olympiad" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-500">Olympiad</Link>
            <Link to="/materials" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-500">Study Materials</Link>
            <Link to="/video-corner" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-500">Video Corner</Link>
            <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="px-3 py-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </form>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-500">Admin Login</Link>
          </div>
        )}
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
