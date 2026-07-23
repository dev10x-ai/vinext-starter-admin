import { Navigate, Route, Routes } from 'react-router-dom'
import { DocumentTitle } from '@/components/DocumentTitle'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { LandingPage } from '@/pages/landing/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { OtpPage } from '@/pages/auth/OtpPage'
import { ChangePasswordPage } from '@/pages/auth/ChangePasswordPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { UsersPage } from '@/pages/access/UsersPage'
import { RolesPage } from '@/pages/access/RolesPage'
import { MenuPage } from '@/pages/access/MenuPage'
import { TenantsPage } from '@/pages/access/TenantsPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import {
  AiSettingsPage,
  EmailSettingsPage,
  LogsSettingsPage,
  ThirdPartySettingsPage,
} from '@/pages/settings/SettingsPanels'
import { SettingsLayout } from '@/pages/settings/SettingsPage'

export default function App() {
  return (
    <>
      <DocumentTitle />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="otp" element={<OtpPage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>

        <Route path="app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
        <Route path="access/users" element={<UsersPage />} />
        <Route path="access/users/new" element={<UsersPage />} />
        <Route path="access/users/:userId/edit" element={<UsersPage />} />
        <Route path="access/roles" element={<RolesPage />} />
        <Route path="access/menu" element={<MenuPage />} />
        <Route path="access/tenants" element={<TenantsPage />} />
        <Route path="access/tenants/new" element={<TenantsPage />} />
        <Route path="access/tenants/:tenantId/edit" element={<TenantsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="ai" replace />} />
            <Route path="ai" element={<AiSettingsPage />} />
            <Route path="email" element={<EmailSettingsPage />} />
            <Route path="third-party" element={<ThirdPartySettingsPage />} />
            <Route path="logs" element={<LogsSettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
