import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { StudyMaterial } from '../../types';
import { FileText, Download, Tag, Calendar, Globe, Book, ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export function MaterialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'studyMaterials', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().isPublished) {
          setMaterial({ id: docSnap.id, ...docSnap.data() } as StudyMaterial);
          
          // Increment view count
          await updateDoc(docRef, {
            viewCount: increment(1)
          });
        } else {
          setError('Material not found or is unavailable.');
        }
      } catch (err) {
        setError('Failed to fetch material details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  const handleDownloadClick = async () => {
    if (!id || !material) return;
    try {
      const docRef = doc(db, 'studyMaterials', id);
      await updateDoc(docRef, {
        downloadCount: increment(1)
      });
    } catch (err) {
      console.error('Failed to increment download count', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center max-w-md">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">{error}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">The study material you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigate(-1)} className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 mb-6 transition-colors uppercase tracking-wide">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </button>
        
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-8 sm:p-10 border-b border-slate-100 bg-gradient-to-r from-red-700 to-red-900 text-white">
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-2 py-0.5 bg-white dark:bg-slate-900/20 text-white text-[10px] font-bold rounded uppercase tracking-wide">
                {material.classLevel}
              </span>
              <span className="px-2 py-0.5 bg-red-500/40 text-red-100 text-[10px] font-bold rounded uppercase tracking-wide">
                {material.subject}
              </span>
              {material.examType !== 'Other' && (
                <span className="px-2 py-0.5 bg-yellow-500/40 text-yellow-100 text-[10px] font-bold rounded uppercase tracking-wide">
                  {material.examType}
                </span>
              )}
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">{material.title}</h1>
            <p className="text-red-100 text-sm leading-relaxed max-w-3xl">{material.description}</p>
          </div>
          
          <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
                  Material Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Type</span>
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center"><Book className="w-4 h-4 mr-1.5 text-red-600" /> {material.materialType === 'Question Paper' ? 'Chapter' : material.materialType}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Year</span>
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-red-600" /> {material.academicYear}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Language</span>
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center"><Globe className="w-4 h-4 mr-1.5 text-red-600" /> {material.language}</span>
                  </div>
                  {material.examName && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Name</span>
                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{material.examName}</span>
                    </div>
                  )}
                </div>
              </div>

              {material.tags && material.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                     <span className="w-1.5 h-4 bg-slate-300 rounded-full"></span> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {material.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 dark:text-slate-400 text-[11px] font-semibold rounded border border-slate-200 dark:border-slate-800 uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="md:border-l md:border-slate-100 md:pl-10 flex flex-col items-center md:items-start justify-center md:justify-start">
              <a
                href={material.googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDownloadClick}
                className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded shadow-md transition-all flex items-center justify-center gap-2 mb-3"
              >
                <Download className="w-4 h-4" />
                View / Download
              </a>
              <a
                href={material.googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-300 hover:text-red-600 hover:bg-slate-50 text-slate-600 dark:text-slate-400 text-sm font-bold rounded transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Drive
              </a>
              <div className="w-full text-center mt-6 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Added {format(new Date(material.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
