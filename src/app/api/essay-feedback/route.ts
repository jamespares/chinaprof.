import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db/database'

const db = getDatabase()

// GET /api/essay-feedback - Get all essay feedback with student/subject names
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    let query = `
      SELECT 
        ef.*,
        s.name as student_name,
        sub.name as subject_name
      FROM essay_feedback ef
      LEFT JOIN students s ON ef.student_id = s.id
      LEFT JOIN subjects sub ON ef.subject_id = sub.id
    `
    const params: any[] = []

    if (studentId) {
      query += ' WHERE ef.student_id = ?'
      params.push(parseInt(studentId))
    }

    query += ' ORDER BY ef.created_at DESC LIMIT 50'

    const stmt = db.prepare(query)
    const feedback = stmt.all(...params)

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Failed to fetch essay feedback:', error)
    return NextResponse.json({ error: 'Failed to fetch essay feedback' }, { status: 500 })
  }
}

// POST /api/essay-feedback - Create new essay feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, subjectId, rawText, feedbackJson, ageGroup, taskType, rubric } = body

    // Basic validation
    if (!studentId || !subjectId || !rawText || !feedbackJson) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, subjectId, rawText, feedbackJson' },
        { status: 400 }
      )
    }

    // In a real implementation, this would call OpenAI API
    // const openaiResponse = await markEssayWithAI(rawText, ageGroup, taskType, rubric)

    const stmt = db.prepare(`
      INSERT INTO essay_feedback (student_id, subject_id, date, raw_text, feedback_json) 
      VALUES (?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      studentId,
      subjectId,
      new Date().toISOString().split('T')[0], // Today's date
      rawText,
      feedbackJson
    )

    return NextResponse.json(
      {
        id: result.lastInsertRowid,
        success: true,
        message: 'Essay feedback saved successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to save essay feedback:', error)
    return NextResponse.json({ error: 'Failed to save essay feedback' }, { status: 500 })
  }
}

// Future implementation for OpenAI integration
async function markEssayWithAI(
  essayText: string,
  ageGroup: string,
  taskType: string,
  rubric: string
) {
  // This would integrate with OpenAI API
  // const prompt = buildPrompt(essayText, ageGroup, taskType, rubric)
  // const response = await openai.completions.create(...)
  // return parseResponse(response)

  throw new Error('OpenAI integration not implemented yet')
}
