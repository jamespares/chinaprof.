import { getDatabase } from './database'
import type {
  Student,
  Subject,
  LessonPlan,
  Homework,
  WeeklyTest,
  WeeklyScore,
  GrammarError,
  Comment,
  Exam,
  EssayFeedback
} from '../types/database'

const db = getDatabase()

// Student queries
export const studentQueries = {
  getAll: () => {
    return db.prepare('SELECT * FROM students ORDER BY name').all() as Student[]
  },

  getById: (id: number) => {
    return db.prepare('SELECT * FROM students WHERE id = ?').get(id) as Student | undefined
  },

  create: (student: Omit<Student, 'id'>) => {
    const stmt = db.prepare(`
      INSERT INTO students (name, class, dob, avatar_url) 
      VALUES (?, ?, ?, ?)
    `)
    const result = stmt.run(student.name, student.class, student.dob, student.avatar_url || null)
    return result.lastInsertRowid as number
  },

  update: (id: number, student: Partial<Omit<Student, 'id'>>) => {
    const fields = Object.keys(student)
      .map((key) => `${key} = ?`)
      .join(', ')
    const values = Object.values(student)
    const stmt = db.prepare(
      `UPDATE students SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    )
    return stmt.run(...values, id)
  },

  delete: (id: number) => {
    return db.prepare('DELETE FROM students WHERE id = ?').run(id)
  }
}

// Subject queries
export const subjectQueries = {
  getAll: () => {
    return db.prepare('SELECT * FROM subjects ORDER BY name').all() as Subject[]
  },

  getById: (id: number) => {
    return db.prepare('SELECT * FROM subjects WHERE id = ?').get(id) as Subject | undefined
  },

  create: (subject: Omit<Subject, 'id'>) => {
    const stmt = db.prepare('INSERT INTO subjects (name, teacher_id) VALUES (?, ?)')
    const result = stmt.run(subject.name, subject.teacher_id)
    return result.lastInsertRowid as number
  },

  update: (id: number, subject: Partial<Omit<Subject, 'id'>>) => {
    const fields = Object.keys(subject)
      .map((key) => `${key} = ?`)
      .join(', ')
    const values = Object.values(subject)
    const stmt = db.prepare(
      `UPDATE subjects SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    )
    return stmt.run(...values, id)
  },

  delete: (id: number) => {
    return db.prepare('DELETE FROM subjects WHERE id = ?').run(id)
  }
}

// Homework queries
export const homeworkQueries = {
  getByStudentAndDateRange: (studentId: number, startDate: string, endDate: string) => {
    return db
      .prepare(
        `
      SELECT * FROM homework 
      WHERE student_id = ? AND date BETWEEN ? AND ? 
      ORDER BY date DESC
    `
      )
      .all(studentId, startDate, endDate) as Homework[]
  },

  markComplete: (studentId: number, date: string, status: boolean) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO homework (student_id, date, status) 
      VALUES (?, ?, ?)
    `)
    return stmt.run(studentId, date, status ? 1 : 0)
  },

  getCompletionStats: (studentId: number) => {
    return db
      .prepare(
        `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as completed,
        ROUND(SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as percentage
      FROM homework 
      WHERE student_id = ?
    `
      )
      .get(studentId) as { total: number; completed: number; percentage: number } | undefined
  }
}

// Grammar error queries
export const grammarErrorQueries = {
  getAll: () => {
    return db
      .prepare(
        `
      SELECT * FROM grammar_errors 
      ORDER BY date DESC
    `
      )
      .all() as GrammarError[]
  },

  getByStudent: (studentId: number) => {
    return db
      .prepare(
        `
      SELECT * FROM grammar_errors 
      WHERE student_id = ? 
      ORDER BY date DESC
    `
      )
      .all(studentId) as GrammarError[]
  },

  create: (error: { student_id: number; subject_id: number; date: string; error_code: string }) => {
    const stmt = db.prepare(`
      INSERT INTO grammar_errors (student_id, subject_id, date, error_code) 
      VALUES (?, ?, ?, ?)
    `)
    const result = stmt.run(error.student_id, error.subject_id, error.date, error.error_code)
    return result.lastInsertRowid as number
  }
}

// Comment queries
export const commentQueries = {
  getByStudent: (studentId: number) => {
    return db
      .prepare(
        `
      SELECT c.*, s.name as subject_name 
      FROM comments c
      JOIN subjects s ON c.subject_id = s.id
      WHERE c.student_id = ? 
      ORDER BY c.date DESC
    `
      )
      .all(studentId) as (Comment & { subject_name: string })[]
  },

  create: (comment: Omit<Comment, 'id'>) => {
    const stmt = db.prepare(`
      INSERT INTO comments (student_id, subject_id, date, comment, evidence) 
      VALUES (?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      comment.student_id,
      comment.subject_id,
      comment.date,
      comment.comment,
      comment.evidence
    )
    return result.lastInsertRowid as number
  }
}

