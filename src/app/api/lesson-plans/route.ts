import { NextRequest, NextResponse } from 'next/server'
import { lessonPlanQueries } from '@/lib/db/queries'
import type { LessonPlan } from '@/lib/types/database'

// GET /api/lesson-plans?subjectId=X - Get lesson plans for a subject
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')

    if (!subjectId) {
      return NextResponse.json({ error: 'Missing required parameter: subjectId' }, { status: 400 })
    }

    const subjectIdNum = parseInt(subjectId)
    if (isNaN(subjectIdNum)) {
      return NextResponse.json({ error: 'Invalid subjectId' }, { status: 400 })
    }

    const lessonPlans = lessonPlanQueries.getBySubject(subjectIdNum)
    return NextResponse.json(lessonPlans)
  } catch (error) {
    console.error('Failed to fetch lesson plans:', error)
    return NextResponse.json({ error: 'Failed to fetch lesson plans' }, { status: 500 })
  }
}

// POST /api/lesson-plans - Create a new lesson plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject_id, week, lesson_no, intro, objectives, explanation, activity, quiz, summary } =
      body

    // Basic validation
    if (!subject_id || !week || !lesson_no) {
      return NextResponse.json(
        { error: 'Missing required fields: subject_id, week, lesson_no' },
        { status: 400 }
      )
    }

    const lessonPlanData: Omit<LessonPlan, 'id'> = {
      subject_id,
      week,
      lesson_no,
      intro: intro || '',
      objectives: objectives || '',
      explanation: explanation || '',
      activity: activity || '',
      quiz: quiz || '',
      summary: summary || ''
    }

    const lessonPlanId = lessonPlanQueries.create(lessonPlanData)
    const newLessonPlan = lessonPlanQueries.getById(lessonPlanId)

    return NextResponse.json(newLessonPlan, { status: 201 })
  } catch (error) {
    console.error('Failed to create lesson plan:', error)
    return NextResponse.json({ error: 'Failed to create lesson plan' }, { status: 500 })
  }
}
