import { Activity, Brain, Cpu, HardDriveDownload, Layers3, Lightbulb, MonitorSmartphone, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { useShellStore } from '@/store/shellStore';
import { LOCAL_MODELS } from '@/models/localModels';
import { MetricCard } from './MetricCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { searchCommands } from '@/features/palette/commandRegistry';
import { cn } from '@/lib/cn';
import type { RuntimeStatus } from '@shared/bridge';

interface DashboardOverviewProps {
  runtimeStatus: RuntimeStatus | null;
}

export function DashboardOverview({ runtimeStatus }: DashboardOverviewProps) {
  const prompts = useShellStore((state) => state.recentPrompts);
  const actions = useShellStore((state) => state.generatedActions);
  const contexts = useShellStore((state) => state.recentContexts);
  const currentModelId = useShellStore((state) => state.currentModelId);
  const searchQuery = useShellStore((state) => state.searchQuery);

  const activeModel = useMemo(() => LOCAL_MODELS.find((model) => model.id === currentModelId) ?? LOCAL_MODELS[0], [currentModelId]);
  const quickCommands = useMemo(() => searchCommands(searchQuery).slice(0, 6), [searchQuery]);
  const activityItems = useMemo(
    () => [
      ...actions.slice(0, 2).map((action) => ({
        title: action.title,
        detail: action.detail,
        timestamp: action.createdAt
      })),
      ...prompts.slice(0, 2).map((prompt) => ({
        title: prompt.title,
        detail: prompt.summary,
        timestamp: prompt.createdAt
      }))
    ],
    [actions, prompts]
  );

  const aiStatusText = contexts.length > 0 ? 'Context learned locally' : 'Awaiting screen capture';
  const aiStatusDetail = contexts.length > 0 ? 'Screen context is already being recorded for local reasoning.' : 'The shell is ready for the screen understanding pipeline.';

  const memoryUsage = runtimeStatus
    ? `${runtimeStatus.appMemoryMb} MB / ${runtimeStatus.systemMemoryTotalMb} MB`
    : 'Probing...';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          label="AI Status"
          value={aiStatusText}
          detail={aiStatusDetail}
          icon={<Brain className="h-5 w-5" />}
          accent="cyan"
        />
        <MetricCard
          label="Current Model"
          value={activeModel.name}
          detail={`${activeModel.modality} model · ${activeModel.status}`}
          icon={<Layers3 className="h-5 w-5" />}
          accent="emerald"
        />
        <MetricCard
          label="GPU Status"
          value={runtimeStatus?.gpuStatus ?? 'Probing'}
          detail={runtimeStatus ? `${runtimeStatus.cpuCount} CPU cores detected for fallback and orchestration.` : 'Hardware probe is running locally.'}
          icon={<Cpu className="h-5 w-5" />}
          accent="amber"
        />
        <MetricCard
          label="Memory Usage"
          value={memoryUsage}
          detail={runtimeStatus ? 'App and system memory are tracked locally for responsiveness.' : 'Awaiting the first runtime sample.'}
          icon={<HardDriveDownload className="h-5 w-5" />}
          accent="violet"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70">Recent Activity</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Command and context history</h3>
            </div>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-4 space-y-3">
            {activityItems.length > 0 ? (
              activityItems.map((item) => (
                <div key={`${item.title}-${item.timestamp}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-sm text-slate-400">
                Run a command or capture context to populate the activity feed.
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70">Quick Commands</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Launch common tasks</h3>
            </div>
            <Zap className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-4 space-y-2">
            {quickCommands.map((command) => (
              <div key={command.id} className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
                <div>
                  <div className="text-sm font-medium text-white">{command.title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-400">{command.description}</div>
                </div>
                <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  {command.category}
                </span>
              </div>
            ))}
            {quickCommands.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-sm text-slate-400">
                No quick commands match the current search.
              </div>
            ) : null}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70">Model lineup</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Local model readiness</h3>
            </div>
            <MonitorSmartphone className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {LOCAL_MODELS.map((model) => (
              <div
                key={model.id}
                className={cn(
                  'rounded-2xl border p-4 transition',
                  model.id === activeModel.id ? 'border-cyan-400/30 bg-cyan-400/10' : 'border-white/10 bg-white/5'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-white">{model.name}</div>
                  <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    {model.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{model.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70">AI Status</p>
              <h3 className="mt-1 text-lg font-semibold text-white">System snapshot</h3>
            </div>
            <Lightbulb className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Current app</div>
              <div className="mt-1 text-white">{contexts[0]?.appName ?? 'No capture yet'}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Visible context</div>
              <div className="mt-1 text-white">{contexts[0]?.windowTitle ?? 'Waiting for screen understanding'}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Clipboard</div>
              <div className="mt-1 text-white">{contexts[0]?.clipboardText || 'Clipboard is empty or not captured yet.'}</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
