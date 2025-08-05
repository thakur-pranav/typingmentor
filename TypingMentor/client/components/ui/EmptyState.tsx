import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-nb-border bg-nb-card px-6 py-14 text-center shadow-nb-sm">
      <p className="text-sm font-black uppercase tracking-wide text-nb-text">{title}</p>
      {description && <p className="max-w-sm text-sm text-nb-sub">{description}</p>}
      {action}
    </div>
  );
}
