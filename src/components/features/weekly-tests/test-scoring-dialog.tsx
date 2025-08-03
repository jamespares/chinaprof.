'use client'

import { useState, useEffect } from 'react'
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
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit3, Save, X } from 'lucide-react'
import { WeeklyTestsAPI } from '@/lib/api/weekly-tests'
import type { WeeklyTest, WeeklyScore, Student } from '@/lib/types/database'

interface TestScoringDialogProps {
  test: WeeklyTest
  students: Student[]
  onScoresUpdated: () => void
  trigger?: React.ReactNode
}

interface ScoreEntry {
  student_id: number
  score: number | ''
  percentage: number
}

export function TestScoringDialog({
  test,
  students,
  onScoresUpdated,
  trigger
}: TestScoringDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [scores, setScores] = useState<ScoreEntry[]>([])

  useEffect(() => {
    if (open) {
      loadScores()
    }
  }, [open, test.id])

  const loadScores = async () => {
    setLoading(true)
    try {
      const existingScores = await WeeklyTestsAPI.getScores(test.id)

      // Initialize scores for all students
      const scoreMap = new Map(existingScores.map((s) => [s.student_id, s.score]))

      const allScores: ScoreEntry[] = students.map((student) => {
        const score = scoreMap.get(student.id) ?? ''
        const percentage =
          typeof score === 'number' ? Math.round((score / test.max_score) * 100) : 0

        return {
          student_id: student.id,
          score,
          percentage
        }
      })

      setScores(allScores)
    } catch (error) {
      console.error('Failed to load scores:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateScore = (studentId: number, newScore: string) => {
    const numScore = newScore === '' ? '' : parseInt(newScore)
    const percentage =
      typeof numScore === 'number' ? Math.round((numScore / test.max_score) * 100) : 0

    setScores((prev) =>
      prev.map((entry) =>
        entry.student_id === studentId ? { ...entry, score: numScore, percentage } : entry
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Only save scores that have values
      const validScores = scores
        .filter((entry) => typeof entry.score === 'number')
        .map((entry) => ({
          test_id: test.id,
          student_id: entry.student_id,
          score: entry.score as number
        }))

      if (validScores.length > 0) {
        await WeeklyTestsAPI.updateScores(validScores)
      }

      onScoresUpdated()
      setOpen(false)
    } catch (error) {
      console.error('Failed to save scores:', error)
    } finally {
      setSaving(false)
    }
  }

  const getStudentName = (studentId: number) => {
    return students.find((s) => s.id === studentId)?.name || 'Unknown'
  }

  const getStudentClass = (studentId: number) => {
    return students.find((s) => s.id === studentId)?.class || ''
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Edit3 className="mr-2 h-4 w-4" />
      Score Test
    </Button>
  )

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading scores...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Score Test: {test.name}</DialogTitle>
          <DialogDescription>
            Enter scores for each student. Max score: {test.max_score} points.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {scores.map((entry) => (
            <Card key={entry.student_id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{getStudentName(entry.student_id)}</div>
                    <div className="text-sm text-muted-foreground">
                      {getStudentClass(entry.student_id)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max={test.max_score}
                        value={entry.score}
                        onChange={(e) => updateScore(entry.student_id, e.target.value)}
                        className="w-20 text-center"
                        placeholder="0"
                      />
                      <span className="text-sm text-muted-foreground">/ {test.max_score}</span>
                    </div>

                    {typeof entry.score === 'number' && (
                      <Badge
                        variant={
                          entry.percentage >= 80
                            ? 'default'
                            : entry.percentage >= 60
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {entry.percentage}%
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Scores'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
