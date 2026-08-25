import React, { useState, useMemo } from 'react';
import { 
  Users, ShieldAlert, BookOpen, Award, Settings, Search, Plus, Filter, 
  Trash2, Edit3, CheckCircle2, AlertTriangle, Clock, Eye, Camera, Maximize, 
  Download, RefreshCw, KeyRound, Check, FileSpreadsheet, Sparkles, Send, UserCheck, Smartphone
} from 'lucide-react';
import { Question, StudentSession, SecurityViolation, ExamConfig, AdminTab, ChapterType } from '../../types';
import { QuestionModal } from './QuestionModal';
import { EssayGradingModal } from './EssayGradingModal';

interface AdminDashboardProps {
  config: ExamConfig;
  onUpdateConfig: (newConfig: ExamConfig) => void;
  questions: Question[];
  onUpdateQuestions: (newQuestions: Question[]) => void;
  sessions: StudentSession[];
  onUpdateSessions: (newSessions: StudentSession[]) => void;
  violations: SecurityViolation[];
  onClearViolations: () => void;
  onSwitchToStudentView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  onUpdateConfig,
  questions,
  onUpdateQuestions,
  sessions,
  onUpdateSessions,
  violations,
  onClearViolations,
  onSwitchToStudentView,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('MONITORING');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBabFilter, setSelectedBabFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  // Question modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Essay grading modal state
  const [isGradingModalOpen, setIsGradingModalOpen] = useState<boolean>(false);
  const [gradingSession, setGradingSession] = useState<StudentSession | null>(null);

