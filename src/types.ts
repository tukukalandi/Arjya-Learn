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
