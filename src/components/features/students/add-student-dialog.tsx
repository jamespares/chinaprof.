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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import type { Student } from '@/lib/types/database'

interface AddStudentDialogProps {
  onStudentAdded: (student: Omit<Student, 'id'>) => void
}

export function AddStudentDialog({ onStudentAdded }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    class: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.class) {
      return // Basic validation
    }

    onStudentAdded(formData)

    // Reset form and close dialog
    setFormData({ name: '', class: '' })
    setOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Common class options for Chinese schools
  const classOptions = [
    'Grade 1A',
    'Grade 1B',
    'Grade 1C',
    'Grade 2A',
    'Grade 2B',
    'Grade 2C',
    'Grade 3A',
    'Grade 3B',
    'Grade 3C',
    'Grade 4A',
    'Grade 4B',
    'Grade 4C',
    'Grade 5A',
    'Grade 5B',
    'Grade 5C',
    'Grade 6A',
    'Grade 6B',
    'Grade 6C',
    'Year 7',
    'Year 8',
    'Year 9',
    'Year 10',
    'Year 11',
    'Year 12'
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Add a new student to your roster. They'll appear in your student list and be available
              for homework tracking and assessments.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                placeholder="Enter student's full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="class">Class</Label>
              <Select onValueChange={(value) => handleInputChange('class', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((classOption) => (
                    <SelectItem key={classOption} value={classOption}>
                      {classOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
