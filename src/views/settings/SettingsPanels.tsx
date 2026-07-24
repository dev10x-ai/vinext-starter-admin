'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Switch } from '@/components/ui/Switch'
import { DatePicker } from '@/components/ui/DatePicker'
import { FileUpload } from '@/components/ui/FileUpload'
import { useSettingQuery, useUpdateSettingMutation } from '@/queries'

const aiSchema = z.object({
  provider: z.string().min(1),
  model: z.string().min(1),
  apiKey: z.string().min(1),
  enabled: z.boolean(),
})
type AiForm = z.infer<typeof aiSchema>

const emailSchema = z.object({
  provider: z.string().min(1),
  from: z.email(),
  apiKey: z.string().min(1),
})
type EmailForm = z.infer<typeof emailSchema>

const thirdPartySchema = z.object({
  stripeKey: z.string().min(1),
  slackWebhook: z.string().min(1),
  enabled: z.boolean(),
})
type ThirdPartyForm = z.infer<typeof thirdPartySchema>

const logsSchema = z.object({
  retentionDays: z.number().int().min(1).max(3650),
  level: z.enum(['debug', 'info', 'warn', 'error']),
  exportEnabled: z.boolean(),
  purgeBefore: z.string().optional(),
  importConfigName: z.string().optional(),
})
type LogsForm = z.infer<typeof logsSchema>

export function AiSettingsPage() {
  const { data: setting, isLoading } = useSettingQuery('ai')
  const updateSetting = useUpdateSettingMutation('ai')
  const [saved, setSaved] = useState(false)
  const form = useForm<AiForm>({
    resolver: zodResolver(aiSchema),
    defaultValues: { provider: 'openai', model: '', apiKey: '', enabled: false },
  })

  useEffect(() => {
    if (!setting) return
    form.reset({
      provider: String(setting.provider ?? 'openai'),
      model: String(setting.model ?? ''),
      apiKey: String(setting.apiKey ?? ''),
      enabled: Boolean(setting.enabled),
    })
  }, [setting, form])

  if (isLoading) return <p className="text-sm text-[var(--color-text-muted)]">Loading settings…</p>

  return (
    <Card className="space-y-3">
      <h2 className="font-semibold">AI providers</h2>
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          if (!setting) return
          await updateSetting.mutateAsync({ ...setting, ...values, id: 'ai', category: setting.category })
          setSaved(true)
          window.setTimeout(() => setSaved(false), 1500)
        })}
      >
        <Select
          label="Provider"
          value={form.watch('provider')}
          onChange={(e) => form.setValue('provider', e.target.value, { shouldDirty: true })}
          options={[
            { value: 'openai', label: 'OpenAI' },
            { value: 'anthropic', label: 'Anthropic' },
            { value: 'azure', label: 'Azure OpenAI' },
          ]}
        />
        <Input label="Model" {...form.register('model')} />
        <Input label="API key" {...form.register('apiKey')} />
        <Checkbox label="Enabled" {...form.register('enabled')} />
        <Button type="submit" disabled={updateSetting.isPending || form.formState.isSubmitting}>
          Save
        </Button>
        {saved ? <p className="text-sm text-[var(--color-success)]">Saved</p> : null}
      </form>
    </Card>
  )
}

export function EmailSettingsPage() {
  const { data: setting, isLoading } = useSettingQuery('email')
  const updateSetting = useUpdateSettingMutation('email')
  const [saved, setSaved] = useState(false)
  const form = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { provider: 'resend', from: '', apiKey: '' },
  })

  useEffect(() => {
    if (!setting) return
    form.reset({
      provider: String(setting.provider ?? 'resend'),
      from: String(setting.from ?? ''),
      apiKey: String(setting.apiKey ?? ''),
    })
  }, [setting, form])

  if (isLoading) return <p className="text-sm text-[var(--color-text-muted)]">Loading settings…</p>

  return (
    <Card className="space-y-3">
      <h2 className="font-semibold">Email providers</h2>
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          if (!setting) return
          await updateSetting.mutateAsync({ ...setting, ...values, id: 'email', category: setting.category })
          setSaved(true)
          window.setTimeout(() => setSaved(false), 1500)
        })}
      >
        <Select
          label="Provider"
          value={form.watch('provider')}
          onChange={(e) => form.setValue('provider', e.target.value, { shouldDirty: true })}
          options={[
            { value: 'resend', label: 'Resend' },
            { value: 'sendgrid', label: 'SendGrid' },
            { value: 'ses', label: 'Amazon SES' },
          ]}
        />
        <Input label="From" error={form.formState.errors.from?.message} {...form.register('from')} />
        <Input label="API key" {...form.register('apiKey')} />
        <Button type="submit" disabled={updateSetting.isPending || form.formState.isSubmitting}>
          Save
        </Button>
        {saved ? <p className="text-sm text-[var(--color-success)]">Saved</p> : null}
      </form>
    </Card>
  )
}

