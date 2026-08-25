export type QuestionType = 'pg' | 'essay';

export type ChapterType = 'Bab 1' | 'Bab 2' | 'Bab 3' | 'Bab 4' | 'Bab 5';

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: number;
  number: number;
  type: QuestionType;
  chapter: ChapterType;
  titleTopic: string;
  arabicText?: string;
  translation?: string;
  questionText: string;
  options?: QuestionOption[];
  correctAnswer?: 'A' | 'B' | 'C' | 'D';
  scoreWeight: number;
  rubricGuide?: string; // Guideline for teacher grading
  explanation?: string;
}

export interface StudentAnswer {
  questionId: number;
  type: QuestionType;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  essayText?: string;
  isFlagged: boolean; // Ragu-ragu / Ditandai
  lastSavedAt: string;
  isSynced: boolean;
  scoreAwarded?: number; // Teacher graded score for essay, auto for PG
  teacherNotes?: string;
}

export type StudentStatus = 'NOT_STARTED' | 'PREPARING' | 'IN_PROGRESS' | 'SUBMITTED' | 'FORCE_SUBMITTED' | 'DISQUALIFIED';

export interface StudentSession {
  nis: string;
  nisn: string;
  name: string;
  className: string;
  token: string;
  sessionId: string;
  deviceInfo: string;
  ipAddress: string;
  status: StudentStatus;
  startedAt?: string;
  submittedAt?: string;
  answers: Record<number, StudentAnswer>;
  violationsCount: number;
  cameraActive: boolean;
  fullscreenActive: boolean;
  connectionStatus: 'ONLINE' | 'RECONNECTING' | 'OFFLINE';
  pgScore?: number;
  essayScore?: number;
  totalScore?: number;
  isGraded?: boolean;
}

export type ViolationType =
  | 'TAB_SWITCH'
  | 'WINDOW_BLUR'
  | 'FULLSCREEN_EXIT'
  | 'COPY_ATTEMPT'
  | 'PASTE_ATTEMPT'
  | 'RIGHT_CLICK'
  | 'MULTI_TAB'
  | 'CAMERA_STOPPED'
  | 'KEY_SHORTCUT';

export interface SecurityViolation {
  id: string;
  studentNis: string;
  studentNisn?: string;
  studentName: string;
  className: string;
  type: ViolationType;
  message: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  penaltyApplied?: string;
}

export interface ExamConfig {
  schoolName: string;
  appName: string;
  subject: string;
  material: string;
  chapters: string;
  durationMinutes: number;
  activeToken: string;
  tokenExpiryDate: string;
  maxViolationsAllowed: number;
  cameraPolicy: 'REQUIRED' | 'OPTIONAL' | 'DISABLED';
  allowScorePreviewToStudent: boolean;
  shuffleQuestions: boolean;
  autoSaveIntervalSeconds: number;
  enableStrictAntiCheat: boolean;
}

export type AppView = 
  | 'STUDENT_LOGIN'
  | 'STUDENT_AGREEMENT'
  | 'STUDENT_EXAM'
  | 'STUDENT_COMPLETED'
  | 'ADMIN_DASHBOARD';

export type AdminTab = 
  | 'MONITORING'
  | 'VIOLATIONS'
  | 'QUESTIONS'
  | 'GRADING'
  | 'SETTINGS';
