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

  url: 'https://vinext-starter-admin-docs.dev10x.ai',
  baseUrl: '/',

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
