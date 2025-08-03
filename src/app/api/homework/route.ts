import { NextRequest, NextResponse } from 'next/server'
import { homeworkQueries } from '@/lib/db/queries'
import type { Homework } from '@/lib/types/database'

// GET /api/homework?studentId=X&startDate=Y&endDate=Z - Get homework for date range
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!studentId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: studentId, startDate, endDate' },
        { status: 400 }
      )
    }

    const studentIdNum = parseInt(studentId)
    if (isNaN(studentIdNum)) {
      return NextResponse.json({ error: 'Invalid studentId' }, { status: 400 })
    }

    const homework = homeworkQueries.getByStudentAndDateRange(studentIdNum, startDate, endDate)

    return NextResponse.json(homework)
  } catch (error) {
    console.error('Failed to fetch homework:', error)
    return NextResponse.json({ error: 'Failed to fetch homework' }, { status: 500 })
  }
}

// POST /api/homework - Mark homework completion (bulk or single)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entries } = body

    if (!Array.isArray(entries)) {
      return NextResponse.json({ error: 'Entries must be an array' }, { status: 400 })
    }

    const results = []

    for (const entry of entries) {
      const { studentId, date, status } = entry

      if (!studentId || !date || status === undefined) {
        return NextResponse.json(
          { error: 'Each entry must have studentId, date, and status' },
          { status: 400 }
        )
      }

      // Validate date format
      const entryDate = new Date(date)
      if (isNaN(entryDate.getTime())) {
        return NextResponse.json(
          { error: `Invalid date format for entry: ${date}` },
          { status: 400 }
        )
      }

      const result = homeworkQueries.markComplete(studentId, date, status)
      results.push(result)
    }

    return NextResponse.json({
      success: true,
      updated: results.length
    })
  } catch (error) {
    console.error('Failed to update homework:', error)
    return NextResponse.json({ error: 'Failed to update homework' }, { status: 500 })
  }
}
