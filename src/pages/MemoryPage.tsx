import { PageShell } from '@/components/layout/PageShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { useShellStore } from '@/store/shellStore';

export function MemoryPage() {
  const contexts = useShellStore((state) => state.recentContexts);

  return (
    <PageShell
      eyebrow="Memory"
      title="Searchable local memory"
      description="This surface will eventually query SQLite and LanceDB. The scaffold already keeps a structured, local history of screen context snapshots."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Embedded snapshots</div>
          <div className="mt-2 text-3xl font-semibold text-white">{contexts.length}</div>
          <div className="mt-1 text-sm text-slate-400">Context records that can later feed semantic search.</div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Next integration</div>
          <div className="mt-2 text-lg font-medium text-white">SQLite + LanceDB</div>
          <div className="mt-1 text-sm text-slate-400">Store conversation history, embeddings, and application history locally.</div>
        </GlassCard>
      </div>
    </PageShell>
  );
}
