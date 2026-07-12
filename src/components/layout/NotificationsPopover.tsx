import { BellRing, Clock3, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useShellStore } from '@/store/shellStore';
import type { RuntimeStatus } from '@shared/bridge';

interface NotificationsPopoverProps {
  runtimeStatus: RuntimeStatus | null;
  onClose: () => void;
}

export function NotificationsPopover({ runtimeStatus, onClose }: NotificationsPopoverProps) {
  const notifications = useShellStore((state) => state.notifications);

  return (
    <GlassCard className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-[22rem] overflow-hidden border-white/15 bg-slate-950/95 p-4 shadow-glow">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">Notifications</p>
          <p className="mt-1 text-sm text-slate-400">Local status and product updates</p>
        </div>
        <button className="text-xs uppercase tracking-[0.2em] text-slate-400 transition hover:text-white" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="mt-3 space-y-3">
        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-3 text-sm text-slate-200">
          <div className="flex items-center gap-2 text-cyan-200">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Runtime status</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {runtimeStatus
              ? `${runtimeStatus.gpuStatus} · ${runtimeStatus.cpuCount} CPU cores · ${runtimeStatus.appMemoryMb} MB app memory`
              : 'Probing the local machine for metrics.'}
          </p>
        </div>

        <div className="space-y-2">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <BellRing className="h-4 w-4 text-cyan-200" />
                {notification.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{notification.detail}</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                {new Date(notification.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
