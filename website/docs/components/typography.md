---
sidebar_position: 3.5
title: Typography
---

# Typography

Long-form and documentation-style content uses the **`Prose`** wrapper. It styles semantic HTML descendants with theme CSS variables (Default / Ruby / Emerald, light + dark).

## Prose

**Path:** `components/ui/Prose.tsx` (+ `Prose.module.css`)  
**Showcase:** `/app/design-system/typography` (sidebar → **Design System → Typography**)

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'div' \| 'article' \| 'section'` | `'div'` | Root element |
| `className` | `string` | — | Extra classes on the root |
| `children` | `ReactNode` | — | Semantic HTML content |
| `…rest` | HTML attributes | — | Passed to the root |

### Styled elements

Headings `h1`–`h6`, paragraphs, links, `strong` / `em` / `small` / `mark` / `del` / `ins` / `abbr`, lists (`ul` / `ol`), definition lists (`dl` / `dt` / `dd`), `blockquote` + `cite`, `hr`, `code` / `pre` / `kbd`, tables (+ `caption`), `figure` / `figcaption`, `address`, `time`, `sub` / `sup`.

### Copy-paste

```tsx
import { Prose } from '@/components/ui/Prose'
import { Card } from '@/components/ui/Card'

export function ReleaseNotes() {
  return (
    <Card>
      <Prose>
        <h1>Platform release notes</h1>
        <p>
          Prefer real semantic HTML inside <code>Prose</code> instead of one-off heading classes.
        </p>
        <ul>
          <li>Faster user search</li>
          <li>
            Open the palette with <kbd>⌘</kbd> + <kbd>K</kbd>
          </li>
        </ul>
        <blockquote>
          <p>Keep admin chrome calm and readable.</p>
          <footer>
            — <cite>Design principles</cite>
          </footer>
        </blockquote>
      </Prose>
    </Card>
  )
}
```

Import from the barrel if you prefer: `import { Prose } from '@/components/ui'`.

## Next steps

- [Form fields](./form-fields) for interactive controls  
- [Layout & chrome](./layout) for shell structure
