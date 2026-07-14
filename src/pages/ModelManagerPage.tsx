import { Boxes } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { LOCAL_MODELS } from '@/models/localModels';
import { useShellStore } from '@/store/shellStore';

export function ModelManagerPage() {
  const currentModelId = useShellStore((state) => state.currentModelId);
  const setCurrentModelId = useShellStore((state) => state.setCurrentModelId);

  return (
    <PageShell
      eyebrow="Model Manager"
      title="Local model orchestration"
      description="Track which local models are installed, queued, and ready for use. The runtime will swap between text and vision backends through a stable interface."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {LOCAL_MODELS.map((model) => {
          const active = model.id === currentModelId;

          return (
            <button type="button" key={model.id} className="text-left" onClick={() => setCurrentModelId(model.id)}>
              <GlassCard className={`flex h-full flex-col gap-4 p-4 transition ${active ? 'border-cyan-400/30 bg-cyan-400/10' : 'hover:border-white/20 hover:bg-white/10'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-white">{model.name}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-400">{model.description}</div>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">{model.status}</span>
                </div>
                <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>{model.modality}</span>
                  <span>{active ? 'Active' : 'Select model'}</span>
                </div>
              </GlassCard>
            </button>
          );
        })}
      </div>
      <div className="mt-5">
        <EmptyState title="Model registry is ready" description="The shell uses a stable local model registry so future integrations can swap backends without changing the UI." icon={<Boxes className="h-5 w-5" />} />
      </div>
    </PageShell>
  );
}
