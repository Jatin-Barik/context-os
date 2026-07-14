import { Clock3, Layers3 } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { InfoCard } from '@/components/ui/InfoCard';
import { useShellStore } from '@/store/shellStore';

export function HistoryPage() {
  const prompts = useShellStore((state) => state.recentPrompts);

  return (
    <PageShell
      eyebrow="History"
      title="Execution timeline"
      description="Track the commands you’ve run, the prompts that triggered them, and where the assistant should continue from next."
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {prompts.length === 0 ? (
            <EmptyState title="No history yet" description="Launch the palette and run a command to populate the local execution timeline." icon={<Clock3 className="h-5 w-5" />} />
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

        <div className="space-y-4">
          <InfoCard title="Local retention" value="Persistent" detail="Recent prompts stay in local storage so the shell remains usable without cloud sync." />
          <InfoCard title="Observability" value="Command-ready" detail="Every action is stored with its context so future workflows can resume naturally." />
        </div>
      </div>
    </PageShell>
  );
}
