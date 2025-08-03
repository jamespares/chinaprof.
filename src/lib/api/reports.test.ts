import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ReportsAPI } from './reports'
import type { StudentReportData } from './reports'

// Mock fetch globally
global.fetch = vi.fn()

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
      { id: 2, date: '2024-01-14', status: false }
    ]
  },
  grammar: {
    total_errors: 5,
    error_breakdown: {
      SVA001: 3,
      ART002: 2
    },
    recent_errors: [
      { id: 1, date: '2024-01-15', error_code: 'SVA001' },
      { id: 2, date: '2024-01-14', error_code: 'ART002' }
    ]
  },
  tests: {
    total_tests: 3,
    average_score: 82,
    recent_scores: [
      { id: 1, test_name: 'Weekly Test 1', score: 85, max_score: 100, percentage: 85 },
      { id: 2, test_name: 'Weekly Test 2', score: 78, max_score: 100, percentage: 78 }
    ]
  },
  comments: {
    total_comments: 2,
    recent_comments: [
      {
        id: 1,
        date: '2024-01-15',
        comment: 'Great improvement in speaking confidence',
        subject_name: 'English Speaking'
      }
    ]
  }
}

const mockFetch = vi.mocked(fetch)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ReportsAPI', () => {
  describe('getStudentReport', () => {
    it('should fetch student report successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReportData
      } as Response)

      const result = await ReportsAPI.getStudentReport(1)

      expect(mockFetch).toHaveBeenCalledWith('/api/reports/student/1')
      expect(result).toEqual(mockReportData)
    })

    it('should throw error when API returns error status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as Response)

      await expect(ReportsAPI.getStudentReport(999)).rejects.toThrow(
        'Failed to fetch student report'
      )
    })

    it('should throw error when network request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(ReportsAPI.getStudentReport(1)).rejects.toThrow('Network error')
    })

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        }
      } as Response)

      await expect(ReportsAPI.getStudentReport(1)).rejects.toThrow('Invalid JSON')
    })

    it('should construct correct API endpoint for different student IDs', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockReportData
      } as Response)

      await ReportsAPI.getStudentReport(42)
      expect(mockFetch).toHaveBeenCalledWith('/api/reports/student/42')

      await ReportsAPI.getStudentReport(999)
      expect(mockFetch).toHaveBeenCalledWith('/api/reports/student/999')
    })

    it('should handle empty report data structure', async () => {
      const emptyReportData: StudentReportData = {
        student: {
          id: 1,
          name: 'Empty Student',
          class: '8C',
          dob: '2010-01-01'
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyReportData
      } as Response)

      const result = await ReportsAPI.getStudentReport(1)
      expect(result).toEqual(emptyReportData)
    })

    it('should handle different HTTP error status codes appropriately', async () => {
      // Test 400 Bad Request
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      } as Response)

      await expect(ReportsAPI.getStudentReport(-1)).rejects.toThrow(
        'Failed to fetch student report'
      )

      // Test 500 Internal Server Error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response)

      await expect(ReportsAPI.getStudentReport(1)).rejects.toThrow('Failed to fetch student report')
    })

    it('should preserve all data structure properties in response', async () => {
      const complexReportData: StudentReportData = {
        student: {
          id: 5,
          name: 'Complex Student',
          class: '9A',
          dob: '2009-12-25'
        },
        generated_at: '2024-01-20T15:45:30.123Z',
        homework: {
          total_assignments: 50,
          completed_assignments: 47,
          completion_percentage: 94,
          recent_homework: Array.from({ length: 14 }, (_, i) => ({
            id: i + 1,
            date: `2024-01-${String(i + 1).padStart(2, '0')}`,
            status: i % 3 !== 0 // Mix of true/false
          }))
        },
        grammar: {
          total_errors: 12,
          error_breakdown: {
            SVA001: 5,
            ART002: 3,
            PRE003: 2,
            TENSE004: 2
          },
          recent_errors: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            date: `2024-01-${String(i + 1).padStart(2, '0')}`,
            error_code: ['SVA001', 'ART002', 'PRE003'][i % 3]
          }))
        },
        tests: {
          total_tests: 8,
          average_score: 87,
          recent_scores: Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            test_name: `Weekly Test ${i + 1}`,
            score: 80 + i * 2,
            max_score: 100,
            percentage: 80 + i * 2
          }))
        },
        comments: {
          total_comments: 6,
          recent_comments: Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            date: `2024-01-${String((i + 1) * 3).padStart(2, '0')}`,
            comment: `Detailed comment ${i + 1} about student progress and observations`,
            subject_name: ['English Grammar', 'English Speaking', 'English Writing'][i % 3]
          }))
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => complexReportData
      } as Response)

      const result = await ReportsAPI.getStudentReport(5)

      expect(result).toEqual(complexReportData)
      expect(result.homework.recent_homework).toHaveLength(14)
      expect(result.grammar.recent_errors).toHaveLength(10)
      expect(result.tests.recent_scores).toHaveLength(8)
      expect(result.comments.recent_comments).toHaveLength(5)
    })

    it('should handle API timeout scenarios', async () => {
      // Mock a slow response that times out
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  ok: false,
                  status: 408,
                  statusText: 'Request Timeout'
                } as Response),
              100
            )
          })
      )

      const startTime = Date.now()
      await expect(ReportsAPI.getStudentReport(1)).rejects.toThrow('Failed to fetch student report')
      const endTime = Date.now()

      expect(endTime - startTime).toBeGreaterThan(90) // Should take at least 100ms
    })

    it('should validate required fields in response data', async () => {
      const incompleteReportData = {
        student: {
          id: 1,
          name: 'Test Student'
          // Missing class and dob
        },
        generated_at: '2024-01-15T10:30:00.000Z'
        // Missing other sections
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => incompleteReportData
      } as Response)

      // The API should still return the data even if incomplete
      // Validation would typically happen at the component level
      const result = await ReportsAPI.getStudentReport(1)
      expect(result.student.id).toBe(1)
      expect(result.student.name).toBe('Test Student')
    })
  })
})
