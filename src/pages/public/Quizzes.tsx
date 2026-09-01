import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Quiz } from '../../types';
import { HelpCircle, ArrowRight, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CARD_COLORS } from '../../utils/colors';

export function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setQuizzes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const classes = useMemo(() => Array.from(new Set(quizzes.map(q => q.classLevel))).sort(), [quizzes]);
  const subjects = useMemo(() => Array.from(new Set(quizzes.map(q => q.subject))).sort(), [quizzes]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.topic.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            quiz.chapter.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass ? quiz.classLevel === selectedClass : true;
      const matchesSubject = selectedSubject ? quiz.subject === selectedSubject : true;
      return matchesSearch && matchesClass && matchesSubject;
    });
  }, [quizzes, searchQuery, selectedClass, selectedSubject]);

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <HelpCircle className="text-red-600 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">All Quizzes</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Test your knowledge with our interactive quizzes.</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by topic or chapter..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white transition-colors"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none text-slate-900 dark:text-white transition-colors"
              >
                <option value="">All Classes</option>
                {classes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="relative flex-1 md:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none text-slate-900 dark:text-white transition-colors"
              >
                <option value="">All Subjects</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No quizzes found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or filters to find what you're looking for!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredQuizzes.map((quiz, idx) => (
              <Link
                key={quiz.id}
                to={`/quiz/${quiz.id}`}
                className={`relative overflow-hidden rounded-sm p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-start justify-center min-h-[160px] group ${CARD_COLORS[idx % CARD_COLORS.length]}`}
              >
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-300">
                  <HelpCircle className="w-24 h-24 text-white" strokeWidth={1.5} />
                </div>
                <div className="relative z-10 font-bold text-xl mb-1 text-white line-clamp-2">{quiz.topic}</div>
                <div className="relative z-10 text-white/90 text-[11px] font-bold uppercase tracking-wider mb-2">
                  {quiz.chapter}
                </div>
                <div className="relative z-10 text-white/80 text-[10px] font-bold uppercase tracking-wider mb-4">
                  {quiz.classLevel} - {quiz.subject}
                </div>
                <div className="relative z-10 text-white font-semibold text-xs mt-auto inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Attempt Quiz <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