  // Local settings form state
  const [formConfig, setFormConfig] = useState<ExamConfig>(config);
  const [settingsSavedToast, setSettingsSavedToast] = useState<boolean>(false);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nis.includes(searchTerm) ||
        s.className.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [sessions, searchTerm]);

  // Filtered Violations
  const filteredViolations = useMemo(() => {
    return violations.filter((v) => {
      const matchSearch =
        v.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.studentNis.includes(searchTerm) ||
        v.message.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [violations, searchTerm]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchBab = selectedBabFilter === 'ALL' || q.chapter === selectedBabFilter;
      const matchType = selectedTypeFilter === 'ALL' || q.type === selectedTypeFilter;
      const matchSearch =
        q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.arabicText && q.arabicText.includes(searchTerm)) ||
        q.titleTopic.toLowerCase().includes(searchTerm.toLowerCase());
      return matchBab && matchType && matchSearch;
    });
  }, [questions, selectedBabFilter, selectedTypeFilter, searchTerm]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = sessions.length;
    const inProgress = sessions.filter((s) => s.status === 'IN_PROGRESS').length;
    const submitted = sessions.filter((s) => s.status === 'SUBMITTED' || s.status === 'FORCE_SUBMITTED').length;
    const notStarted = sessions.filter((s) => s.status === 'NOT_STARTED').length;
    const totalViolations = violations.length;
    
    // Average score of submitted
    const gradedSessions = sessions.filter((s) => s.totalScore !== undefined);
    const avgScore = gradedSessions.length
      ? Math.round(gradedSessions.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) / gradedSessions.length)
      : 0;

    return { total, inProgress, submitted, notStarted, totalViolations, avgScore };
  }, [sessions, violations]);

  // Question CRUD
  const handleSaveQuestion = (qData: Question) => {
    if (editingQuestion) {
      onUpdateQuestions(questions.map((q) => (q.id === qData.id ? qData : q)));
    } else {
      onUpdateQuestions([...questions, qData]);
    }
  };

  const handleDeleteQuestion = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus butir soal ini?')) {
      const updated = questions.filter((q) => q.id !== id).map((q, idx) => ({ ...q, number: idx + 1 }));
      onUpdateQuestions(updated);
    }
  };

  // Grade Saving
  const handleSaveGrades = (nis: string, updatedAnswers: any, totalEssayScore: number) => {
    const updated = sessions.map((s) => {
      if (s.nis === nis) {
        const pgScore = s.pgScore ?? 0;
        const total = pgScore + totalEssayScore;
        return {
          ...s,
          answers: updatedAnswers,
          essayScore: totalEssayScore,
          totalScore: total,
          isGraded: true,
        };
      }
      return s;
    });
    onUpdateSessions(updated);
  };

  // Force Submit a student
  const handleForceSubmitStudent = (nis: string) => {
    if (window.confirm(`Paksa kumpulkan ujian untuk siswa NIS ${nis}? Jawaban siswa akan segera dikunci.`)) {
      const updated = sessions.map((s) => {
        if (s.nis === nis) {
          return {
            ...s,
            status: 'FORCE_SUBMITTED' as const,
            submittedAt: new Date().toLocaleTimeString('id-ID'),
          };
        }
        return s;
      });
      onUpdateSessions(updated);
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formConfig);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  // Generate Token helper
  const handleGenerateRandomToken = () => {
    const random = 'TAUHID' + Math.floor(100 + Math.random() * 900);
    setFormConfig((prev) => ({ ...prev, activeToken: random }));
  };

  // Export Results to CSV
  const handleExportCSV = () => {
    const headers = ['NIS', 'Nama', 'Kelas', 'Status', 'Pelanggaran', 'Nilai PG', 'Nilai Esai', 'Total Nilai', 'Predikat'];
    const rows = sessions.map((s) => {
      let predikat = '-';
      const tot = s.totalScore ?? 0;
      if (s.isGraded) {
        if (tot >= 90) predikat = 'A (Mumtaz)';
        else if (tot >= 80) predikat = 'B (Jayyid Jiddan)';
        else if (tot >= 70) predikat = 'C (Jayyid)';
        else predikat = 'D (Maqbul)';
      }
      return [
        s.nis,
        `"${s.name}"`,
        s.className,
        s.status,
        s.violationsCount,
        s.pgScore ?? 0,
        s.essayScore ?? 0,
        s.totalScore ?? 0,
        predikat,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_Tauhid_SMP_Para_Sahabat_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F1F5F2] p-3 sm:p-5 lg:p-6">
      
      {/* Question Modal */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        question={editingQuestion}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={handleSaveQuestion}
        nextNumber={questions.length + 1}
      />

      {/* Essay Grading Modal */}
      <EssayGradingModal
        isOpen={isGradingModalOpen}
        session={gradingSession}
        questions={questions}
        onClose={() => setIsGradingModalOpen(false)}
        onSaveGrades={handleSaveGrades}
      />

      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xs border border-[#E1E8E2] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-[#1B4332] tracking-tight">
                  Dashboard Guru & Pengawas CBT
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#D8F3DC] text-[#1B4332] border border-[#95D5B2]">
                  SMP Para Sahabat
                </span>
              </div>
              <p className="text-xs text-[#55655B] mt-0.5">
                Monitoring Real-time, Audit Log Pelanggaran, Bank Soal Kitab Tauhid Bab 1–5 & Penilaian Esai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F1F5F2] hover:bg-[#E1E8E2] border border-[#E1E8E2] text-[#2D3436] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Unduh Rekap Nilai Siswa (CSV)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={onSwitchToStudentView}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#2D6A4F] hover:bg-[#1B4332] text-white flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Simulasi Siswa</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          
          <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-2xs border border-[#E1E8E2]">
            <span className="text-[11px] font-bold text-[#55655B] uppercase tracking-wider block">
              Total Peserta Terdaftar
            </span>
            <div className="flex items-baseline justify-between mt-1.5">
              <span className="text-xl sm:text-2xl font-black text-[#1B4332] font-mono">
                {metrics.total}
              </span>
              <span className="text-[11px] font-semibold text-[#1B4332] bg-[#D8F3DC] px-2 py-0.5 rounded">
                Semua Kelas
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-2xs border border-[#E1E8E2]">
            <span className="text-[11px] font-bold text-[#55655B] uppercase tracking-wider block">
              Sedang Mengerjakan
            </span>
            <div className="flex items-baseline justify-between mt-1.5">
              <span className="text-xl sm:text-2xl font-black text-[#2D6A4F] font-mono">
                {metrics.inProgress}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F] animate-pulse"></span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-2xs border border-[#E1E8E2]">
            <span className="text-[11px] font-bold text-[#55655B] uppercase tracking-wider block">
              Sudah Mengirim
            </span>
            <div className="flex items-baseline justify-between mt-1.5">
              <span className="text-xl sm:text-2xl font-black text-[#2D3436] font-mono">
                {metrics.submitted}
              </span>
              <span className="text-[11px] font-semibold text-[#55655B]">
                Selesai
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-2xs border border-[#E1E8E2]">
            <span className="text-[11px] font-bold text-[#55655B] uppercase tracking-wider block">
              Pelanggaran Terdeteksi
            </span>
            <div className="flex items-baseline justify-between mt-1.5">
              <span className={`text-xl sm:text-2xl font-black font-mono ${
                metrics.totalViolations > 0 ? 'text-amber-600' : 'text-[#2D3436]'
              }`}>
                {metrics.totalViolations}
              </span>
              <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                Log Keamanan
              </span>
            </div>
          </div>

        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="bg-white rounded-xl p-1 shadow-2xs border border-[#E1E8E2] flex flex-wrap gap-1">
          {[
            { id: 'MONITORING', label: 'Monitoring Live Peserta', icon: Users },
            { id: 'VIOLATIONS', label: `Log Pelanggaran (${violations.length})`, icon: ShieldAlert },
            { id: 'QUESTIONS', label: `Bank Soal Tauhid (${questions.length})`, icon: BookOpen },
            { id: 'GRADING', label: 'Penilaian Esai & Rekap Nilai', icon: Award },
            { id: 'SETTINGS', label: 'Pengaturan Ujian & Token', icon: Settings },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                id={`admin-tab-${t.id.toLowerCase()}`}
                onClick={() => setActiveTab(t.id as AdminTab)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2D6A4F] text-white shadow-2xs'
                    : 'text-[#55655B] hover:text-[#1B4332] hover:bg-[#F1F5F2]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MONITORING PESERTA */}
        {activeTab === 'MONITORING' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xs border border-[#E1E8E2] space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E1E8E2]">
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#1B4332]">
                  Monitoring Peserta Ujian Secara Real-time
                </h2>
                <p className="text-xs text-[#55655B]">
                  Status kamera, fullscreen, kemajuan pengerjaan, dan catatan keamanan per peserta
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#55655B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari siswa / NIS / kelas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg text-xs focus:ring-1 focus:ring-[#2D6A4F]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F7FCF8] text-[#55655B] font-bold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-[#E1E8E2]">
                    <th className="p-2.5">Peserta</th>
                    <th className="p-2.5">Kelas</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Kamera</th>
                    <th className="p-2.5">Fullscreen</th>
                    <th className="p-2.5">Progres Soal</th>
                    <th className="p-2.5">Pelanggaran</th>
                    <th className="p-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E8E2]">
                  {filteredSessions.map((s) => {
                    const ansCount = Object.keys(s.answers || {}).length;
                    return (
                      <tr key={s.nis} className="hover:bg-[#F7FCF8] transition-colors">
                        <td className="p-2.5">
                          <strong className="text-[#1B4332] font-bold block">{s.name}</strong>
                          <span className="text-[10px] text-[#55655B] font-mono">NIS: {s.nis}</span>
                        </td>
                        <td className="p-2.5 text-[#2D3436] font-medium">{s.className}</td>
                        <td className="p-2.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              s.status === 'IN_PROGRESS'
                                ? 'bg-[#D8F3DC] text-[#1B4332] border border-[#95D5B2]'
                                : s.status === 'SUBMITTED' || s.status === 'FORCE_SUBMITTED'
                                ? 'bg-[#F1F5F2] text-[#2D3436] border border-[#E1E8E2]'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {s.status === 'IN_PROGRESS' && <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-pulse"></span>}
                            {s.status === 'IN_PROGRESS'
                              ? 'Sedang Mengerjakan'
                              : s.status === 'SUBMITTED'
                              ? 'Sudah Terkirim'
                              : s.status === 'FORCE_SUBMITTED'
                              ? 'Dikunci Otomatis'
                              : 'Belum Mulai'}
                          </span>
                        </td>
                        <td className="p-2.5">
                          {s.cameraActive ? (
                            <span className="inline-flex items-center gap-1 text-[#2D6A4F] font-semibold text-xs">
                              <Camera className="w-3.5 h-3.5 text-[#2D6A4F]" /> Aktif
                            </span>
                          ) : (
                            <span className="text-[#55655B] text-xs">Mati / Nonaktif</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          {s.fullscreenActive ? (
                            <span className="inline-flex items-center gap-1 text-[#2D6A4F] font-semibold text-xs">
                              <Maximize className="w-3.5 h-3.5 text-[#2D6A4F]" /> Layar Penuh
                            </span>
                          ) : (
                            <span className="text-amber-700 text-xs">Terganggu</span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono font-bold text-[#2D3436]">
                          {ansCount}/15 Soal
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                              s.violationsCount > 0 ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-[#F1F5F2] text-[#55655B]'
                            }`}
                          >
                            {s.violationsCount} Kali
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {s.status === 'IN_PROGRESS' && (
                              <button
                                onClick={() => handleForceSubmitStudent(s.nis)}
                                className="px-2 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-[#D63031] border border-rose-200 transition-colors"
                                title="Paksa selesaikan ujian siswa ini"
                              >
                                Kunci
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setGradingSession(s);
                                setIsGradingModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#D8F3DC] hover:bg-[#95D5B2]/50 text-[#1B4332] border border-[#95D5B2] transition-colors"
                            >
                              Periksa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: LOG PELANGGARAN */}
        {activeTab === 'VIOLATIONS' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xs border border-[#E1E8E2] space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E1E8E2]">
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#1B4332]">
                  Audit Log Pelanggaran & Keamanan Ujian
                </h2>
                <p className="text-xs text-[#55655B]">
                  Catatan otomatis perpindahan tab, kehilangan fokus, keluar fullscreen, percobaan copy/paste, dan sesi ganda
                </p>
              </div>

              <button
                onClick={onClearViolations}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold text-[#55655B] hover:bg-[#F1F5F2] border border-[#E1E8E2] transition-colors"
              >
                Bersihkan Log
              </button>
            </div>

            {filteredViolations.length === 0 ? (
              <div className="text-center py-10 text-[#55655B]">
                <ShieldAlert className="w-10 h-10 mx-auto text-[#2D6A4F]/40 mb-2" />
                <p className="font-semibold text-xs">Tidak ada pelanggaran keamanan yang terdeteksi.</p>
                <p className="text-[11px] text-[#55655B]">Seluruh peserta mematuhi tata tertib ujian dengan tertib.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#F7FCF8] text-[#55655B] font-bold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-[#E1E8E2]">
                      <th className="p-2.5">Waktu</th>
                      <th className="p-2.5">Peserta</th>
                      <th className="p-2.5">Tipe Aktivitas</th>
                      <th className="p-2.5">Tingkat</th>
                      <th className="p-2.5">Rincian Kejadian</th>
                      <th className="p-2.5">Tindakan Sistem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E8E2]">
                    {filteredViolations.map((v) => (
                      <tr key={v.id} className="hover:bg-[#F7FCF8] transition-colors">
                        <td className="p-2.5 font-mono text-[#55655B] font-semibold">{v.timestamp} WIB</td>
                        <td className="p-2.5">
                          <strong className="text-[#1B4332] font-bold block">{v.studentName}</strong>
                          <span className="text-[10px] text-[#55655B] font-mono">NIS: {v.studentNis} • {v.className}</span>
                        </td>
                        <td className="p-2.5 font-mono font-bold text-[#2D3436]">
                          {v.type}
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.severity === 'CRITICAL'
                                ? 'bg-rose-100 text-[#D63031] border border-rose-300'
                                : v.severity === 'WARNING'
                                ? 'bg-amber-100 text-amber-950 border border-amber-300'
                                : 'bg-[#F1F5F2] text-[#2D3436] border border-[#E1E8E2]'
                            }`}
                          >
                            {v.severity}
                          </span>
                        </td>
                        <td className="p-2.5 text-[#2D3436] max-w-xs">{v.message}</td>
                        <td className="p-2.5 text-[#55655B] text-xs">{v.penaltyApplied || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BANK SOAL TAUHID */}
        {activeTab === 'QUESTIONS' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xs border border-[#E1E8E2] space-y-3.5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E1E8E2]">
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#1B4332]">
                  Bank Soal Kitab Tauhid (Bab 1 s.d. Bab 5)
                </h2>
                <p className="text-xs text-[#55655B]">
                  Total {questions.length} Soal (10 Pilihan Ganda + 5 Soal Esai)
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingQuestion(null);
                  setIsQuestionModalOpen(true);
                }}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#2D6A4F] hover:bg-[#1B4332] text-white flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Soal Baru</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1 text-xs">
                <span className="font-bold text-[#55655B]">Bab:</span>
                <select
                  value={selectedBabFilter}
                  onChange={(e) => setSelectedBabFilter(e.target.value)}
                  className="p-1.5 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg text-xs font-semibold text-[#2D3436]"
                >
                  <option value="ALL">Semua Bab</option>
                  <option value="Bab 1">Bab 1</option>
                  <option value="Bab 2">Bab 2</option>
                  <option value="Bab 3">Bab 3</option>
                  <option value="Bab 4">Bab 4</option>
                  <option value="Bab 5">Bab 5</option>
                </select>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <span className="font-bold text-[#55655B]">Tipe:</span>
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="p-1.5 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg text-xs font-semibold text-[#2D3436]"
                >
                  <option value="ALL">Semua Tipe</option>
                  <option value="pg">Pilihan Ganda (PG)</option>
                  <option value="essay">Soal Esai</option>
                </select>
              </div>
            </div>

            {/* Question Cards List */}
            <div className="space-y-3">
              {filteredQuestions.map((q) => (
                <div key={q.id} className="bg-[#F7FCF8] border border-[#E1E8E2] rounded-xl p-3.5 sm:p-4 space-y-2.5">
                  
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#2D6A4F] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {q.number}
                      </span>
                      <span className="text-xs font-bold text-[#1B4332] bg-[#D8F3DC] px-2 py-0.5 rounded border border-[#95D5B2]">
                        {q.chapter}
                      </span>
                      <span className="text-xs font-bold text-[#2D3436]">
                        {q.titleTopic}
                      </span>
                      <span className="text-[10px] font-semibold text-[#55655B] bg-white border border-[#E1E8E2] px-2 py-0.5 rounded">
                        {q.type.toUpperCase()} • {q.scoreWeight} Poin
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingQuestion(q);
                          setIsQuestionModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-[#55655B] hover:bg-[#E1E8E2] transition-colors"
                        title="Edit Soal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 rounded-lg text-[#D63031] hover:bg-rose-100 transition-colors"
                        title="Hapus Soal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {q.arabicText && (
                    <div className="p-2.5 bg-white border border-[#95D5B2] rounded-lg font-arabic text-base sm:text-lg text-[#1B4332] font-bold text-right" dir="rtl">
                      {q.arabicText}
                    </div>
                  )}

                  <p className="text-xs font-semibold text-[#1B4332]">
                    {q.questionText}
                  </p>

                  {q.type === 'pg' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs pt-1">
                      {q.options.map((opt) => (
                        <div
                          key={opt.key}
                          className={`p-2 rounded-lg border flex items-start gap-2 ${
                            q.correctAnswer === opt.key
                              ? 'bg-[#D8F3DC] border-[#95D5B2] text-[#1B4332] font-bold'
                              : 'bg-white border-[#E1E8E2] text-[#2D3436]'
                          }`}
                        >
                          <span className="w-4 h-4 rounded font-bold text-[10px] flex items-center justify-center bg-[#E1E8E2] text-[#1B4332] shrink-0">
                            {opt.key}
                          </span>
                          <span className="text-xs">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'essay' && q.rubricGuide && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 text-[11px] text-amber-950 rounded-lg whitespace-pre-line">
                      <strong>Rubrik Penilaian:</strong> {q.rubricGuide}
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: PENILAIAN ESAI & REKAP NILAI */}
        {activeTab === 'GRADING' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xs border border-[#E1E8E2] space-y-3.5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E1E8E2]">
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#1B4332]">
                  Penilaian Esai & Rekap Nilai Siswa
                </h2>
                <p className="text-xs text-[#55655B]">
                  Pilihan ganda (10 Soal x 5 = 50 Poin) dinilai otomatis. Guru memeriksa dan memberi skor untuk 5 Soal Esai (5 x 10 = 50 Poin).
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#2D6A4F] hover:bg-[#1B4332] text-white flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Rekap Nilai (CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F7FCF8] text-[#55655B] font-bold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-[#E1E8E2]">
                    <th className="p-2.5">Peserta</th>
                    <th className="p-2.5">Kelas</th>
                    <th className="p-2.5">Nilai PG (Max 50)</th>
                    <th className="p-2.5">Nilai Esai (Max 50)</th>
                    <th className="p-2.5">Total Skor</th>
                    <th className="p-2.5">Predikat</th>
                    <th className="p-2.5">Status Penilaian</th>
                    <th className="p-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E8E2]">
                  {filteredSessions.map((s) => {
                    const total = s.totalScore ?? (s.pgScore ?? 0) + (s.essayScore ?? 0);
                    let predikat = '-';
                    if (s.isGraded) {
                      if (total >= 90) predikat = 'A (Mumtaz)';
                      else if (total >= 80) predikat = 'B (Jayyid Jiddan)';
                      else if (total >= 70) predikat = 'C (Jayyid)';
                      else predikat = 'D (Maqbul)';
                    }

                    return (
                      <tr key={s.nis} className="hover:bg-[#F7FCF8] transition-colors">
                        <td className="p-2.5">
                          <strong className="text-[#1B4332] font-bold block">{s.name}</strong>
                          <span className="text-[10px] text-[#55655B] font-mono">NIS: {s.nis}</span>
                        </td>
                        <td className="p-2.5 text-[#2D3436] font-medium">{s.className}</td>
                        <td className="p-2.5 font-mono font-bold text-[#2D3436]">
                          {s.pgScore ?? 0} Poin
                        </td>
                        <td className="p-2.5 font-mono font-bold text-[#2D6A4F]">
                          {s.essayScore !== undefined ? `${s.essayScore} Poin` : 'Belum Dinilai'}
                        </td>
                        <td className="p-2.5 font-mono font-black text-[#1B4332] text-xs">
                          {s.isGraded ? total : '-'}
                        </td>
                        <td className="p-2.5">
                          <span className="font-bold text-xs text-[#2D3436]">{predikat}</span>
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              s.isGraded
                                ? 'bg-[#D8F3DC] text-[#1B4332] border border-[#95D5B2]'
                                : 'bg-amber-100 text-amber-950 border border-amber-300'
                            }`}
                          >
                            {s.isGraded ? 'Sudah Dinilai' : 'Menunggu Penilaian'}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => {
                              setGradingSession(s);
                              setIsGradingModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2D6A4F] hover:bg-[#1B4332] text-white shadow-2xs transition-colors cursor-pointer"
                          >
                            Beri Nilai Esai
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 5: PENGATURAN CBT & TOKEN */}
        {activeTab === 'SETTINGS' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xs border border-[#E1E8E2] space-y-4">
            
            <div className="pb-3 border-b border-[#E1E8E2]">
              <h2 className="text-sm sm:text-base font-black text-[#1B4332]">
                Pengaturan Ujian & Token CBT
              </h2>
              <p className="text-xs text-[#55655B]">
                Atur token aktif ujian, toleransi pelanggaran, kebijakan pengawasan kamera, dan durasi ujian
              </p>
            </div>

            {settingsSavedToast && (
              <div className="p-3 rounded-xl bg-[#D8F3DC] border border-[#95D5B2] text-[#1B4332] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                <span>Pengaturan berhasil disimpan dan diterapkan ke sistem CBT!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-3xl text-xs sm:text-sm">
              
              {/* Token Management */}
              <div className="p-4 bg-[#F7FCF8] border border-[#95D5B2] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-black text-[#1B4332] uppercase tracking-wider text-[11px]">
                      Token Ujian Aktif
                    </label>
                    <p className="text-xs text-[#55655B] mt-0.5">
                      Token ini wajib dimasukkan oleh seluruh siswa untuk memulai ujian.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateRandomToken}
                    className="px-2.5 py-1 bg-white border border-[#E1E8E2] hover:bg-[#F1F5F2] rounded-lg text-xs font-bold text-[#1B4332] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Acak Token</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2D6A4F]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formConfig.activeToken}
                    onChange={(e) =>
                      setFormConfig((prev) => ({ ...prev, activeToken: e.target.value.toUpperCase() }))
                    }
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#95D5B2] rounded-lg text-sm font-black font-mono tracking-widest text-[#1B4332] uppercase focus:ring-1 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>

              {/* Exam Duration & Violations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[11px] mb-1">
                    Alokasi Waktu Ujian (Menit)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={formConfig.durationMinutes}
                    onChange={(e) =>
                      setFormConfig((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))
                    }
                    className="w-full p-2 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg font-bold text-[#2D3436]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[11px] mb-1">
                    Batas Maksimal Pelanggaran Sebelum Auto-Submit
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formConfig.maxViolationsAllowed}
                    onChange={(e) =>
                      setFormConfig((prev) => ({ ...prev, maxViolationsAllowed: Number(e.target.value) }))
                    }
                    className="w-full p-2 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg font-bold text-[#2D3436]"
                  />
                </div>
              </div>

              {/* Camera Policy */}
              <div>
                <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[11px] mb-1">
                  Kebijakan Kamera Proctoring
                </label>
                <select
                  value={formConfig.cameraPolicy}
                  onChange={(e) =>
                    setFormConfig((prev) => ({
                      ...prev,
                      cameraPolicy: e.target.value as any,
                    }))
                  }
                  className="w-full p-2 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg font-semibold text-[#2D3436]"
                >
                  <option value="REQUIRED">Kamera Wajib Aktif (Direkomendasikan)</option>
                  <option value="OPTIONAL">Kamera Opsional (Siswa dapat izin bila tanpa kamera)</option>
                  <option value="DISABLED">Kamera Dinonaktifkan</option>
                </select>
              </div>

              {/* Anti-cheat toggles */}
              <div className="p-3 bg-[#F7FCF8] border border-[#E1E8E2] rounded-xl space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formConfig.enableStrictAntiCheat}
                    onChange={(e) =>
                      setFormConfig((prev) => ({ ...prev, enableStrictAntiCheat: e.target.checked }))
                    }
                    className="w-4 h-4 text-[#2D6A4F] rounded border-[#E1E8E2] focus:ring-[#2D6A4F]"
                  />
                  <span className="text-xs font-semibold text-[#2D3436]">
                    Aktifkan Proteksi Ketat (Blokir Clipboard, Cegah Shortcut, & Deteksi Perpindahan Tab)
                  </span>
                </label>
              </div>

              {/* Safe Exam Browser & Kiosk Mode Guide */}
              <div className="p-3 bg-[#F1F5F2] border border-[#E1E8E2] rounded-xl text-xs text-[#55655B] space-y-1 leading-relaxed">
                <strong className="text-[#1B4332] block">Kompatibilitas Safe Exam Browser & Kiosk Mode:</strong>
                <p className="text-[11px]">
                  Sistem CBT SMP Para Sahabat kompatibel dengan Safe Exam Browser (SEB) dan Chromebook Kiosk Mode untuk membatasi akses sistem operasi secara menyeluruh pada laboratorium sekolah.
                </p>
              </div>

              <div className="pt-3 border-t border-[#E1E8E2] flex items-center justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white bg-[#2D6A4F] hover:bg-[#1B4332] shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Pengaturan Ujian</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </div>

    </div>
  );
};
