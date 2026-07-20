import { PauseCircle, Sparkles } from 'lucide-react';
import type { AIExecutionState } from '@/store/shellStore';
import { cn } from '@/lib/cn';

interface CommandResponsePanelProps {
  execution: AIExecutionState;
  onCancel: () => void;
  onFollowUp: (commandId: string) => void;
}

export function CommandResponsePanel({ execution, onCancel, onFollowUp }: CommandResponsePanelProps) {
  const hasResponse = Boolean(execution.formattedResponse || execution.response);
  const responseText = execution.formattedResponse || execution.response;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          Local AI response
        </span>
        <span>{execution.status === 'streaming' || execution.status === 'loading' ? 'Working' : execution.status}</span>
      </div>

      <div className="mt-3 space-y-3">
        {hasResponse ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm leading-6 text-slate-200">
            <div className="whitespace-pre-wrap text-slate-200">{responseText}</div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 px-3 py-4 text-sm text-slate-400">
            Run <span className="text-white">Explain this screen</span> to see a streamed local response here.
          </div>
        )}

        {execution.status === 'loading' || execution.status === 'streaming' ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            <PauseCircle className="h-4 w-4" />
            Stop generation
          </button>
        ) : null}

        {execution.followUps.length > 0 ? (
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Follow-up actions</div>
            <div className="grid gap-2">
              {execution.followUps.map((followUp) => (
                <button
                  key={`${followUp.title}-${followUp.detail}`}
                  type="button"
                  disabled={!followUp.commandId}
                  onClick={() => {
                    if (followUp.commandId) {
                      onFollowUp(followUp.commandId);
                    }
                  }}
                  className={cn(
                    'rounded-2xl border px-3 py-2 text-left text-sm transition',
                    followUp.commandId ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-white/5 bg-white/5 text-slate-500'
                  )}
                >
                  <div className="font-medium text-white">{followUp.title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{followUp.detail}</div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {execution.metrics ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Prompt {execution.metrics.promptLength} chars · {execution.metrics.tokenCount} tokens · {execution.metrics.inferenceTimeMs} ms
          </div>
        ) : null}

        {execution.error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{execution.error}</div> : null}
      </div>
    </div>
  );
}
