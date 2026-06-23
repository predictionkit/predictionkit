import { useEffect, useState } from 'react';

export interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
}

/**
 * Minimal data-fetching primitive: runs `factory` whenever `deps` change,
 * tracks loading/error/data, and ignores results from stale runs. Kept tiny
 * deliberately so the library has no data-fetching dependency.
 */
export function useAsync<T>(factory: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: undefined,
    loading: true,
    error: undefined,
  });

  useEffect(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true, error: undefined }));

    factory().then(
      (data) => {
        if (active) setState({ data, loading: false, error: undefined });
      },
      (err: unknown) => {
        if (active) {
          setState({
            data: undefined,
            loading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
      },
    );

    return () => {
      active = false;
    };
    // `factory` is intentionally excluded; callers express dependencies via `deps`.
  }, deps);

  return state;
}
