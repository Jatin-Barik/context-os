import { useMemo } from 'react';
import { useContext } from '@/services/context/useContext';
import { cn } from '@/lib/cn';

interface ContextInspectorProps {
  input: {
    windowTitle?: string;
    windowProcess?: string;
    ocrText?: string;
    clipboardText?: string;
    selectedText?: string;
    browserContext?: {
      available: boolean;
      url?: string;
      domain?: string;
      title?: string;
    };
    displayName?: string;
    resolution?: string;
    timestamp?: string;
    metadata?: Record<string, unknown>;
  };
}

export function ContextInspector({ input }: ContextInspectorProps) {
  const { context, loading } = useContext(input);
  const preview = useMemo(() => JSON.stringify(context, null, 2), [context]);

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
        <div>Window: {context?.windowTitle ?? 'Pending'}</div>
        <div>Application: {context?.application?.name ?? 'Pending'}</div>
        <div>Intent: {context?.intent?.intent ?? 'Pending'}</div>
        <div>Detection Time: {context?.timestamp ? new Date(context.timestamp).toLocaleTimeString() : 'Pending'}</div>
      </div>
      <pre className="mt-3 max-h-56 overflow-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] leading-6 text-slate-300">
        {loading ? 'Building context…' : preview}
      </pre>
    </div>
  );
}
