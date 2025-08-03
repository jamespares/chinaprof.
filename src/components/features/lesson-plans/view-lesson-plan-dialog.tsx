'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Target, Lightbulb, ClipboardList, HelpCircle, CheckCircle } from 'lucide-react'
import type { LessonPlan } from '@/lib/types/database'

interface ViewLessonPlanDialogProps {
  lessonPlan: LessonPlan | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewLessonPlanDialog({
  lessonPlan,
  open,
  onOpenChange
}: ViewLessonPlanDialogProps) {
  if (!lessonPlan) {
    return null
  }

  const ContentSection = ({
    icon: Icon,
    title,
    content
  }: {
    icon: any
    title: string
    content: string
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h4 className="font-medium text-sm">{title}</h4>
      </div>
      <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
        {content || <em>No content added</em>}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Lesson Plan Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Week {lessonPlan.week}</Badge>
              <Badge variant="secondary">Lesson {lessonPlan.lesson_no}</Badge>
            </div>
          </div>
          <DialogDescription>
            Complete lesson plan with all sections and activities
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <ContentSection icon={BookOpen} title="Introduction" content={lessonPlan.intro} />

          <Separator />

          <ContentSection
            icon={Target}
            title="Learning Objectives"
            content={lessonPlan.objectives}
          />

          <Separator />

          <ContentSection
            icon={Lightbulb}
            title="Explanation & Content"
            content={lessonPlan.explanation}
          />

          <Separator />

          <ContentSection icon={ClipboardList} title="Activities" content={lessonPlan.activity} />

          <Separator />

          <ContentSection icon={HelpCircle} title="Assessment & Quiz" content={lessonPlan.quiz} />

          <Separator />

          <ContentSection icon={CheckCircle} title="Summary" content={lessonPlan.summary} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
