import { NextRequest, NextResponse } from 'next/server'
import { ClassesAPI } from '@/lib/api/classes'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid class ID' }, { status: 400 })
    }

    const stats = await ClassesAPI.getStats(id)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching class stats:', error)
    return NextResponse.json({ error: 'Failed to fetch class statistics' }, { status: 500 })
  }
}
