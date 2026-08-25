import React from 'react';
import { CheckCircle, BookOpen, ShieldCheck, Clock, FileCheck, ArrowRight, Sparkles, Award } from 'lucide-react';
import { StudentSession, ExamConfig } from '../../types';

interface CompletionViewProps {
  session: StudentSession;
  config: ExamConfig;
  onReturnToHome: () => void;
  onOpenAdminDashboard: () => void;
}

export const CompletionView: React.FC<CompletionViewProps> = ({
  session,
  config,
  onReturnToHome,
  onOpenAdminDashboard,
}) => {
  const answeredCount = Object.keys(session.answers).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#F1F5F2]">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-[#E1E8E2] text-center relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="h-1.5 bg-[#2D6A4F] absolute top-0 left-0 right-0" />

        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center mb-4 ring-4 ring-[#F7FCF8] shadow-2xs">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D8F3DC] text-[#1B4332] border border-[#95D5B2] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
          Status: Ujian Sukses Terkirim
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-[#1B4332] tracking-tight">
          ALHAMDULILLAH, UJIAN TELAH SELESAI
        </h1>
        <p className="text-xs text-[#55655B] mt-1 max-w-md mx-auto leading-relaxed">
          Terima kasih telah mengikuti ujian dengan tertib, jujur, dan sungguh-sungguh. Jawaban Anda telah tersimpan aman di server.
        </p>

        {/* Receipt / Summary Table Card */}
        <div className="bg-[#F7FCF8] border border-[#E1E8E2] rounded-xl p-4 my-5 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E1E8E2]">
            <span className="text-[#55655B]">Nama Peserta:</span>
            <strong className="text-[#1B4332] font-bold">{session.name}</strong>
          </div>
          {session.nisn && (
            <div className="flex items-center justify-between pb-2 border-b border-[#E1E8E2]">
              <span className="text-[#55655B]">Nomor Induk Siswa Nasional (NISN):</span>
              <strong className="text-[#2D6A4F] font-mono font-bold">{session.nisn}</strong>
            </div>
          )}
          <div className="flex items-center justify-between pb-2 border-b border-[#E1E8E2]">
            <span className="text-[#55655B]">Nomor Induk Siswa (NIS):</span>
            <strong className="text-[#2D3436] font-mono">{session.nis}</strong>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#E1E8E2]">
            <span className="text-[#55655B]">Kelas / Rombel:</span>
            <span className="text-[#2D3436] font-semibold">{session.className}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#E1E8E2]">
            <span className="text-[#55655B]">Mata Pelajaran:</span>
            <span className="text-[#1B4332] font-bold">Tauhid (Kitab Tauhid Bab 1–5)</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#E1E8E2]">
            <span className="text-[#55655B]">Waktu Selesai:</span>
            <span className="text-[#2D3436] font-mono">{session.submittedAt || new Date().toLocaleTimeString('id-ID')} WIB</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#E1E8E2]">
            <span className="text-[#55655B]">Total Soal Terisi:</span>
            <span className="text-[#2D6A4F] font-bold font-mono">{answeredCount} dari 15 Butir Soal</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#55655B]">Catatan Pelanggaran:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              session.violationsCount > 0
                ? 'bg-amber-100 text-amber-950 border border-amber-300'
                : 'bg-[#D8F3DC] text-[#1B4332] border border-[#95D5B2]'
            }`}>
              {session.violationsCount === 0 ? 'Sesi Bersih & Tertib (0)' : `${session.violationsCount} Catatan Fokus`}
            </span>
          </div>
        </div>

        {/* Teacher grading notice */}
        <div className="p-3.5 bg-[#F1F5F2] border border-[#E1E8E2] rounded-xl text-left text-xs text-[#2D3436] flex items-start gap-2.5 mb-5">
          <Award className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-[#1B4332]">Informasi Penilaian Guru:</strong>
            <p className="mt-0.5 text-[#55655B] leading-relaxed text-[11px]">
              Nilai 10 Pilihan Ganda telah diproses oleh sistem. Jawaban 5 Soal Esai akan diperiksa dan dinilai oleh dewan guru Tauhid melalui dashboard penilaian guru.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            id="btn-return-home"
            type="button"
            onClick={onReturnToHome}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-semibold text-[#55655B] hover:text-[#1B4332] bg-[#F1F5F2] hover:bg-[#E1E8E2] border border-[#E1E8E2] transition-all cursor-pointer"
          >
            Kembali ke Halaman Login
          </button>
          <button
            id="btn-view-admin-dashboard"
            type="button"
            onClick={onOpenAdminDashboard}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#1B4332] shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Buka Dashboard Guru / Pengawas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
