---
sidebar_position: 3.5
title: Tipografia
---

# Tipografia

Conteúdo longo e no estilo de documentação usa o wrapper **`Prose`**. Ele estiliza HTML semântico com variáveis CSS do tema (Default / Ruby / Emerald, claro + escuro).

## Prose

**Caminho:** `src/components/ui/Prose.tsx` (+ `Prose.module.css`)  
**Showcase:** `/app/design-system/typography` (sidebar → **Design System → Typography**)

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `as` | `'div' \| 'article' \| 'section'` | `'div'` | Elemento raiz |
| `className` | `string` | — | Classes extras na raiz |
| `children` | `ReactNode` | — | Conteúdo HTML semântico |
| `…rest` | atributos HTML | — | Passados para a raiz |

### Elementos estilizados

Títulos `h1`–`h6`, parágrafos, links, `strong` / `em` / `small` / `mark` / `del` / `ins` / `abbr`, listas (`ul` / `ol`), listas de definição (`dl` / `dt` / `dd`), `blockquote` + `cite`, `hr`, `code` / `pre` / `kbd`, tabelas (+ `caption`), `figure` / `figcaption`, `address`, `time`, `sub` / `sup`.

### Exemplo

```tsx
import { Prose } from '@/components/ui/Prose'
import { Card } from '@/components/ui/Card'

export function ReleaseNotes() {
  return (
    <Card>
      <Prose>
        <h1>Notas da plataforma</h1>
        <p>
          Prefira HTML semântico dentro de <code>Prose</code> em vez de classes
          de título avulsas.
        </p>
      </Prose>
    </Card>
  )
}
```

Import pelo barrel: `import { Prose } from '@/components/ui'`.

## Próximos passos

- [Campos de formulário](./form-fields) para controles interativos  
- [Layout](./layout) para a estrutura do shell
