import React, { useState, useEffect, useRef } from 'react';
import { collection, query, getDocs, deleteDoc, doc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Video } from '../../types';
import { Trash2, Plus, Play, ExternalLink, Video as VideoIcon, UploadCloud, X } from 'lucide-react';

export function VideosManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    categoryType: 'Class' as Video['categoryType'],
    classOrExam: '',
    subject: '',
    chapter: '',
    title: '',
    description: '',
    videoUrl: '' // Either YouTube or Storage URL
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchVideos = async () => {
    try {
      const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteDoc(doc(db, 'videos', id));
        setVideos(videos.filter(v => v.id !== id));
      } catch (error) {
        console.error("Error deleting video:", error);
        alert('Failed to delete video');
      }
    }
  };

  const getClassOrExamOptions = () => {
    if (formData.categoryType === 'Class') {
      return Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);
    } else if (formData.categoryType === 'Competitive Exam') {
      return ['TET', 'SSC CGL', 'SSC CHSL', 'UPSC', 'Banking', 'Railway', 'Other'];
    } else {
      return Array.from({ length: 10 }, (_, i) => `Olympiad Class ${i + 1}`);
    }
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Video['categoryType'];
    setFormData({ ...formData, categoryType: val, classOrExam: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
      } else {
        alert('Please select a valid video file (MP4, WebM, MOV)');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryType || !formData.classOrExam || !formData.subject || !formData.chapter || !formData.title) {
      setErrorMsg('Please fill in all required fields');
      return;
    }
    if (!videoFile && !formData.videoUrl) {
      setErrorMsg('Please either provide a video URL or upload a video file');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    let finalVideoUrl = formData.videoUrl;

    try {
      if (videoFile) {
        const storageRef = ref(storage, `videos/${Date.now()}_${videoFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            }, 
            (error) => reject(error), 
            async () => {
              finalVideoUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const newVideo = {
        categoryType: formData.categoryType,
        classOrExam: formData.classOrExam,
        subject: formData.subject,
        chapter: formData.chapter,
        title: formData.title,
        description: formData.description,
        videoUrl: finalVideoUrl,
        status: 'published',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'videos'), newVideo);
      
      // Reset form
      setFormData({ categoryType: 'Class', classOrExam: '', subject: '', chapter: '', title: '', description: '', videoUrl: '' });
      setVideoFile(null);
      setUploadProgress(0);
      setIsFormOpen(false);
      fetchVideos();
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error("Error adding video:", error);
      setErrorMsg('Failed to add video. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Videos</h1>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
        >
          {isFormOpen ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Upload Video</>}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-slate-200">
          <h2 className="text-lg font-bold mb-4 text-slate-800">Upload New Video</h2>
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category Type *</label>
              <select
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.categoryType}
                onChange={handleCategoryChange}
              >
                <option value="Class">Class</option>
                <option value="Competitive Exam">Competitive Exam</option>
                <option value="Olympiad Exam">Olympiad Exam</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Class / Exam *</label>
              <select
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.classOrExam}
                onChange={e => setFormData({ ...formData, classOrExam: e.target.value })}
              >
                <option value="">Select...</option>
                {getClassOrExamOptions().map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
              <select
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="">Select Subject</option>
                {['Mathematics', 'Science', 'English', 'Social Science', 'Physics', 'Chemistry', 'Biology', 'General Knowledge', 'Reasoning', 'Quantitative Aptitude', 'General Awareness', 'Other'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chapter Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Fractions"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.chapter}
                onChange={e => setFormData({ ...formData, chapter: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Video Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Introduction to Fractions - Part 1"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Video File or URL *</label>
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
              <div className="flex flex-col items-center justify-center">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-600 mb-2">Upload a video file (MP4, WebM, MOV)</p>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                
                {videoFile && (
                  <div className="mt-4 w-full flex items-center justify-between bg-white p-3 rounded-md border border-slate-200">
                    <div className="flex items-center">
                      <VideoIcon className="w-5 h-5 text-red-500 mr-2" />
                      <div className="text-sm">
                        <p className="font-medium text-slate-700 truncate max-w-xs">{videoFile.name}</p>
                        <p className="text-slate-500 text-xs">{formatFileSize(videoFile.size)}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setVideoFile(null)} className="text-slate-400 hover:text-red-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-slate-300"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OR</span>
                <div className="flex-grow border-t border-slate-300"></div>
              </div>

              <div>
                <input
                  type="url"
                  placeholder="Paste YouTube or External Video URL"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  disabled={!!videoFile}
                />
              </div>
            </div>
          </div>

          {saving && videoFile && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700 font-medium">Uploading Video...</span>
                <span className="text-slate-700 font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50 font-medium"
          >
            {saving ? 'Processing...' : 'Submit / Upload Video'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Subject & Chapter</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map(video => (
              <tr key={video.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-10 bg-slate-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {video.videoUrl?.includes('youtube.com') || video.videoUrl?.includes('youtu.be') ? (
                         <img 
                          src={`https://img.youtube.com/vi/${extractYoutubeId(video.videoUrl || '')}/default.jpg`} 
                          alt="thumb" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Play className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">{video.title}</p>
                      <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 hover:underline inline-flex items-center mt-1">
                        View Video <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <p className="font-medium text-slate-800">{video.categoryType}</p>
                    <p className="text-xs text-slate-500">{video.classOrExam}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <p className="font-medium text-slate-800">{video.subject}</p>
                    <p className="text-xs text-slate-500">{video.chapter}</p>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {new Date(video.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => video.id && handleDelete(video.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {videos.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No videos uploaded yet. Click "Upload Video" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  function extractYoutubeId(url: string) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
}
