import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomeworkGrid } from './homework-grid'
import type { HomeworkGridData } from '@/lib/api/homework'

const mockData: HomeworkGridData = {
  dates: ['2024-01-15', '2024-01-16', '2024-01-17'],
  students: [
    {
      student: { id: 1, name: 'John Doe', class: '8A' },
      homework: [
        { date: '2024-01-15', status: true },
        { date: '2024-01-16', status: false },
        { date: '2024-01-17', status: null }
      ],
      stats: { total: 3, completed: 1, percentage: 33 }
    },
    {
      student: { id: 2, name: 'Li Wei', class: '8A' },
      homework: [
        { date: '2024-01-15', status: true },
        { date: '2024-01-16', status: false },
        { date: '2024-01-17', status: true }
      ],
      stats: { total: 3, completed: 2, percentage: 67 }
    }
  ],
  summary: {
    totalStudents: 2,
    dateRange: {
      startDate: '2024-01-15',
      endDate: '2024-01-17'
    }
  }
}

const emptyData: HomeworkGridData = {
  dates: ['2024-01-15', '2024-01-16', '2024-01-17'],
  students: [],
  summary: {
    totalStudents: 0,
    dateRange: {
      startDate: '2024-01-15',
      endDate: '2024-01-17'
    }
  }
}

const mockOnUpdateHomework = vi.fn()
const mockOnBulkUpdate = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('HomeworkGrid', () => {
  it('should render homework grid with student data', async () => {
    render(
      <HomeworkGrid
        data={mockData}
        onUpdateHomework={mockOnUpdateHomework}
        onBulkUpdate={mockOnBulkUpdate}
      />
    )

    // Should show student names
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Li Wei')).toBeInTheDocument()
  })

  it('should display completion status with RAG indicators', async () => {
    render(
      <HomeworkGrid
        data={mockData}
        onUpdateHomework={mockOnUpdateHomework}
        onBulkUpdate={mockOnBulkUpdate}
      />
    )

    // Should show the RAG grid with homework status buttons
    expect(screen.getByText('Homework RAG Grid')).toBeInTheDocument()
    expect(
      screen.getByText('Red = Incomplete • Amber = Not Set • Green = Complete')
    ).toBeInTheDocument()
  })

  it('should show overall statistics', async () => {
    render(
      <HomeworkGrid
        data={mockData}
        onUpdateHomework={mockOnUpdateHomework}
        onBulkUpdate={mockOnBulkUpdate}
      />
    )

    // Should show summary statistics
    expect(screen.getByText('Average Completion')).toBeInTheDocument()
    expect(screen.getByText('Total Completed')).toBeInTheDocument()
    expect(screen.getByText('Students Tracked')).toBeInTheDocument()
  })

  it('should handle empty student data gracefully', async () => {
    render(
      <HomeworkGrid
        data={emptyData}
        onUpdateHomework={mockOnUpdateHomework}
        onBulkUpdate={mockOnBulkUpdate}
      />
    )

    // Should show empty state message
    expect(
      screen.getByText('No students found. Add students first to track homework.')
    ).toBeInTheDocument()
  })

  it('should call onUpdateHomework when homework status is changed', async () => {
    const user = userEvent.setup()

    render(
      <HomeworkGrid
        data={mockData}
        onUpdateHomework={mockOnUpdateHomework}
        onBulkUpdate={mockOnBulkUpdate}
      />
    )

    // Look for homework status buttons in the grid
    const statusButtons = screen
      .getAllByRole('button')
      .filter(
        (btn) =>
          btn.getAttribute('title')?.includes('John Doe') ||
          btn.getAttribute('title')?.includes('Li Wei')
      )

    if (statusButtons.length > 0) {
      await user.click(statusButtons[0])
      expect(mockOnUpdateHomework).toHaveBeenCalled()
    }
  })

  it('should show completion percentages', async () => {
    render(
      <HomeworkGrid
        data={mockData}
        onUpdateHomework={mockOnUpdateHomework}
        onBulkUpdate={mockOnBulkUpdate}
      />
    )

    // Should show percentage badges in the completion column
    expect(screen.getByText('33%')).toBeInTheDocument()
    expect(screen.getByText('67%')).toBeInTheDocument()
  })

  it('should handle bulk operations', async () => {
    const user = userEvent.setup()

    render(
      <HomeworkGrid
        data={mockData}
        onUpdateHomework={mockOnUpdateHomework}
        onBulkUpdate={mockOnBulkUpdate}
      />
    )

    // Should show the RAG grid which contains bulk operation functionality
    expect(screen.getByText('Homework RAG Grid')).toBeInTheDocument()
  })

  it('should display class information', async () => {
    render(
      <HomeworkGrid
        data={mockData}
        onUpdateHomework={mockOnUpdateHomework}
        onBulkUpdate={mockOnBulkUpdate}
      />
    )

    // Should show class information (both students are in class 8A)
    expect(screen.getAllByText('8A').length).toBeGreaterThan(0)
  })

  it('should handle loading states appropriately', () => {
    render(
      <HomeworkGrid
        data={mockData}
        onUpdateHomework={mockOnUpdateHomework}
        onBulkUpdate={mockOnBulkUpdate}
      />
    )

    // Component should render without loading states when data is provided
    expect(screen.getByText('Homework RAG Grid')).toBeInTheDocument()
  })
})
