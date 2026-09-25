"use client";

import { useEffect, useState } from "react";

/** Small shared helper so pages don't hand-roll fetch/loading/error state. */
export function useAsync(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, isLoading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Something went wrong",
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
