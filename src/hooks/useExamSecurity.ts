import { useEffect, useRef, useState, useCallback } from 'react';
import { SecurityViolation, ViolationType } from '../types';

interface UseExamSecurityProps {
  enabled: boolean;
  studentNis: string;
  studentName: string;
  className: string;
  maxViolations: number;
  onViolation: (violation: SecurityViolation) => void;
  onForceSubmit: () => void;
}

export function useExamSecurity({
  enabled,
  studentNis,
  studentName,
  className,
  maxViolations,
  onViolation,
  onForceSubmit,
}: UseExamSecurityProps) {
  const [violationsCount, setViolationsCount] = useState<number>(0);
  const [currentWarning, setCurrentWarning] = useState<SecurityViolation | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMultiTabDetected, setIsMultiTabDetected] = useState<boolean>(false);
  const lastViolationTimeRef = useRef<number>(0);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Helper to record violation with debouncing (prevent multiple fires within 1 second for same event)
  const registerViolation = useCallback(
    (type: ViolationType, message: string, severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'WARNING') => {
      if (!enabled) return;

      const now = Date.now();
      if (now - lastViolationTimeRef.current < 1200) {
        return; // debounce rapid triggers
      }
      lastViolationTimeRef.current = now;

      const timeStr = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const newViolation: SecurityViolation = {
        id: `VIO-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        studentNis,
        studentName,
        className,
        type,
        message,
        timestamp: timeStr,
        severity,
        penaltyApplied: `Pelanggaran tercatat (${violationsCount + 1}/${maxViolations})`,
      };

      setViolationsCount((prev) => {
        const updated = prev + 1;
        if (updated >= maxViolations) {
          newViolation.severity = 'CRITICAL';
          newViolation.penaltyApplied = 'Batas pelanggaran terlampaui. Ujian otomatis diselesaikan!';
          setTimeout(() => {
            onForceSubmit();
          }, 2000);
        }
        return updated;
      });

      setCurrentWarning(newViolation);
      onViolation(newViolation);
    },
    [enabled, studentNis, studentName, className, maxViolations, violationsCount, onViolation, onForceSubmit]
  );

  // Request Fullscreen helper
  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.warn('Fullscreen request denied or not supported:', err);
    }
  }, []);

  // Exit Fullscreen helper
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Exit fullscreen error:', err);
    }
  }, []);

  // Multi-tab detection via BroadcastChannel & LocalStorage
  useEffect(() => {
    if (!enabled) return;

    const channelName = `smp_cbt_session_${studentNis || 'active'}`;
    const myTabId = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    try {
      const bc = new BroadcastChannel(channelName);
      broadcastChannelRef.current = bc;

      // Broadcast announcement that this tab is active
      bc.postMessage({ type: 'PING_EXISTING', tabId: myTabId });

      bc.onmessage = (event) => {
        if (event.data?.type === 'PING_EXISTING') {
          // Another tab is pinging; respond that we are already running
          bc.postMessage({ type: 'PONG_EXISTING', tabId: myTabId });
        } else if (event.data?.type === 'PONG_EXISTING' && event.data.tabId !== myTabId) {
          // Detected existing tab
          setIsMultiTabDetected(true);
          registerViolation(
            'MULTI_TAB',
            'Sesi ganda terdeteksi! Ujian dibuka pada lebih dari satu tab atau jendela.',
            'CRITICAL'
          );
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in this environment', e);
    }

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, [enabled, studentNis, registerViolation]);

  // Tab switch & Window Blur detection
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        registerViolation(
          'TAB_SWITCH',
          'Peserta terdeteksi berpindah tab browser atau meminimalkan layar ujian.'
        );
      }
    };

    const handleWindowBlur = () => {
      // Small timeout to avoid false positives when interacting with system prompts
      setTimeout(() => {
        if (document.hidden) {
          registerViolation(
            'WINDOW_BLUR',
            'Browser kehilangan fokus (peserta diduga membuka jendela atau aplikasi lain).'
          );
        }
      }, 300);
    };

    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active && enabled) {
        registerViolation(
          'FULLSCREEN_EXIT',
          'Peserta keluar dari mode layar penuh (fullscreen).'
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [enabled, registerViolation]);

  // Copy, Cut, Paste, Right Click, & Shortcut prevention
  useEffect(() => {
    if (!enabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      registerViolation('RIGHT_CLICK', 'Klik kanan diblokir selama ujian berlangsung.', 'INFO');
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      registerViolation('COPY_ATTEMPT', 'Tindakan Copy tidak diizinkan selama ujian.', 'INFO');
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      registerViolation('COPY_ATTEMPT', 'Tindakan Cut tidak diizinkan selama ujian.', 'INFO');
    };

    const handlePaste = (e: ClipboardEvent) => {
      // In essay textarea we can either restrict or warn. For CBT integrity we block pasting external content
      e.preventDefault();
      registerViolation('PASTE_ATTEMPT', 'Tindakan Paste tidak diizinkan selama ujian.', 'INFO');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common inspect / copy shortcuts
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (
        (isCtrlOrCmd && ['c', 'v', 'x', 'a', 'p', 'u', 's'].includes(key)) ||
        e.key === 'F12' ||
        (isCtrlOrCmd && e.shiftKey && ['i', 'j', 'c'].includes(key))
      ) {
        e.preventDefault();
        registerViolation(
          'KEY_SHORTCUT',
          `Kombinasi tombol pintas (${e.ctrlKey ? 'Ctrl+' : ''}${e.metaKey ? 'Cmd+' : ''}${e.key}) dinonaktifkan.`
        );
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, registerViolation]);

  const dismissWarning = () => {
    setCurrentWarning(null);
  };

  return {
    violationsCount,
    currentWarning,
    isFullscreen,
    isMultiTabDetected,
    enterFullscreen,
    exitFullscreen,
    dismissWarning,
    registerViolation,
  };
}
