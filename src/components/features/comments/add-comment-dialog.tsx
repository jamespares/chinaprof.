'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { MessageSquarePlus } from 'lucide-react'
import { CommentsAPI } from '@/lib/api/comments'
import type { Student, Subject, Comment } from '@/lib/types/database'

interface AddCommentDialogProps {
  students: Student[]
  subjects: Subject[]
  onCommentAdded: (comment: Comment & { subject_name: string }) => void
  trigger?: React.ReactNode
}

export function AddCommentDialog({
  students,
  subjects,
  onCommentAdded,
  trigger
}: AddCommentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    comment: '',
    evidence: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.student_id || !formData.subject_id || !formData.comment.trim()) {
      return
    }

    setLoading(true)
    try {
      const newComment = await CommentsAPI.create({
        student_id: parseInt(formData.student_id),
        subject_id: parseInt(formData.subject_id),
        comment: formData.comment.trim(),
        evidence: formData.evidence.trim()
      })

      onCommentAdded(newComment)
      setFormData({ student_id: '', subject_id: '', comment: '', evidence: '' })
      setOpen(false)
    } catch (error) {
      console.error('Failed to create comment:', error)
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button>
      <MessageSquarePlus className="mr-2 h-4 w-4" />
      Add Comment
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Student Comment</DialogTitle>
            <DialogDescription>
              Record observations, feedback, or notes about a student's progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select
                  value={formData.student_id}
                  onValueChange={(value) => setFormData({ ...formData, student_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.name} ({student.class})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={formData.subject_id}
                  onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Write your observation or feedback about the student..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidence">Evidence (Optional)</Label>
              <Textarea
                id="evidence"
                value={formData.evidence}
                onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                placeholder="Any supporting evidence, examples, or context..."
                className="min-h-[60px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Comment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
