import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'
import openApiSidebar from './docs/api/reference/sidebar'

const sidebars: SidebarsConfig = {
  docs: [
    'getting-started',
    'concepts',
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'components/overview',
      },
      items: [
        {
          type: 'category',
          label: 'Forms',
          collapsed: false,
          link: {
            type: 'doc',
            id: 'components/forms',
          },
          items: [
            {
              type: 'doc',
              id: 'components/form-fields',
              label: 'Form fields',
            },
            {
              type: 'doc',
              id: 'components/form-patterns',
              label: 'Form patterns',
            },
          ],
        },
        {
          type: 'doc',
          id: 'components/typography',
          label: 'Typography',
        },
        {
          type: 'category',
          label: 'Lists & tables',
          collapsed: false,
          items: [
            'components/lists-and-tables',
            'components/data-table',
          ],
        },
        'components/menu-tree',
        'components/layout',
      ],
    },
    {
      type: 'category',
      label: 'API',
      collapsed: false,
      items: [
        'api/server',
        'api/rest-examples',
        {
          type: 'category',
          label: 'API Reference',
          collapsed: false,
          items: openApiSidebar,
        },
      ],
    },
  ],
}

export default sidebars
