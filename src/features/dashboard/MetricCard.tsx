import type { ReactNode } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'violet';
}

const accentClasses: Record<NonNullable<MetricCardProps['accent']>, string> = {
  cyan: 'from-cyan-400/18 to-cyan-400/6 text-cyan-100',
  emerald: 'from-emerald-400/18 to-emerald-400/6 text-emerald-100',
  amber: 'from-amber-400/18 to-amber-400/6 text-amber-100',
  violet: 'from-violet-400/18 to-violet-400/6 text-violet-100'
};

export function MetricCard({ label, value, detail, icon, accent = 'cyan' }: MetricCardProps) {
  return (
    <GlassCard className="overflow-hidden p-0">
      <div className={`flex h-full flex-col justify-between bg-gradient-to-br ${accentClasses[accent]} p-4`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 p-3 text-white">{icon}</div>
        </div>
        <p className="mt-6 text-sm leading-6 text-slate-300">{detail}</p>
      </div>
    </GlassCard>
  );
}
