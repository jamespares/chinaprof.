'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus, ChevronRight } from 'lucide-react'
import { AddLessonPlanDialog } from '@/components/features/lesson-plans/add-lesson-plan-dialog'
import { LessonPlansTable } from '@/components/features/lesson-plans/lesson-plans-table'
import type { LessonPlan, Subject } from '@/lib/types/database'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function LessonPlansPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [lessonPlansLoading, setLessonPlansLoading] = useState(false)

  useEffect(() => {
    loadSubjects()
  }, [])

  useEffect(() => {
    if (selectedSubjectId) {
      loadLessonPlans(parseInt(selectedSubjectId))
    } else {
      setLessonPlans([])
    }
  }, [selectedSubjectId])

  const loadSubjects = async () => {
    try {
      const response = await fetch('/api/subjects')
      if (!response.ok) {
        throw new Error('Failed to fetch subjects')
      }
      const subjectsData = await response.json()
      setSubjects(subjectsData)

      // Auto-select first subject if available
      if (subjectsData.length > 0) {
        setSelectedSubjectId(subjectsData[0].id.toString())
      }
    } catch (error) {
      console.error('Failed to load subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLessonPlans = async (subjectId: number) => {
    setLessonPlansLoading(true)
    try {
      const response = await fetch(`/api/lesson-plans?subjectId=${subjectId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch lesson plans')
      }
      const lessonPlansData = await response.json()
      setLessonPlans(lessonPlansData)
    } catch (error) {
      console.error('Failed to load lesson plans:', error)
      setLessonPlans([])
    } finally {
      setLessonPlansLoading(false)
    }
  }

  const handleLessonPlanAdded = (newLessonPlan: LessonPlan) => {
    setLessonPlans((prev) =>
      [...prev, newLessonPlan].sort((a, b) => {
        if (a.week !== b.week) return a.week - b.week
        return a.lesson_no - b.lesson_no
      })
    )
  }

  const handleLessonPlanDeleted = (lessonPlanId: number) => {
    setLessonPlans((prev) => prev.filter((lp) => lp.id !== lessonPlanId))
  }

  const selectedSubject = subjects.find((s) => s.id.toString() === selectedSubjectId)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Lesson Plans</h1>
            <p className="text-muted-foreground">
              Create and manage detailed lesson plans for your subjects
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Lesson Plans</h1>
          <p className="text-muted-foreground">
            Create and manage detailed lesson plans for your subjects
          </p>
        </div>
        {selectedSubjectId && (
          <AddLessonPlanDialog
            subjectId={parseInt(selectedSubjectId)}
            onLessonPlanAdded={handleLessonPlanAdded}
          />
        )}
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No subjects found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You need to create subjects before you can add lesson plans.
              </p>
              <Button className="mt-4" asChild>
                <a href="/subjects">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Subject
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Subject Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Select Subject
              </CardTitle>
              <CardDescription>
                Choose a subject to view and manage its lesson plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSubject && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {lessonPlans.length} lesson plan{lessonPlans.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lesson Plans Table */}
          {selectedSubjectId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lesson Plans for {selectedSubject?.name}
                </CardTitle>
                <CardDescription>
                  Detailed lesson plans organized by week and lesson number
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lessonPlansLoading ? (
                  <div className="text-center py-12">
                    <div className="text-sm text-muted-foreground">Loading lesson plans...</div>
                  </div>
                ) : lessonPlans.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No lesson plans yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create your first lesson plan for {selectedSubject?.name} to get started.
                    </p>
                    <AddLessonPlanDialog
                      subjectId={parseInt(selectedSubjectId)}
                      onLessonPlanAdded={handleLessonPlanAdded}
                      trigger={
                        <Button className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          Create First Lesson Plan
                        </Button>
                      }
                    />
                  </div>
                ) : (
                  <LessonPlansTable
                    lessonPlans={lessonPlans}
                    onLessonPlanDeleted={handleLessonPlanDeleted}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
