import { SettingsLayout } from '@/views/settings/SettingsPage'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SettingsLayout>{children}</SettingsLayout>
}
