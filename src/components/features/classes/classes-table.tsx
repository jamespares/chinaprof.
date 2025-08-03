'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Users, BarChart3 } from 'lucide-react'
import type { Class } from '@/lib/types/database'

interface ClassesTableProps {
  classes: Class[]
  onClassDeleted: (classId: number) => void
}

interface ClassStats {
  studentCount: number
  homeworkCompletionRate: number
  averageTestScore: number
}

export function ClassesTable({ classes, onClassDeleted }: ClassesTableProps) {
  const [classStats, setClassStats] = useState<Record<number, ClassStats>>({})
  const [loading, setLoading] = useState<Record<number, boolean>>({})

  useEffect(() => {
    // Load stats for all classes
    classes.forEach((classItem) => {
      loadClassStats(classItem.id)
    })
  }, [classes])

  const loadClassStats = async (classId: number) => {
    setLoading((prev) => ({ ...prev, [classId]: true }))
    try {
      const response = await fetch(`/api/classes/${classId}/stats`)
      if (response.ok) {
        const stats = await response.json()
        setClassStats((prev) => ({ ...prev, [classId]: stats }))
      }
    } catch (error) {
      console.error(`Failed to load stats for class ${classId}:`, error)
    } finally {
      setLoading((prev) => ({ ...prev, [classId]: false }))
    }
  }

  const handleDelete = async (classId: number) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete class')
      }

      onClassDeleted(classId)
    } catch (error) {
      console.error('Failed to delete class:', error)
      // TODO: Show error message to user
    }
  }

  const getYearLevelBadge = (yearLevel?: number) => {
    if (!yearLevel) return null

    const variant = yearLevel <= 6 ? 'secondary' : yearLevel <= 9 ? 'outline' : 'default'
    const prefix = yearLevel <= 6 ? 'Grade' : 'Year'

    return (
      <Badge variant={variant}>
        {prefix} {yearLevel}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Name</TableHead>
            <TableHead>Year Level</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Students</TableHead>
            <TableHead className="text-center">Homework Rate</TableHead>
            <TableHead className="text-center">Avg Test Score</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classItem) => {
            const stats = classStats[classItem.id]
            const isLoadingStats = loading[classItem.id]

            return (
              <TableRow key={classItem.id}>
                <TableCell className="font-medium">{classItem.name}</TableCell>
                <TableCell>{getYearLevelBadge(classItem.year_level)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {classItem.description || '-'}
                </TableCell>
                <TableCell className="text-center">
                  {isLoadingStats ? (
                    <div className="text-xs text-muted-foreground">Loading...</div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{stats?.studentCount || 0}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {isLoadingStats ? (
                    <div className="text-xs text-muted-foreground">Loading...</div>
                  ) : (
                    <div className="text-sm">
                      {stats?.homeworkCompletionRate
                        ? `${Math.round(stats.homeworkCompletionRate)}%`
                        : '-'}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {isLoadingStats ? (
                    <div className="text-xs text-muted-foreground">Loading...</div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <BarChart3 className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {stats?.averageTestScore ? `${Math.round(stats.averageTestScore)}%` : '-'}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(classItem.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {classes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No classes created yet.</div>
      )}
    </div>
  )
}
