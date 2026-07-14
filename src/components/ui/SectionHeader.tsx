interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}

export function SectionHeader({ eyebrow, title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300/70">{eyebrow}</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
