import { Activity, Brain, Cpu, HardDriveDownload, Layers3, Lightbulb, MonitorSmartphone, Sparkles, Zap, Clock3, ArrowRight, ScanSearch, Compass, PenTool, FolderOpen } from 'lucide-react';
import { useMemo } from 'react';
import { useShellStore } from '@/store/shellStore';
import { LOCAL_MODELS } from '@/models/localModels';
import { MetricCard } from './MetricCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatusCard } from '@/components/ui/StatusCard';
import { ShortcutCard } from '@/components/ui/ShortcutCard';
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
        <MetricCard label="AI Status" value={aiStatusText} detail={aiStatusDetail} icon={<Brain className="h-5 w-5" />} accent="cyan" />
        <MetricCard label="Current Model" value={activeModel.name} detail={`${activeModel.modality} model · ${activeModel.status}`} icon={<Layers3 className="h-5 w-5" />} accent="emerald" />
        <MetricCard label="GPU Status" value={runtimeStatus?.gpuStatus ?? 'Probing'} detail={runtimeStatus ? `${runtimeStatus.cpuCount} CPU cores detected for fallback and orchestration.` : 'Hardware probe is running locally.'} icon={<Cpu className="h-5 w-5" />} accent="amber" />
        <MetricCard label="Memory Usage" value={memoryUsage} detail={runtimeStatus ? 'App and system memory are tracked locally for responsiveness.' : 'Awaiting the first runtime sample.'} icon={<HardDriveDownload className="h-5 w-5" />} accent="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="p-5">
          <SectionHeader eyebrow="Recent activity" title="Command and context history" action={<Activity className="h-5 w-5 text-slate-400" />} />
          <div className="mt-4 space-y-3">
            {activityItems.length > 0 ? (
              activityItems.map((item) => (
                <div key={`${item.title}-${item.timestamp}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
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

        <div className="space-y-4">
          <StatusCard title="AI Status" value="Local context ready" detail="The shell is prepared for screen understanding and local-first assistance." icon={<Sparkles className="h-4 w-4" />} accent="cyan" />
          <StatusCard title="Quick Actions" value="4 shortcuts" detail="Use the palette to trigger explain, summarize, translate, or notes flows instantly." icon={<Zap className="h-4 w-4" />} accent="emerald" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-5">
          <SectionHeader eyebrow="Quick actions" title="Launch common tasks" action={<Zap className="h-5 w-5 text-slate-400" />} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ShortcutCard title="Explain Screen" detail="Break down context in a focused summary." icon={<ScanSearch className="h-4 w-4" />} accent="cyan" />
            <ShortcutCard title="Summarize" detail="Condense the current context into a short brief." icon={<Compass className="h-4 w-4" />} accent="emerald" />
            <ShortcutCard title="Translate" detail="Convert selected text while preserving tone." icon={<ArrowRight className="h-4 w-4" />} accent="amber" />
            <ShortcutCard title="Generate Notes" detail="Create structured notes from the active context." icon={<PenTool className="h-4 w-4" />} accent="cyan" />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionHeader eyebrow="System snapshot" title="Model and runtime detail" action={<Lightbulb className="h-5 w-5 text-slate-400" />} />
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Current app</div>
              <div className="mt-1 text-white">{contexts[0]?.appName ?? 'No capture yet'}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Visible context</div>
              <div className="mt-1 text-white">{contexts[0]?.windowTitle ?? 'Waiting for screen understanding'}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Clipboard</div>
              <div className="mt-1 text-white">{contexts[0]?.clipboardText || 'Clipboard is empty or not captured yet.'}</div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <SectionHeader eyebrow="Model lineup" title="Local model readiness" action={<MonitorSmartphone className="h-5 w-5 text-slate-400" />} />
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
                <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">{model.status}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{model.description}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
