import type { WeeklyTest, WeeklyScore } from '@/lib/types/database'

export const WeeklyTestsAPI = {
  async getAll(): Promise<WeeklyTest[]> {
    const response = await fetch('/api/weekly-tests')
    if (!response.ok) {
      throw new Error('Failed to fetch weekly tests')
    }
    return response.json()
  },

  async create(test: Omit<WeeklyTest, 'id'>): Promise<WeeklyTest> {
    const response = await fetch('/api/weekly-tests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(test)
    })

    if (!response.ok) {
      throw new Error('Failed to create weekly test')
    }

    return response.json()
  },

  async getScores(
    testId: number
  ): Promise<(WeeklyScore & { student_name: string; student_class: string })[]> {
    const response = await fetch(`/api/weekly-scores?testId=${testId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch test scores')
    }
    return response.json()
  },

  async updateScores(
    scores: Array<{ test_id: number; student_id: number; score: number }>
  ): Promise<void> {
    const response = await fetch('/api/weekly-scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ scores })
    })

    if (!response.ok) {
      throw new Error('Failed to update test scores')
    }
  }
}
