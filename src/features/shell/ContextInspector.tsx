import { useMemo } from 'react';
import { cn } from '@/lib/cn';
import type { AppInfo } from '@shared/bridge';
import type { ContextSnapshot } from '@/store/shellStore';
import { useApplicationContext } from '@/integrations/core/useApplicationContext';

interface ContextInspectorProps {
  input: ContextSnapshot | null;
  appInfo: AppInfo | null;
}

export function ContextInspector({ input, appInfo }: ContextInspectorProps) {
  const { applicationContext, loading, registry } = useApplicationContext({ context: input, appInfo });
  const preview = useMemo(() => JSON.stringify(applicationContext, null, 2), [applicationContext]);

  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className={cn('mt-4 rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4 text-sm text-slate-300')}>
      <div className="flex items-center justify-between">
        <div className="font-medium text-white">Context Inspector</div>
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">dev-only</div>
      </div>
      <div className="mt-3 space-y-2 text-xs text-slate-400">
        <div>Window: {applicationContext?.metadata.windowTitle ?? 'Pending'}</div>
        <div>Application: {applicationContext?.applicationName ?? 'Pending'}</div>
        <div>Adapter: {applicationContext?.adapterName ?? 'Pending'}</div>
        <div>Health: {applicationContext?.health.detail ?? 'Pending'}</div>
        <div>Detection Time: {applicationContext?.detectionTimeMs ?? 'Pending'} ms</div>
        <div>Execution Time: {applicationContext?.executionTimeMs ?? 'Pending'} ms</div>
        <div>Registered Adapters: {registry.map((entry) => entry.id).join(', ') || 'Pending'}</div>
      </div>
      <pre className="mt-3 max-h-56 overflow-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] leading-6 text-slate-300">
        {loading ? 'Building context…' : preview}
      </pre>
    </div>
  );
}
