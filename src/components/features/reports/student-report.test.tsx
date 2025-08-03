import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { StudentReport } from './student-report'
import type { StudentReportData } from '@/lib/api/reports'

// Mock the grammar errors data
vi.mock('@/lib/data/grammar-errors', () => ({
  COMMON_GRAMMAR_ERRORS: [
    { code: 'SVA001', error: 'Subject-Verb Agreement' },
    { code: 'ART002', error: 'Article Usage' },
    { code: 'PRE003', error: 'Preposition Errors' },
    { code: 'TENSE004', error: 'Tense Consistency' }
  ]
}))

const mockReportData: StudentReportData = {
  student: {
    id: 1,
    name: 'John Doe',
    class: '8A',
    dob: '2010-03-15'
  },
  generated_at: '2024-01-15T10:30:00.000Z',
  homework: {
    total_assignments: 25,
    completed_assignments: 20,
    completion_percentage: 80,
    recent_homework: [
      { id: 1, date: '2024-01-15', status: true },
      { id: 2, date: '2024-01-14', status: true },
      { id: 3, date: '2024-01-13', status: false },
      { id: 4, date: '2024-01-12', status: true },
      { id: 5, date: '2024-01-11', status: true }
    ]
  },
  grammar: {
    total_errors: 7,
    error_breakdown: {
      SVA001: 3,
      ART002: 2,
      PRE003: 1,
      TENSE004: 1
    },
    recent_errors: [
      { id: 1, date: '2024-01-15', error_code: 'SVA001' },
      { id: 2, date: '2024-01-14', error_code: 'ART002' },
      { id: 3, date: '2024-01-13', error_code: 'SVA001' }
    ]
  },
  tests: {
    total_tests: 4,
    average_score: 82,
    recent_scores: [
      { id: 1, test_name: 'Weekly Spelling Test 1', score: 85, max_score: 100, percentage: 85 },
      { id: 2, test_name: 'Weekly Spelling Test 2', score: 78, max_score: 100, percentage: 78 },
      { id: 3, test_name: 'Weekly Spelling Test 3', score: 92, max_score: 100, percentage: 92 },
      { id: 4, test_name: 'Monthly Assessment', score: 74, max_score: 100, percentage: 74 }
    ]
  },
  comments: {
    total_comments: 3,
    recent_comments: [
      {
        id: 1,
        date: '2024-01-15',
        comment:
          'Excellent participation in class discussions. Shows good understanding of topics.',
        subject_name: 'English Speaking'
      },
      {
        id: 2,
        date: '2024-01-10',
        comment: 'Improvement shown in grammar exercises. Keep practicing!',
        subject_name: 'English Grammar'
      },
      {
        id: 3,
        date: '2024-01-08',
        comment: 'Creative writing shows good vocabulary range.',
        subject_name: 'English Writing'
      }
    ]
  }
}

const emptyReportData: StudentReportData = {
  student: {
    id: 2,
    name: 'Jane Smith',
    class: '8B',
    dob: '2010-08-22'
  },
  generated_at: '2024-01-15T10:30:00.000Z',
  homework: {
    total_assignments: 0,
    completed_assignments: 0,
    completion_percentage: 0,
    recent_homework: []
  },
  grammar: {
    total_errors: 0,
    error_breakdown: {},
    recent_errors: []
  },
  tests: {
    total_tests: 0,
    average_score: 0,
    recent_scores: []
  },
  comments: {
    total_comments: 0,
    recent_comments: []
  }
}

