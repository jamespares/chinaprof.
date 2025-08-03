import { NextRequest, NextResponse } from 'next/server'
import { subjectQueries } from '@/lib/db/queries'
import type { Subject } from '@/lib/types/database'

// GET /api/subjects/[id] - Get a specific subject
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid subject ID' }, { status: 400 })
    }

    const subject = subjectQueries.getById(id)
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    return NextResponse.json(subject)
  } catch (error) {
    console.error('Error fetching subject:', error)
    return NextResponse.json({ error: 'Failed to fetch subject' }, { status: 500 })
  }
}

// PUT /api/subjects/[id] - Update a subject
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid subject ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, teacher_id } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Subject name is required' }, { status: 400 })
    }

    subjectQueries.update(id, { name: name.trim(), teacher_id })

    const updatedSubject = subjectQueries.getById(id)
    return NextResponse.json(updatedSubject)
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 })
  }
}

// DELETE /api/subjects/[id] - Delete a subject
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid subject ID' }, { status: 400 })
    }

    subjectQueries.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 })
  }
}
