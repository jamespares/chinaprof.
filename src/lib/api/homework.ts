import type { Homework } from '@/lib/types/database'

const API_BASE = '/api/homework'

export interface HomeworkEntry {
  studentId: number
  date: string
  status: boolean
}

export interface GridStudent {
  student: {
    id: number
    name: string
    class: string
  }
  homework: Array<{
    date: string
    status: boolean | null // null = not set, true = complete, false = incomplete
  }>
  stats: {
    total: number
    completed: number
    percentage: number
  }
}

export interface HomeworkGridData {
  dates: string[]
  students: GridStudent[]
  summary: {
    totalStudents: number
    dateRange: {
      startDate: string
      endDate: string
    }
  }
}

export class HomeworkAPI {
  static async getByStudentAndDateRange(
    studentId: number,
    startDate: string,
    endDate: string
  ): Promise<Homework[]> {
    const params = new URLSearchParams({
      studentId: studentId.toString(),
      startDate,
      endDate
    })

    const response = await fetch(`${API_BASE}?${params}`)
    if (!response.ok) {
      throw new Error('Failed to fetch homework')
    }
    return response.json()
  }

  static async updateHomework(entries: HomeworkEntry[]): Promise<void> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ entries })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update homework')
    }
  }

  static async getGridData(startDate: string, endDate: string): Promise<HomeworkGridData> {
    const params = new URLSearchParams({
      startDate,
      endDate
    })

    const response = await fetch(`${API_BASE}/grid?${params}`)
    if (!response.ok) {
      throw new Error('Failed to fetch homework grid')
    }
    return response.json()
  }

  // Helper to update a single homework entry
  static async markSingle(studentId: number, date: string, status: boolean): Promise<void> {
    return this.updateHomework([{ studentId, date, status }])
  }

  // Helper to bulk update homework for a specific date
  static async bulkUpdateForDate(
    date: string,
    updates: Array<{ studentId: number; status: boolean }>
  ): Promise<void> {
    const entries = updates.map((update) => ({
      studentId: update.studentId,
      date,
      status: update.status
    }))
    return this.updateHomework(entries)
  }
}
