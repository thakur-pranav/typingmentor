import { Button } from "../../../components/ui/Button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function PaginationControls({ page, totalPages, onChange }: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-slate-400">
        Page {page} of {totalPages}
      </span>
      <Button variant="secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
