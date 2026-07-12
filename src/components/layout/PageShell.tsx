import type { ReactNode } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface PageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/70">{eyebrow}</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
      </div>
      <GlassCard className="p-6">{children}</GlassCard>
    </div>
  );
}
