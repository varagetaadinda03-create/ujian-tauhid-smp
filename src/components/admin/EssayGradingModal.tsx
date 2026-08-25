import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Award, FileText, User, Save, Sparkles, MessageSquare } from 'lucide-react';
import { Question, StudentSession, StudentAnswer } from '../../types';

interface EssayGradingModalProps {
  isOpen: boolean;
  session: StudentSession | null;
  questions: Question[];
  onClose: () => void;
  onSaveGrades: (nis: string, updatedAnswers: Record<number, StudentAnswer>, totalEssayScore: number) => void;
}

export const EssayGradingModal: React.FC<EssayGradingModalProps> = ({
  isOpen,
  session,
  questions,
  onClose,
  onSaveGrades,
}) => {
  const [essayScores, setEssayScores] = useState<Record<number, number>>({});
  const [teacherNotes, setTeacherNotes] = useState<Record<number, string>>({});

  const essayQuestions = questions.filter((q) => q.type === 'essay');

  useEffect(() => {
    if (session) {
      const initialScores: Record<number, number> = {};
      const initialNotes: Record<number, string> = {};

      essayQuestions.forEach((q) => {
        const ans = session.answers[q.id];
        initialScores[q.id] = ans?.scoreAwarded ?? 0;
        initialNotes[q.id] = ans?.teacherNotes ?? '';
      });

      setEssayScores(initialScores);
      setTeacherNotes(initialNotes);
    }
  }, [session, isOpen]);

  if (!isOpen || !session) return null;

  const handleScoreChange = (qId: number, score: number, maxWeight: number) => {
    const clamped = Math.max(0, Math.min(maxWeight, score));
    setEssayScores((prev) => ({
      ...prev,
      [qId]: clamped,
    }));
  };

  const handleNoteChange = (qId: number, note: string) => {
    setTeacherNotes((prev) => ({
      ...prev,
      [qId]: note,
    }));
  };

  const totalEssayScore = (Object.values(essayScores) as number[]).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const maxPossibleEssay = essayQuestions.reduce((sum, q) => sum + q.scoreWeight, 0);

  const handleSave = () => {
    const updatedAnswers = { ...session.answers };

    essayQuestions.forEach((q) => {
      if (updatedAnswers[q.id]) {
        updatedAnswers[q.id] = {
          ...updatedAnswers[q.id],
          scoreAwarded: essayScores[q.id] || 0,
          teacherNotes: teacherNotes[q.id] || '',
        };
      } else {
        updatedAnswers[q.id] = {
          questionId: q.id,
          type: 'essay',
          essayText: '',
          isFlagged: false,
          lastSavedAt: new Date().toLocaleTimeString('id-ID'),
          isSynced: true,
          scoreAwarded: essayScores[q.id] || 0,
          teacherNotes: teacherNotes[q.id] || '',
        };
      }
    });

    onSaveGrades(session.nis, updatedAnswers, totalEssayScore);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-[#E1E8E2] my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E1E8E2] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#1B4332]">
                  Penilaian Jawaban Esai Peserta
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D8F3DC] text-[#1B4332] border border-[#95D5B2]">
                  {session.className}
                </span>
              </div>
              <p className="text-[11px] text-[#55655B] mt-0.5">
                Peserta: <strong className="text-[#1B4332]">{session.name}</strong> • NIS: {session.nis}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#55655B] hover:text-[#1B4332] hover:bg-[#F1F5F2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aggregate Score Bar */}
        <div className="bg-[#2D6A4F] text-white rounded-xl p-3.5 mb-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] text-[#D8F3DC] block uppercase tracking-wider font-bold">Total Nilai Esai Peserta:</span>
            <div className="text-xl font-black font-mono mt-0.5">
              {totalEssayScore} <span className="text-[11px] text-[#D8F3DC] font-normal">/ {maxPossibleEssay} Poin Maksimal</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#D8F3DC] block uppercase tracking-wider font-bold">Nilai PG Otomatis:</span>
            <span className="text-base font-bold font-mono text-white">
              {session.pgScore ?? 0} Poin
            </span>
          </div>
        </div>

        {/* Questions & Answers List */}
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {essayQuestions.map((q) => {
            const studentAns = session.answers[q.id]?.essayText || '';
            const currentScore = essayScores[q.id] ?? 0;
            const currentNote = teacherNotes[q.id] ?? '';

            return (
              <div key={q.id} className="bg-[#F7FCF8] border border-[#E1E8E2] rounded-xl p-3.5 sm:p-4 space-y-3">
                
                {/* Question info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#2D6A4F] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {q.number}
                    </span>
                    <span className="text-xs font-bold text-[#1B4332] bg-[#D8F3DC] px-2 py-0.5 rounded border border-[#95D5B2]">
                      {q.chapter}
                    </span>
                    <span className="text-xs text-[#55655B] font-medium">
                      {q.titleTopic}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1B4332] bg-white border border-[#E1E8E2] px-2 py-0.5 rounded">
                    Bobot: {q.scoreWeight} Poin
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#1B4332] leading-relaxed">
                  {q.questionText}
                </p>

                {/* Rubric */}
                {q.rubricGuide && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-950 leading-relaxed whitespace-pre-line">
                    <strong className="text-amber-950 font-bold block mb-0.5">Pedoman Rubrik Guru:</strong>
                    {q.rubricGuide}
                  </div>
                )}

                {/* Student's Answer */}
                <div className="bg-white border border-[#95D5B2] rounded-lg p-3">
                  <span className="text-[11px] font-bold text-[#1B4332] block mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Jawaban Siswa ({session.name}):
                  </span>
                  {studentAns ? (
                    <p className="text-xs text-[#2D3436] leading-relaxed whitespace-pre-wrap font-sans">
                      {studentAns}
                    </p>
                  ) : (
                    <p className="text-xs text-rose-500 italic">
                      [Siswa tidak mengisi jawaban pada butir soal ini]
                    </p>
                  )}
                </div>

                {/* Teacher Score Input & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-[#E1E8E2]">
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold text-[#1B4332] uppercase tracking-wider mb-1">
                      Beri Nilai (0 s.d. {q.scoreWeight}):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={q.scoreWeight}
                        value={currentScore}
                        onChange={(e) => handleScoreChange(q.id, Number(e.target.value), q.scoreWeight)}
                        className="w-20 p-1.5 bg-white border border-[#E1E8E2] rounded-lg font-bold font-mono text-xs text-[#1B4332] focus:ring-1 focus:ring-[#2D6A4F]"
                      />
                      <span className="text-[11px] text-[#55655B]">/ {q.scoreWeight} Poin</span>
                    </div>
                  </div>

                  <div className="sm:col-span-8">
                    <label className="block text-[10px] font-bold text-[#1B4332] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-[#55655B]" /> Catatan / Feedback Guru (Opsional):
                    </label>
                    <input
                      type="text"
                      value={currentNote}
                      onChange={(e) => handleNoteChange(q.id, e.target.value)}
                      placeholder="Contoh: Pemahaman dalil sangat baik dan tepat."
                      className="w-full p-1.5 bg-white border border-[#E1E8E2] rounded-lg text-xs text-[#2D3436] focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E1E8E2] flex items-center justify-between gap-3 mt-4">
          <div className="text-[11px] text-[#55655B]">
            Nilai akhir otomatis diperbarui setelah disimpan.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg font-semibold text-xs text-[#55655B] hover:bg-[#F1F5F2] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg font-bold text-xs text-white bg-[#2D6A4F] hover:bg-[#1B4332] shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan & Terbitkan Nilai</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
