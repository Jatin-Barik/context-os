import { Puzzle } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';

const extensionRows = [
  { name: 'Chrome', status: 'Planned', detail: 'Summarize pages, extract tables, and generate notes from browser content.' },
  { name: 'VS Code', status: 'Planned', detail: 'Explain errors, refactor code, and generate tests from the active file.' },
  { name: 'Gmail', status: 'Planned', detail: 'Draft replies, rewrite email, and extract action items from threads.' },
  { name: 'Excel', status: 'Planned', detail: 'Explain formulas and generate chart suggestions from spreadsheets.' }
];

export function ExtensionsPage() {
  return (
    <PageShell
      eyebrow="Extensions"
      title="MVP integration catalog"
      description="Connect browsers and desktop apps through explicit permissions and feature-specific adapters."
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {extensionRows.map((row) => (
            <GlassCard key={row.name} className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="text-sm font-medium text-white">{row.name}</div>
                <div className="mt-1 text-sm leading-6 text-slate-400">{row.detail}</div>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">{row.status}</span>
            </GlassCard>
          ))}
        </div>
        <EmptyState title="Extension marketplace" description="This screen is designed to present integrations as premium, permissioned capabilities instead of ad-hoc plugins." icon={<Puzzle className="h-5 w-5" />} />
      </div>
    </PageShell>
  );
}
