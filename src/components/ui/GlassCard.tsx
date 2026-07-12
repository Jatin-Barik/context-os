import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 shadow-glow backdrop-blur-xl',
        className
      )}
      {...props}
    />
  );
}
