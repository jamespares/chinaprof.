'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Plus, School } from 'lucide-react'
import { AddClassDialog } from '@/components/features/classes/add-class-dialog'
import { ClassesTable } from '@/components/features/classes/classes-table'
import type { Class } from '@/lib/types/database'

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) {
        throw new Error('Failed to fetch classes')
      }
      const classesData = await response.json()
      setClasses(classesData)
    } catch (error) {
      console.error('Failed to load classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClassAdded = (newClass: Class) => {
    setClasses((prev) => [...prev, newClass])
  }

  const handleClassDeleted = (classId: number) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Class Management</h1>
            <p className="text-muted-foreground">
              Organize your students into classes and track their progress
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-sm text-muted-foreground">Loading classes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Class Management</h1>
          <p className="text-muted-foreground">
            Organize your students into classes and track their progress
          </p>
        </div>
        <AddClassDialog onClassAdded={handleClassAdded} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Class Overview
          </CardTitle>
          <CardDescription>Manage your classes and monitor student progress</CardDescription>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <div className="text-center py-12">
              <School className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No classes created yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first class to start organizing students and tracking their progress.
              </p>
              <AddClassDialog
                onClassAdded={handleClassAdded}
                trigger={
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Class
                  </Button>
                }
              />
            </div>
          ) : (
            <ClassesTable classes={classes} onClassDeleted={handleClassDeleted} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