// Lesson plan queries
export const lessonPlanQueries = {
  getBySubject: (subjectId: number) => {
    return db
      .prepare(
        `
      SELECT * FROM lesson_plans 
      WHERE subject_id = ? 
      ORDER BY week, lesson_no
    `
      )
      .all(subjectId) as LessonPlan[]
  },

  getById: (id: number) => {
    return db.prepare('SELECT * FROM lesson_plans WHERE id = ?').get(id) as LessonPlan | undefined
  },

  create: (lessonPlan: Omit<LessonPlan, 'id'>) => {
    const stmt = db.prepare(`
      INSERT INTO lesson_plans (
        subject_id, week, lesson_no, intro, objectives, 
        explanation, activity, quiz, summary
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      lessonPlan.subject_id,
      lessonPlan.week,
      lessonPlan.lesson_no,
      lessonPlan.intro,
      lessonPlan.objectives,
      lessonPlan.explanation,
      lessonPlan.activity,
      lessonPlan.quiz,
      lessonPlan.summary
    )
    return result.lastInsertRowid as number
  },

  update: (id: number, lessonPlan: Partial<Omit<LessonPlan, 'id'>>) => {
    const fields = Object.keys(lessonPlan)
      .map((key) => `${key} = ?`)
      .join(', ')
    const values = Object.values(lessonPlan)
    const stmt = db.prepare(
      `UPDATE lesson_plans SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    )
    return stmt.run(...values, id)
  },

  delete: (id: number) => {
    return db.prepare('DELETE FROM lesson_plans WHERE id = ?').run(id)
  }
}

// Dashboard queries for overview data
export const dashboardQueries = {
  getStudentOverview: () => {
    return db
      .prepare(
        `
      SELECT 
        COUNT(*) as total_students,
        COUNT(DISTINCT class) as total_classes
      FROM students
    `
      )
      .get() as { total_students: number; total_classes: number } | undefined
  },

  getHomeworkOverview: () => {
    return db
      .prepare(
        `
      SELECT 
        COUNT(*) as total_homework,
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as completed_homework,
        ROUND(SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as completion_percentage
      FROM homework
    `
      )
      .get() as
      | { total_homework: number; completed_homework: number; completion_percentage: number }
      | undefined
  },

  getClassBreakdown: () => {
    return db
      .prepare(
        `
      SELECT class, COUNT(*) as student_count
      FROM students
      WHERE class IS NOT NULL
      GROUP BY class
      ORDER BY student_count DESC
    `
      )
      .all() as { class: string; student_count: number }[]
  },

  getRecentCommentsCount: () => {
    return db
      .prepare(
        `
      SELECT COUNT(*) as recent_comments
      FROM comments
      WHERE date >= date('now', '-7 days')
    `
      )
      .get() as { recent_comments: number } | undefined
  },

  getRecentActivity: () => {
    return db
      .prepare(
        `
      SELECT 'homework' as type, date, COUNT(*) as count
      FROM homework 
      WHERE date >= date('now', '-7 days')
      GROUP BY date
      UNION ALL
      SELECT 'comment' as type, date, COUNT(*) as count
      FROM comments
      WHERE date >= date('now', '-7 days')
      GROUP BY date
      ORDER BY date DESC
      LIMIT 10
    `
      )
      .all() as { type: string; date: string; count: number }[]
  }
}
