import React, { useState } from 'react';
import { BookOpen, KeyRound, User, Hash, School, AlertCircle, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Smartphone } from 'lucide-react';
import { ExamConfig, StudentSession } from '../../types';
import { PRESET_STUDENTS } from '../../data/defaultData';

interface LoginViewProps {
  config: ExamConfig;
  onLoginSuccess: (studentData: {
    nis: string;
    nisn: string;
    name: string;
    className: string;
    token: string;
    sessionId: string;
  }) => void;
  activeSessions: StudentSession[];
}

export const LoginView: React.FC<LoginViewProps> = ({
  config,
  onLoginSuccess,
  activeSessions,
}) => {
  const [name, setName] = useState<string>('');
  const [nisn, setNisn] = useState<string>('');
  const [nis, setNis] = useState<string>('');
  const [className, setClassName] = useState<string>('Kelas 9A');
  const [token, setToken] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Quick preset selector
  const handleSelectPreset = (preset: typeof PRESET_STUDENTS[0]) => {
    setName(preset.name);
    setNisn(preset.nisn || `008927182${preset.nis.slice(-1)}`);
    setNis(preset.nis);
    setClassName(preset.className);
    setToken(config.activeToken);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Harap masukkan Nama Lengkap Siswa.');
      return;
    }
    if (!nisn.trim()) {
      setErrorMsg('Harap masukkan NISN (Nomor Induk Siswa Nasional).');
      return;
    }
    if (nisn.trim().length < 6) {
      setErrorMsg('Harap periksa kembali NISN (Nomor Induk Siswa Nasional) yang dimasukkan.');
      return;
    }
    if (!token.trim()) {
      setErrorMsg('Harap masukkan Token Ujian yang diberikan pengawas.');
      return;
    }

    // Token validation
    if (token.trim().toUpperCase() !== config.activeToken.toUpperCase()) {
      setErrorMsg(`Token ujian tidak valid. Pastikan token yang Anda masukkan benar (Token aktif: ${config.activeToken}).`);
      return;
    }

    // Check if student already submitted by NIS or NISN
    const effectiveNis = nis.trim() || nisn.trim();
    const existing = activeSessions.find(
      (s) =>
        s.nis.toLowerCase() === effectiveNis.toLowerCase() ||
        (s.nisn && s.nisn.toLowerCase() === nisn.trim().toLowerCase())
    );
    if (existing && (existing.status === 'SUBMITTED' || existing.status === 'FORCE_SUBMITTED')) {
      setErrorMsg('Peserta dengan identitas NISN / NIS ini telah menyelesaikan ujian dan tidak dapat masuk kembali.');
      return;
    }

    const sessionId = `SESS-${className.replace(/\s+/g, '')}-${Math.floor(10000 + Math.random() * 90000)}`;

    onLoginSuccess({
      nis: effectiveNis,
      nisn: nisn.trim(),
      name: name.trim(),
      className,
      token: token.trim().toUpperCase(),
      sessionId,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4.25rem)] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-islamic-pattern">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Col: School & Exam Details Card (Regal Emerald & Gold) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#091F15] via-[#123626] to-[#1C4A35] text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden border border-[#C5A059]/30">
          
          {/* Subtle Islamic Geometric Corner Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C5A059]/20 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#2D6A4F]/30 via-transparent to-transparent pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-xl bg-[#0A2117] border border-[#C5A059]/50 flex items-center justify-center text-[#F9E7BA] shadow-sm">
                <BookOpen className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <h1 className="font-cinzel text-base sm:text-lg font-bold tracking-wider text-white">
                  SMP PARA SAHABAT
                </h1>
                <p className="text-[11px] text-[#E8D8B0] font-medium tracking-wide">
                  Portal Ujian Digital & Standar Integritas
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-black/30 border border-[#C5A059]/30 rounded-xl p-4 backdrop-blur-xs relative overflow-hidden">
                <div className="absolute -top-3 -right-3 text-[50px] opacity-10 text-[#C5A059] font-arabic select-none pointer-events-none">
                  توحيد
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#E8D8B0] tracking-widest uppercase mb-1">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  MATA PELAJARAN
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-white font-cinzel tracking-wide">
                  TAUHID
                </div>
                <div className="text-xs text-[#E8D8B0] font-arabic mt-1" dir="rtl">
                  كتاب التوحيد الذي هو حق الله على العبيد
                </div>
                <div className="text-[11px] text-[#D8E6DC] mt-2 font-medium">
                  Cakupan: Kitab Tauhid – Bab 1 sampai Bab 5
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-[#E8D8B0] uppercase font-bold tracking-wider block">Pilihan Ganda</span>
                  <span className="text-base font-extrabold text-white">10 Soal</span>
                  <span className="text-[9px] text-[#95D5B2] block mt-0.5 font-medium">Matan & Dalil</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-[#E8D8B0] uppercase font-bold tracking-wider block">Soal Esai</span>
                  <span className="text-base font-extrabold text-white">5 Soal</span>
                  <span className="text-[9px] text-[#95D5B2] block mt-0.5 font-medium">Analisis Konsep</span>
                </div>
              </div>

              <div className="bg-[#0A2117]/80 border border-[#C5A059]/40 rounded-xl p-3 text-xs text-white flex items-center justify-between">
                <span className="text-[11px] text-[#E8D8B0] font-medium">Alokasi Waktu Ujian:</span>
                <span className="font-bold text-[#0F2E21] bg-gradient-to-r from-[#F9E7BA] to-[#D4AF37] px-2.5 py-0.5 rounded-lg text-xs shadow-xs">
                  {config.durationMinutes} Menit
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-[#D8E6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Proctoring & Deteksi Integritas</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#F9E7BA] bg-white/10 px-2 py-0.5 rounded-md border border-[#C5A059]/30">
              <Smartphone className="w-3 h-3 text-[#C5A059]" />
              Support PWA App
            </span>
          </div>
        </div>

        {/* Right Col: Login Form (Clean Ivory Alabaster Card) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-[#E2E8E0] flex flex-col justify-between relative">
          <div>
            <div className="mb-5 pb-3 border-b border-[#E2E8E0]">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A5B18]">
                  Portal Peserta Ujian
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E21] tracking-tight font-cinzel">
                Masuk Ruang Ujian
              </h2>
              <p className="text-xs text-[#556B5F] mt-0.5">
                Lengkapi identitas Nama, NISN resmi, dan Token Ujian yang diberikan pengawas.
              </p>
            </div>

            {/* Quick preset chips for rapid testing */}
            <div className="mb-5 bg-[#F8FAF7] border border-[#DDE4DC] rounded-xl p-3.5">
              <span className="text-[10px] font-bold text-[#556B5F] uppercase tracking-wider block mb-2">
                Pilih Cepat Peserta (Data Siswa SMP Para Sahabat):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_STUDENTS.map((st) => (
                  <button
                    key={st.nis}
                    type="button"
                    onClick={() => handleSelectPreset(st)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-[#DDE4DC] hover:border-[#C5A059] hover:bg-[#FDFBF7] text-[#1E2922] font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] group-hover:bg-[#C5A059]"></span>
                    <span>{st.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-[#7A5B18] font-mono">({st.className})</span>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Gagal Memulai Ujian</p>
                  <p className="mt-0.5 text-rose-700">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#1E2922] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Nama Lengkap Siswa <span className="text-rose-600 font-bold">*</span></span>
                  <span className="text-[10px] text-[#556B5F] font-normal lowercase">sesuai kartu peserta</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556B5F]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Ahmad Fauzan Al-Ghifari"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#F8FAF7] border border-[#DDE4DC] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all font-semibold text-[#0F2E21]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#1E2922] uppercase tracking-wider mb-1">
                    NISN Siswa (10 Digit) <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556B5F]">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      id="input-nisn"
                      type="text"
                      required
                      maxLength={10}
                      value={nisn}
                      onChange={(e) => setNisn(e.target.value.replace(/\D/g, ''))}
                      placeholder="Contoh: 0089271821"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#F8FAF7] border border-[#DDE4DC] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all font-mono font-bold text-[#0F2E21]"
                    />
                  </div>
                  <span className="text-[10px] text-[#556B5F] mt-1 block">
                    Nomor Induk Siswa Nasional
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1E2922] uppercase tracking-wider mb-1">
                    NIS / No. Peserta
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556B5F]">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      id="input-nis"
                      type="text"
                      value={nis}
                      onChange={(e) => setNis(e.target.value)}
                      placeholder="Contoh: 2025001"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#F8FAF7] border border-[#DDE4DC] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all font-mono text-[#1E2922]"
                    />
                  </div>
                  <span className="text-[10px] text-[#556B5F] mt-1 block">
                    No. Absen / Induk Sekolah
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#1E2922] uppercase tracking-wider mb-1">
                    Kelas / Rombel
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556B5F]">
                      <School className="w-4 h-4" />
                    </div>
                    <select
                      id="select-class"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#F8FAF7] border border-[#DDE4DC] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all cursor-pointer font-semibold text-[#0F2E21]"
                    >
                      <option value="Kelas 7A">Kelas 7A</option>
                      <option value="Kelas 7B">Kelas 7B</option>
                      <option value="Kelas 8A">Kelas 8A</option>
                      <option value="Kelas 8B">Kelas 8B</option>
                      <option value="Kelas 9A">Kelas 9A</option>
                      <option value="Kelas 9B">Kelas 9B</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-[#1E2922] uppercase tracking-wider">
                      Token Ujian <span className="text-rose-600 font-bold">*</span>
                    </label>
                    <span className="text-[10px] text-[#7A5B18] font-bold bg-[#F4EBD9] border border-[#E0CF9B] px-1.5 py-0.5 rounded">
                      Aktif: {config.activeToken}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#556B5F]">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="input-token"
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Masukkan Token"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#F8FAF7] border border-[#DDE4DC] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all uppercase tracking-widest font-mono font-bold text-[#0F2E21]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-login-submit"
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#0F2E21] via-[#194633] to-[#0F2E21] hover:from-[#194633] hover:to-[#1F513B] active:scale-[0.99] text-[#F9E7BA] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-[#C5A059]/40"
                >
                  <span className="tracking-wide">Masuk Ruang Persiapan Ujian</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 pt-3 border-t border-[#E2E8E0] flex items-center justify-between text-[11px] text-[#556B5F]">
            <span className="font-medium">SMP Para Sahabat CBT Digital v2.4</span>
            <span className="flex items-center gap-1.5 text-[#1F513B] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#1F513B] animate-pulse"></span>
              Sistem Pengawasan Aktif
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
