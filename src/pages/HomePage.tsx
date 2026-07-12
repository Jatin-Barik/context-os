import { PageShell } from '@/components/layout/PageShell';
import { DashboardOverview } from '@/features/dashboard/DashboardOverview';
import { useRuntimeStatus } from '@/hooks/useRuntimeStatus';

export function HomePage() {
  const { runtimeStatus } = useRuntimeStatus();

  return (
    <PageShell
      eyebrow="Overview"
      title="Mission control"
      description="A local-first dashboard for screen understanding, model readiness, and quick actions without leaving the desktop."
    >
      <DashboardOverview runtimeStatus={runtimeStatus} />
    </PageShell>
  );
}
