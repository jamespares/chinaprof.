import { NextResponse } from 'next/server'
import { dashboardQueries, subjectQueries } from '@/lib/db/queries'

// Cache for dashboard data (5 minutes TTL)
let dashboardCache: { data: Record<string, unknown>; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function GET() {
  try {
    // Check cache first
    const now = Date.now()
    if (dashboardCache && now - dashboardCache.timestamp < CACHE_TTL) {
      return NextResponse.json(dashboardCache.data, {
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes browser cache
          'X-Cache': 'HIT'
        }
      })
    }

    // Parallel execution of all dashboard queries for better performance
    const [
      studentOverview,
      homeworkOverview,
      classBreakdownData,
      recentCommentsData,
      subjects,
      recentActivity
    ] = await Promise.all([
      Promise.resolve(dashboardQueries.getStudentOverview()),
      Promise.resolve(dashboardQueries.getHomeworkOverview()),
      Promise.resolve(dashboardQueries.getClassBreakdown()),
      Promise.resolve(dashboardQueries.getRecentCommentsCount()),
      Promise.resolve(subjectQueries.getAll()),
      Promise.resolve(dashboardQueries.getRecentActivity())
    ])

    // Transform class breakdown to object format
    const classBreakdown: Record<string, number> = {}
    classBreakdownData.forEach((item) => {
      classBreakdown[item.class] = item.student_count
    })

    const dashboardData = {
      totalStudents: studentOverview?.total_students || 0,
      totalClasses: studentOverview?.total_classes || 0,
      activeSubjects: subjects.length,
      homeworkCompletion: Math.round(homeworkOverview?.completion_percentage || 0),
      totalHomeworkEntries: homeworkOverview?.total_homework || 0,
      completedHomeworkEntries: homeworkOverview?.completed_homework || 0,
      recentComments: recentCommentsData?.recent_comments || 0,
      recentActivity,
      classBreakdown
    }

    // Update cache
    dashboardCache = { data: dashboardData, timestamp: now }

    return NextResponse.json(dashboardData, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minutes browser cache
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
