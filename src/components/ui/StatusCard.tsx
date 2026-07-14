import type { ReactNode } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface StatusCardProps {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'violet';
}

const accentStyles: Record<NonNullable<StatusCardProps['accent']>, string> = {
  cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
  emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  amber: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
  violet: 'border-violet-400/20 bg-violet-400/10 text-violet-100'
};

export function StatusCard({ title, value, detail, icon, accent = 'cyan' }: StatusCardProps) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{title}</div>
          <div className="mt-2 text-lg font-semibold text-white">{value}</div>
        </div>
        <div className={`rounded-2xl border p-2.5 ${accentStyles[accent]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p>
    </GlassCard>
  );
}
