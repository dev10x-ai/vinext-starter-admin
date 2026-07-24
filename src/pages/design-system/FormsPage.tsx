import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { Switch } from '@/components/ui/Switch'
import { Textarea } from '@/components/ui/Textarea'
import { DatePicker } from '@/components/ui/DatePicker'
import { FileUpload } from '@/components/ui/FileUpload'
import { InputOTP } from '@/components/ui/InputOTP'

export function FormsPage() {
  const [newsletter, setNewsletter] = useState(true)
  const [exportEnabled, setExportEnabled] = useState(false)
  const [notes, setNotes] = useState('Role description for operators who manage tenant users.')
  const [purgeBefore, setPurgeBefore] = useState('2026-07-01')
  const [otp, setOtp] = useState('')
  const [fileSummary, setFileSummary] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <PageHeader
        title="Forms"
        description="Live showcase of design-system field controls — Checkbox, Switch, Textarea, DatePicker, FileUpload, and InputOTP."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Checkbox</h2>
          <Checkbox
            label="Subscribe to product updates"
            name="newsletter"
            checked={newsletter}
            onChange={(event) => setNewsletter(event.target.checked)}
            hint="Used for opt-in flags and permission rows"
          />
          <Checkbox
            label="Accept terms"
            name="termsError"
            error="Required before continuing"
            hint="Hidden when an error is present"
          />
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Switch</h2>
          <Switch
            label="Allow log export"
            name="exportEnabled"
            checked={exportEnabled}
            onChange={(event) => setExportEnabled(event.target.checked)}
            hint="Profile 2FA and settings toggles use the same control"
          />
          <Switch label="Locked setting" name="locked" disabled checked />
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Textarea</h2>
          <Textarea
            label="Description"
            name="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            hint="Long-form notes such as role descriptions"
            rows={4}
          />
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">DatePicker</h2>
          <DatePicker
            label="Purge logs before"
            name="purgeBefore"
            value={purgeBefore}
            onChange={(event) => setPurgeBefore(event.target.value)}
            hint="Native date input styled for the theme"
          />
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">FileUpload</h2>
          <FileUpload
            label="Import filter config"
            name="importConfig"
            accept=".json,.txt,application/json,text/plain"
            hint="Mocked locally — only the filename is shown"
            onChange={(event) => {
              const file = event.target.files?.[0]
              setFileSummary(file?.name ?? null)
            }}
          />
          {fileSummary ? (
            <p className="text-xs text-[var(--color-text-muted)]">Selected: {fileSummary}</p>
          ) : null}
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">InputOTP</h2>
          <InputOTP
            label="Verification code"
            name="otp"
            value={otp}
            onChange={setOtp}
            hint="Six digits — paste and keyboard navigation supported"
          />
          {otp.length === 6 ? (
            <p className="text-xs text-[var(--color-success)]">Code complete: {otp}</p>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
