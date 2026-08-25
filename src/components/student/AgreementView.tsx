import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Camera, CameraOff, Maximize, AlertTriangle, CheckSquare, Square, ArrowLeft, Play, Sparkles, CheckCircle, Wifi, Monitor } from 'lucide-react';
import { ExamConfig } from '../../types';

interface AgreementViewProps {
  studentData: {
    nis: string;
    nisn?: string;
    name: string;
    className: string;
    token: string;
    sessionId: string;
  };
  config: ExamConfig;
  onStartExam: (cameraActive: boolean) => void;
  onBackToLogin: () => void;
}

export const AgreementView: React.FC<AgreementViewProps> = ({
  studentData,
  config,
  onStartExam,
  onBackToLogin,
}) => {
  const [agreed, setAgreed] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize camera request if required/optional
  const requestCamera = async () => {
    setCameraLoading(true);
    setCameraError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 480 }, height: { ideal: 360 }, facingMode: 'user' },
          audio: false,
        });
        setStream(mediaStream);
        setCameraActive(true);
      } else {
        throw new Error('MediaDevices API tidak didukung pada peramban ini.');
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(
        'Kamera pengawas belum terhubung atau izin belum diberikan. Klik tombol di bawah untuk mengizinkan akses kamera peramban.'
      );
      setCameraActive(false);
    } finally {
      setCameraLoading(false);
    }
  };

  useEffect(() => {
    if (config.cameraPolicy !== 'DISABLED') {
      requestCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [config.cameraPolicy]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleStart = () => {
    if (!agreed) return;
    if (config.cameraPolicy === 'REQUIRED' && !cameraActive) {
      alert('Kamera pengawas wajib diaktifkan sebelum memulai ujian sesuai kebijakan sekolah.');
      return;
    }
    onStartExam(cameraActive);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#F1F5F2]">
      <div className="w-full max-w-4xl bg-white rounded-2xl p-5 sm:p-7 md:p-8 shadow-sm border border-[#E1E8E2]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E1E8E2]">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D8F3DC] text-[#1B4332] border border-[#95D5B2] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
              Langkah 2: Verifikasi Identitas & Pengawasan Kamera
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#1B4332] tracking-tight">
              Tata Tertib & Kesiapan Pengawas Ujian
            </h2>
            <p className="text-xs text-[#55655B] mt-0.5">
              Pastikan data diri Anda sudah benar dan posisi wajah terlihat jelas di kamera pengawas.
            </p>
          </div>

          <button
            onClick={onBackToLogin}
            className="self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-semibold text-[#55655B] hover:text-[#1B4332] bg-[#F1F5F2] hover:bg-[#E1E8E2] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Koreksi Data / NISN</span>
          </button>
        </div>

        {/* Candidate Identity Card Banner */}
        <div className="mt-4 p-3.5 bg-[#F7FCF8] rounded-xl border border-[#95D5B2]/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-[#55655B] font-bold uppercase tracking-wider block">Nama Siswa</span>
            <span className="font-bold text-[#1B4332] truncate block">{studentData.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#55655B] font-bold uppercase tracking-wider block">NISN Siswa</span>
            <span className="font-mono font-bold text-[#1B4332] block">{studentData.nisn || studentData.nis}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#55655B] font-bold uppercase tracking-wider block">Kelas & Rombel</span>
            <span className="font-semibold text-[#2D3436] block">{studentData.className}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#55655B] font-bold uppercase tracking-wider block">Token Ujian</span>
            <span className="font-mono font-bold text-[#2D6A4F] bg-[#D8F3DC] px-1.5 py-0.5 rounded inline-block">
              {studentData.token}
            </span>
          </div>
        </div>

        {/* 2-Columns layout: Rules & Camera/Device check */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-5">
          
          {/* Rules Section (7 cols) */}
          <div className="md:col-span-7 space-y-3.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1B4332]">
              <ShieldAlert className="w-4 h-4 text-[#2D6A4F]" />
              <span>Tata Tertib Integritas & Keamanan Ujian:</span>
            </div>

            <div className="bg-[#F7FCF8] border border-[#E1E8E2] rounded-xl p-3.5 sm:p-4 space-y-2.5 text-xs text-[#2D3436] leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D8F3DC] text-[#1B4332] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  <strong className="text-[#1B4332]">Kamera Pengawas Aktif:</strong> Kamera pengawas akan merekam posisi peserta secara berkala selama ujian berlangsung.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D8F3DC] text-[#1B4332] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  <strong className="text-[#1B4332]">Jangan berpindah tab atau keluar fullscreen:</strong> Sistem akan mendeteksi kehilangan fokus dan mencatat setiap pelanggaran di log pengawas.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D8F3DC] text-[#1B4332] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  <strong className="text-[#1B4332]">Dilarang copy, cut, paste, atau klik kanan:</strong> Fitur manipulasi clipboard dinonaktifkan untuk menjaga kemurnian ujian.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D8F3DC] text-[#1B4332] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <p>
                  <strong className="text-[#1B4332]">Batas Maksimal Pelanggaran {config.maxViolationsAllowed}x:</strong> Pelanggaran berulang akan menyebabkan ujian otomatis dihentikan dan dikunci oleh sistem.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Watermark Pengawasan:</strong> Watermark identitas Nama & NISN Anda akan ditampilkan transparan pada lembar soal untuk mencegah kecurangan.
              </span>
            </div>
          </div>

          {/* Device & Camera Check (5 cols) */}
          <div className="md:col-span-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#1B4332] mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#2D6A4F]" />
                  <span>Kamera Pengawas (Proctoring Cam)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#D8F3DC] text-[#1B4332] border border-[#95D5B2]">
                  {config.cameraPolicy === 'REQUIRED' ? 'Wajib Aktif' : 'Disarankan'}
                </span>
              </div>

              {/* Camera Preview Box with Proctoring Grid */}
              <div className="relative aspect-4/3 w-full bg-slate-900 rounded-xl overflow-hidden border border-[#E1E8E2] flex items-center justify-center shadow-inner group">
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror scale-x-[-1]"
                    />
                    
                    {/* Face Guide Target Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-32 h-40 rounded-full border-2 border-dashed border-[#95D5B2]/60 animate-pulse"></div>
                    </div>

                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-[#95D5B2] flex items-center gap-1.5 border border-[#2D6A4F]">
                      <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse"></span>
                      KAMERA PENGAWAS AKTIF
                    </div>

                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-slate-300">
                      LIVE PROCTORING • {studentData.nisn || studentData.nis}
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-slate-400 space-y-2">
                    <CameraOff className="w-7 h-7 mx-auto text-slate-500" />
                    <p className="text-xs font-medium">
                      {cameraLoading ? 'Menghubungkan kamera pengawas...' : 'Kamera pengawas belum terhubung'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Izinkan akses webcam pada browser Anda untuk pengawasan proctoring.
                    </p>
                    <button
                      type="button"
                      onClick={requestCamera}
                      className="text-xs bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-lg font-bold shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Izinkan / Tes Kamera
                    </button>
                  </div>
                )}
              </div>

              {cameraError && (
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2">
                  {cameraError}
                </p>
              )}
            </div>

            {/* Device Readiness Checklist */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#55655B] bg-[#F7FCF8] p-2.5 rounded-lg border border-[#E1E8E2]">
              <div className="flex items-center gap-1 text-[#2D6A4F]">
                <CheckCircle className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Identitas Valid</span>
              </div>
              <div className="flex items-center gap-1 text-[#2D6A4F]">
                <CheckCircle className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Koneksi Siap</span>
              </div>
              <div className="flex items-center gap-1 text-[#2D6A4F]">
                <CheckCircle className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Kamera Pengawas</span>
              </div>
              <div className="flex items-center gap-1 text-[#2D6A4F]">
                <CheckCircle className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Anti-Cheat Aktif</span>
              </div>
            </div>

          </div>

        </div>

        {/* Agreement Checkbox & Start Button */}
        <div className="pt-4 border-t border-[#E1E8E2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="flex items-start sm:items-center gap-2.5 cursor-pointer group select-none">
            <div
              onClick={() => setAgreed(!agreed)}
              className="mt-0.5 sm:mt-0 text-[#2D6A4F] hover:text-[#1B4332] transition-colors"
            >
              {agreed ? (
                <CheckSquare className="w-5 h-5 fill-[#D8F3DC]" />
              ) : (
                <Square className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
              )}
            </div>
            <span
              onClick={() => setAgreed(!agreed)}
              className="text-xs sm:text-sm font-semibold text-[#2D3436] group-hover:text-[#1B4332]"
            >
              Saya menyatakan bahwa identitas di atas adalah benar dan saya siap mematuhi seluruh tata tertib ujian.
            </span>
          </label>

          <button
            id="btn-start-exam"
            type="button"
            disabled={!agreed}
            onClick={handleStart}
            className={`py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
              agreed
                ? 'bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.99] text-white'
                : 'bg-[#E1E8E2] text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>MULAI UJIAN SEKARANG</span>
          </button>
        </div>

      </div>
    </div>
  );
};
