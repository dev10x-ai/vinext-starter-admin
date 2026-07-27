import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Bookmark,
  Boxes,
  Building2,
  Calendar,
  Clock,
  Cloud,
  CreditCard,
  Database,
  Eye,
  FileBarChart,
  FileText,
  Flag,
  FolderTree,
  FormInput,
  Gauge,
  Globe,
  HelpCircle,
  Home,
  Inbox,
  Info,
  Key,
  KeyRound,
  Layers,
  LayoutDashboard,
  LineChart,
  Link,
  ListTree,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Navigation,
  Package,
  Palette,
  PieChart,
  Plug,
  Receipt,
  ScrollText,
  Search,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Tag,
  TrendingUp,
  Type,
  UserCog,
  Users,
  Wallet,
  Wrench,
  Zap,
} from 'lucide-react'

export type MenuIconEntry = {
  name: string
  label: string
  Icon: LucideIcon
}

/** Curated Lucide icon names for admin navigation menus. */
export const MENU_ICON_ENTRIES: readonly MenuIconEntry[] = [
  { name: 'LayoutDashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { name: 'Home', label: 'Home', Icon: Home },
  { name: 'Menu', label: 'Menu', Icon: Menu },
  { name: 'ListTree', label: 'List tree', Icon: ListTree },
  { name: 'FolderTree', label: 'Folder tree', Icon: FolderTree },
  { name: 'Navigation', label: 'Navigation', Icon: Navigation },
  { name: 'Users', label: 'Users', Icon: Users },
  { name: 'UserCog', label: 'User settings', Icon: UserCog },
  { name: 'Shield', label: 'Shield', Icon: Shield },
  { name: 'ShieldCheck', label: 'Shield check', Icon: ShieldCheck },
  { name: 'KeyRound', label: 'Key round', Icon: KeyRound },
  { name: 'Key', label: 'Key', Icon: Key },
  { name: 'Lock', label: 'Lock', Icon: Lock },
  { name: 'Building2', label: 'Building', Icon: Building2 },
  { name: 'Layers', label: 'Layers', Icon: Layers },
  { name: 'Boxes', label: 'Boxes', Icon: Boxes },
  { name: 'Package', label: 'Package', Icon: Package },
  { name: 'Settings', label: 'Settings', Icon: Settings },
  { name: 'SlidersHorizontal', label: 'Sliders', Icon: SlidersHorizontal },
  { name: 'Wrench', label: 'Wrench', Icon: Wrench },
  { name: 'Plug', label: 'Plug', Icon: Plug },
  { name: 'Palette', label: 'Palette', Icon: Palette },
  { name: 'Type', label: 'Typography', Icon: Type },
  { name: 'FormInput', label: 'Forms', Icon: FormInput },
  { name: 'Bell', label: 'Bell', Icon: Bell },
  { name: 'Mail', label: 'Mail', Icon: Mail },
  { name: 'Inbox', label: 'Inbox', Icon: Inbox },
  { name: 'MessageSquare', label: 'Messages', Icon: MessageSquare },
  { name: 'ScrollText', label: 'Scroll text', Icon: ScrollText },
  { name: 'FileText', label: 'File text', Icon: FileText },
  { name: 'FileBarChart', label: 'File chart', Icon: FileBarChart },
  { name: 'BarChart3', label: 'Bar chart', Icon: BarChart3 },
  { name: 'PieChart', label: 'Pie chart', Icon: PieChart },
  { name: 'LineChart', label: 'Line chart', Icon: LineChart },
  { name: 'TrendingUp', label: 'Trending up', Icon: TrendingUp },
  { name: 'Activity', label: 'Activity', Icon: Activity },
  { name: 'Gauge', label: 'Gauge', Icon: Gauge },
  { name: 'Receipt', label: 'Receipt', Icon: Receipt },
  { name: 'CreditCard', label: 'Credit card', Icon: CreditCard },
  { name: 'Wallet', label: 'Wallet', Icon: Wallet },
  { name: 'Database', label: 'Database', Icon: Database },
  { name: 'Server', label: 'Server', Icon: Server },
  { name: 'Cloud', label: 'Cloud', Icon: Cloud },
  { name: 'Globe', label: 'Globe', Icon: Globe },
  { name: 'Link', label: 'Link', Icon: Link },
  { name: 'MapPin', label: 'Map pin', Icon: MapPin },
  { name: 'Calendar', label: 'Calendar', Icon: Calendar },
  { name: 'Clock', label: 'Clock', Icon: Clock },
  { name: 'Search', label: 'Search', Icon: Search },
  { name: 'Eye', label: 'Eye', Icon: Eye },
  { name: 'Tag', label: 'Tag', Icon: Tag },
  { name: 'Bookmark', label: 'Bookmark', Icon: Bookmark },
  { name: 'Star', label: 'Star', Icon: Star },
  { name: 'Flag', label: 'Flag', Icon: Flag },
  { name: 'Zap', label: 'Zap', Icon: Zap },
  { name: 'AlertTriangle', label: 'Alert', Icon: AlertTriangle },
  { name: 'HelpCircle', label: 'Help', Icon: HelpCircle },
  { name: 'Info', label: 'Info', Icon: Info },
]

export type MenuIconName = (typeof MENU_ICON_ENTRIES)[number]['name']

const MENU_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  MENU_ICON_ENTRIES.map(({ name, Icon }) => [name, Icon]),
)

export const MENU_ICON_NAMES: readonly string[] = MENU_ICON_ENTRIES.map(
  (entry) => entry.name,
)

/**
 * Resolve a stored Lucide icon name to a component.
 * Returns null for empty/unknown names so callers can omit the glyph.
 */
export function resolveMenuIcon(name: string | null | undefined): LucideIcon | null {
  if (typeof name !== 'string') return null
  const trimmed = name.trim()
  if (!trimmed) return null
  return MENU_ICON_MAP[trimmed] ?? null
}

export function isMenuIconName(name: string): name is MenuIconName {
  return Object.prototype.hasOwnProperty.call(MENU_ICON_MAP, name)
}

export function filterMenuIcons(query: string): MenuIconEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return [...MENU_ICON_ENTRIES]
  return MENU_ICON_ENTRIES.filter(
    (entry) =>
      entry.name.toLowerCase().includes(q) || entry.label.toLowerCase().includes(q),
  )
}
