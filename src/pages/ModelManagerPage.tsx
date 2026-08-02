import { Boxes } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { useShellStore } from '@/store/shellStore';
import { useModelManagerStore, getModelSnapshots } from '@/store/modelManagerStore';
import { cn } from '@/lib/cn';

export function ModelManagerPage() {
  const currentModelId = useShellStore((state) => state.currentModelId);
  const models = useModelManagerStore((state) => state.models);
  const installModel = useModelManagerStore((state) => state.installModel);
  const deleteModel = useModelManagerStore((state) => state.deleteModel);
  const updateModel = useModelManagerStore((state) => state.updateModel);
  const activateModel = useModelManagerStore((state) => state.activateModel);

  const snapshots = getModelSnapshots(models);
  const installedCount = snapshots.filter((model) => model.installed).length;
  const updatesAvailable = snapshots.filter((model) => model.updateAvailable).length;
  const activeModel = snapshots.find((model) => model.id === currentModelId) ?? snapshots[0];

  return (
    <PageShell
      eyebrow="Model Manager"
      title="Local model orchestration"
      description="Track which local models are installed, queued, and ready for use. The runtime will swap between text and vision backends through a stable interface."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <GlassCard className="p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Installed</div>
          <div className="mt-2 text-3xl font-semibold text-white">{installedCount}</div>
          <div className="mt-1 text-sm text-slate-400">Local models available to the AI runtime.</div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Active model</div>
          <div className="mt-2 text-3xl font-semibold text-white">{activeModel?.name ?? 'None'}</div>
          <div className="mt-1 text-sm text-slate-400">{activeModel?.modality ?? 'Unknown'} · {activeModel?.installed ? 'Installed' : 'Not installed'}</div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Updates</div>
          <div className="mt-2 text-3xl font-semibold text-white">{updatesAvailable}</div>
          <div className="mt-1 text-sm text-slate-400">Models that can be refreshed locally.</div>
        </GlassCard>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {snapshots.map((model) => {
          const isActive = model.id === currentModelId;

          return (
            <GlassCard
              key={model.id}
              className={cn(
                'flex h-full flex-col gap-4 p-4 transition',
                isActive ? 'border-cyan-400/30 bg-cyan-400/10' : 'hover:border-white/20 hover:bg-white/10'
              )}
            >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-white">{model.name}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-400">{model.description}</div>
                  </div>
                  <span className={cn('rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em]', model.installed ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100' : 'border-white/10 text-slate-500')}>
                    {model.installed ? (model.updateAvailable ? 'Update available' : 'Installed') : model.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">{model.modality}</div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">{model.version}</div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">{model.sizeMb} MB</div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">{model.ramUsageMb} MB RAM</div>
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => activateModel(model.id)}
                  >
                    {isActive ? 'Active' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => installModel(model.id)}
                    disabled={model.installed}
                  >
                    Install
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-100 transition hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => updateModel(model.id)}
                    disabled={!model.installed || !model.updateAvailable}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => deleteModel(model.id)}
                    disabled={model.locked}
                  >
                    Delete
                  </button>
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {model.active ? 'In use by the AI runtime' : model.locked ? 'Protected default model' : 'Optional local model'}
                </div>
              </GlassCard>
          );
        })}
      </div>
      <div className="mt-5">
        <EmptyState title="Model registry is now interactive" description="Install, update, delete, and activate local models from one place, and the runtime will use the selected model automatically." icon={<Boxes className="h-5 w-5" />} />
      </div>
    </PageShell>
  );
}
