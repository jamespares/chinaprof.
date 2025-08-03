import { NextRequest, NextResponse } from 'next/server'
import { studentQueries } from '@/lib/db/queries'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/students/[id] - Get a specific student
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const studentId = parseInt(params.id)

    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 })
    }

    const student = studentQueries.getById(studentId)

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Failed to fetch student:', error)
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 })
  }
}

// PUT /api/students/[id] - Update a student
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const studentId = parseInt(params.id)

    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, class: studentClass, dob } = body

    // Check if student exists
    const existingStudent = studentQueries.getById(studentId)
    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Build update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (studentClass !== undefined) updateData.class = studentClass.trim()
    if (dob !== undefined) {
      const dobDate = new Date(dob)
      if (isNaN(dobDate.getTime())) {
        return NextResponse.json({ error: 'Invalid date format for dob' }, { status: 400 })
      }
      updateData.dob = dob
    }

    studentQueries.update(studentId, updateData)

    const updatedStudent = studentQueries.getById(studentId)

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error('Failed to update student:', error)
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}

// DELETE /api/students/[id] - Delete a student
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const studentId = parseInt(params.id)

    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 })
    }

    // Check if student exists
    const existingStudent = studentQueries.getById(studentId)
    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    studentQueries.delete(studentId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete student:', error)
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}
