import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db/database'
import type { WeeklyTest, WeeklyScore } from '@/lib/types/database'

const db = getDatabase()

// GET /api/weekly-tests - Get all weekly tests
export async function GET() {
  try {
    const tests = db
      .prepare('SELECT * FROM weekly_tests ORDER BY created_at DESC')
      .all() as WeeklyTest[]
    return NextResponse.json(tests)
  } catch (error) {
    console.error('Failed to fetch weekly tests:', error)
    return NextResponse.json({ error: 'Failed to fetch weekly tests' }, { status: 500 })
  }
}

// POST /api/weekly-tests - Create a new weekly test
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, max_score } = body

    // Basic validation
    if (!name || !max_score) {
      return NextResponse.json(
        { error: 'Missing required fields: name, max_score' },
        { status: 400 }
      )
    }

    if (max_score <= 0) {
      return NextResponse.json({ error: 'Max score must be greater than 0' }, { status: 400 })
    }

    const stmt = db.prepare('INSERT INTO weekly_tests (name, max_score) VALUES (?, ?)')
    const result = stmt.run(name.trim(), max_score)

    const newTest = db
      .prepare('SELECT * FROM weekly_tests WHERE id = ?')
      .get(result.lastInsertRowid) as WeeklyTest

    return NextResponse.json(newTest, { status: 201 })
  } catch (error) {
    console.error('Failed to create weekly test:', error)
    return NextResponse.json({ error: 'Failed to create weekly test' }, { status: 500 })
  }
}
