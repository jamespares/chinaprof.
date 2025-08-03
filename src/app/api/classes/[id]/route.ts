import { NextRequest, NextResponse } from 'next/server'
import { ClassesAPI } from '@/lib/api/classes'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid class ID' }, { status: 400 })
    }

    const classData = await ClassesAPI.getById(id)
    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid class ID' }, { status: 400 })
    }

    const body = await request.json()
    const updatedClass = await ClassesAPI.update(id, body)

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json({ error: 'Failed to update class' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid class ID' }, { status: 400 })
    }

    await ClassesAPI.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 })
  }
}
