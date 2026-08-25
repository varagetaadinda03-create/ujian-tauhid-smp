import React from 'react';
import { AlertCircle, CheckCircle2, Send, ArrowLeft, HelpCircle, FileText } from 'lucide-react';
import { Question, StudentAnswer } from '../../types';

interface SubmitConfirmModalProps {
  questions: Question[];
  answers: Record<number, StudentAnswer>;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  questions,
  answers,
  isOpen,
  onClose,
  onConfirmSubmit,
}) => {
  if (!isOpen) return null;

  const pgQuestions = questions.filter((q) => q.type === 'pg');
  const essayQuestions = questions.filter((q) => q.type === 'essay');

  const pgAnsweredCount = pgQuestions.filter((q) => answers[q.id]?.selectedOption).length;
  const pgUnansweredCount = pgQuestions.length - pgAnsweredCount;

  const essayAnsweredCount = essayQuestions.filter(
    (q) => answers[q.id]?.essayText && answers[q.id].essayText!.trim().length > 0
  ).length;
  const essayUnansweredCount = essayQuestions.length - essayAnsweredCount;

  const flaggedCount = (Object.values(answers) as StudentAnswer[]).filter((a) => a.isFlagged).length;
  const hasUnanswered = pgUnansweredCount > 0 || essayUnansweredCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl p-5 sm:p-7 shadow-xl border border-[#E1E8E2] animate-scaleUp">
        
        <div className="flex items-center gap-3 mb-3.5 pb-3 border-b border-[#E1E8E2]">
          <div className="w-9 h-9 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center font-bold">
            <FileText className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#1B4332]">
              Konfirmasi Selesai Ujian
            </h3>
            <p className="text-xs text-[#55655B]">
              Pastikan seluruh jawaban Anda telah terisi dengan benar sebelum mengirim.
            </p>
          </div>
        </div>

        {/* Answer Breakdown Cards */}
        <div className="grid grid-cols-2 gap-2.5 my-3.5">
          
          {/* PG Summary */}
          <div className="bg-[#F7FCF8] border border-[#E1E8E2] rounded-xl p-3.5 text-left">
            <span className="text-xs font-bold text-[#1B4332] block mb-1.5">
              Pilihan Ganda (10 Soal)
            </span>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#2D6A4F] flex items-center gap-1 text-[11px] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Terjawab:
                </span>
                <strong className="text-[#1B4332] font-mono text-xs">{pgAnsweredCount}/10</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#55655B] flex items-center gap-1 text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5" /> Belum Dijawab:
                </span>
                <strong className="text-[#2D3436] font-mono text-xs">{pgUnansweredCount}/10</strong>
              </div>
            </div>
          </div>

          {/* Essay Summary */}
          <div className="bg-[#F7FCF8] border border-[#E1E8E2] rounded-xl p-3.5 text-left">
            <span className="text-xs font-bold text-[#1B4332] block mb-1.5">
              Soal Esai (5 Soal)
            </span>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#2D6A4F] flex items-center gap-1 text-[11px] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Terjawab:
                </span>
                <strong className="text-[#1B4332] font-mono text-xs">{essayAnsweredCount}/5</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#55655B] flex items-center gap-1 text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5" /> Belum Dijawab:
                </span>
                <strong className="text-[#2D3436] font-mono text-xs">{essayUnansweredCount}/5</strong>
              </div>
            </div>
          </div>

        </div>

        {flaggedCount > 0 && (
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between mb-3.5">
            <span className="flex items-center gap-1.5 font-medium">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Soal masih ditandai ragu-ragu:
            </span>
            <strong className="font-mono text-xs bg-amber-200/80 px-2 py-0.5 rounded text-amber-950">
              {flaggedCount} Soal
            </strong>
          </div>
        )}

        {hasUnanswered && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-[#D63031] text-xs flex items-start gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-[#D63031] shrink-0 mt-0.5" />
            <span>
              <strong>Perhatian:</strong> Masih terdapat soal yang belum Anda jawab. Apakah Anda yakin tetap ingin mengakhiri dan mengirim ujian?
            </span>
          </div>
        )}

        {!hasUnanswered && (
          <p className="text-xs text-[#55655B] mb-4 leading-relaxed">
            Alhamdulillah! Anda telah mengisi seluruh 15 butir soal. Setelah menekan tombol <strong>Kirim Jawaban</strong>, jawaban Anda akan terkunci permanen.
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-[#E1E8E2]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2 px-4 rounded-lg text-xs font-semibold text-[#55655B] hover:text-[#2D3436] bg-[#F1F5F2] hover:bg-[#E1E8E2] border border-[#E1E8E2] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>KEMBALI KE UJIAN</span>
          </button>
          <button
            id="btn-final-submit-confirm"
            type="button"
            onClick={onConfirmSubmit}
            className="w-full sm:w-auto py-2 px-5 rounded-lg text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#1B4332] shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>KIRIM JAWABAN SEKARANG</span>
          </button>
        </div>

      </div>
    </div>
  );
};
