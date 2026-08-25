import React from 'react';
import { Shield, BookOpen, Clock, Users, GraduationCap, Sparkles } from 'lucide-react';
import { AppView } from '../../types';

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
    <header id="main-cbt-navbar" className="bg-white/95 backdrop-blur-md border-b border-[#E1E8E2] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & School Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] flex items-center justify-center text-white shadow-xs ring-2 ring-[#D8F3DC]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#1B4332]">
                  SMP PARA SAHABAT
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#D8F3DC] text-[#1B4332] border border-[#95D5B2]">
                  CBT Digital
                </span>
              </div>
              <p className="text-[11px] text-[#55655B] font-medium hidden xs:block">
                Sistem Ujian Digital – Aman, Modern, dan Terintegrasi
              </p>
            </div>
          </div>

          {/* Center Info (Hidden on active exam to keep header minimal) */}
          {!isExamActive && (
            <div className="hidden md:flex items-center gap-2 bg-[#F7FCF8] border border-[#D8F3DC] px-3 py-1 rounded-full text-xs text-[#1B4332] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Ujian Tauhid – Kitab Tauhid Bab 1 s.d. Bab 5</span>
            </div>
          )}

          {/* Right Section: Time & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Realtime Clock */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#2D3436] bg-[#F1F5F2] px-2.5 py-1 rounded-lg border border-[#E1E8E2]">
              <Clock className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span className="font-mono font-medium">{currentTime || '08:00:00'} WIB</span>
            </div>

            {/* View Switcher (Quick Toggle for evaluation & demonstration) */}
            {!isExamActive && (
              <div className="flex items-center p-0.5 bg-[#F1F5F2] rounded-lg border border-[#E1E8E2]">
                <button
                  id="nav-btn-student"
                  onClick={() => onNavigate('STUDENT_LOGIN')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    currentView.startsWith('STUDENT')
                      ? 'bg-[#2D6A4F] text-white shadow-xs'
                      : 'text-[#55655B] hover:text-[#1B4332]'
                  }`}
                  title="Masuk sebagai Peserta Ujian"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Siswa</span>
                </button>
                <button
                  id="nav-btn-admin"
                  onClick={() => onNavigate('ADMIN_DASHBOARD')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    currentView === 'ADMIN_DASHBOARD'
                      ? 'bg-[#2D6A4F] text-white shadow-xs'
                      : 'text-[#55655B] hover:text-[#1B4332]'
                  }`}
                  title="Panel Guru & Administrator"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Guru & Admin</span>
                </button>
              </div>
            )}

            {/* If Exam is active, show student identity pill */}
            {isExamActive && studentName && (
              <div className="flex items-center gap-2 bg-[#F7FCF8] border border-[#D8F3DC] px-2.5 py-1 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse"></div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#1B4332] truncate max-w-[120px] sm:max-w-[180px]">
                    {studentName}
                  </p>
                  <p className="text-[10px] text-[#2D6A4F]">{studentClass}</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
