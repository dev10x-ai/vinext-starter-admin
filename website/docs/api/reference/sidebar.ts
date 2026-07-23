import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/reference/acp-admin-mock-api",
    },
    {
      type: "category",
      label: "Auth",
      link: {
        type: "doc",
        id: "api/reference/auth",
      },
      items: [
        {
          type: "doc",
          id: "api/reference/auth-login",
          label: "Login with email and password",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/reference/auth-otp-request",
          label: "Request passwordless OTP",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/reference/auth-otp-verify",
          label: "Verify OTP (login or 2FA)",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/reference/auth-signup",
          label: "Sign up (creates tenant + owner)",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/reference/auth-forgot-password",
          label: "Forgot password",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/reference/auth-change-password",
          label: "Change password",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Users",
      link: {
        type: "doc",
        id: "api/reference/users",
      },
      items: [
        {
          type: "doc",
          id: "api/reference/list-users",
          label: "List users",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/create-user",
          label: "Create user",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/reference/get-user",
          label: "Get user by id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/replace-user",
          label: "Replace user",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/reference/patch-user",
          label: "Patch user",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/reference/delete-user",
          label: "Delete user",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Tenants",
      link: {
        type: "doc",
        id: "api/reference/tenants",
      },
      items: [
        {
          type: "doc",
          id: "api/reference/list-tenants",
          label: "List tenants",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/create-tenant",
          label: "Create tenant",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/reference/get-tenant",
          label: "Get tenant by id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/replace-tenant",
          label: "Replace tenant",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/reference/patch-tenant",
          label: "Patch tenant",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/reference/delete-tenant",
          label: "Delete tenant",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Roles",
      link: {
        type: "doc",
        id: "api/reference/roles",
      },
      items: [
        {
          type: "doc",
          id: "api/reference/list-roles",
          label: "List roles",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/create-role",
          label: "Create role",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/reference/get-role",
          label: "Get role by id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/replace-role",
          label: "Replace role",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/reference/patch-role",
          label: "Patch role",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/reference/delete-role",
          label: "Delete role",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Permissions",
      link: {
        type: "doc",
        id: "api/reference/permissions",
      },
      items: [
        {
          type: "doc",
          id: "api/reference/list-permissions",
          label: "List permissions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/get-permission",
          label: "Get permission by id",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Menu",
      link: {
        type: "doc",
        id: "api/reference/menu",
      },
      items: [
        {
          type: "doc",
          id: "api/reference/list-menu",
          label: "List menu items",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/create-menu-item",
          label: "Create menu item",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/reference/get-menu-item",
          label: "Get menu item",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/replace-menu-item",
          label: "Replace menu item",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/reference/patch-menu-item",
          label: "Patch menu item",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/reference/delete-menu-item",
          label: "Delete menu item",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Notifications",
      link: {
        type: "doc",
        id: "api/reference/notifications",
      },
      items: [
        {
          type: "doc",
          id: "api/reference/list-notifications",
          label: "List notifications",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/create-notification",
          label: "Create notification",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/reference/get-notification",
          label: "Get notification",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/patch-notification",
          label: "Mark read / patch notification",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/reference/delete-notification",
          label: "Delete notification",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Settings",
      link: {
        type: "doc",
        id: "api/reference/settings",
      },
      items: [
        {
          type: "doc",
          id: "api/reference/list-settings",
          label: "List all settings documents",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/get-settings",
          label: "Get settings by id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/replace-settings",
          label: "Replace settings document",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/reference/patch-settings",
          label: "Patch settings document",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Dashboard",
      link: {
        type: "doc",
        id: "api/reference/dashboard",
      },
      items: [
        {
          type: "doc",
          id: "api/reference/list-dashboard-stats",
          label: "List dashboard widgets",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/reference/get-dashboard-stat",
          label: "Get dashboard widget",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Search",
      link: {
        type: "doc",
        id: "api/reference/search",
      },
      items: [
        {
          type: "doc",
          id: "api/reference/global-search",
          label: "Hybrid search (users, tenants, settings)",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
