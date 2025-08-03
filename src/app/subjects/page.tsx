'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus } from 'lucide-react'
import { AddSubjectDialog } from '@/components/features/subjects/add-subject-dialog'
import { SubjectsTable } from '@/components/features/subjects/subjects-table'
import { SubjectsAPI } from '@/lib/api/subjects'
import type { Subject } from '@/lib/types/database'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      const subjectsData = await SubjectsAPI.getAll()
      setSubjects(subjectsData)
    } catch (error) {
      console.error('Failed to load subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectAdded = (newSubject: Subject) => {
    setSubjects((prev) => [...prev, newSubject])
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">My Subjects</h1>
            <p className="text-muted-foreground">
              Organize your curriculum and create lesson plans
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-sm text-muted-foreground">Loading subjects...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Subjects</h1>
          <p className="text-muted-foreground">Organize your curriculum and create lesson plans</p>
        </div>
        <AddSubjectDialog onSubjectAdded={handleSubjectAdded} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subject Overview
          </CardTitle>
          <CardDescription>Your teaching subjects and lesson plans</CardDescription>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No subjects created yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first subject to start organizing lesson plans and tracking student
                progress.
              </p>
              <AddSubjectDialog
                onSubjectAdded={handleSubjectAdded}
                trigger={
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Subject
                  </Button>
                }
              />
            </div>
          ) : (
            <SubjectsTable subjects={subjects} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
