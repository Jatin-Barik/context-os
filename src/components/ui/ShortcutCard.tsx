import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface ShortcutCardProps {
  title: string;
  detail: string;
  icon: ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber';
  onClick?: () => void;
}

const accentStyles: Record<NonNullable<ShortcutCardProps['accent']>, string> = {
  cyan: 'from-cyan-400/15 to-cyan-400/5 text-cyan-100',
  emerald: 'from-emerald-400/15 to-emerald-400/5 text-emerald-100',
  amber: 'from-amber-400/15 to-amber-400/5 text-amber-100'
};

export function ShortcutCard({ title, detail, icon, accent = 'cyan', onClick }: ShortcutCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full text-left"
      onClick={onClick}
    >
      <GlassCard className={`overflow-hidden bg-gradient-to-br ${accentStyles[accent]} p-4`}>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/15 p-2.5">{icon}</div>
          <div>
            <div className="text-sm font-semibold text-white">{title}</div>
            <p className="mt-1 text-sm leading-6 text-slate-300">{detail}</p>
          </div>
        </div>
      </GlassCard>
    </motion.button>
  );
}
