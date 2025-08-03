import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock next/link to behave like an <a>
vi.mock('next/link', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: (props: any) => {
      const { href, children, ...rest } = props
      return (
        <a href={href} {...rest}>
          {children}
        </a>
      )
    }
  }
})

import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'

const links: Array<{ text: string; href: string }> = [
  { text: 'Dashboard', href: '/dashboard' },
  { text: 'Students', href: '/students' },
  { text: 'My Classes', href: '/classes' },
  { text: 'My Subjects', href: '/subjects' },
  { text: 'Homework', href: '/homework' },
  { text: 'Weekly Spelling Test', href: '/weekly-tests' },
  { text: 'Essay Marking', href: '/essay-marking' },
  { text: 'Grammar', href: '/grammar-errors' },
  { text: 'Lesson Plans', href: '/lesson-plans' },
  { text: 'Parents Evening', href: '/planning/parents-evening' },
  { text: 'Open Class', href: '/planning/open-class' },
  { text: 'Assembly', href: '/planning/assembly' },
  { text: 'Meetings', href: '/planning/meetings' },
  { text: 'Reports', href: '/reports' },
  { text: 'Settings', href: '/settings' }
]

describe('<AppSidebar>', () => {
  it('renders all navigation links with correct href', () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    )

    links.forEach(({ text, href }) => {
      const linkEl = screen.getByRole('link', { name: text }) as HTMLAnchorElement
      expect(linkEl).toBeInTheDocument()
      expect(linkEl.getAttribute('href')).toBe(href)
    })
  })
})
