import type { ReactNode } from 'react';

/** A labelled frame around a rendered component example. */
export function Example({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="example">
      <div className="example__label">{label}</div>
      <div className="example__body">{children}</div>
    </div>
  );
}
