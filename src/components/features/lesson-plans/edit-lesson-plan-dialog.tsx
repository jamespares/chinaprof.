'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Edit } from 'lucide-react'
import type { LessonPlan } from '@/lib/types/database'

interface EditLessonPlanDialogProps {
  lessonPlan: LessonPlan | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onLessonPlanUpdated: (lessonPlan: LessonPlan) => void
}

export function EditLessonPlanDialog({
  lessonPlan,
  open,
  onOpenChange,
  onLessonPlanUpdated
}: EditLessonPlanDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    week: '',
    lesson_no: '',
    intro: '',
    objectives: '',
    explanation: '',
    activity: '',
    quiz: '',
    summary: ''
  })

  useEffect(() => {
    if (lessonPlan) {
      setFormData({
        week: lessonPlan.week.toString(),
        lesson_no: lessonPlan.lesson_no.toString(),
        intro: lessonPlan.intro,
        objectives: lessonPlan.objectives,
        explanation: lessonPlan.explanation,
        activity: lessonPlan.activity,
        quiz: lessonPlan.quiz,
        summary: lessonPlan.summary
      })
    }
  }, [lessonPlan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!lessonPlan || !formData.week || !formData.lesson_no) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/lesson-plans/${lessonPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          week: parseInt(formData.week),
          lesson_no: parseInt(formData.lesson_no),
          intro: formData.intro.trim(),
          objectives: formData.objectives.trim(),
          explanation: formData.explanation.trim(),
          activity: formData.activity.trim(),
          quiz: formData.quiz.trim(),
          summary: formData.summary.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update lesson plan')
      }

      const updatedLessonPlan = await response.json()
      onLessonPlanUpdated(updatedLessonPlan)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update lesson plan:', error)
      // TODO: Show error message to user
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!lessonPlan) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Lesson Plan
            </DialogTitle>
            <DialogDescription>Update the lesson plan details and content.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="week">Week Number *</Label>
                <Input
                  id="week"
                  type="number"
                  min="1"
                  value={formData.week}
                  onChange={(e) => handleInputChange('week', e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lesson_no">Lesson Number *</Label>
                <Input
                  id="lesson_no"
                  type="number"
                  min="1"
                  value={formData.lesson_no}
                  onChange={(e) => handleInputChange('lesson_no', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="intro">Introduction</Label>
              <Textarea
                id="intro"
                placeholder="Brief introduction to the lesson topic and context..."
                value={formData.intro}
                onChange={(e) => handleInputChange('intro', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="objectives">Learning Objectives</Label>
              <Textarea
                id="objectives"
                placeholder="What students will learn and be able to do after this lesson..."
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="explanation">Explanation/Content</Label>
              <Textarea
                id="explanation"
                placeholder="Main content, concepts, and explanations to cover..."
                value={formData.explanation}
                onChange={(e) => handleInputChange('explanation', e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="activity">Activities</Label>
              <Textarea
                id="activity"
                placeholder="Hands-on activities, exercises, and practice tasks..."
                value={formData.activity}
                onChange={(e) => handleInputChange('activity', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quiz">Assessment/Quiz</Label>
              <Textarea
                id="quiz"
                placeholder="Questions, quiz items, or assessment activities..."
                value={formData.quiz}
                onChange={(e) => handleInputChange('quiz', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                placeholder="Key takeaways, wrap-up, and preview of next lesson..."
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Lesson Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
