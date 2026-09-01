import React, { useState, useEffect, useRef } from 'react';
import { collection, query, getDocs, deleteDoc, doc, addDoc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Quiz } from '../../types';
import { Trash2, Plus, ExternalLink, UploadCloud, X, Edit2, HelpCircle, Code } from 'lucide-react';

export function QuizManager() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    classLevel: '',
    subject: '',
    chapter: '',
    topic: '',
    htmlContent: '',
    fileName: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCode, setShowCode] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await deleteDoc(doc(db, 'quizzes', id));
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert('Error deleting quiz');
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingId(quiz.id!);
    setFormData({
      classLevel: quiz.classLevel,
      subject: quiz.subject,
      chapter: quiz.chapter,
      topic: quiz.topic,
      htmlContent: quiz.htmlContent || '',
      fileName: quiz.fileName || ''
    });
    setShowCode(true);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      classLevel: '',
      subject: '',
      chapter: '',
      topic: '',
      htmlContent: '',
      fileName: ''
    });
    setEditingId(null);
    setErrorMsg('');
    setShowCode(false);
    setIsFormOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.html')) {
        setErrorMsg('Please upload a valid HTML file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setFormData(prev => ({
            ...prev,
            htmlContent: event.target!.result as string,
            fileName: file.name
          }));
          setShowCode(true);
          setErrorMsg('');
        }
      };
      reader.onerror = () => {
        setErrorMsg('Error reading file.');
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      if (!formData.htmlContent) {
        throw new Error("Please upload an HTML file or enter HTML content.");
      }

      const quizData = {
        classLevel: formData.classLevel,
        subject: formData.subject,
        chapter: formData.chapter,
        topic: formData.topic,
        htmlContent: formData.htmlContent,
        fileName: formData.fileName || 'custom-quiz.html',
        isPublished: true,
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        await updateDoc(doc(db, 'quizzes', editingId), quizData);
      } else {
        await addDoc(collection(db, 'quizzes'), {
          ...quizData,
          createdAt: new Date().toISOString(),
        });
      }

      await fetchQuizzes();
      resetForm();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error saving quiz');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quiz Manager</h1>
          <p className="text-slate-500 text-sm">Upload and edit HTML quiz files for students.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Quiz
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Quiz' : 'Add New Quiz'}</h2>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class *</label>
                <input 
                  required type="text" placeholder="e.g. Class 10" 
                  value={formData.classLevel} onChange={e => setFormData({...formData, classLevel: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                <input 
                  required type="text" placeholder="e.g. Science"
                  value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chapter *</label>
                <input 
                  required type="text" placeholder="e.g. Atoms and Molecules"
                  value={formData.chapter} onChange={e => setFormData({...formData, chapter: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Topic *</label>
                <input 
                  required type="text" placeholder="e.g. Atomic Mass"
                  value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">HTML Content *</label>
                <button 
                  type="button" 
                  onClick={() => setShowCode(!showCode)}
                  className="text-xs text-red-600 font-medium hover:text-red-700 flex items-center gap-1"
                >
                  <Code className="w-3 h-3" />
                  {showCode ? 'Hide Code Editor' : 'Show Code Editor'}
                </button>
              </div>

              {!showCode ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50">
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                  <input 
                    type="file" 
                    accept=".html"
                    onChange={handleFileChange}
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                  {formData.fileName && (
                    <p className="mt-2 text-xs text-slate-500">Current file: {formData.fileName}</p>
                  )}
                  {formData.htmlContent && (
                    <p className="mt-1 text-xs text-green-600 font-medium">HTML Content loaded successfully.</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <textarea 
                    value={formData.htmlContent}
                    onChange={e => setFormData({...formData, htmlContent: e.target.value})}
                    placeholder="<html><body>...</body></html>"
                    className="w-full h-64 font-mono text-sm p-4 rounded-md border border-slate-300 focus:border-red-500 focus:ring-red-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Or upload a file to replace content:</span>
                    <input 
                      type="file" 
                      accept=".html"
                      onChange={handleFileChange}
                      className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="mr-3 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !formData.htmlContent}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>Saving... <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span></>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-slate-200">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No quizzes uploaded</h3>
          <p className="text-slate-500 mt-1">Get started by uploading your first HTML quiz file.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Topic / Chapter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Class & Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{quiz.topic}</div>
                    <div className="text-xs text-slate-500">{quiz.chapter}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 mr-2">
                      {quiz.classLevel}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
                      {quiz.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-500 text-xs font-medium">
                      {quiz.fileName || 'custom-quiz.html'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(quiz)} className="text-slate-400 hover:text-slate-600 mr-3">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(quiz.id!)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
