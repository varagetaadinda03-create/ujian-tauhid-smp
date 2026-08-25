import React, { useState } from 'react';
import { AppView, ExamConfig, Question, StudentSession, SecurityViolation, StudentAnswer } from './types';
import { DEFAULT_EXAM_CONFIG, INITIAL_QUESTIONS, INITIAL_STUDENT_SESSIONS, INITIAL_VIOLATIONS } from './data/defaultData';
import { Navbar } from './components/common/Navbar';
import { LoginView } from './components/student/LoginView';
import { AgreementView } from './components/student/AgreementView';
import { ExamRoomView } from './components/student/ExamRoomView';
import { CompletionView } from './components/student/CompletionView';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('STUDENT_LOGIN');
  const [config, setConfig] = useState<ExamConfig>(DEFAULT_EXAM_CONFIG);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [sessions, setSessions] = useState<StudentSession[]>(INITIAL_STUDENT_SESSIONS);
  const [violations, setViolations] = useState<SecurityViolation[]>(INITIAL_VIOLATIONS);

  // Active student in the current browser turn
  const [currentStudent, setCurrentStudent] = useState<{
    nis: string;
    nisn: string;
    name: string;
    className: string;
    token: string;
    sessionId: string;
  } | null>(null);

  const [cameraActiveForExam, setCameraActiveForExam] = useState<boolean>(true);
  const [completedSession, setCompletedSession] = useState<StudentSession | null>(null);

  // Handle student login success
  const handleLoginSuccess = (studentData: {
    nis: string;
    nisn: string;
    name: string;
    className: string;
    token: string;
    sessionId: string;
  }) => {
    setCurrentStudent(studentData);

    // Check if session exists in session list or create new
    const existingIndex = sessions.findIndex(
      (s) => s.nis === studentData.nis || (s.nisn && s.nisn === studentData.nisn)
    );
    if (existingIndex === -1) {
      const newSession: StudentSession = {
        nis: studentData.nis,
        nisn: studentData.nisn,
        name: studentData.name,
        className: studentData.className,
        token: studentData.token,
        sessionId: studentData.sessionId,
        deviceInfo: navigator.userAgent.includes('Mobile') ? 'Smartphone / Mobile' : 'Desktop / PC',
        ipAddress: '192.168.1.' + Math.floor(10 + Math.random() * 80),
        status: 'PREPARING',
        answers: {},
        violationsCount: 0,
        cameraActive: false,
        fullscreenActive: false,
        connectionStatus: 'ONLINE',
      };
      setSessions((prev) => [newSession, ...prev]);
    } else {
      setSessions((prev) =>
        prev.map((s, idx) =>
          idx === existingIndex
            ? { ...s, status: 'PREPARING', sessionId: studentData.sessionId, nisn: studentData.nisn, name: studentData.name }
            : s
        )
      );
    }

    setCurrentView('STUDENT_AGREEMENT');
  };

  // Start exam from agreement page
  const handleStartExam = (cameraActive: boolean) => {
    setCameraActiveForExam(cameraActive);
    if (currentStudent) {
      setSessions((prev) =>
        prev.map((s) =>
          s.nis === currentStudent.nis
            ? {
                ...s,
                status: 'IN_PROGRESS',
                startedAt: new Date().toLocaleTimeString('id-ID'),
                cameraActive,
                fullscreenActive: true,
              }
            : s
        )
      );
    }
    setCurrentView('STUDENT_EXAM');
  };

  // Handle security violation
  const handleViolationOccurred = (violation: SecurityViolation) => {
    setViolations((prev) => [violation, ...prev]);

    if (currentStudent) {
      setSessions((prev) =>
        prev.map((s) =>
          s.nis === currentStudent.nis
            ? {
                ...s,
                violationsCount: s.violationsCount + 1,
              }
            : s
        )
      );
    }
  };

  // Submit and grade PG automatically
  const handleSubmitExam = (
    finalAnswers: Record<number, StudentAnswer>,
    totalViolations: number
  ) => {
    if (!currentStudent) return;

    // Compute Multiple Choice Score automatically
    let pgScore = 0;
    questions.forEach((q) => {
      if (q.type === 'pg') {
        const studentAns = finalAnswers[q.id]?.selectedOption;
        if (studentAns && studentAns === q.correctAnswer) {
          pgScore += q.scoreWeight;
        }
      }
    });

    const submitTime = new Date().toLocaleTimeString('id-ID');
    const existing = sessions.find((s) => s.nis === currentStudent.nis);

    const updatedSession: StudentSession = {
      nis: currentStudent.nis,
      nisn: currentStudent.nisn,
      name: currentStudent.name,
      className: currentStudent.className,
      token: currentStudent.token,
      sessionId: currentStudent.sessionId,
      deviceInfo: existing?.deviceInfo || 'Browser Client',
      ipAddress: existing?.ipAddress || '192.168.1.10',
      status: totalViolations >= config.maxViolationsAllowed ? 'FORCE_SUBMITTED' : 'SUBMITTED',
      startedAt: existing?.startedAt || submitTime,
      submittedAt: submitTime,
      answers: finalAnswers,
      violationsCount: totalViolations,
      cameraActive: false,
      fullscreenActive: false,
      connectionStatus: 'ONLINE',
      pgScore,
      essayScore: 0,
      totalScore: pgScore,
      isGraded: false,
    };

    setSessions((prev) =>
      prev.map((s) => (s.nis === currentStudent.nis ? updatedSession : s))
    );

    setCompletedSession(updatedSession);
    setCurrentView('STUDENT_COMPLETED');
  };

  const handleReturnToHome = () => {
    setCurrentStudent(null);
    setCurrentView('STUDENT_LOGIN');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Universal CBT Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        studentName={currentStudent?.name}
        studentClass={currentStudent?.className}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'STUDENT_LOGIN' && (
          <LoginView
            config={config}
            activeSessions={sessions}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentView === 'STUDENT_AGREEMENT' && currentStudent && (
          <AgreementView
            studentData={currentStudent}
            config={config}
            onStartExam={handleStartExam}
            onBackToLogin={handleReturnToHome}
          />
        )}

        {currentView === 'STUDENT_EXAM' && currentStudent && (
          <ExamRoomView
            studentData={currentStudent}
            config={config}
            questions={questions}
            initialAnswers={sessions.find((s) => s.nis === currentStudent.nis)?.answers || {}}
            initialCameraActive={cameraActiveForExam}
            onViolationOccurred={handleViolationOccurred}
            onSubmitExam={handleSubmitExam}
          />
        )}

        {currentView === 'STUDENT_COMPLETED' && completedSession && (
          <CompletionView
            session={completedSession}
            config={config}
            onReturnToHome={handleReturnToHome}
            onOpenAdminDashboard={() => setCurrentView('ADMIN_DASHBOARD')}
          />
        )}

        {currentView === 'ADMIN_DASHBOARD' && (
          <AdminDashboard
            config={config}
            onUpdateConfig={setConfig}
            questions={questions}
            onUpdateQuestions={setQuestions}
            sessions={sessions}
            onUpdateSessions={setSessions}
            violations={violations}
            onClearViolations={() => setViolations([])}
            onSwitchToStudentView={() => setCurrentView('STUDENT_LOGIN')}
          />
        )}
      </div>

    </div>
  );
}
