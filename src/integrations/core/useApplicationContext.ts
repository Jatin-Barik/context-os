import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppInfo } from '@shared/bridge';
import type { ContextSnapshot } from '@/store/shellStore';
import { getSharedApplicationManager } from './ApplicationManager';
import type { ApplicationContext, ApplicationContextInput } from './ApplicationContext';
import type { InstalledAdapterSnapshot } from './ApplicationRegistry';
import type { ApplicationCommand } from './ApplicationTypes';

export interface UseApplicationContextInput {
  readonly context: ContextSnapshot | null;
  readonly appInfo: AppInfo | null;
}

export interface UseApplicationContextResult {
  readonly applicationContext: ApplicationContext | null;
  readonly loading: boolean;
  readonly registry: readonly InstalledAdapterSnapshot[];
  readonly resolveCommands: (query: string) => readonly ApplicationCommand[];
}

function toInput(context: ContextSnapshot | null, appInfo: AppInfo | null): ApplicationContextInput {
  return {
    appInfo,
    windowTitle: context?.windowTitle ?? appInfo?.name ?? 'Unknown window',
    windowProcess: context?.appName ?? appInfo?.name ?? 'unknown',
    selectedText: context?.selectedText ?? '',
    clipboardText: context?.clipboardText ?? '',
    currentUrl: context?.currentUrl ?? '',
    currentFileName: context?.currentFileName ?? '',
    currentLanguage: context?.currentLanguage ?? 'unknown',
    currentIntent: context?.currentIntent ?? 'Reading Research',
    currentErrorMessage: context?.currentErrorMessage ?? '',
    currentTableSummary: context?.currentTableSummary ?? '',
    currentImageSummary: context?.currentImageSummary ?? '',
    capturedAt: context?.capturedAt ?? new Date().toISOString(),
    metadata: {
      appName: context?.appName ?? appInfo?.name ?? 'unknown',
      currentUrl: context?.currentUrl ?? '',
      currentFileName: context?.currentFileName ?? '',
      currentLanguage: context?.currentLanguage ?? '',
      currentIntent: context?.currentIntent ?? '',
      currentImageSummary: context?.currentImageSummary ?? '',
      source: 'application-hook'
    }
  };
}

export function useApplicationContext(input: UseApplicationContextInput): UseApplicationContextResult {
  const manager = useMemo(() => getSharedApplicationManager(), []);
  const [applicationContext, setApplicationContext] = useState<ApplicationContext | null>(null);
  const [registry, setRegistry] = useState<readonly InstalledAdapterSnapshot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void (async () => {
      const resolution = await manager.resolve(toInput(input.context, input.appInfo));
      if (!cancelled) {
        setApplicationContext(resolution.context);
        setRegistry(resolution.installedAdapters);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [input.appInfo, input.context, manager]);

  const resolveCommands = useCallback((query: string) => (applicationContext ? manager.resolveCommands(applicationContext, query) : []), [applicationContext, manager]);

  return { applicationContext, loading, registry, resolveCommands };
}
