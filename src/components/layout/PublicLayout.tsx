import React from "react";
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, Search, UserCircle } from 'lucide-react';
import { useState } from 'react';

export function PublicLayout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/materials?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 antialiased overflow-x-hidden">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Edu<span className="text-blue-600">Portal</span></span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/classes" className="hover:text-blue-600 transition-colors">Classes</Link>
          <Link to="/olympiad" className="hover:text-blue-600 transition-colors">Olympiad</Link>
          <Link to="/materials" className="hover:text-blue-600 transition-colors">Study Materials</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search materials..."
              className="pl-9 pr-4 py-1.5 rounded-full border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 lg:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </form>
          <Link to="/admin" className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-4 py-2 border border-slate-200 rounded-md transition-all">
            Admin Login
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 absolute top-16 left-0 right-0 shadow-md">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600">Home</Link>
            <Link to="/classes" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600">Classes</Link>
            <Link to="/olympiad" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600">Olympiad</Link>
            <Link to="/materials" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600">Study Materials</Link>
            <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="px-3 py-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </form>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600">Admin Login</Link>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="h-16 md:h-10 bg-white border-t border-slate-200 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 text-[11px] text-slate-500 shrink-0 uppercase tracking-wide font-semibold mt-auto py-2 md:py-0">
        <div>© 2026 EDUPORTAL. ALL RIGHTS RESERVED.</div>
        <div className="flex items-center gap-6 mt-2 md:mt-0">
          <Link to="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
          <Link to="#" className="hover:text-blue-600 transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
