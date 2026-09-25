import { Button } from "../../../components/ui/Button";

export function PaginationControls({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="font-mono text-sm font-bold text-nb-text">
        Page {page} of {totalPages}
      </span>
      <Button variant="ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
