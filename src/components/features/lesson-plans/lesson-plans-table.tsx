'use client'

import { useState } from 'react'
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
import { Trash2, Eye, Edit } from 'lucide-react'
import { ViewLessonPlanDialog } from './view-lesson-plan-dialog'
import { EditLessonPlanDialog } from './edit-lesson-plan-dialog'
import type { LessonPlan } from '@/lib/types/database'

interface LessonPlansTableProps {
  lessonPlans: LessonPlan[]
  onLessonPlanDeleted: (lessonPlanId: number) => void
}

export function LessonPlansTable({ lessonPlans, onLessonPlanDeleted }: LessonPlansTableProps) {
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<LessonPlan | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleDelete = async (lessonPlanId: number) => {
    if (
      !confirm('Are you sure you want to delete this lesson plan? This action cannot be undone.')
    ) {
      return
    }

    try {
      const response = await fetch(`/api/lesson-plans/${lessonPlanId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete lesson plan')
      }

      onLessonPlanDeleted(lessonPlanId)
    } catch (error) {
      console.error('Failed to delete lesson plan:', error)
      // TODO: Show error message to user
    }
  }

  const handleView = (lessonPlan: LessonPlan) => {
    setSelectedLessonPlan(lessonPlan)
    setViewDialogOpen(true)
  }

  const handleEdit = (lessonPlan: LessonPlan) => {
    setSelectedLessonPlan(lessonPlan)
    setEditDialogOpen(true)
  }

  const handleLessonPlanUpdated = (updatedLessonPlan: LessonPlan) => {
    // Refresh the page or update the lesson plan in place
    window.location.reload()
  }

  const getContentPreview = (content: string, maxLength: number = 50) => {
    if (!content || content.length === 0) return '-'
    return content.length > maxLength ? `${content.slice(0, maxLength)}...` : content
  }

  return (
    <>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Week</TableHead>
              <TableHead className="w-20">Lesson</TableHead>
              <TableHead>Introduction</TableHead>
              <TableHead>Objectives</TableHead>
              <TableHead>Activities</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessonPlans.map((lessonPlan) => (
              <TableRow key={lessonPlan.id}>
                <TableCell>
                  <Badge variant="outline">Week {lessonPlan.week}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">#{lessonPlan.lesson_no}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                  {getContentPreview(lessonPlan.intro)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                  {getContentPreview(lessonPlan.objectives)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                  {getContentPreview(lessonPlan.activity)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(lessonPlan)}
                      title="View lesson plan"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(lessonPlan)}
                      title="Edit lesson plan"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(lessonPlan.id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete lesson plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {lessonPlans.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No lesson plans created yet.</div>
        )}
      </div>

      {/* View Dialog */}
      <ViewLessonPlanDialog
        lessonPlan={selectedLessonPlan}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      {/* Edit Dialog */}
      <EditLessonPlanDialog
        lessonPlan={selectedLessonPlan}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onLessonPlanUpdated={handleLessonPlanUpdated}
      />
    </>
  )
}
