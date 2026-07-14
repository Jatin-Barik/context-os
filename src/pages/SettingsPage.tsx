import { ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { useShellStore } from '@/store/shellStore';

export function SettingsPage() {
  const themeMode = useShellStore((state) => state.themeMode);
  const toggleThemeMode = useShellStore((state) => state.toggleThemeMode);
  const clearLocalData = useShellStore((state) => state.clearLocalData);

  return (
    <PageShell
      eyebrow="Settings"
      title="Permissions and controls"
      description="Manage local capture permissions, privacy defaults, and the assistant behaviors that are allowed to run on your machine."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-4">
          <div className="text-sm font-medium text-white">Theme mode</div>
          <p className="mt-2 text-sm leading-6 text-slate-400">Switch between the two built-in dark shell themes.</p>
          <button className="mt-4 inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10" onClick={toggleThemeMode}>
            {themeMode === 'midnight' ? 'Switch to Aurora' : 'Switch to Midnight'}
          </button>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-sm font-medium text-white">Clear local data</div>
          <p className="mt-2 text-sm leading-6 text-slate-400">Delete prompts, contexts, generated actions, and search state from local storage.</p>
          <button className="mt-4 inline-flex items-center rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-100 transition hover:bg-red-400/15" onClick={clearLocalData}>
            Clear data
          </button>
        </GlassCard>
      </div>
      <div className="mt-5">
        <EmptyState title="Privacy first" description="Every setting emphasizes local execution and explicit user control over intelligence on the device." icon={<ShieldCheck className="h-5 w-5" />} />
      </div>
    </PageShell>
  );
}
