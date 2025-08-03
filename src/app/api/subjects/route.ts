import { NextRequest, NextResponse } from 'next/server'
import { subjectQueries } from '@/lib/db/queries'
import type { Subject } from '@/lib/types/database'

// GET /api/subjects - Get all subjects
export async function GET() {
  try {
    const subjects = subjectQueries.getAll()
    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Failed to fetch subjects:', error)
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 })
  }
}

// POST /api/subjects - Create a new subject
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, teacher_id } = body

    // Basic validation
    if (!name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 })
    }

    const subjectData: Omit<Subject, 'id'> = {
      name: name.trim(),
      teacher_id: teacher_id || 'default' // For Phase 1, use default teacher
    }

    const subjectId = subjectQueries.create(subjectData)

    // Return the created subject
    const newSubject = { id: subjectId, ...subjectData }

    return NextResponse.json(newSubject, { status: 201 })
  } catch (error) {
    console.error('Failed to create subject:', error)
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 })
  }
}
