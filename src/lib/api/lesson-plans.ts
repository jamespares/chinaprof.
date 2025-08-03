import type { LessonPlan } from '@/lib/types/database'

export const LessonPlansAPI = {
  async getBySubject(subjectId: number): Promise<LessonPlan[]> {
    const response = await fetch(`/api/lesson-plans?subjectId=${subjectId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch lesson plans')
    }
    return response.json()
  },

  async create(lessonPlan: Omit<LessonPlan, 'id'>): Promise<LessonPlan> {
    const response = await fetch('/api/lesson-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lessonPlan)
    })

    if (!response.ok) {
      throw new Error('Failed to create lesson plan')
    }

    return response.json()
  },

  async update(id: number, lessonPlan: Partial<Omit<LessonPlan, 'id'>>): Promise<LessonPlan> {
    const response = await fetch(`/api/lesson-plans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lessonPlan)
    })

    if (!response.ok) {
      throw new Error('Failed to update lesson plan')
    }

    return response.json()
  }
}
