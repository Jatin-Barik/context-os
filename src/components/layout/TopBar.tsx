import { Bell, Search, SquarePen, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { NotificationsPopover } from '@/components/layout/NotificationsPopover';
import { useRuntimeStatus } from '@/hooks/useRuntimeStatus';
import { getLocalModel } from '@/models/localModels';
import { useShellStore } from '@/store/shellStore';
import { useApplicationContext } from '@/integrations/core/useApplicationContext';

export function TopBar() {
  const searchQuery = useShellStore((state) => state.searchQuery);
  const setSearchQuery = useShellStore((state) => state.setSearchQuery);
  const toggleNotifications = useShellStore((state) => state.toggleNotifications);
  const notificationsVisible = useShellStore((state) => state.notificationsVisible);
  const toggleThemeMode = useShellStore((state) => state.toggleThemeMode);
  const currentModelId = useShellStore((state) => state.currentModelId);
  const themeMode = useShellStore((state) => state.themeMode);
  const appInfo = useShellStore((state) => state.appInfo);
  const latestContext = useShellStore((state) => state.recentContexts[0] ?? null);
  const { runtimeStatus } = useRuntimeStatus();
  const { applicationContext } = useApplicationContext({ context: latestContext, appInfo });

  const activeModel = useMemo(() => getLocalModel(currentModelId), [currentModelId]);
  const unreadCount = useShellStore((state) => state.notifications.length);

  return (
    <div className="relative">
      <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 shadow-[0_20px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            aria-label="Search dashboard"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search dashboard, quick commands, models..."
            className="w-full border-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden min-w-[11rem] rounded-2xl border border-cyan-400/15 bg-cyan-400/10 px-4 py-3 text-left lg:block">
            <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-200/70">Active application</div>
            <div className="mt-1 flex items-center gap-2 text-sm font-medium text-white">
              <SquarePen className="h-4 w-4 text-cyan-200" />
              {applicationContext?.applicationName ?? appInfo?.name ?? 'Resolving'}
            </div>
            <div className="mt-1 text-xs text-cyan-100/75">{applicationContext?.adapterName ?? appInfo?.platform ?? 'Adapter pending'}</div>
          </div>

          <button
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            onClick={toggleNotifications}
          >
            <Bell className="h-4 w-4" />
            <span>Alerts</span>
            <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-cyan-200">
              {unreadCount}
            </span>
          </button>

          <button
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            onClick={toggleThemeMode}
          >
            <Sparkles className="h-4 w-4" />
            <span>{themeMode === 'midnight' ? 'Aurora' : 'Midnight'}</span>
          </button>

          <div className="hidden min-w-[11rem] rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-4 py-3 text-left lg:block">
            <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-200/70">Model status</div>
            <div className="mt-1 flex items-center gap-2 text-sm font-medium text-white">
              <SquarePen className="h-4 w-4 text-emerald-200" />
              {activeModel.name}
            </div>
            <div className="mt-1 text-xs text-emerald-100/75">{runtimeStatus ? runtimeStatus.gpuStatus : 'Probing hardware'}</div>
          </div>
        </div>
      </header>

      {notificationsVisible ? <NotificationsPopover runtimeStatus={runtimeStatus} onClose={toggleNotifications} /> : null}
    </div>
  );
}
