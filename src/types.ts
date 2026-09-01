export interface StudyMaterial {
  id?: string;
  title: string;
  description: string;
  classLevel: string; // e.g., 'Class 5'
  subject: string; // e.g., 'Mathematics'
  examType: string; // e.g., 'School Examination', 'Olympiad'
  examName: string; // e.g., 'IMO' or empty
  materialType: string; // e.g., 'Question Paper'
  academicYear: string; // e.g., '2026-27'
  language: string; // e.g., 'English'
  fileName: string;
  googleDriveUrl: string;
  googleDriveFileId: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  downloadCount: number;
  viewCount: number;
  tags: string[];
}

export interface Video {
  id?: string;
  categoryType: 'Class' | 'Competitive Exam' | 'Olympiad Exam';
  classOrExam: string;
  subject: string;
  chapter: string;
  title: string;
  videoUrl: string; // Storage URL or YouTube URL
  thumbnailUrl?: string;
  duration?: string;
  description?: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt?: string;
}

export interface Quiz {
  id?: string;
  classLevel: string;
  subject: string;
  chapter: string;
  topic: string;
  htmlContent: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}
