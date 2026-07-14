import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

export function SidebarItem({ label, icon: Icon, active, collapsed, onClick }: SidebarItemProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ x: 4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group flex w-full items-center rounded-2xl border border-transparent px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40',
        active
          ? 'border-cyan-400/20 bg-cyan-400/12 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.16)]'
          : 'text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
      )}
      onClick={onClick}
    >
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl', active ? 'bg-cyan-400/16 text-cyan-200' : 'bg-white/5 text-slate-400 group-hover:text-white')}>
        <Icon className="h-4 w-4" />
      </span>

      {!collapsed ? <span className="ml-3 text-sm font-medium">{label}</span> : null}
    </motion.button>
  );
}
