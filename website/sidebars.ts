import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'
import openApiSidebar from './docs/api/reference/sidebar'

const sidebars: SidebarsConfig = {
  docs: [
    'getting-started',
    {
      type: 'category',
      label: 'Componentes',
      items: [
        'components/overview',
        'components/forms',
        'components/menu-tree',
      ],
    },
    {
      type: 'category',
      label: 'API',
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
