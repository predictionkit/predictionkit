'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
  return (
    <Link href={href} className="navlink" data-active={active}>
      {label}
    </Link>
  );
}
