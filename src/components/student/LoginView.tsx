import React, { useState } from 'react';
import { BookOpen, KeyRound, User, Hash, School, AlertCircle, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#F1F5F2]">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Col: School & Exam Details Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#1B4332] text-white rounded-2xl p-5 sm:p-7 shadow-md flex flex-col justify-between relative overflow-hidden border border-[#2D6A4F]">
          {/* Background Subtle Accent */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-teal-400/10 blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#95D5B2]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  SMP PARA SAHABAT
                </h1>
                <p className="text-[11px] text-[#D8F3DC] font-medium">
                  Sistem Ujian Digital – Aman, Modern, & Terpadu
                </p>
              </div>
            </div>

            <div className="space-y-3.5 mb-6">
              <div className="bg-white/10 border border-white/15 rounded-xl p-3.5 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#95D5B2] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  MATA PELAJARAN
                </div>
                <div className="text-base sm:text-lg font-bold text-white">Tauhid</div>
                <div className="text-xs text-[#D8F3DC] font-arabic mt-1" dir="rtl">
                  كتاب التوحيد للشيخ محمد بن عبد الوهاب
                </div>
                <div className="text-[11px] text-emerald-100/90 mt-1">
                  Materi: Kitab Tauhid – Bab 1 sampai Bab 5
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                  <span className="text-[10px] text-[#D8F3DC] block">Pilihan Ganda</span>
                  <span className="text-sm font-bold text-white">10 Soal</span>
                  <span className="text-[9px] text-[#95D5B2] block mt-0.5">Teks Arab & Makna</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                  <span className="text-[10px] text-[#D8F3DC] block">Soal Esai</span>
                  <span className="text-sm font-bold text-white">5 Soal</span>
                  <span className="text-[9px] text-[#95D5B2] block mt-0.5">Penjelasan Konsep</span>
                </div>
              </div>

              <div className="bg-[#1B4332]/80 border border-[#95D5B2]/30 rounded-lg p-2.5 text-xs text-emerald-100 flex items-center justify-between">
                <span className="text-[11px]">Alokasi Waktu Ujian:</span>
                <span className="font-bold text-white bg-[#2D6A4F] px-2 py-0.5 rounded text-[11px]">
                  {config.durationMinutes} Menit
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/15 text-[11px] text-[#D8F3DC] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#95D5B2] shrink-0" />
            <span>Dilengkapi Proctoring & Deteksi Kecurangan Terpadu</span>
          </div>
        </div>

        {/* Right Col: Login Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-[#E1E8E2] flex flex-col justify-between">
          <div>
            <div className="mb-5">
              <h2 className="text-lg sm:text-xl font-black text-[#1B4332] tracking-tight">
                Login Peserta Ujian
              </h2>
              <p className="text-xs text-[#55655B] mt-0.5">
                Silakan lengkapi identitas dan masukkan token ujian untuk memulai.
              </p>
            </div>

            {/* Quick preset chips for rapid testing */}
            <div className="mb-5 bg-[#F7FCF8] border border-[#E1E8E2] rounded-xl p-3">
              <span className="text-[10px] font-bold text-[#55655B] uppercase tracking-wider block mb-2">
                Pilih Cepat Peserta (Demo / Pengujian):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_STUDENTS.map((st) => (
                  <button
                    key={st.nis}
                    type="button"
                    onClick={() => handleSelectPreset(st)}
                    className="text-xs px-2.5 py-1 rounded-md bg-white border border-[#E1E8E2] hover:border-[#2D6A4F] hover:bg-[#D8F3DC]/40 text-[#2D3436] font-medium transition-all shadow-2xs cursor-pointer"
                  >
                    {st.name.split(' ')[0]} ({st.className})
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Gagal Memulai Ujian</p>
                  <p className="mt-0.5 text-rose-700">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#2D3436] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Nama Lengkap Siswa <span className="text-rose-600 font-bold">*</span></span>
                  <span className="text-[10px] text-[#55655B] font-normal lowercase">sesuai daftar hadir</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#55655B]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Ahmad Fauzan Al-Ghifari"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] transition-all font-medium text-[#1B4332]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#2D3436] uppercase tracking-wider mb-1">
                    NISN Siswa (10 Digit) <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#55655B]">
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
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] transition-all font-mono font-bold text-[#1B4332]"
                    />
                  </div>
                  <span className="text-[10px] text-[#55655B] mt-0.5 block">
                    Nomor Induk Siswa Nasional
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#2D3436] uppercase tracking-wider mb-1">
                    NIS / No. Peserta (Opsional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#55655B]">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      id="input-nis"
                      type="text"
                      value={nis}
                      onChange={(e) => setNis(e.target.value)}
                      placeholder="Contoh: 2025001"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] transition-all font-mono text-[#2D3436]"
                    />
                  </div>
                  <span className="text-[10px] text-[#55655B] mt-0.5 block">
                    No. Absen / Induk Sekolah
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#2D3436] uppercase tracking-wider mb-1">
                    Kelas / Rombel
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#55655B]">
                      <School className="w-4 h-4" />
                    </div>
                    <select
                      id="select-class"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] transition-all cursor-pointer font-medium"
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
                    <label className="block text-[11px] font-bold text-[#2D3436] uppercase tracking-wider">
                      Token Ujian <span className="text-rose-600 font-bold">*</span>
                    </label>
                    <span className="text-[10px] text-[#2D6A4F] font-bold bg-[#D8F3DC] px-1.5 py-0.5 rounded">
                      Aktif: {config.activeToken}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#55655B]">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="input-token"
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Masukkan Token"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] transition-all uppercase tracking-widest font-mono font-bold text-[#1B4332]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-login-submit"
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Masuk Ruang Persiapan Ujian</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E1E8E2] flex items-center justify-between text-[11px] text-[#55655B]">
            <span>SMP Para Sahabat CBT v2.4</span>
            <span className="flex items-center gap-1 text-[#2D6A4F] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Koneksi Server Siap
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
