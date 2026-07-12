import { useEffect } from 'react';
import { useShellStore } from '@/store/shellStore';

export function useThemeMode(): void {
  const themeMode = useShellStore((state) => state.themeMode);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);
}
