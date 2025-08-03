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
import { Plus } from 'lucide-react'
import { WeeklyTestsAPI } from '@/lib/api/weekly-tests'
import type { WeeklyTest } from '@/lib/types/database'

interface AddTestDialogProps {
  onTestAdded: (test: WeeklyTest) => void
  trigger?: React.ReactNode
}

export function AddTestDialog({ onTestAdded, trigger }: AddTestDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    max_score: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.max_score) {
      return
    }

    const maxScore = parseInt(formData.max_score)
    if (isNaN(maxScore) || maxScore <= 0) {
      return
    }

    setLoading(true)
    try {
      const newTest = await WeeklyTestsAPI.create({
        name: formData.name.trim(),
        max_score: maxScore
      })

      onTestAdded(newTest)
      setFormData({ name: '', max_score: '' })
      setOpen(false)
    } catch (error) {
      console.error('Failed to create test:', error)
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Create Test
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Weekly Test</DialogTitle>
            <DialogDescription>
              Set up a new test that you can quickly score for all students.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Test Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Weekly Quiz #1, Vocabulary Test"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max_score" className="text-right">
                Max Score
              </Label>
              <Input
                id="max_score"
                type="number"
                min="1"
                value={formData.max_score}
                onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
                className="col-span-3"
                placeholder="e.g., 100, 50, 20"
                required
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
              {loading ? 'Creating...' : 'Create Test'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
