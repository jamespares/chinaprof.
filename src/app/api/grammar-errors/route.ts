import { NextRequest, NextResponse } from 'next/server'
import { grammarErrorQueries } from '@/lib/db/queries'
import type { GrammarError } from '@/lib/types/database'

// GET /api/grammar-errors?studentId=X - Get grammar errors for a student, or all errors if no studentId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    let grammarErrors: any[]

    if (!studentId) {
      // Get all grammar errors for analytics
      grammarErrors = grammarErrorQueries.getAll()
    } else {
      const studentIdNum = parseInt(studentId)
      if (isNaN(studentIdNum)) {
        return NextResponse.json({ error: 'Invalid studentId' }, { status: 400 })
      }
      grammarErrors = grammarErrorQueries.getByStudent(studentIdNum)
    }

    return NextResponse.json(grammarErrors)
  } catch (error) {
    console.error('Failed to fetch grammar errors:', error)
    return NextResponse.json({ error: 'Failed to fetch grammar errors' }, { status: 500 })
  }
}

// POST /api/grammar-errors - Create a new grammar error entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, subjectId, errorCode, lessonRef } = body

    // Basic validation
    if (!studentId || !subjectId || !errorCode) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, subjectId, errorCode' },
        { status: 400 }
      )
    }

    const grammarErrorData = {
      student_id: studentId,
      subject_id: subjectId,
      date: new Date().toISOString().split('T')[0], // Today's date
      error_code: errorCode
    }

    const errorId = grammarErrorQueries.create(grammarErrorData)

    return NextResponse.json(
      {
        id: errorId,
        success: true,
        message: 'Grammar error logged successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create grammar error:', error)
    return NextResponse.json({ error: 'Failed to create grammar error' }, { status: 500 })
  }
}
