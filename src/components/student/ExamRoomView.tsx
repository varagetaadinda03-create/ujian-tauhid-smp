import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  BookOpen, Clock, Camera, CameraOff, Wifi, WifiOff, Flag, ChevronLeft, ChevronRight, 
  CheckCircle2, AlertCircle, ShieldAlert, Send, Bookmark, FileText, Check, Sparkles, RefreshCw
} from 'lucide-react';
import { Question, StudentAnswer, ExamConfig, SecurityViolation } from '../../types';
import { useExamSecurity } from '../../hooks/useExamSecurity';
import { Watermark } from '../common/Watermark';
import { WarningModal } from './WarningModal';
import { SubmitConfirmModal } from './SubmitConfirmModal';

interface ExamRoomViewProps {
  studentData: {
    nis: string;
    nisn?: string;
    name: string;
    className: string;
    token: string;
    sessionId: string;
  };
  config: ExamConfig;
  questions: Question[];
  initialAnswers?: Record<number, StudentAnswer>;
  initialCameraActive?: boolean;
  onViolationOccurred: (violation: SecurityViolation) => void;
  onSubmitExam: (finalAnswers: Record<number, StudentAnswer>, totalViolations: number) => void;
}

export const ExamRoomView: React.FC<ExamRoomViewProps> = ({
  studentData,
  config,
  questions,
  initialAnswers = {},
  initialCameraActive = true,
  onViolationOccurred,
  onSubmitExam,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, StudentAnswer>>(initialAnswers);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(config.durationMinutes * 60);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [saveStatus, setSaveStatus] = useState<'SAVED' | 'SAVING'>('SAVED');

  // Camera proctoring state & stream
  const [cameraActive, setCameraActive] = useState<boolean>(initialCameraActive);
  const [isCameraMinimized, setIsCameraMinimized] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sidebarVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentQuestion = questions[currentIndex] || questions[0];

  // Auto submit handler triggered by timer or security
  const handleForceSubmit = useCallback(() => {
    onSubmitExam(answers, 3);
  }, [answers, onSubmitExam]);

  // Security Engine
  const {
    violationsCount,
    currentWarning,
    isFullscreen,
    enterFullscreen,
    dismissWarning,
    registerViolation,
  } = useExamSecurity({
    enabled: config.enableStrictAntiCheat,
    studentNis: studentData.nis,
    studentName: studentData.name,
    className: studentData.className,
    maxViolations: config.maxViolationsAllowed,
    onViolation: (v) => {
      onViolationOccurred(v);
    },
    onForceSubmit: handleForceSubmit,
  });

  // Attempt initial fullscreen on mount
  useEffect(() => {
    enterFullscreen();
  }, [enterFullscreen]);

  // Setup Webcam Stream
  useEffect(() => {
    if (config.cameraPolicy !== 'DISABLED') {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' }, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          setCameraActive(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          if (sidebarVideoRef.current) {
            sidebarVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Exam room webcam stream failed:', err);
          setCameraActive(false);
        });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [config.cameraPolicy]);

  // Keep sidebar video ref synced when stream or minification changes
  useEffect(() => {
    if (sidebarVideoRef.current && streamRef.current) {
      sidebarVideoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive, isCameraMinimized]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleForceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleForceSubmit]);

  // Format time remaining MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Helper to update answers with auto-save
  const updateAnswer = (
    qId: number,
    partial: Partial<StudentAnswer>
  ) => {
    setSaveStatus('SAVING');
    const existing = answers[qId] || {
      questionId: qId,
      type: currentQuestion.type,
      isFlagged: false,
      lastSavedAt: new Date().toLocaleTimeString('id-ID'),
      isSynced: true,
    };

    const updated: StudentAnswer = {
      ...existing,
      ...partial,
      lastSavedAt: new Date().toLocaleTimeString('id-ID'),
      isSynced: isOnline,
    };

    setAnswers((prev) => ({
      ...prev,
      [qId]: updated,
    }));

    setTimeout(() => {
      setSaveStatus('SAVED');
    }, 400);
  };

  // Toggle flag / ragu-ragu
  const handleToggleFlag = () => {
    const currentAns = answers[currentQuestion.id];
    updateAnswer(currentQuestion.id, {
      isFlagged: currentAns ? !currentAns.isFlagged : true,
    });
  };

  // Select PG option
  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    updateAnswer(currentQuestion.id, {
      selectedOption: key,
    });
  };

  // Change Essay text
  const handleEssayChange = (text: string) => {
    updateAnswer(currentQuestion.id, {
      essayText: text,
    });
  };

  // Compute stats
  const answeredCount = useMemo(() => {
    return questions.filter((q) => {
      const a = answers[q.id];
      if (!a) return false;
      if (q.type === 'pg') return Boolean(a.selectedOption);
      if (q.type === 'essay') return Boolean(a.essayText && a.essayText.trim().length > 0);
      return false;
    }).length;
  }, [questions, answers]);

  const flaggedCount = useMemo(() => {
    return (Object.values(answers) as StudentAnswer[]).filter((a) => a.isFlagged).length;
  }, [answers]);

  const currentAnswer = answers[currentQuestion.id];
  const isTimeCritical = secondsRemaining < 300; // less than 5 min

  return (
    <div className="min-h-screen bg-[#F1F5F2] flex flex-col justify-between exam-protection relative select-none">
      
      {/* Dynamic Watermark for Security */}
      <Watermark
        studentName={studentData.name}
        studentNis={studentData.nis}
        studentNisn={studentData.nisn}
        sessionId={studentData.sessionId}
      />

      {/* Warning Modal when violation triggered */}
      <WarningModal
        warning={currentWarning}
        violationsCount={violationsCount}
        maxViolations={config.maxViolationsAllowed}
        onDismiss={dismissWarning}
        onReenterFullscreen={enterFullscreen}
      />

      {/* Confirmation Finish Modal */}
      <SubmitConfirmModal
        questions={questions}
        answers={answers}
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={() => onSubmitExam(answers, violationsCount)}
      />

      {/* TOP HEADER: Identity, Timer, Proctoring Camera */}
      <header className="bg-white border-b border-[#E1E8E2] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left: School & Subject Info */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-extrabold text-xs sm:text-sm text-[#1B4332] truncate">
                    {studentData.name}
                  </span>
                  <span className="text-[10px] font-bold text-[#1B4332] bg-[#D8F3DC] border border-[#95D5B2] px-1.5 py-0.5 rounded hidden xs:inline-block">
                    {studentData.className}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#55655B] truncate">
                  NISN: <span className="font-mono font-bold text-[#2D6A4F]">{studentData.nisn || studentData.nis}</span> • Tauhid Bab 1–5
                </p>
              </div>
            </div>

            {/* Right: Security Pill, Proctoring Camera, Timer & Sync */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Security Shield & Violation Counter */}
              <div
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${
                  violationsCount > 0
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-[#F7FCF8] text-[#1B4332] border-[#D8F3DC]'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>
                  Pelanggaran: {violationsCount}/{config.maxViolationsAllowed}
                </span>
              </div>

              {/* Proctoring Camera Stream Thumbnail */}
              {config.cameraPolicy !== 'DISABLED' && (
                <div className="relative w-11 h-8 sm:w-14 sm:h-10 bg-slate-900 rounded-lg overflow-hidden border border-[#E1E8E2] shadow-2xs shrink-0 group">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-800">
                      <CameraOff className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-pulse"></span>
                </div>
              )}

              {/* Countdown Timer */}
              <div
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border font-mono font-bold text-xs sm:text-sm transition-colors ${
                  isTimeCritical
                    ? 'bg-rose-50 text-[#D63031] border-rose-300 animate-pulse'
                    : 'bg-[#1B4332] text-white border-[#1B4332] shadow-2xs'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#95D5B2] shrink-0" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>

              {/* Save Status & Network */}
              <div className="hidden lg:flex items-center gap-1 text-[11px] text-[#55655B]">
                {isOnline ? (
                  <span className="flex items-center gap-1 text-[#2D6A4F] font-medium">
                    <Wifi className="w-3.5 h-3.5" />
                    {saveStatus === 'SAVING' ? 'Menyimpan...' : 'Tersimpan'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <WifiOff className="w-3.5 h-3.5" />
                    Offline (Lokal)
                  </span>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-[#E1E8E2] h-1">
          <div
            className="bg-[#2D6A4F] h-1 transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </header>

      {/* MAIN EXAM BODY: 2 Columns on Desktop */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-3 sm:py-5 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT / CENTER: Active Question Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-3.5">
          
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-[#E1E8E2]">
            
            {/* Question Top Info */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E1E8E2]">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#2D6A4F] text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
                  {currentQuestion.number}
                </span>
                <div>
                  <span className="text-[11px] font-bold text-[#1B4332] bg-[#D8F3DC] border border-[#95D5B2] px-2 py-0.5 rounded">
                    {currentQuestion.chapter}
                  </span>
                  <span className="text-xs text-[#55655B] ml-2 font-medium hidden sm:inline">
                    {currentQuestion.titleTopic}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#55655B] bg-[#F1F5F2] border border-[#E1E8E2] px-2 py-0.5 rounded">
                  Bobot: {currentQuestion.scoreWeight} Poin
                </span>
                <button
                  id="btn-flag-toggle"
                  type="button"
                  onClick={handleToggleFlag}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    currentAnswer?.isFlagged
                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                      : 'bg-[#F1F5F2] text-[#55655B] hover:bg-[#E1E8E2] border border-[#E1E8E2]'
                  }`}
                  title="Tandai jika masih ragu-ragu"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${currentAnswer?.isFlagged ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>{currentAnswer?.isFlagged ? 'Ditandai Ragu' : 'Tandai Soal'}</span>
                </button>
              </div>
            </div>

            {/* Arabic Matan / Dalil Box (If applicable) */}
            {currentQuestion.arabicText && (
              <div className="my-4 bg-[#F7FCF8] border border-[#95D5B2] rounded-xl p-3.5 sm:p-5 text-right">
                <div className="text-[10px] font-bold text-[#1B4332] tracking-wider mb-1.5 flex items-center justify-end gap-1">
                  <span>مَتْنُ كِتَابِ التَّوْحِيدِ / النَّصُّ الشَّرْعِيُّ</span>
                  <Sparkles className="w-3 h-3 text-[#2D6A4F]" />
                </div>
                <div className="font-arabic text-lg sm:text-xl text-[#1B4332] font-bold leading-loose select-none" dir="rtl">
                  {currentQuestion.arabicText}
                </div>
                {currentQuestion.translation && (
                  <div className="mt-2.5 pt-2.5 border-t border-[#D8F3DC] text-xs text-[#2D3436] text-left italic">
                    {currentQuestion.translation}
                  </div>
                )}
              </div>
            )}

            {/* Question Text */}
            <div className="my-3.5">
              <p className="text-xs sm:text-sm font-semibold text-[#2D3436] leading-relaxed">
                {currentQuestion.questionText}
              </p>
            </div>

            {/* MULTIPLE CHOICE OPTIONS (If PG) */}
            {currentQuestion.type === 'pg' && currentQuestion.options && (
              <div className="space-y-2.5 mt-5">
                {currentQuestion.options.map((opt) => {
                  const isSelected = currentAnswer?.selectedOption === opt.key;
                  return (
                    <button
                      key={opt.key}
                      id={`option-${currentQuestion.id}-${opt.key}`}
                      type="button"
                      onClick={() => handleSelectOption(opt.key)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer select-none ${
                        isSelected
                          ? 'bg-[#D8F3DC]/70 border-[#2D6A4F] text-[#1B4332] shadow-2xs ring-1 ring-[#2D6A4F]'
                          : 'bg-white border-[#E1E8E2] hover:border-[#95D5B2] hover:bg-[#F7FCF8] text-[#2D3436]'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#2D6A4F] text-white'
                            : 'bg-[#F1F5F2] text-[#2D3436]'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="text-xs sm:text-sm font-medium pt-0.5 leading-relaxed">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ESSAY TEXTAREA (If Essay) */}
            {currentQuestion.type === 'essay' && (
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#55655B]">
                  <span className="font-bold text-[#1B4332] flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    Lembar Jawaban Esai:
                  </span>
                  <span className="font-mono text-[11px]">
                    {(currentAnswer?.essayText || '').length} Karakter •{' '}
                    {(currentAnswer?.essayText || '').trim().split(/\s+/).filter(Boolean).length} Kata
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id={`essay-textarea-${currentQuestion.id}`}
                    rows={6}
                    value={currentAnswer?.essayText || ''}
                    onChange={(e) => handleEssayChange(e.target.value)}
                    placeholder="Tuliskan penjelasan dan argumentasi Anda secara lengkap dan terstruktur di sini..."
                    className="w-full p-3.5 text-xs sm:text-sm bg-[#F7FCF8] border border-[#E1E8E2] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] transition-all font-sans leading-relaxed text-[#2D3436]"
                  />
                </div>

                {currentQuestion.rubricGuide && (
                  <div className="p-2.5 bg-[#F1F5F2] rounded-lg border border-[#E1E8E2] text-[11px] text-[#55655B]">
                    <strong className="text-[#1B4332]">Petunjuk Jawaban:</strong> Pastikan jawaban Anda mencakup dalil dan rincian poin-poin yang diminta soal.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* QUESTION ACTION BAR: Prev, Flag, Next, Finish */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3 shadow-xs border border-[#E1E8E2] flex items-center justify-between gap-2">
            
            <button
              id="btn-prev-question"
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentIndex === 0
                  ? 'bg-[#F1F5F2] text-slate-300 cursor-not-allowed'
                  : 'bg-[#F1F5F2] hover:bg-[#E1E8E2] text-[#2D3436] cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Sebelumnya</span>
            </button>

            <span className="text-xs font-bold text-[#55655B] bg-[#F1F5F2] px-2.5 py-1 rounded-md border border-[#E1E8E2]">
              Soal {currentIndex + 1} dari {questions.length}
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                id="btn-next-question"
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-3.5 sm:px-5 py-2 rounded-lg text-xs font-bold bg-[#2D6A4F] hover:bg-[#1B4332] text-white flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-submit-exam-trigger"
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-3.5 sm:px-5 py-2 rounded-lg text-xs font-bold bg-[#D63031] hover:bg-[#A52021] text-white flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SELESAI UJIAN</span>
              </button>
            )}

          </div>

        </div>

        {/* RIGHT: QUESTION NAVIGATOR SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          
          {/* Proctoring Camera Surveillance Card */}
          {config.cameraPolicy !== 'DISABLED' && (
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-[#E1E8E2]">
              <div className="flex items-center justify-between pb-2 border-b border-[#E1E8E2] mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span className="text-xs font-bold text-[#1B4332]">Kamera Pengawas (Proctoring)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCameraMinimized(!isCameraMinimized)}
                  className="text-[10px] text-[#55655B] hover:text-[#1B4332] font-semibold bg-[#F1F5F2] hover:bg-[#E1E8E2] px-2 py-0.5 rounded cursor-pointer transition-colors"
                >
                  {isCameraMinimized ? 'Perbesar' : 'Sederhanakan'}
                </button>
              </div>

              {!isCameraMinimized ? (
                <div className="space-y-2">
                  <div className="relative aspect-4/3 w-full bg-slate-900 rounded-xl overflow-hidden border border-[#E1E8E2] flex items-center justify-center shadow-inner">
                    {cameraActive ? (
                      <>
                        <video
                          ref={sidebarVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover mirror scale-x-[-1]"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-bold text-[#95D5B2] flex items-center gap-1 border border-[#2D6A4F]/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                          <span>LIVE PENGAWASAN</span>
                        </div>
                        <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-300">
                          {studentData.nisn || studentData.nis}
                        </div>
                      </>
                    ) : (
                      <div className="p-3 text-center text-slate-400 space-y-1">
                        <CameraOff className="w-5 h-5 mx-auto text-slate-500" />
                        <p className="text-[11px]">Kamera Pengawas Tidak Aktif</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] text-[#55655B] bg-[#F7FCF8] px-2.5 py-1.5 rounded-lg border border-[#E1E8E2]">
                    <span className="flex items-center gap-1 text-[#2D6A4F] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]"></span>
                      Status: Posisi Wajah Terpantau
                    </span>
                    <span className="font-mono text-[#55655B]">30 FPS</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-[#F7FCF8] p-2 rounded-lg border border-[#E1E8E2] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold text-[#1B4332]">Kamera Pengawas Aktif di Latar</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#2D6A4F] bg-[#D8F3DC] px-1.5 py-0.5 rounded">
                    TERKONEKSI
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#E1E8E2] sticky top-20">
            
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E1E8E2] mb-3.5">
              <h3 className="text-xs sm:text-sm font-bold text-[#1B4332]">
                Navigasi Nomor Soal
              </h3>
              <span className="text-[11px] font-mono font-bold text-[#1B4332] bg-[#D8F3DC] px-2 py-0.5 rounded">
                {answeredCount}/{questions.length} Terjawab
              </span>
            </div>

            {/* Grid 1 - 15 */}
            <div className="grid grid-cols-5 gap-2 mb-5">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isAnswered = q.type === 'pg' ? Boolean(ans?.selectedOption) : Boolean(ans?.essayText?.trim());
                const isFlagged = ans?.isFlagged;
                const isActive = idx === currentIndex;

                let btnStyle = 'bg-[#F1F5F2] text-[#2D3436] hover:bg-[#E1E8E2] border-[#E1E8E2]';
                if (isFlagged) {
                  btnStyle = 'bg-amber-400 text-amber-950 font-bold border-amber-500';
                } else if (isAnswered) {
                  btnStyle = 'bg-[#2D6A4F] text-white font-bold border-[#1B4332]';
                }

                return (
                  <button
                    key={q.id}
                    id={`nav-question-${q.number}`}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg text-xs flex flex-col items-center justify-center relative border transition-all cursor-pointer ${btnStyle} ${
                      isActive ? 'ring-2 ring-[#2D6A4F] scale-105 shadow-2xs z-10' : ''
                    }`}
                  >
                    <span className="font-bold">{q.number}</span>
                    <span className="text-[8px] opacity-80">{q.type.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>

            {/* Legend / Status Descriptions */}
            <div className="pt-3 border-t border-[#E1E8E2] space-y-1.5 text-xs text-[#55655B]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#2D6A4F]"></span> Sudah Dijawab
                </span>
                <strong className="font-mono">{answeredCount}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span> Ragu-ragu / Ditandai
                </span>
                <strong className="font-mono">{flaggedCount}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#F1F5F2] border border-[#E1E8E2]"></span> Belum Dijawab
                </span>
                <strong className="font-mono">{questions.length - answeredCount}</strong>
              </div>
            </div>

            {/* Finish Button at bottom of sidebar */}
            <div className="mt-4 pt-3 border-t border-[#E1E8E2]">
              <button
                id="btn-sidebar-finish-exam"
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full py-2.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#1B4332] hover:bg-[#2D6A4F] text-white flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SELESAI & KUMPULKAN</span>
              </button>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};
