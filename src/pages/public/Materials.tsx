import React from "react";
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { StudyMaterial } from '../../types';
import { FileText, Filter, Book, Search, Download, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { CARD_COLORS, BUTTON_COLORS, TEXT_COLORS, BADGE_COLORS } from '../../utils/colors';
import { getSubjectsForClass } from '../../utils/subjects';

export function Materials() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state derived from URL
  const searchQuery = searchParams.get('search') || '';
  const classFilter = searchParams.get('classLevel') || 'All';
  const subjectFilter = searchParams.get('subject') || 'All';
  const examFilter = searchParams.get('examType') || 'All';
  const typeFilter = searchParams.get('materialType') || 'All';

  // Local state for search input to allow typing before submit
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync local search when URL changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const classes = ['All', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  const subjects = ['All', ...getSubjectsForClass(classFilter === 'All' ? '' : classFilter)];
  const examTypes = ['All', 'School Examination', 'Olympiad', 'Competitive', 'Other'];
  const materialTypes = ['All', 'NCERT Book', 'Study Notes', 'Chapter Notes', 'Question Papers', 'Previous Year Papers', 'Model Papers', 'Practice Papers', 'Mock Tests', 'Worksheets', 'Answer Keys', 'Solutions', 'Syllabus'];

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'studyMaterials'),
          where('isPublished', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyMaterial));
        setMaterials(data);
      } catch (error) {
        console.error("Error fetching materials", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', localSearch);
  };

  // Apply filters on the client side for simplicity in this demo, 
  // in production with large datasets we'd use composite index queries.
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchSearch = !searchQuery || 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchClass = classFilter === 'All' || m.classLevel?.trim().toLowerCase() === classFilter.trim().toLowerCase();
      const matchSubject = subjectFilter === 'All' || m.subject?.trim().toLowerCase() === subjectFilter.trim().toLowerCase();
      const matchExam = examFilter === 'All' || m.examType?.trim().toLowerCase() === examFilter.trim().toLowerCase();
      const matchType = typeFilter === 'All' || m.materialType?.trim().toLowerCase() === typeFilter.trim().toLowerCase() || (typeFilter === 'NCERT Book' && (m.materialType === 'Chapter' || m.materialType === 'NCERT Book'));

      return matchSearch && matchClass && matchSubject && matchExam && matchType;
    });
  }, [materials, searchQuery, classFilter, subjectFilter, examFilter, typeFilter]);

  const clearFilters = () => {
    setLocalSearch('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-950 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 transition-colors uppercase tracking-wide">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </button>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Filters */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100 mb-5 text-sm uppercase tracking-wider">
            <Filter className="w-4 h-4 text-red-600" /> Filters
          </div>

          <form onSubmit={handleSearchSubmit} className="mb-5 relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Class</label>
              <select value={classFilter} onChange={(e) => updateFilter('classLevel', e.target.value)} className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-slate-900">
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
              <select value={subjectFilter} onChange={(e) => updateFilter('subject', e.target.value)} className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-slate-900">
                {subjects.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Examination</label>
              <select value={examFilter} onChange={(e) => updateFilter('examType', e.target.value)} className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-slate-900">
                {examTypes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Material Type</label>
              <select value={typeFilter} onChange={(e) => updateFilter('materialType', e.target.value)} className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-slate-900">
                {materialTypes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={clearFilters}
            className="w-full mt-6 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded transition-colors uppercase tracking-wide"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-600 rounded-full"></span> 
            Study Materials
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 ml-3.5">Showing {filteredMaterials.length} results</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No materials found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 mb-6">We couldn't find any study materials matching your current filters.</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-2 bg-slate-50 text-red-600 text-xs font-bold rounded hover:bg-red-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredMaterials.map((material, idx) => (
              <div key={material.id} className={`relative overflow-hidden rounded-sm p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-all group ${CARD_COLORS[idx % CARD_COLORS.length]}`}>
                <div className="flex flex-wrap gap-2 mb-3 relative z-10">
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${BADGE_COLORS[idx % BADGE_COLORS.length]}`}>
                    {material.classLevel}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${BADGE_COLORS[idx % BADGE_COLORS.length]}`}>
                    {material.subject}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-1 line-clamp-2 text-white relative z-10">{material.title}</h3>
                <p className="text-white/80 text-xs mb-5 line-clamp-2 flex-grow relative z-10">{material.description}</p>
                
                <div className="flex items-center justify-between text-[11px] font-bold text-white/70 mb-4 uppercase tracking-wide relative z-10">
                  <span className="flex items-center"><Book className="w-3.5 h-3.5 mr-1" /> {material.materialType === 'Chapter' ? 'NCERT Book' : material.materialType}</span>
                  <span>{format(new Date(material.createdAt), 'MMM yyyy')}</span>
                </div>

                <Link
                  to={`/material/${material.id}`}
                  className={`mt-auto flex items-center justify-center w-full text-xs font-bold py-2 rounded transition-colors relative z-10 ${BUTTON_COLORS[idx % BUTTON_COLORS.length]}`}
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
