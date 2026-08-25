import React from 'react';
import { Shield, BookOpen, Clock, Users, GraduationCap, Sparkles } from 'lucide-react';
import { AppView } from '../../types';
import { PwaInstallPrompt } from './PwaInstallPrompt';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  studentName?: string;
  studentClass?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  studentName,
  studentClass,
}) => {
  const [currentTime, setCurrentTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isExamActive = currentView === 'STUDENT_EXAM';

  return (
    <header id="main-cbt-navbar" className="bg-white/95 backdrop-blur-md border-b border-[#E2E8E0] sticky top-0 z-30 shadow-[0_2px_12px_-4px_rgba(15,46,33,0.06)]">
      {/* Top subtle golden accent hairline */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#0F2E21] via-[#C5A059] to-[#0F2E21]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-16">
          
          {/* Logo & School Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F2E21] to-[#1F513B] p-0.5 shadow-sm ring-1 ring-[#C5A059]/40 flex items-center justify-center text-white">
              <div className="w-full h-full rounded-[10px] bg-[#0A2117]/60 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#E8D8B0]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-bold text-sm sm:text-[15px] tracking-wider text-[#0F2E21]">
                  SMP PARA SAHABAT
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4EBD9] text-[#7A5B18] border border-[#E0CF9B]">
                  <Sparkles className="w-2.5 h-2.5 text-[#B3862A]" />
                  CBT Digital
                </span>
              </div>
              <p className="text-[11px] text-[#556B5F] font-medium hidden xs:block">
                Evaluasi Pembelajaran Kitab Tauhid Bab 1 s.d. 5
              </p>
            </div>
          </div>

          {/* Center Info (Hidden on active exam to keep header minimal) */}
          {!isExamActive && (
            <div className="hidden lg:flex items-center gap-2 bg-[#F8FAF7] border border-[#D5E2D8] px-3.5 py-1 rounded-full text-xs text-[#1F513B] font-medium shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
              <span className="font-medium tracking-wide">Ujian Tauhid – Semester Ganjil 2025/2026</span>
            </div>
          )}

          {/* Right Section: Time & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Realtime Clock */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#1E2922] bg-[#F5F7F4] px-2.5 py-1.5 rounded-lg border border-[#E2E8E0]">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-mono font-bold text-[#0F2E21]">{currentTime || '08:00:00'} WIB</span>
            </div>

            {/* PWA Install Button */}
            {!isExamActive && <PwaInstallPrompt />}

            {/* View Switcher (Quick Toggle for evaluation & demonstration) */}
            {!isExamActive && (
              <div className="flex items-center p-1 bg-[#ECEFEA] rounded-xl border border-[#DDE4DC]">
                <button
                  id="nav-btn-student"
                  onClick={() => onNavigate('STUDENT_LOGIN')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentView.startsWith('STUDENT')
                      ? 'bg-[#0F2E21] text-[#F9E7BA] shadow-xs ring-1 ring-[#C5A059]/30'
                      : 'text-[#556B5F] hover:text-[#0F2E21]'
                  }`}
                  title="Masuk sebagai Peserta Ujian"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Siswa</span>
                </button>
                <button
                  id="nav-btn-admin"
                  onClick={() => onNavigate('ADMIN_DASHBOARD')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'ADMIN_DASHBOARD'
                      ? 'bg-[#0F2E21] text-[#F9E7BA] shadow-xs ring-1 ring-[#C5A059]/30'
                      : 'text-[#556B5F] hover:text-[#0F2E21]'
                  }`}
                  title="Panel Guru & Administrator"
                >
                  <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Guru & Admin</span>
                </button>
              </div>
            )}

            {/* If Exam is active, show student identity pill */}
            {isExamActive && studentName && (
              <div className="flex items-center gap-2 bg-[#F8FAF7] border border-[#C5A059]/40 px-3 py-1 rounded-xl shadow-xs">
                <div className="w-2 h-2 rounded-full bg-[#1F513B] animate-pulse"></div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#0F2E21] truncate max-w-[120px] sm:max-w-[180px]">
                    {studentName}
                  </p>
                  <p className="text-[10px] text-[#C5A059] font-semibold">{studentClass}</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
