import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Quiz } from '../../types';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export function QuizDetails() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'quizzes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuiz({ id: docSnap.id, ...docSnap.data() } as Quiz);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-20">
        <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Quiz Not Found</h2>
        <p className="text-slate-500 mt-2 mb-6">The quiz you are looking for does not exist.</p>
        <Link to="/quizzes" className="text-red-600 font-semibold hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Quizzes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Quiz Header */}
      <div className="bg-slate-900 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
              {quiz.classLevel} • {quiz.subject} • {quiz.chapter}
            </div>
            <h1 className="text-2xl font-bold">{quiz.topic}</h1>
          </div>
          <Link to="/quizzes" className="hidden sm:flex text-sm text-slate-300 hover:text-white items-center gap-2 font-medium bg-slate-800 px-4 py-2 rounded-md">
            <ArrowLeft className="w-4 h-4" /> Exit Quiz
          </Link>
        </div>
      </div>
      
      {/* Quiz Content Container - Renders the HTML */}
      <div className="w-full" style={{ height: 'calc(100vh - 100px)' }}>
        <iframe 
          title={quiz.topic}
          srcDoc={quiz.htmlContent}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
