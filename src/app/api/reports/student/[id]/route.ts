import { NextRequest, NextResponse } from 'next/server'
import {
  studentQueries,
  homeworkQueries,
  grammarErrorQueries,
  commentQueries
} from '@/lib/db/queries'
import { getDatabase } from '@/lib/db/database'
import type { Student } from '@/lib/types/database'

const db = getDatabase()

// GET /api/reports/student/[id] - Generate comprehensive student report
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const studentId = parseInt(params.id)
    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 })
    }

    // Get student info
    const student = studentQueries.getById(studentId)
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Get homework completion stats
    const homeworkStats = homeworkQueries.getCompletionStats(studentId)

    // Get recent homework (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentHomework = homeworkQueries.getByStudentAndDateRange(
      studentId,
      thirtyDaysAgo.toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    )

    // Get grammar errors
    const grammarErrors = grammarErrorQueries.getByStudent(studentId)

    // Group grammar errors by type
    const grammarErrorCounts: Record<string, number> = {}
    grammarErrors.forEach((error) => {
      grammarErrorCounts[error.error_code] = (grammarErrorCounts[error.error_code] || 0) + 1
    })

    // Get comments
    const comments = commentQueries.getByStudent(studentId)

    // Get weekly test scores
    const weeklyScores = db
      .prepare(
        `
      SELECT ws.*, wt.name as test_name, wt.max_score,
             ROUND((ws.score * 100.0 / wt.max_score), 1) as percentage
      FROM weekly_scores ws
      JOIN weekly_tests wt ON ws.test_id = wt.id
      WHERE ws.student_id = ?
      ORDER BY wt.created_at DESC
      LIMIT 10
    `
      )
      .all(studentId)

    // Calculate test average
    const testAverage =
      weeklyScores.length > 0
        ? Math.round(
            weeklyScores.reduce((sum: number, score: any) => sum + score.percentage, 0) /
              weeklyScores.length
          )
        : 0

    // Generate report data
    const reportData = {
      student,
      generated_at: new Date().toISOString(),
      homework: {
        total_assignments: homeworkStats?.total || 0,
        completed_assignments: homeworkStats?.completed || 0,
        completion_percentage: homeworkStats?.percentage || 0,
        recent_homework: recentHomework
      },
      grammar: {
        total_errors: grammarErrors.length,
        error_breakdown: grammarErrorCounts,
        recent_errors: grammarErrors.slice(0, 10)
      },
      tests: {
        total_tests: weeklyScores.length,
        average_score: testAverage,
        recent_scores: weeklyScores
      },
      comments: {
        total_comments: comments.length,
        recent_comments: comments.slice(0, 5)
      }
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Failed to generate student report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
