import type { ReactNode } from 'react';

/** Join class names, dropping falsy values. */
export function cx(...parts: Array<string | false | undefined | null>): string {
  return parts.filter(Boolean).join(' ');
}

export type StatusKind = 'loading' | 'error' | 'empty';

export interface StatusMessageProps {
  kind: StatusKind;
  children: ReactNode;
  className?: string;
}

/** Small accessible status/loading/empty/error placeholder. */
export function StatusMessage({ kind, children, className }: StatusMessageProps) {
  return (
    <div
      className={cx('pk-status', `pk-status--${kind}`, className)}
      role={kind === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}
