import { PageShell } from '@/components/layout/PageShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { useShellStore } from '@/store/shellStore';

export function HistoryPage() {
  const prompts = useShellStore((state) => state.recentPrompts);

  return (
    <PageShell
      eyebrow="History"
      title="Execution timeline"
      description="Track the commands you’ve run, the prompts that triggered them, and where the assistant should continue from next."
    >
      <div className="space-y-3">
        {prompts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-sm text-slate-400">
            No history yet. Launch the palette and run a command to populate the timeline.
          </div>
        ) : (
          prompts.map((prompt) => (
            <GlassCard key={prompt.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-white">{prompt.title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-400">{prompt.summary}</div>
                </div>
                <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  {new Date(prompt.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </PageShell>
  );
}
