---
sidebar_position: 3
title: Campos de formulário
---

# Campos de formulário

Primitivos em `src/components/ui/`, reexportados de `src/components/ui/index.ts`. São wrappers finos em cima de controles HTML nativos — não há `FormField` separado. Todos usam variáveis CSS do tema (`--color-*`).

**Showcase:** `/app/design-system/forms` (sidebar → **Design System → Forms**) — Checkbox, Switch, Textarea, DatePicker, FileUpload, InputOTP ao vivo.

## Controles cobertos

| Componente | Caminho |
|------------|---------|
| `Input` | `src/components/ui/Input.tsx` |
| `Select` | `src/components/ui/Select.tsx` |
| `Checkbox` | `src/components/ui/Checkbox.tsx` |
| `Switch` | `src/components/ui/Switch.tsx` |
| `Textarea` | `src/components/ui/Textarea.tsx` |
| `DatePicker` | `src/components/ui/DatePicker.tsx` |
| `FileUpload` | `src/components/ui/FileUpload.tsx` |
| `InputOTP` | `src/components/ui/InputOTP.tsx` |

Props comuns na maioria dos campos: `label`, `error`, `hint`, mais atributos nativos (`name`, `disabled`, etc.).

### Exemplo rápido

```tsx
import { Checkbox } from '@/components/ui/Checkbox'
import { Switch } from '@/components/ui/Switch'
import { Textarea } from '@/components/ui/Textarea'
import { DatePicker } from '@/components/ui/DatePicker'
import { FileUpload } from '@/components/ui/FileUpload'
import { InputOTP } from '@/components/ui/InputOTP'

<Checkbox label="Enabled" name="enabled" />
<Switch label="Allow export" name="exportEnabled" />
<Textarea label="Description" name="description" rows={4} />
<DatePicker label="Purge before" name="purgeBefore" />
<FileUpload label="Import config" accept=".json" />
<InputOTP label="Code" value={code} onChange={setCode} />
```

A referência completa em inglês (props por controle + copy-paste RHF/Zod) fica em [Form fields](/components/form-fields) no locale `en`.

## Próximos passos

- [Padrões de formulário](./form-patterns)  
- [Tipografia](./typography)  
- Voltar a [Formulários](./forms)
