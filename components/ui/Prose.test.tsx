import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Prose } from './Prose'

describe('Prose', () => {
  it('renders semantic children', () => {
    render(
      <Prose>
        <h1>Platform release notes</h1>
        <p>
          Read the <a href="/app/profile">profile</a> guide.
        </p>
        <blockquote>
          <p>Keep chrome calm.</p>
        </blockquote>
      </Prose>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Platform release notes' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'profile' })).toHaveAttribute('href', '/app/profile')
    expect(screen.getByText('Keep chrome calm.')).toBeInTheDocument()
  })
})
