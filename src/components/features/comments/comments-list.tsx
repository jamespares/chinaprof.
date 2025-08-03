'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Calendar, FileText } from 'lucide-react'
import type { Comment, Student } from '@/lib/types/database'

interface CommentsListProps {
  comments: (Comment & { subject_name: string })[]
  students: Student[]
}

export function CommentsList({ comments, students }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No comments yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Start adding observations and feedback about your students.
        </p>
      </div>
    )
  }

  const getStudentName = (studentId: number) => {
    return students.find((s) => s.id === studentId)?.name || 'Unknown Student'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{getStudentName(comment.student_id)}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{comment.subject_name}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(comment.date)}
                  </div>
                </div>
              </div>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <p className="text-sm leading-relaxed">{comment.comment}</p>
              </div>

              {comment.evidence && (
                <div className="border-l-2 border-muted pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Evidence
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comment.evidence}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
