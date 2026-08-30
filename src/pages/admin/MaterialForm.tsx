import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { StudyMaterial } from '../../types';
import { Upload, X } from 'lucide-react';

export function MaterialForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tokenClientRef = useRef<any>(null);

  const [formData, setFormData] = useState<Partial<StudyMaterial>>({
    title: '',
    description: '',
    classLevel: 'Class 10',
    subject: 'Mathematics',
    examType: 'School Examination',
    examName: '',
    materialType: 'NCERT Book',
    academicYear: '2026-27',
    language: 'English',
    fileName: '',
    googleDriveUrl: '',
    googleDriveFileId: '',
    isPublished: false,
    tags: []
  });

  // Basic mock categories - in a real app these would be fetched from Firestore collections
  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Odia', 'Social Science', 'Computer', 'General Knowledge', 'Reasoning', 'Environmental Studies'];
  const materialTypes = ['NCERT Book', 'Study Notes', 'Chapter Notes', 'Question Papers', 'Previous Year Papers', 'Model Papers', 'Practice Papers', 'Mock Tests', 'Worksheets', 'Answer Keys', 'Solutions', 'Syllabus'];
  const examTypes = ['School Examination', 'Olympiad', 'Competitive', 'Other'];
  const languages = ['English', 'Hindi', 'Odia', 'Other'];

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'studyMaterials', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data() as StudyMaterial);
        } else {
          setError('Material not found');
        }
      } catch (err) {
        setError('Failed to fetch material');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  useEffect(() => {
    // Initialize Google Identity Services
    const g = (window as any).google;
    if (g?.accounts?.oauth2) {
      tokenClientRef.current = g.accounts.oauth2.initTokenClient({
        client_id: '806441051802-9m8ko9s8uu98c02u1qpbilusmstilemq.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (response: any) => {
          if (response.error !== undefined) {
            setError('Failed to authenticate with Google Drive.');
            return;
          }
          setDriveToken(response.access_token);
        },
      });
    }
  }, []);

  const requestDriveAccess = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken();
    } else {
      setError('Google Identity Services not loaded.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!driveToken) {
      setError('Please connect to Google Drive first.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setError('');

    try {
      const metadata = {
        name: file.name,
        parents: ['1IS3GnAqnkU7hxW3Q3rlAtBuHlZ7VQ7fO']
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      // Using XMLHttpRequest for upload progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true');
      xhr.setRequestHeader('Authorization', 'Bearer ' + driveToken);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.statusText || 'Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(form);
      });

      const response: any = await uploadPromise;
      
      // Update permissions so anyone with link can view
      await fetch(`https://www.googleapis.com/drive/v3/files/${response.id}/permissions`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + driveToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      });

      // Also request webViewLink if needed, but we can construct standard ones
      const fileId = response.id;
      const webViewLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

      setFormData(prev => ({
        ...prev,
        fileName: file.name,
        googleDriveFileId: fileId,
        googleDriveUrl: webViewLink
      }));
      
    } catch (err: any) {
      console.error(err);
      setError('Upload failed. Please ensure you have granted Drive permissions or try again.');
      // Token might be expired
      setDriveToken(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const extractDriveFileId = (url: string) => {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : '';
  };

  const handleDriveUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const fileId = extractDriveFileId(url);
    setFormData(prev => ({
      ...prev,
      googleDriveUrl: url,
      googleDriveFileId: fileId || prev.googleDriveFileId
    }));
  };

  const handleSubmit = async (e: React.FormEvent, isPublished: boolean) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const now = new Date().toISOString();
      const materialData = {
        ...formData,
        isPublished,
        updatedAt: now,
      };

      if (!isEditing) {
        Object.assign(materialData, {
          createdAt: now,
          uploadedBy: user?.uid,
          viewCount: 0,
          downloadCount: 0,
        });
        await addDoc(collection(db, 'studyMaterials'), materialData);
      } else {
        await updateDoc(doc(db, 'studyMaterials', id!), materialData);
      }

      navigate('/admin/materials');
    } catch (err) {
      setError('Failed to save material');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        {isEditing ? 'Edit Study Material' : 'Add Study Material'}
      </h1>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-100">
        
        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-slate-900 border-b pb-2">Basic Information</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Title <span className="text-red-500">*</span></label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Class <span className="text-red-500">*</span></label>
              <select required name="classLevel" value={formData.classLevel} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm">
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Subject <span className="text-red-500">*</span></label>
              <select required name="subject" value={formData.subject} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm">
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Material Type <span className="text-red-500">*</span></label>
              <select required name="materialType" value={formData.materialType} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm">
                {materialTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Language</label>
              <select name="language" value={formData.language} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm">
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Exam Type</label>
              <select name="examType" value={formData.examType} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm">
                {examTypes.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div>
              {formData.materialType === "NCERT Book" ? (
                <label className="block text-sm font-medium text-slate-700">Chapter No.</label>
              ) : (
                <label className="block text-sm font-medium text-slate-700">Exam Name (e.g. IMO)</label>
              )}
              <input type="text" name="examName" value={formData.examName} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
            </div>
          </div>
        </div>

        {/* File Info */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-slate-900 border-b pb-2">File Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload File to Google Drive</label>
              
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                
                {!driveToken ? (
                  <button
                    type="button"
                    onClick={requestDriveAccess}
                    className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Connect Google Drive
                  </button>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className={`inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md ${uploading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-slate-700 bg-white hover:bg-slate-50 cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Select & Upload File'}
                  </label>
                )}
                
                {uploading && (
                  <div className="flex-1 max-w-xs">
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block">{uploadProgress}% Complete</span>
                  </div>
                )}
                
                {!uploading && driveToken && !formData.googleDriveFileId && (
                  <span className="text-sm text-slate-500">Google Drive connected. Select a file.</span>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Google Drive URL <span className="text-red-500">*</span></label>
              <input required type="url" name="googleDriveUrl" value={formData.googleDriveUrl} onChange={handleDriveUrlChange} placeholder="https://drive.google.com/file/d/..." className="mt-1 block w-full rounded-md border-slate-300 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
              <p className="mt-1 text-xs text-slate-500">Auto-filled after upload, or you can paste an existing shareable link.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Google Drive File ID</label>
              <input type="text" name="googleDriveFileId" value={formData.googleDriveFileId} onChange={handleChange} placeholder="Auto-extracted if possible" className="mt-1 block w-full rounded-md border-slate-300 bg-slate-50 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Display File Name</label>
              <input type="text" name="fileName" value={formData.fileName} onChange={handleChange} placeholder="e.g. Math_Model_Paper_2026.pdf" className="mt-1 block w-full rounded-md border-slate-300 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-medium text-slate-900 border-b pb-2">Additional Details</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Tags (comma separated)</label>
              <input type="text" value={formData.tags?.join(', ') || ''} onChange={handleTagsChange} placeholder="algebra, geometry, mock test" className="mt-1 block w-full rounded-md border-slate-300 border py-2 px-3 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/materials')}
            className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}
