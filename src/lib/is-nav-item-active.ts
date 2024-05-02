import type { NavItemConfig } from '@/types/nav';

export function isNavItemActive({
  disabled,
  external,
  href,
  pathname,
}: Pick<NavItemConfig, 'disabled' | 'external' | 'href'> & { pathname: string }): boolean {
  if (disabled || !href || external) {
    return false;
  }


  return pathname.startsWith(href);
}
