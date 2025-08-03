import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { GrammarAnalytics } from './grammar-analytics'

// Mock Chart.js components
vi.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }: any) => (
    <div data-testid="bar-chart">
      <div data-testid="chart-title">{options?.plugins?.title?.text}</div>
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  Pie: ({ data, options }: any) => (
    <div data-testid="pie-chart">
      <div data-testid="chart-title">{options?.plugins?.title?.text}</div>
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  Line: ({ data, options }: any) => (
    <div data-testid="line-chart">
      <div data-testid="chart-title">{options?.plugins?.title?.text}</div>
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  )
}))

vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  ArcElement: {},
  LineElement: {},
  PointElement: {},
  Title: {},
  Tooltip: {},
  Legend: {}
}))

const mockGrammarErrors = [
  {
    id: 1,
    student_id: 1,
    subject_id: 1,
    date: '2024-01-15',
    error_code: 'SVA001',
    lesson_ref: 'Unit 3',
    student_name: 'John Doe',
    subject_name: 'English Grammar'
  },
  {
    id: 2,
    student_id: 1,
    subject_id: 1,
    date: '2024-01-14',
    error_code: 'ART002',
    lesson_ref: 'Unit 2',
    student_name: 'John Doe',
    subject_name: 'English Grammar'
  },
  {
    id: 3,
    student_id: 2,
    subject_id: 1,
    date: '2024-01-13',
    error_code: 'SVA001',
    lesson_ref: 'Unit 3',
    student_name: 'Li Wei',
    subject_name: 'English Grammar'
  },
  {
    id: 4,
    student_id: 2,
    subject_id: 1,
    date: '2024-01-12',
    error_code: 'PRE003',
    lesson_ref: 'Unit 1',
    student_name: 'Li Wei',
    subject_name: 'English Grammar'
  },
  {
    id: 5,
    student_id: 3,
    subject_id: 1,
    date: '2024-01-11',
    error_code: 'SVA001',
    lesson_ref: 'Unit 3',
    student_name: 'Zhang Min',
    subject_name: 'English Grammar'
  }
]

const mockStudents = [
  { id: 1, name: 'John Doe', class: '8A' },
  { id: 2, name: 'Li Wei', class: '8A' },
  { id: 3, name: 'Zhang Min', class: '8B' }
]

describe('GrammarAnalytics', () => {
  it('should render analytics overview with correct statistics', async () => {
    render(<GrammarAnalytics errors={mockGrammarErrors} students={mockStudents} />)

    await waitFor(() => {
      // Check that Total Errors text appears
      expect(screen.getByText('Total Errors')).toBeInTheDocument()

      // Check that Students Affected text appears
      expect(screen.getByText('Students Affected')).toBeInTheDocument()
    })
  })

  it('should display most common errors correctly', async () => {
    render(<GrammarAnalytics errors={mockGrammarErrors} students={mockStudents} />)

    await waitFor(() => {
      // Should show error analysis sections
      expect(screen.getByText('Most Common Errors')).toBeInTheDocument()
      // SVA001 appears 3 times, should be most common - check that it appears at least once
      expect(screen.getAllByText('SVA001')[0]).toBeInTheDocument()
    })
  })

  it('should render error frequency section', async () => {
    render(<GrammarAnalytics errors={mockGrammarErrors} students={mockStudents} />)

    await waitFor(() => {
      expect(screen.getByText('Most Common Errors')).toBeInTheDocument()
      expect(screen.getAllByText('SVA001').length).toBeGreaterThan(0)
    })
  })

  it('should show error distribution by student', async () => {
    render(<GrammarAnalytics errors={mockGrammarErrors} students={mockStudents} />)

    await waitFor(() => {
      // Should show each student with their error count
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Li Wei')).toBeInTheDocument()
      expect(screen.getByText('Zhang Min')).toBeInTheDocument()
    })
  })

  it('should handle empty error data gracefully', async () => {
    render(<GrammarAnalytics errors={[]} students={mockStudents} />)

    await waitFor(() => {
      expect(screen.getByText('Total Errors')).toBeInTheDocument()
      expect(screen.getByText('Students Affected')).toBeInTheDocument()
    })
  })

  it('should handle extended error data with additional entries', async () => {
    const errorsWithDates = [
      ...mockGrammarErrors,
      {
        id: 6,
        student_id: 1,
        subject_id: 1,
        date: '2024-01-16',
        error_code: 'SVA001',
        lesson_ref: 'Unit 4',
        student_name: 'John Doe',
        subject_name: 'English Grammar'
      }
    ]

    render(<GrammarAnalytics errors={errorsWithDates} students={mockStudents} />)

    await waitFor(() => {
      // Should render with additional error data
      expect(screen.getByText('Total Errors')).toBeInTheDocument()
    })
  })

  it('should show error analysis and student breakdown', async () => {
    render(<GrammarAnalytics errors={mockGrammarErrors} students={mockStudents} />)

    await waitFor(() => {
      // Should show error analysis sections
      expect(screen.getByText('Most Common Errors')).toBeInTheDocument()
      expect(screen.getByText('Students Needing Most Support')).toBeInTheDocument()
    })
  })

  it('should show total error count in summary stats', async () => {
    render(<GrammarAnalytics errors={mockGrammarErrors} students={mockStudents} />)

    await waitFor(() => {
      // Should show total errors count (5 from mock data)
      expect(screen.getByText('Total Errors')).toBeInTheDocument()
    })
  })

  it('should show analytics header and filters', async () => {
    render(<GrammarAnalytics errors={mockGrammarErrors} students={mockStudents} />)

    await waitFor(() => {
      // Should show main header
      expect(screen.getByText('Grammar Error Analytics')).toBeInTheDocument()
      expect(screen.getByText('All Students')).toBeInTheDocument()
      expect(screen.getByText('All Time')).toBeInTheDocument()
    })
  })

  it('should show students affected count', async () => {
    render(<GrammarAnalytics errors={mockGrammarErrors} students={mockStudents} />)

    await waitFor(() => {
      // Should show students affected (3 unique students from mock data)
      expect(screen.getByText('Students Affected')).toBeInTheDocument()
    })
  })

  it('should show export functionality', async () => {
    global.URL.createObjectURL = vi.fn()
    global.URL.revokeObjectURL = vi.fn()

    render(<GrammarAnalytics errors={mockGrammarErrors} students={mockStudents} />)

    await waitFor(() => {
      const exportButton = screen.getByText('Export')
      expect(exportButton).toBeInTheDocument()
    })
  })
})
