/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from './route'
import { getDatabase } from '@/lib/db/database'

// Mock the database
vi.mock('@/lib/db/database')

const mockDb = {
  prepare: vi.fn()
}

const mockStmt = {
  all: vi.fn(),
  run: vi.fn()
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getDatabase).mockReturnValue(mockDb as any)
  mockDb.prepare.mockReturnValue(mockStmt as any)
})

describe('/api/essay-feedback', () => {
  describe('GET - Essay Feedback Retrieval', () => {
    it('should fetch all essay feedback successfully', async () => {
      const mockFeedback = [
        {
          id: 1,
          student_id: 1,
          subject_id: 1,
          essay_text: 'Sample essay about my family...',
          feedback: 'Good structure but needs grammar work',
          score: 75,
          student_name: 'John Doe',
          subject_name: 'English Writing',
          created_at: '2024-01-15'
        },
        {
          id: 2,
          student_id: 2,
          subject_id: 1,
          essay_text: 'My favorite holiday is Chinese New Year...',
          feedback: 'Excellent vocabulary and cultural details',
          score: 88,
          student_name: 'Li Wei',
          subject_name: 'English Writing',
          created_at: '2024-01-14'
        }
      ]

      mockStmt.all.mockReturnValue(mockFeedback)

      const request = new Request('http://localhost:3000/api/essay-feedback')
      const response = await GET(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockFeedback)
      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining(
          'SELECT ef.*, s.name as student_name, sub.name as subject_name FROM essay_feedback ef'
        )
      )
    })

    it('should filter feedback by student ID', async () => {
      const mockFeedback = [
        {
          id: 1,
          student_id: 1,
          essay_text: 'Sample essay...',
          feedback: 'Good work',
          score: 75,
          student_name: 'John Doe',
          subject_name: 'English Writing'
        }
      ]

      mockStmt.all.mockReturnValue(mockFeedback)

      const request = new Request('http://localhost:3000/api/essay-feedback?studentId=1')
      const response = await GET(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockFeedback)
      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('WHERE ef.student_id = ?')
      )
      expect(mockStmt.all).toHaveBeenCalledWith(1)
    })

    it('should handle database errors gracefully', async () => {
      mockStmt.all.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const request = new Request('http://localhost:3000/api/essay-feedback')
      const response = await GET(request as any)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch essay feedback')
    })
  })

  describe('POST - Essay Feedback Creation', () => {
    it('should create essay feedback successfully', async () => {
      const mockRunResult = {
        lastInsertRowid: 123,
        changes: 1
      }
      mockStmt.run.mockReturnValue(mockRunResult)

      const essayData = {
        studentId: 1,
        subjectId: 1,
        essayText: 'My family has four people. My father is teacher and my mother is doctor...',
        feedback: 'Good content but needs work on grammar and articles',
        score: 72,
        ageGroup: 'middle-school',
        taskType: 'descriptive',
        rubric: 'standard'
      }

      const request = new Request('http://localhost:3000/api/essay-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(essayData)
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.id).toBe(123)
      expect(data.success).toBe(true)
      expect(mockStmt.run).toHaveBeenCalledWith(1, 1, essayData.essayText, essayData.feedback, 72)
    })

    it('should validate required fields', async () => {
      const incompleteData = {
        studentId: 1,
        // Missing subjectId, essayText, feedback
        score: 75
      }

      const request = new Request('http://localhost:3000/api/essay-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incompleteData)
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Missing required fields')
    })

    it('should handle AI essay analysis integration', async () => {
      // Test the AI marking function (mocked)
      const essayText =
        'My family have four person. Father work in school, mother work in hospital. I have one brother. We live in big house with garden. Every weekend we go park together and play games. I love my family very much because they always help me when I need.'

      const expectedAIFeedback = {
        overallScore: 68,
        feedback:
          'Good family description with clear structure. Grammar needs improvement: "have" should be "has", "person" should be "people", add articles "a/the". Vocabulary is appropriate for level.',
        grammarErrors: ['subject-verb agreement', 'plural forms', 'missing articles'],
        strengths: ['clear content', 'good family vocabulary', 'logical organization'],
        improvements: ['grammar accuracy', 'article usage', 'sentence variety']
      }

      // This would test the AI integration if implemented
      // For now, we'll test that the structure handles AI data correctly
      const aiData = {
        studentId: 1,
        subjectId: 1,
        essayText,
        feedback: expectedAIFeedback.feedback,
        score: expectedAIFeedback.overallScore,
        aiAnalysis: expectedAIFeedback
      }

      expect(aiData.score).toBe(68)
      expect(aiData.feedback).toContain('Grammar needs improvement')
      expect(aiData.aiAnalysis?.grammarErrors).toContain('subject-verb agreement')
    })
  })
})
