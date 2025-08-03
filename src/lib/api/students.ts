import type { Student } from '@/lib/types/database'

const API_BASE = '/api/students'

export class StudentsAPI {
  static async getAll(): Promise<Student[]> {
    const response = await fetch(API_BASE)
    if (!response.ok) {
      throw new Error('Failed to fetch students')
    }
    return response.json()
  }

  static async getById(id: number): Promise<Student> {
    const response = await fetch(`${API_BASE}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch student')
    }
    return response.json()
  }

  static async create(student: Omit<Student, 'id'>): Promise<Student> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(student)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create student')
    }

    return response.json()
  }

  static async update(id: number, updates: Partial<Omit<Student, 'id'>>): Promise<Student> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update student')
    }

    return response.json()
  }

  static async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete student')
    }
  }
}
