import { NextRequest, NextResponse } from 'next/server'
import { studentQueries, homeworkQueries } from '@/lib/db/queries'

// GET /api/homework/grid?startDate=Y&endDate=Z - Get homework grid data for all students
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: startDate, endDate' },
        { status: 400 }
      )
    }

    // Get all students
    const students = studentQueries.getAll()

    // Generate date range
    const dates = []
    const start = new Date(startDate)
    const end = new Date(endDate)

    const toYMD = (date: Date) => {
      // Format as YYYY-MM-DD using local calendar values (not UTC)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(toYMD(new Date(d)))
    }

    // Get homework data for all students and dates
    const homeworkGrid = []

    for (const student of students) {
      const homework = homeworkQueries.getByStudentAndDateRange(student.id, startDate, endDate)

      // Create a map for quick lookup
      const homeworkMap = new Map()
      homework.forEach((hw) => {
        homeworkMap.set(hw.date, Boolean(hw.status))
      })

      // Build student row with completion data
      const studentRow = {
        student: {
          id: student.id,
          name: student.name,
          class: student.class
        },
        homework: dates.map((date) => ({
          date,
          status: homeworkMap.get(date) ?? null // null = not set, true = complete, false = incomplete
        })),
        stats: {
          total: dates.length,
          completed: Array.from(homeworkMap.values()).filter((status) => status === true).length,
          percentage: 0
        }
      }

      // Calculate percentage
      const completedCount = Array.from(homeworkMap.values()).filter(
        (status) => status === true
      ).length
      const totalAssigned = Array.from(homeworkMap.values()).filter(
        (status) => status !== null
      ).length
      studentRow.stats.percentage =
        totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0

      homeworkGrid.push(studentRow)
    }

    return NextResponse.json({
      dates,
      students: homeworkGrid,
      summary: {
        totalStudents: students.length,
        dateRange: { startDate, endDate }
      }
    })
  } catch (error) {
    console.error('Failed to fetch homework grid:', error)
    return NextResponse.json({ error: 'Failed to fetch homework grid' }, { status: 500 })
  }
}