export function ThirdPartySettingsPage() {
  const { data: setting, isLoading } = useSettingQuery('thirdparty')
  const updateSetting = useUpdateSettingMutation('thirdparty')
  const [saved, setSaved] = useState(false)
  const form = useForm<ThirdPartyForm>({
    resolver: zodResolver(thirdPartySchema),
    defaultValues: { stripeKey: '', slackWebhook: '', enabled: false },
  })

  useEffect(() => {
    if (!setting) return
    form.reset({
      stripeKey: String(setting.stripeKey ?? ''),
      slackWebhook: String(setting.slackWebhook ?? ''),
      enabled: Boolean(setting.enabled),
    })
  }, [setting, form])

  if (isLoading) return <p className="text-sm text-[var(--color-text-muted)]">Loading settings…</p>

  return (
    <Card className="space-y-3">
      <h2 className="font-semibold">Third-party APIs</h2>
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          if (!setting) return
          await updateSetting.mutateAsync({
            ...setting,
            ...values,
            id: 'thirdparty',
            category: setting.category,
          })
          setSaved(true)
          window.setTimeout(() => setSaved(false), 1500)
        })}
      >
        <Input label="Stripe publishable key" {...form.register('stripeKey')} />
        <Input label="Slack webhook" {...form.register('slackWebhook')} />
        <Checkbox label="Integrations enabled" {...form.register('enabled')} />
        <Button type="submit" disabled={updateSetting.isPending || form.formState.isSubmitting}>
          Save
        </Button>
        {saved ? <p className="text-sm text-[var(--color-success)]">Saved</p> : null}
      </form>
    </Card>
  )
}

export function LogsSettingsPage() {
  const { data: setting, isLoading } = useSettingQuery('logs')
  const updateSetting = useUpdateSettingMutation('logs')
  const [saved, setSaved] = useState(false)
  const form = useForm<LogsForm>({
    resolver: zodResolver(logsSchema),
    defaultValues: {
      retentionDays: 30,
      level: 'info',
      exportEnabled: true,
      purgeBefore: '',
      importConfigName: '',
    },
  })

  useEffect(() => {
    if (!setting) return
    const level = String(setting.level ?? 'info')
    form.reset({
      retentionDays: Number(setting.retentionDays ?? 30),
      level: (['debug', 'info', 'warn', 'error'].includes(level)
        ? level
        : 'info') as LogsForm['level'],
      exportEnabled: Boolean(setting.exportEnabled),
      purgeBefore: String(setting.purgeBefore ?? ''),
      importConfigName: String(setting.importConfigName ?? ''),
    })
  }, [setting, form])

  if (isLoading) return <p className="text-sm text-[var(--color-text-muted)]">Loading settings…</p>

  return (
    <Card className="space-y-3">
      <h2 className="font-semibold">Logs</h2>
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          if (!setting) return
          await updateSetting.mutateAsync({ ...setting, ...values, id: 'logs', category: setting.category })
          setSaved(true)
          window.setTimeout(() => setSaved(false), 1500)
        })}
      >
        <Input
          label="Retention (days)"
          type="number"
          error={form.formState.errors.retentionDays?.message}
          {...form.register('retentionDays', { valueAsNumber: true })}
        />
        <Select
          label="Level"
          value={form.watch('level')}
          onChange={(e) => form.setValue('level', e.target.value as LogsForm['level'], { shouldDirty: true })}
          options={[
            { value: 'debug', label: 'Debug' },
            { value: 'info', label: 'Info' },
            { value: 'warn', label: 'Warn' },
            { value: 'error', label: 'Error' },
          ]}
        />
        <Switch
          label="Allow log export"
          hint="When off, export actions are hidden in log views"
          {...form.register('exportEnabled')}
        />
        <DatePicker
          label="Purge logs before"
          hint="Optional cutoff date for retention jobs"
          error={form.formState.errors.purgeBefore?.message}
          {...form.register('purgeBefore')}
        />
        <FileUpload
          label="Import filter config"
          accept=".json,.txt,application/json,text/plain"
          hint="Mocked — only the filename is stored"
          error={form.formState.errors.importConfigName?.message}
          onChange={(event) => {
            const file = event.target.files?.[0]
            form.setValue('importConfigName', file?.name ?? '', { shouldDirty: true })
          }}
        />
        {form.watch('importConfigName') ? (
          <p className="text-xs text-[var(--color-text-muted)]">
            Selected: {form.watch('importConfigName')}
          </p>
        ) : null}
        <Button type="submit" disabled={updateSetting.isPending || form.formState.isSubmitting}>
          Save
        </Button>
        {saved ? <p className="text-sm text-[var(--color-success)]">Saved</p> : null}
      </form>
    </Card>
  )
}