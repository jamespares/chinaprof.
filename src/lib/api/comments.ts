import type { Comment } from '@/lib/types/database'

export const CommentsAPI = {
  async getByStudent(studentId: number): Promise<(Comment & { subject_name: string })[]> {
    const response = await fetch(`/api/comments?studentId=${studentId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch comments')
    }
    return response.json()
  },

  async create(comment: Omit<Comment, 'id' | 'date'>): Promise<Comment & { subject_name: string }> {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    })

    if (!response.ok) {
      throw new Error('Failed to create comment')
    }

    return response.json()
  }
}
