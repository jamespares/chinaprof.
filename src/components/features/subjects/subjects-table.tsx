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
import { Eye, Edit, Trash2, BookOpen, MoreHorizontal, FileText, BarChart3 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { EditSubjectDialog } from './edit-subject-dialog'
import { SubjectsAPI } from '@/lib/api/subjects'
import type { Subject } from '@/lib/types/database'

interface SubjectsTableProps {
  subjects: Subject[]
  onSubjectUpdated?: (subject: Subject) => void
  onSubjectDeleted?: (subjectId: number) => void
}

export function SubjectsTable({
  subjects,
  onSubjectUpdated,
  onSubjectDeleted
}: SubjectsTableProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleDelete = async (subjectId: number) => {
    if (!confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
      return
    }

    try {
      await SubjectsAPI.delete(subjectId)
      onSubjectDeleted?.(subjectId)
    } catch (error) {
      console.error('Failed to delete subject:', error)
      // TODO: Show error message to user
    }
  }

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject)
    setEditDialogOpen(true)
  }

  const handleSubjectUpdated = (updatedSubject: Subject) => {
    onSubjectUpdated?.(updatedSubject)
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No subjects created yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first subject to start organizing lesson plans and tracking student progress.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject Name</TableHead>
            <TableHead>Lesson Plans</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  {subject.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">0 lessons planned</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Active</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/lesson-plans?subjectId=${subject.id}`, '_blank')}
                    title="View lesson plans"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(subject)}
                    title="Edit subject"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(subject.id)}
                    className="text-destructive hover:text-destructive"
                    title="Delete subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <EditSubjectDialog
        subject={selectedSubject}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubjectUpdated={handleSubjectUpdated}
      />
    </div>
  )
}
