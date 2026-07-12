import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CommandPalette } from '@/features/palette/CommandPalette';
import { ShellLayout } from '@/features/shell/ShellLayout';
import { useShellStore } from '@/store/shellStore';
import { useThemeMode } from '@/hooks/useThemeMode';

export default function App() {
  const paletteVisible = useShellStore((state) => state.paletteVisible);
  const openPalette = useShellStore((state) => state.openPalette);
  const closePalette = useShellStore((state) => state.closePalette);
  const closeNotifications = useShellStore((state) => state.closeNotifications);
  const setAppInfo = useShellStore((state) => state.setAppInfo);

  useThemeMode();

  useEffect(() => {
    window.contextos.getAppInfo().then(setAppInfo).catch(() => undefined);
    const stopListening = window.contextos.onPaletteOpen(openPalette);
    return stopListening;
  }, [openPalette, setAppInfo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closePalette();
        closeNotifications();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeNotifications, closePalette]);

  return (
    <div className="min-h-screen text-slate-100">
      <ShellLayout />
      <AnimatePresence>
        {paletteVisible ? <CommandPalette key="palette" onClose={closePalette} /> : null}
      </AnimatePresence>
    </div>
  );
}
