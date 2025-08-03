import { NextRequest, NextResponse } from 'next/server'
import { ClassesAPI } from '@/lib/api/classes'

export async function GET() {
  try {
    const classes = await ClassesAPI.getAll()
    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, year_level, teacher_id } = body

    if (!name) {
      return NextResponse.json({ error: 'Class name is required' }, { status: 400 })
    }

    const newClass = await ClassesAPI.create({
      name,
      description,
      year_level,
      teacher_id
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 })
  }
}
