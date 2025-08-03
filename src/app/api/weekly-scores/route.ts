import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db/database'
import type { WeeklyScore } from '@/lib/types/database'

const db = getDatabase()

// GET /api/weekly-scores?testId=X - Get scores for a specific test
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('testId')

    if (!testId) {
      return NextResponse.json({ error: 'Missing required parameter: testId' }, { status: 400 })
    }

    const testIdNum = parseInt(testId)
    if (isNaN(testIdNum)) {
      return NextResponse.json({ error: 'Invalid testId' }, { status: 400 })
    }

    const scores = db
      .prepare(
        `
      SELECT ws.*, s.name as student_name, s.class as student_class
      FROM weekly_scores ws
      JOIN students s ON ws.student_id = s.id
      WHERE ws.test_id = ?
      ORDER BY s.name
    `
      )
      .all(testIdNum) as (WeeklyScore & { student_name: string; student_class: string })[]

    return NextResponse.json(scores)
  } catch (error) {
    console.error('Failed to fetch weekly scores:', error)
    return NextResponse.json({ error: 'Failed to fetch weekly scores' }, { status: 500 })
  }
}

// POST /api/weekly-scores - Add/update scores for a test (bulk operation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scores } = body

    if (!Array.isArray(scores)) {
      return NextResponse.json({ error: 'Scores must be an array' }, { status: 400 })
    }

    const results = []

    for (const scoreEntry of scores) {
      const { test_id, student_id, score } = scoreEntry

      if (!test_id || !student_id || score === undefined) {
        return NextResponse.json(
          { error: 'Each score entry must have test_id, student_id, and score' },
          { status: 400 }
        )
      }

      // Validate score is non-negative
      if (score < 0) {
        return NextResponse.json({ error: 'Score cannot be negative' }, { status: 400 })
      }

      // Insert or update score
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO weekly_scores (test_id, student_id, score) 
        VALUES (?, ?, ?)
      `)
      const result = stmt.run(test_id, student_id, score)
      results.push(result)
    }

    return NextResponse.json({
      success: true,
      updated: results.length
    })
  } catch (error) {
    console.error('Failed to update weekly scores:', error)
    return NextResponse.json({ error: 'Failed to update weekly scores' }, { status: 500 })
  }
}