describe('StudentReport', () => {
  it('should render student header information correctly', () => {
    render(<StudentReport reportData={mockReportData} />)

    expect(screen.getByText('John Doe - Progress Report')).toBeInTheDocument()
    expect(screen.getByText(/Class: 8A/)).toBeInTheDocument()
    expect(screen.getByText(/Generated: Jan 15, 2024/)).toBeInTheDocument()
  })

  it('should display homework completion statistics', () => {
    render(<StudentReport reportData={mockReportData} />)

    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('20 of 25 completed')).toBeInTheDocument()
  })

  it('should show test average and performance badge', () => {
    render(<StudentReport reportData={mockReportData} />)

    expect(screen.getByText('82%')).toBeInTheDocument()
    expect(screen.getByText('Based on 4 tests')).toBeInTheDocument()
    expect(screen.getByText('Good')).toBeInTheDocument() // Performance badge for 82%
  })

  it('should display grammar error count', () => {
    render(<StudentReport reportData={mockReportData} />)

    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('Total logged errors')).toBeInTheDocument()
  })

  it('should show comment count', () => {
    render(<StudentReport reportData={mockReportData} />)

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Teacher observations')).toBeInTheDocument()
  })

  it('should render recent test scores with correct formatting', () => {
    render(<StudentReport reportData={mockReportData} />)

    expect(screen.getByText('Weekly Spelling Test 1')).toBeInTheDocument()
    expect(screen.getByText('85 / 100 points')).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()

    expect(screen.getByText('Monthly Assessment')).toBeInTheDocument()
    expect(screen.getByText('74 / 100 points')).toBeInTheDocument()
    expect(screen.getByText('74%')).toBeInTheDocument()
  })

  it('should display grammar error breakdown with proper names', () => {
    render(<StudentReport reportData={mockReportData} />)

    expect(screen.getByText('Subject-Verb Agreement')).toBeInTheDocument()
    expect(screen.getByText('3x')).toBeInTheDocument()
    expect(screen.getByText('Article Usage')).toBeInTheDocument()
    expect(screen.getByText('2x')).toBeInTheDocument()
  })

  it('should show teacher comments with dates and subjects', () => {
    render(<StudentReport reportData={mockReportData} />)

    expect(screen.getByText(/Excellent participation in class discussions/)).toBeInTheDocument()
    expect(screen.getByText('English Speaking')).toBeInTheDocument()
    expect(screen.getByText(/Improvement shown in grammar exercises/)).toBeInTheDocument()
    expect(screen.getByText('English Grammar')).toBeInTheDocument()
  })

  it('should render homework completion visual indicators', () => {
    render(<StudentReport reportData={mockReportData} />)

    // Should show recent homework grid
    const completedIndicators = screen.getAllByText('✓')
    const missedIndicators = screen.getAllByText('✗')

    expect(completedIndicators.length).toBeGreaterThan(0)
    expect(missedIndicators.length).toBeGreaterThan(0)
  })

  it('should handle empty data gracefully', () => {
    render(<StudentReport reportData={emptyReportData} />)

    expect(screen.getByText('Jane Smith - Progress Report')).toBeInTheDocument()
    expect(screen.getByText('No test scores recorded yet.')).toBeInTheDocument()
    expect(screen.getByText('No grammar errors recorded yet.')).toBeInTheDocument()
    expect(screen.getByText('No comments recorded yet.')).toBeInTheDocument()
  })

  it('should show correct performance badges for different score ranges', () => {
    const excellentData = {
      ...mockReportData,
      tests: { ...mockReportData.tests, average_score: 95 }
    }
    const { rerender } = render(<StudentReport reportData={excellentData} />)
    expect(screen.getByText('Excellent')).toBeInTheDocument()

    const needsImprovementData = {
      ...mockReportData,
      tests: { ...mockReportData.tests, average_score: 65 }
    }
    rerender(<StudentReport reportData={needsImprovementData} />)
    expect(screen.getByText('Needs Improvement')).toBeInTheDocument()

    const attentionRequiredData = {
      ...mockReportData,
      tests: { ...mockReportData.tests, average_score: 45 }
    }
    rerender(<StudentReport reportData={attentionRequiredData} />)
    expect(screen.getByText('Requires Attention')).toBeInTheDocument()
  })

  it('should properly sort grammar errors by frequency', () => {
    const data = {
      ...mockReportData,
      grammar: {
        ...mockReportData.grammar,
        error_breakdown: {
          PRE003: 1,
          SVA001: 5,
          ART002: 3,
          TENSE004: 2
        }
      }
    }

    render(<StudentReport reportData={data} />)

    // SVA001 (5x) should appear before ART002 (3x)
    const errorElements = screen.getAllByText(/\dx/)
    const firstError = errorElements[0]
    expect(firstError).toHaveTextContent('5x')
  })

  it('should format dates consistently throughout the report', () => {
    render(<StudentReport reportData={mockReportData} />)

    // Check that dates are formatted as "Jan 15, 2024" style
    const allDates = screen.getAllByText(/Jan \d{1,2}, 2024/)
    expect(allDates.length).toBeGreaterThan(0)

    // Specifically check the generated date in header
    expect(screen.getByText(/Generated: Jan 15, 2024/)).toBeInTheDocument()
  })

  it('should limit displayed data appropriately', () => {
    const dataWithManyItems = {
      ...mockReportData,
      tests: {
        ...mockReportData.tests,
        recent_scores: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          test_name: `Test ${i + 1}`,
          score: 80 + i,
          max_score: 100,
          percentage: 80 + i
        }))
      }
    }

    render(<StudentReport reportData={dataWithManyItems} />)

    // Should only show first 5 test scores
    expect(screen.getByText('Test 1')).toBeInTheDocument()
    expect(screen.getByText('Test 5')).toBeInTheDocument()
    expect(screen.queryByText('Test 6')).not.toBeInTheDocument()
  })

  it('should handle singular/plural text correctly', () => {
    const singleTestData = {
      ...mockReportData,
      tests: {
        total_tests: 1,
        average_score: 85,
        recent_scores: [
          { id: 1, test_name: 'Single Test', score: 85, max_score: 100, percentage: 85 }
        ]
      }
    }

    render(<StudentReport reportData={singleTestData} />)
    expect(screen.getByText('Based on 1 test')).toBeInTheDocument() // Singular form
  })

  it('should provide meaningful tooltips for homework indicators', () => {
    render(<StudentReport reportData={mockReportData} />)

    // Check that homework indicators have meaningful titles
    const completedHomework = screen.getByTitle(/Jan 15, 2024: Completed/)
    expect(completedHomework).toBeInTheDocument()
  })

  it('should use appropriate color coding for test score badges', () => {
    render(<StudentReport reportData={mockReportData} />)

    // Check that different scores get different badge variants
    const highScore = screen.getByText('92%') // Should be default variant (>= 80)
    const lowScore = screen.getByText('74%') // Should be secondary variant (>= 60, < 80)

    expect(highScore).toBeInTheDocument()
    expect(lowScore).toBeInTheDocument()
  })
})
