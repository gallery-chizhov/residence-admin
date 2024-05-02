import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'users', title: 'Пользователи', href: paths.dashboard.users, icon: 'users' },
  { key: 'residents', title: 'Жители', href: paths.dashboard.residents, icon: 'finn-the-human' },
  { key: 'apartments', title: 'Апартаменты', href: paths.dashboard.apartments, icon: 'house' },
] satisfies NavItemConfig[];
