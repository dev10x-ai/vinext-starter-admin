import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Prose } from '@/components/ui/Prose'

export function TypographyPage() {
  return (
    <div>
      <PageHeader
        title="Typography"
        description="Semantic text elements styled by the Prose wrapper — headings, lists, tables, quotes, and more."
      />
      <Card>
        <Prose>
          <h1>Platform release notes</h1>
          <p>
            This page showcases how <strong>rich text</strong> and documentation copy render inside ACP Admin.
            Prefer real semantic HTML inside <code>Prose</code> instead of one-off heading styles.
          </p>

          <h2>What changed in this release</h2>
          <p>
            Operators can review audit trails faster, export filtered tables, and switch theme packs without
            leaving the shell. <em>Emphasis</em> and <mark>highlights</mark> stay theme-aware in light and dark
            modes.
          </p>

          <h3>Highlights</h3>
          <ul>
            <li>
              Faster user search across tenants
              <ul>
                <li>Exact email match</li>
                <li>Partial name match</li>
              </ul>
            </li>
            <li>
              Role templates for <abbr title="Role-based access control">RBAC</abbr>
            </li>
            <li>
              Keyboard shortcuts: open command palette with <kbd>⌘</kbd> + <kbd>K</kbd>
            </li>
          </ul>

          <h3>Rollout checklist</h3>
          <ol>
            <li>Confirm theme pack on staging</li>
            <li>Invite one operator per tenant</li>
            <li>Enable 2FA for privileged accounts</li>
          </ol>

          <h4>Definitions</h4>
          <dl>
            <dt>Tenant</dt>
            <dd>An organization boundary for users, roles, and billing.</dd>
            <dt>Operator</dt>
            <dd>A staff role that can manage users but not platform billing.</dd>
          </dl>

          <h4>Inline edits</h4>
          <p>
            Status moved from <del>invited</del> to <ins>active</ins>. Formula example: H<sub>2</sub>O and
            E = mc<sup>2</sup>. Published <time dateTime="2026-07-23">July 23, 2026</time>.
          </p>

          <hr />

          <h2>Quote from product</h2>
          <blockquote>
            <p>
              Keep admin chrome calm and readable — the content should carry hierarchy, not neon accents.
            </p>
            <footer>
              — <cite>Design principles</cite>
            </footer>
          </blockquote>

          <h2>Sample configuration</h2>
          <pre>
            <code>{`{
  "theme": "default",
  "colorMode": "system",
  "retentionDays": 30
}`}</code>
          </pre>

          <h2>Plan comparison</h2>
          <table>
            <caption>Starter vs Growth feature matrix (demo)</caption>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Starter</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Seats</td>
                <td>10</td>
                <td>100</td>
              </tr>
              <tr>
                <td>SSO</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Audit export</td>
                <td>CSV</td>
                <td>CSV + JSON</td>
              </tr>
            </tbody>
          </table>

          <figure>
            <pre>
              <code>GET /users?tenantId=t1&amp;status=active</code>
            </pre>
            <figcaption>Example API call used by the Users list.</figcaption>
          </figure>

          <h2>Support contact</h2>
          <address>
            ACP Admin Support
            <br />
            100 Market Street
            <br />
            São Paulo, SP
            <br />
            <a href="mailto:support@acp.local">support@acp.local</a>
          </address>

          <h5>Small heading</h5>
          <p>
            <small>Secondary footnotes and disclaimers use muted small text.</small>
          </p>

          <h6>Section label</h6>
          <p>
            Links stay on brand: see the{' '}
            <a href="/app/profile">profile settings</a> page for 2FA controls.
          </p>
        </Prose>
      </Card>
    </div>
  )
}
