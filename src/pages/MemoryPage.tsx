import { DatabaseZap, MemoryStick } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { InfoCard } from '@/components/ui/InfoCard';
import { useShellStore } from '@/store/shellStore';

export function MemoryPage() {
  const contexts = useShellStore((state) => state.recentContexts);

  return (
    <PageShell
      eyebrow="Memory"
      title="Searchable local memory"
      description="This surface will eventually query SQLite and LanceDB. The scaffold already keeps a structured, local history of screen context snapshots."
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {contexts.length === 0 ? (
            <EmptyState title="No memory snapshots yet" description="Capture context from the shell to begin building a searchable local memory graph." icon={<MemoryStick className="h-5 w-5" />} />
          ) : (
            contexts.slice(0, 3).map((context) => (
              <GlassCard key={context.id} className="p-4">
                <div className="text-sm font-medium text-white">{context.appName}</div>
                <div className="mt-1 text-sm leading-6 text-slate-400">{context.windowTitle}</div>
              </GlassCard>
            ))
          )}
        </div>

        <div className="space-y-4">
          <InfoCard title="Embedded snapshots" value={`${contexts.length}`} detail="Context records that can later feed semantic search and retrieval." />
          <InfoCard title="Next integration" value="SQLite + LanceDB" detail="Store conversation history, embeddings, and desktop context locally without leaving the device." />
        </div>
      </div>
    </PageShell>
  );
}
