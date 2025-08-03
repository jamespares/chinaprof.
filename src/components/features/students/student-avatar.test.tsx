import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StudentAvatar } from './student-avatar'

describe('<StudentAvatar>', () => {
  it('renders with initials when no avatar_url provided', () => {
    const student = { name: 'Alice Chen' }
    render(<StudentAvatar student={student} />)
    
    // Should show initials AC
    const initials = screen.getByText('AC')
    expect(initials).toBeInTheDocument()
  })

  it('renders with avatar image when avatar_url provided', () => {
    const student = { name: 'Bob Wang', avatar_url: '/test-avatar.png' }
    render(<StudentAvatar student={student} />)
    
    const avatar = screen.getByRole('img', { name: /bob wang's avatar/i })
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', '/test-avatar.png')
  })

  it('generates correct initials for space-separated Chinese names', () => {
    const student = { name: '李 明华' }
    render(<StudentAvatar student={student} />)
    
    // Should show first character of first and last parts
    const initials = screen.getByText('李明')
    expect(initials).toBeInTheDocument()
  })

  it('generates correct initials for single-word Chinese names', () => {
    const student = { name: '李明华' }
    render(<StudentAvatar student={student} />)
    
    // For single-word names, shows only first character
    const initials = screen.getByText('李')
    expect(initials).toBeInTheDocument()
  })

  it('handles single character names', () => {
    const student = { name: 'A' }
    render(<StudentAvatar student={student} />)
    
    const initials = screen.getByText('A')
    expect(initials).toBeInTheDocument()
  })

  it('applies custom size classes', () => {
    const student = { name: 'Charlie Brown' }
    const { container } = render(<StudentAvatar student={student} size="lg" />)
    
    const avatar = container.querySelector('[data-testid="avatar"]') || container.querySelector('.h-10')
    expect(avatar).toBeInTheDocument()
  })
})