import type { Subject } from '@/lib/types/database'

export const SubjectsAPI = {
  async getAll(): Promise<Subject[]> {
    const response = await fetch('/api/subjects')
    if (!response.ok) {
      throw new Error('Failed to fetch subjects')
    }
    return response.json()
  },

  async getById(id: number): Promise<Subject | null> {
    const response = await fetch(`/api/subjects/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch subject')
    }
    return response.json()
  },

  async create(subject: Omit<Subject, 'id'>): Promise<Subject> {
    const response = await fetch('/api/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subject)
    })

    if (!response.ok) {
      throw new Error('Failed to create subject')
    }

    return response.json()
  },

  async update(id: number, subject: Partial<Omit<Subject, 'id'>>): Promise<Subject> {
    const response = await fetch(`/api/subjects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subject)
    })

    if (!response.ok) {
      throw new Error('Failed to update subject')
    }

    return response.json()
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`/api/subjects/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete subject')
    }
  }
}
