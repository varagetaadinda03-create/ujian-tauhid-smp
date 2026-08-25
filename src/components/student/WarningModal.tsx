import React from 'react';
import { AlertTriangle, ShieldAlert, Maximize2, XCircle } from 'lucide-react';
import { SecurityViolation } from '../../types';

interface WarningModalProps {
  warning: SecurityViolation | null;
  violationsCount: number;
  maxViolations: number;
  onDismiss: () => void;
  onReenterFullscreen: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({
  warning,
  violationsCount,
  maxViolations,
  onDismiss,
  onReenterFullscreen,
}) => {
  if (!warning) return null;

  const isCritical = violationsCount >= maxViolations;
  const isFullscreenViolation = warning.type === 'FULLSCREEN_EXIT';

  const handleAction = () => {
    if (isFullscreenViolation) {
      onReenterFullscreen();
    }
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl p-5 sm:p-7 shadow-xl border border-[#E1E8E2] relative overflow-hidden">
        
        {/* Top Warning Accent Stripe */}
        <div className={`h-1.5 absolute top-0 left-0 right-0 ${isCritical ? 'bg-[#D63031]' : 'bg-amber-500'}`} />

        <div className="flex items-start gap-3 mb-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isCritical ? 'bg-rose-100 text-[#D63031]' : 'bg-amber-100 text-amber-700'
          }`}>
            {isCritical ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isCritical ? 'bg-rose-100 text-[#D63031]' : 'bg-amber-100 text-amber-900'
            }`}>
              {isCritical ? 'PERINGATAN KRITIS / BATAS MAKSIMAL' : 'PERINGATAN KEAMANAN UJIAN'}
            </span>
            <h3 className="text-base sm:text-lg font-black text-[#1B4332] mt-0.5">
              {isFullscreenViolation ? 'Mode Layar Penuh Terganggu' : 'Aktivitas Tidak Wajar Terdeteksi!'}
            </h3>
          </div>
        </div>

        <div className="bg-[#F7FCF8] border border-[#E1E8E2] rounded-xl p-3.5 my-3.5 space-y-1.5 text-xs text-[#2D3436]">
          <p className="font-semibold text-[#1B4332]">{warning.message}</p>
          <div className="flex items-center justify-between pt-1.5 border-t border-[#E1E8E2] text-[11px] text-[#55655B]">
            <span>Waktu Kejadian: <strong>{warning.timestamp} WIB</strong></span>
            <span>Tipe: <strong>{warning.type}</strong></span>
          </div>
        </div>

        {/* Counter Pill */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs mb-4">
          <span className="font-semibold text-amber-900 text-xs">Total Catatan Pelanggaran:</span>
          <span className="font-bold text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-mono">
            {violationsCount} dari {maxViolations}
          </span>
        </div>

        <p className="text-[11px] text-[#55655B] mb-5 leading-relaxed">
          {isCritical ? (
            <span className="text-[#D63031] font-bold">
              Batas toleransi pelanggaran telah tercapai. Ujian Anda sedang dikunci dan dikirimkan otomatis ke pengawas.
            </span>
          ) : (
            'Harap tetap fokus pada halaman ujian. Jangan berpindah tab, jangan membuka aplikasi lain, dan jangan keluar dari mode layar penuh agar ujian tidak dibatalkan.'
          )}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            id="btn-dismiss-warning"
            type="button"
            onClick={handleAction}
            className={`w-full py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
              isCritical
                ? 'bg-[#D63031] hover:bg-[#A52021]'
                : 'bg-[#2D6A4F] hover:bg-[#1B4332]'
            }`}
          >
            {isFullscreenViolation ? (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>KEMBALI KE FULLSCREEN</span>
              </>
            ) : (
              <span>SAYA MENGERTI & LANJUTKAN UJIAN</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
