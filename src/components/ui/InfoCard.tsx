import { GlassCard } from '@/components/ui/GlassCard';

interface InfoCardProps {
  title: string;
  value: string;
  detail: string;
}

export function InfoCard({ title, value, detail }: InfoCardProps) {
  return (
    <GlassCard className="p-4">
      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{title}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
      <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
    </GlassCard>
  );
}
