import { NextRequest, NextResponse } from 'next/server'
import { lessonPlanQueries } from '@/lib/db/queries'
import type { LessonPlan } from '@/lib/types/database'

// GET /api/lesson-plans/[id] - Get a specific lesson plan
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid lesson plan ID' }, { status: 400 })
    }

    const lessonPlan = lessonPlanQueries.getById(id)
    if (!lessonPlan) {
      return NextResponse.json({ error: 'Lesson plan not found' }, { status: 404 })
    }

    return NextResponse.json(lessonPlan)
  } catch (error) {
    console.error('Error fetching lesson plan:', error)
    return NextResponse.json({ error: 'Failed to fetch lesson plan' }, { status: 500 })
  }
}

// PUT /api/lesson-plans/[id] - Update a lesson plan
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid lesson plan ID' }, { status: 400 })
    }

    const body = await request.json()
    lessonPlanQueries.update(id, body)

    const updatedLessonPlan = lessonPlanQueries.getById(id)
    return NextResponse.json(updatedLessonPlan)
  } catch (error) {
    console.error('Error updating lesson plan:', error)
    return NextResponse.json({ error: 'Failed to update lesson plan' }, { status: 500 })
  }
}

// DELETE /api/lesson-plans/[id] - Delete a lesson plan
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid lesson plan ID' }, { status: 400 })
    }

    lessonPlanQueries.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lesson plan:', error)
    return NextResponse.json({ error: 'Failed to delete lesson plan' }, { status: 500 })
  }
}
