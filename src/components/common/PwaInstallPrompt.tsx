import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, Smartphone, Monitor, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [installed, setInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed PWA)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    // Listen for PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setShowModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setInstalled(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('PWA install prompt error:', err);
      }
    } else {
      setShowModal(true);
    }
  };

  // If already running as standalone app, show small active badge or nothing
  if (isStandalone || installed) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D8F3DC] text-[#1B4332] border border-[#95D5B2]">
        <CheckCircle className="w-3 h-3 text-[#2D6A4F]" />
        <span>PWA Aktif</span>
      </span>
    );
  }

  return (
    <>
      {/* Install Button Trigger in Navbar / Header */}
      <button
        id="btn-install-pwa"
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2D6A4F] hover:bg-[#1B4332] text-white shadow-xs transition-all cursor-pointer border border-[#1B4332]"
        title="Pasang / Install Aplikasi CBT di Komputer atau HP"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Pasang PWA</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* Instructional Modal for Manual Install (Chrome Desktop, iOS, Android) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-[#E1E8E2] animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8E2] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center font-bold">
                  <Download className="w-5 h-5 text-[#2D6A4F]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1B4332]">
                    Pasang Aplikasi CBT (PWA)
                  </h3>
                  <p className="text-[11px] text-[#55655B]">
                    SMP Para Sahabat – Ujian Tauhid
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-[#55655B] hover:text-[#1B4332] hover:bg-[#F1F5F2] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-[#2D3436]">
              <div className="p-3 bg-[#F7FCF8] rounded-xl border border-[#D8F3DC]">
                <p className="font-semibold text-[#1B4332] leading-relaxed">
                  Dengan memasang PWA, ujian berjalan dalam mode layar penuh terkunci (*kiosk standalone*), lebih stabil, cepat, dan hemat kuota tanpa bilah alamat browser.
                </p>
              </div>

              {isIOS ? (
                /* iOS Safari instructions */
                <div className="space-y-2">
                  <span className="font-bold text-[#1B4332] flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#2D6A4F]" />
                    Cara Pasang di iPhone / iPad (Safari):
                  </span>
                  <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-[#55655B]">
                    <li>Tekan tombol <strong>Bagikan / Share (<Share className="w-3 h-3 inline text-[#2D6A4F]" />)</strong> di baris menu bawah Safari.</li>
                    <li>Gulir ke bawah dan pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</li>
                    <li>Tekan <strong>Tambah (Add)</strong> di pojok kanan atas.</li>
                  </ol>
                </div>
              ) : (
                /* Desktop & Android Chrome instructions */
                <div className="space-y-2">
                  <span className="font-bold text-[#1B4332] flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-[#2D6A4F]" />
                    Cara Pasang di Laptop / Komputer / Android:
                  </span>
                  <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-[#55655B]">
                    <li>Klik ikon <strong>Install / Pasang (<Download className="w-3 h-3 inline text-[#2D6A4F]" />)</strong> di bilah alamat (*address bar*) browser Anda.</li>
                    <li>Atau buka Menu Browser <strong>(titik tiga ⋮) &gt; Simpan dan Bagikan &gt; Pasang Aplikasi CBT</strong>.</li>
                    <li>Klik tombol <strong>Install / Pasang</strong> saat konfirmasi muncul.</li>
                  </ol>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 px-4 rounded-xl font-bold text-xs text-white bg-[#2D6A4F] hover:bg-[#1B4332] transition-colors cursor-pointer text-center shadow-xs"
                >
                  Saya Mengerti
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
