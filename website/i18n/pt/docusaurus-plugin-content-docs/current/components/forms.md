---
sidebar_position: 2
title: Formulários
---

# Formulários

Telas de auth e CRUD no ACP Admin usam **React Hook Form** + **Zod** (`zodResolver`). A UI dos campos vem de wrappers em `src/components/ui/` (também reexportados de `src/components/ui/index.ts`).

**Showcase:** `/app/design-system/forms` (sidebar → **Design System → Forms**)

## Stack

| Peça | Pacote / caminho |
|------|------------------|
| Estado do form | `react-hook-form` |
| Schema | `zod` + `@hookform/resolvers/zod` |
| Texto / select | `@/components/ui/Input`, `@/components/ui/Select` |
| Boolean / multi | `@/components/ui/Checkbox`, `@/components/ui/Switch` |
| Texto longo / data / arquivo | `@/components/ui/Textarea`, `@/components/ui/DatePicker`, `@/components/ui/FileUpload` |
| OTP | `@/components/ui/InputOTP` |

## Inventário

| Controle | Uso típico |
|----------|------------|
| `Checkbox` | Menu enabled, permissões, toggles de settings |
| `Switch` | 2FA no perfil, export de logs |
| `Textarea` | Descrição de papéis |
| `DatePicker` | Purge-before em logs |
| `FileUpload` | Import de config (mock) |
| `InputOTP` | Página de verificação OTP |

Veja [Campos de formulário](./form-fields) para props e exemplos, e [Padrões de formulário](./form-patterns) para receitas de tela.

## Próximos passos

1. [Campos de formulário](./form-fields)  
2. [Padrões de formulário](./form-patterns)  
3. [Tipografia](./typography) — `Prose`  
4. [Listas e tabelas](./lists-and-tables) → [DataTable](./data-table)
