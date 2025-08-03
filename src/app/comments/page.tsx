'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquarePlus, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AddCommentDialog } from '@/components/features/comments/add-comment-dialog'
import { CommentsList } from '@/components/features/comments/comments-list'
import { StudentsAPI } from '@/lib/api/students'
import { SubjectsAPI } from '@/lib/api/subjects'
import { CommentsAPI } from '@/lib/api/comments'
import type { Student, Subject, Comment } from '@/lib/types/database'

export default function CommentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [comments, setComments] = useState<(Comment & { subject_name: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [studentsData, subjectsData] = await Promise.all([
        StudentsAPI.getAll(),
        SubjectsAPI.getAll()
      ])

      setStudents(studentsData)
      setSubjects(subjectsData)

      // Load all comments initially
      if (studentsData.length > 0) {
        const allComments: (Comment & { subject_name: string })[] = []
        for (const student of studentsData) {
          const studentComments = await CommentsAPI.getByStudent(student.id)
          allComments.push(...studentComments)
        }
        // Sort by date descending
        allComments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setComments(allComments)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentAdded = (newComment: Comment & { subject_name: string }) => {
    setComments((prev) => [newComment, ...prev])
  }

  const filteredComments =
    selectedStudent === 'all'
      ? comments
      : comments.filter((comment) => comment.student_id.toString() === selectedStudent)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Comments</h1>
            <p className="text-muted-foreground">
              Record observations and feedback about student progress
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-sm text-muted-foreground">Loading comments...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Comments</h1>
          <p className="text-muted-foreground">
            Record observations and feedback about student progress
          </p>
        </div>
        <AddCommentDialog
          students={students}
          subjects={subjects}
          onCommentAdded={handleCommentAdded}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by student:</span>
        </div>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id.toString()}>
                {student.name} ({student.class})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5" />
            Student Comments
            {filteredComments.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({filteredComments.length} {filteredComments.length === 1 ? 'comment' : 'comments'})
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {selectedStudent === 'all'
              ? 'All student observations and feedback'
              : `Comments for ${students.find((s) => s.id.toString() === selectedStudent)?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquarePlus className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No students yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add students first before recording comments about them.
              </p>
            </div>
          ) : (
            <CommentsList comments={filteredComments} students={students} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
