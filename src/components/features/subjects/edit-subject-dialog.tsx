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
import { Edit } from 'lucide-react'
import { SubjectsAPI } from '@/lib/api/subjects'
import type { Subject } from '@/lib/types/database'

interface EditSubjectDialogProps {
  subject: Subject | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubjectUpdated: (subject: Subject) => void
}

export function EditSubjectDialog({
  subject,
  open,
  onOpenChange,
  onSubjectUpdated
}: EditSubjectDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: ''
  })

  useEffect(() => {
    if (subject) {
      setFormData({ name: subject.name })
    }
  }, [subject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject || !formData.name.trim()) {
      return
    }

    setLoading(true)
    try {
      const updatedSubject = await SubjectsAPI.update(subject.id, {
        name: formData.name.trim()
      })

      onSubjectUpdated(updatedSubject)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update subject:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!subject) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Subject
            </DialogTitle>
            <DialogDescription>Update the subject name and details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Subject Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g., English Literature, Grammar Basics"
                required
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
              {loading ? 'Updating...' : 'Update Subject'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
