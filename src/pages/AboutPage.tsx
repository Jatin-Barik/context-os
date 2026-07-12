import { PageShell } from '@/components/layout/PageShell';
import { GlassCard } from '@/components/ui/GlassCard';

export function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="ContextOS"
      description="A local-first assistant that understands the screen, preserves privacy, and routes every workflow through explicit user intent."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard className="p-4">
          <div className="text-sm font-medium text-white">Privacy</div>
          <p className="mt-2 text-sm leading-6 text-slate-400">No screenshots are uploaded. Core inference stays local by design.</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-sm font-medium text-white">Roadmap</div>
          <p className="mt-2 text-sm leading-6 text-slate-400">Add OCR, vision, embeddings, memory search, and app integrations in the next phases.</p>
        </GlassCard>
      </div>
    </PageShell>
  );
}
