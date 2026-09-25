"use client";

import { useState } from "react";
import { ProtectedRoute } from "../../../features/auth/components/ProtectedRoute.jsx";
import { useAsync } from "../../../hooks/useAsync.js";
import { historyService } from "../../../features/history/services/historyService.js";
import { HistoryTable } from "../../../features/history/components/HistoryTable.jsx";
import { PaginationControls } from "../../../features/history/components/PaginationControls.jsx";
import { Skeleton } from "../../../components/ui/Skeleton.jsx";
import { Alert } from "../../../components/ui/Alert.jsx";

function HistoryContent() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAsync(() => historyService.getHistory(page, 10), [page]);

  if (isLoading) {
    return <Skeleton className="h-64" />;
  }

  if (error || !data) {
    return <Alert variant="error">{error ?? "Could not load history."}</Alert>;
  }

  return (
    <div className="space-y-6">
      <HistoryTable results={data.results} />
      {data.totalPages > 1 && (
        <PaginationControls page={data.page} totalPages={data.totalPages} onChange={setPage} />
      )}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <h1 className="text-3xl font-black uppercase tracking-tight text-nb-text">Typing History</h1>
        <HistoryContent />
      </div>
    </ProtectedRoute>
  );
}
