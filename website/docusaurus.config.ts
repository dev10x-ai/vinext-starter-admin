import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs'

/** Production site origin (admin Worker). Override for previews via DOCUSAURUS_URL. */
const SITE_URL = process.env.DOCUSAURUS_URL ?? 'https://vinext-starter-admin.dev10x.ai'
/** Served under the admin Worker at /docs/*. Local `docusaurus start` uses the same path. */
const BASE_URL = process.env.DOCUSAURUS_BASE_URL ?? '/docs/'
/**
 * Origin for Admin / Console / Landing links.
 * Empty = same-origin relative paths (production + Worker preview).
 * Local DX: DOCUSAURUS_APP_ORIGIN=http://127.0.0.1:5173 make docs
 */
const APP_ORIGIN = (process.env.DOCUSAURUS_APP_ORIGIN ?? '').replace(/\/$/, '')

function appHref(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  // Always absolute so Docusaurus does not prefix baseUrl (/docs/) onto /login or /api.
  // Local DX: DOCUSAURUS_APP_ORIGIN=http://127.0.0.1:5173 make docs
  const origin = APP_ORIGIN || SITE_URL
  return `${origin}${normalized}`
}

const config: Config = {
  title: 'ACP Admin Docs',
  tagline: 'Operations console documentation',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: SITE_URL,
  baseUrl: BASE_URL,

  organizationName: 'acp',
  projectName: 'acp-admin',

  onBrokenLinks: 'throw',

  // Same Google font stack as admin `index.html` (DM Sans + Source Serif 4).
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    // Apply brand pack before first paint (avoids flash vs Default).
    {
      tagName: 'script',
      attributes: {},
      innerHTML: `(function(){try{var b=localStorage.getItem('acp-docs-brand');if(b==='default'||b==='ruby'||b==='emerald'){document.documentElement.setAttribute('data-brand',b);}else{document.documentElement.setAttribute('data-brand','default');}}catch(e){document.documentElement.setAttribute('data-brand','default');}})();`,
    },
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap',
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    localeConfigs: {
      en: {
        label: 'English',
        htmlLang: 'en',
      },
      pt: {
        label: 'Português',
        htmlLang: 'pt-BR',
      },
    },
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
    image: 'img/acp-shield.svg',
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
        src: 'img/acp-shield-mark.svg',
        srcDark: 'img/acp-shield-mark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'custom-brandSwitcher',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: appHref('/'),
          label: 'Admin',
          position: 'right',
        },
        {
          href: appHref('/login'),
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
            { label: 'Landing', href: appHref('/') },
            { label: 'Mock API', href: appHref('/api') },
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
