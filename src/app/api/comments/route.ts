import { NextRequest, NextResponse } from 'next/server'
import { commentQueries } from '@/lib/db/queries'
import type { Comment } from '@/lib/types/database'

// GET /api/comments?studentId=X - Get comments for a student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json({ error: 'Missing required parameter: studentId' }, { status: 400 })
    }

    const studentIdNum = parseInt(studentId)
    if (isNaN(studentIdNum)) {
      return NextResponse.json({ error: 'Invalid studentId' }, { status: 400 })
    }

    const comments = commentQueries.getByStudent(studentIdNum)
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { student_id, subject_id, comment, evidence } = body

    // Basic validation
    if (!student_id || !subject_id || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields: student_id, subject_id, comment' },
        { status: 400 }
      )
    }

    const commentData: Omit<Comment, 'id'> = {
      student_id,
      subject_id,
      date: new Date().toISOString().split('T')[0], // Today's date
      comment: comment.trim(),
      evidence: evidence || ''
    }

    const commentId = commentQueries.create(commentData)

    // Return the created comment with subject name
    const comments = commentQueries.getByStudent(student_id)
    const newComment = comments.find((c) => c.id === commentId)

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    console.error('Failed to create comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
