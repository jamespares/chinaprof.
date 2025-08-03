import { NextRequest, NextResponse } from 'next/server'
import { studentQueries } from '@/lib/db/queries'
import type { Student } from '@/lib/types/database'

// GET /api/students - Get all students
export async function GET() {
  try {
    const students = studentQueries.getAll()
    return NextResponse.json(students)
  } catch (error) {
    console.error('Failed to fetch students:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

// POST /api/students - Create a new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, class: studentClass, dob } = body

    // Basic validation
    if (!name || !studentClass || !dob) {
      return NextResponse.json(
        { error: 'Missing required fields: name, class, dob' },
        { status: 400 }
      )
    }

    // Validate date format
    const dobDate = new Date(dob)
    if (isNaN(dobDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format for dob' }, { status: 400 })
    }

    const studentData: Omit<Student, 'id'> = {
      name: name.trim(),
      class: studentClass.trim(),
      dob: dob
    }

    const studentId = studentQueries.create(studentData)

    const newStudent = studentQueries.getById(studentId)

    return NextResponse.json(newStudent, { status: 201 })
  } catch (error) {
    console.error('Failed to create student:', error)
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}
