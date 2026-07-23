import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs'

const config: Config = {
  title: 'ACP Admin Docs',
  tagline: 'Operations console documentation',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://acp-admin.local',
  baseUrl: '/',

  organizationName: 'acp',
  projectName: 'acp-admin',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          docItemComponent: '@theme/ApiItem',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'classic',
        config: {
          mock: {
            specPath: '../mock/openapi.yaml',
            outputDir: 'docs/api/reference',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            },
            hideSendButton: false,
            showExtensions: true,
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],

  themes: ['docusaurus-theme-openapi-docs'],

  themeConfig: {
    image: 'img/acp-logo.svg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    api: {
      authPersistance: 'localStorage',
      requestCredentials: 'omit',
    },
    navbar: {
      title: 'ACP Docs',
      logo: {
        alt: 'ACP',
        src: 'img/acp-mark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'http://localhost:5173',
          label: 'Admin',
          position: 'right',
        },
        {
          href: 'http://localhost:5173/login',
          label: 'Console',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting started', to: '/' },
            { label: 'Components', to: '/components/overview' },
            { label: 'API Server', to: '/api/server' },
            { label: 'API Reference', to: '/api/reference/acp-admin-mock-api' },
          ],
        },
        {
          title: 'App',
          items: [
            { label: 'Landing', href: 'http://localhost:5173' },
            { label: 'Mock API', href: 'http://localhost:4001' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ACP Admin.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'http'],
    },
  } satisfies Preset.ThemeConfig,
}

export default config
