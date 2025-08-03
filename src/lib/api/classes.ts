import { getDatabase } from '@/lib/db/database'
import type { Class } from '@/lib/types/database'

export class ClassesAPI {
  /**
   * Get all classes
   */
  static async getAll(): Promise<Class[]> {
    const db = getDatabase() as any
    const query = `
      SELECT id, name, description, year_level, teacher_id, created_at, updated_at 
      FROM classes 
      ORDER BY year_level ASC, name ASC
    `
    return db.all(query)
  }

  /**
   * Get a single class by ID
   */
  static async getById(id: number): Promise<Class | null> {
    const db = getDatabase() as any
    const query = `
      SELECT id, name, description, year_level, teacher_id, created_at, updated_at 
      FROM classes 
      WHERE id = ?
    `
    const result = db.get(query, [id])
    return result || null
  }

  /**
   * Create a new class
   */
  static async create(classData: Omit<Class, 'id'>): Promise<Class> {
    const db = getDatabase() as any
    const query = `
      INSERT INTO classes (name, description, year_level, teacher_id)
      VALUES (?, ?, ?, ?)
    `

    const result = db.run(query, [
      classData.name,
      classData.description || null,
      classData.year_level || null,
      classData.teacher_id || null
    ])

    if (!result.lastInsertRowid) {
      throw new Error('Failed to create class')
    }

    const newClass = await this.getById(Number(result.lastInsertRowid))
    if (!newClass) {
      throw new Error('Failed to retrieve created class')
    }

    return newClass
  }

  /**
   * Update an existing class
   */
  static async update(id: number, classData: Partial<Omit<Class, 'id'>>): Promise<Class> {
    const db = getDatabase() as any

    const updates: string[] = []
    const values: any[] = []

    if (classData.name !== undefined) {
      updates.push('name = ?')
      values.push(classData.name)
    }
    if (classData.description !== undefined) {
      updates.push('description = ?')
      values.push(classData.description)
    }
    if (classData.year_level !== undefined) {
      updates.push('year_level = ?')
      values.push(classData.year_level)
    }
    if (classData.teacher_id !== undefined) {
      updates.push('teacher_id = ?')
      values.push(classData.teacher_id)
    }

    if (updates.length === 0) {
      throw new Error('No fields to update')
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    const query = `UPDATE classes SET ${updates.join(', ')} WHERE id = ?`
    db.run(query, values)

    const updatedClass = await this.getById(id)
    if (!updatedClass) {
      throw new Error('Failed to retrieve updated class')
    }

    return updatedClass
  }

  /**
   * Delete a class
   */
  static async delete(id: number): Promise<void> {
    const db = getDatabase() as any
    const query = 'DELETE FROM classes WHERE id = ?'
    db.run(query, [id])
  }

  /**
   * Get students in a class
   */
  static async getStudents(classId: number): Promise<any[]> {
    const db = getDatabase() as any
    const query = `
      SELECT s.id, s.name, s.class, s.dob, s.avatar_url, s.created_at, s.updated_at
      FROM students s
      WHERE s.class_id = ?
      ORDER BY s.name ASC
    `
    return db.all(query, [classId])
  }

  /**
   * Get class statistics
   */
  static async getStats(classId: number): Promise<{
    studentCount: number
    homeworkCompletionRate: number
    averageTestScore: number
  }> {
    const db = getDatabase() as any

    // Get student count
    const studentCountQuery = 'SELECT COUNT(*) as count FROM students WHERE class_id = ?'
    const studentCountResult = db.get(studentCountQuery, [classId]) as { count: number }

    // Get homework completion rate (last 30 days)
    const homeworkQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as completed
      FROM homework h
      JOIN students s ON h.student_id = s.id
      WHERE s.class_id = ? 
      AND h.date >= date('now', '-30 days')
    `
    const homeworkResult = db.get(homeworkQuery, [classId]) as { total: number; completed: number }

    // Get average test score (last 10 tests)
    const testScoreQuery = `
      SELECT AVG(ws.score * 100.0 / wt.max_score) as avg_score
      FROM weekly_scores ws
      JOIN weekly_tests wt ON ws.test_id = wt.id
      JOIN students s ON ws.student_id = s.id
      WHERE s.class_id = ?
      AND wt.id IN (
        SELECT id FROM weekly_tests 
        ORDER BY created_at DESC 
        LIMIT 10
      )
    `
    const testScoreResult = db.get(testScoreQuery, [classId]) as { avg_score: number }

    return {
      studentCount: studentCountResult.count,
      homeworkCompletionRate:
        homeworkResult.total > 0 ? (homeworkResult.completed / homeworkResult.total) * 100 : 0,
      averageTestScore: testScoreResult.avg_score || 0
    }
  }
}
