'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface DashboardData {
  totalStudents: number
  totalClasses: number
  activeSubjects: number
  homeworkCompletion: number
  totalHomeworkEntries: number
  completedHomeworkEntries: number
  recentComments: number
  recentActivity: Array<{ type: string; date: string; count: number }>
  classBreakdown: Record<string, number>
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  // Add a fallback timeout to prevent infinite loading
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Dashboard loading timeout - using fallback data')
        setData({
          totalStudents: 0,
          totalClasses: 0,
          activeSubjects: 0,
          homeworkCompletion: 0,
          recentComments: 0,
          totalHomeworkEntries: 0,
          completedHomeworkEntries: 0,
          recentActivity: [],
          classBreakdown: {}
        })
        setLoading(false)
      }
    }, 3000) // 3 second fallback

    return () => clearTimeout(fallbackTimeout)
  }, [loading])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Set a timeout for the API call
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch('/api/dashboard', {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      // Set fallback data if API fails
      setData({
        totalStudents: 0,
        totalClasses: 0,
        activeSubjects: 0,
        homeworkCompletion: 0,
        recentComments: 0,
        totalHomeworkEntries: 0,
        completedHomeworkEntries: 0,
        recentActivity: [],
        classBreakdown: {}
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>

        {/* Skeleton for stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton for feature cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalStudents')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              {data?.totalStudents === 0
                ? 'No students added yet'
                : `Across ${data?.totalClasses || 0} classes`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.activeSubjects || 0}</div>
            <p className="text-xs text-muted-foreground">No subjects created yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Homework Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.homeworkCompletion || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {data?.totalHomeworkEntries === 0
                ? 'No homework tracked yet'
                : `${data?.completedHomeworkEntries || 0} of ${data?.totalHomeworkEntries || 0} assignments`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.recentComments || 0}</div>
            <p className="text-xs text-muted-foreground">No comments added yet</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Access Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Homework Tracker */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Homework Tracker</CardTitle>
            <CardDescription className="text-sm">Daily completion tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Track daily homework completion with RAG grid view and automatic percentage
              calculations.
            </p>
            <Button asChild className="w-full btn-accent">
              <Link href="/homework">
                Open Homework
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Grammar Errors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Grammar Errors</CardTitle>
            <CardDescription className="text-sm">Error tracking & analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Log common CN-ESL errors and view detailed analytics to target your teaching focus.
            </p>
            <Button asChild className="w-full btn-accent">
              <Link href="/grammar-errors">
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Tests */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Weekly Tests</CardTitle>
            <CardDescription className="text-sm">Test scores & rankings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create tests, rapid score entry, and view ranked student performance tables.
            </p>
            <Button asChild className="w-full btn-accent">
              <Link href="/weekly-tests">
                Manage Tests
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Essay Marking */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Essay Marking</CardTitle>
            <CardDescription className="text-sm">AI-powered feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Paste essays for AI analysis with detailed feedback and error identification.
            </p>
            <Button asChild className="w-full btn-accent">
              <Link href="/essay-marking">
                Mark Essays
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Comments</CardTitle>
            <CardDescription className="text-sm">Student feedback notes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Rich-text comments with evidence tracking and AI summary generation.
            </p>
            <Button asChild className="w-full">
              <Link href="/comments">
                Manage Comments
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-sm">Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link href="/students">Add Students</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link href="/subjects">Create Subjects</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link href="/reports">View Reports</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
