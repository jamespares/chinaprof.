'use client'

import { useState, useEffect, useRef } from 'react'
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
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit3, Save, Keyboard, Zap, CheckCircle2, Users } from 'lucide-react'
import { WeeklyTestsAPI } from '@/lib/api/weekly-tests'
import type { WeeklyTest, Student } from '@/lib/types/database'

interface RapidScoringDialogProps {
  test: WeeklyTest
  students: Student[]
  onScoresUpdated: () => void
  trigger?: React.ReactNode
}

interface ScoreEntry {
  student_id: number
  student_name: string
  student_class: string
  score: number | ''
  percentage: number
}

export function RapidScoringDialog({
  test,
  students,
  onScoresUpdated,
  trigger
}: RapidScoringDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (open) {
      loadScores()
    }
  }, [open, test.id])

  // Auto-save every 3 seconds
  useEffect(() => {
    if (!open || scores.length === 0) return

    const interval = setInterval(() => {
      autoSave()
    }, 3000)

    return () => clearInterval(interval)
  }, [scores, open])

  const loadScores = async () => {
    setLoading(true)
    try {
      const existingScores = await WeeklyTestsAPI.getScores(test.id)
      const scoreMap = new Map(existingScores.map((s) => [s.student_id, s.score]))

      const allScores: ScoreEntry[] = students.map((student) => {
        const score = scoreMap.get(student.id) ?? ''
        const percentage =
          typeof score === 'number' ? Math.round((score / test.max_score) * 100) : 0

        return {
          student_id: student.id,
          student_name: student.name,
          student_class: student.class,
          score,
          percentage
        }
      })

      setScores(allScores)
      setCompletedCount(allScores.filter((s) => typeof s.score === 'number').length)

      // Focus first empty input
      setTimeout(() => {
        const firstEmptyIndex = allScores.findIndex((s) => s.score === '')
        if (firstEmptyIndex >= 0) {
          setCurrentIndex(firstEmptyIndex)
          inputRefs.current[firstEmptyIndex]?.focus()
        }
      }, 100)
    } catch (error) {
      console.error('Failed to load scores:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateScore = (index: number, newScore: string) => {
    const numScore = newScore === '' ? '' : parseInt(newScore)
    const percentage =
      typeof numScore === 'number' ? Math.round((numScore / test.max_score) * 100) : 0

    setScores((prev) => {
      const updated = [...prev]
      const wasEmpty = updated[index].score === ''
      const nowFilled = typeof numScore === 'number'

      updated[index] = { ...updated[index], score: numScore, percentage }

      // Update completed count
      if (wasEmpty && nowFilled) {
        setCompletedCount((c) => c + 1)
      } else if (!wasEmpty && !nowFilled) {
        setCompletedCount((c) => c - 1)
      }

      return updated
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      const nextIndex = index + 1
      if (nextIndex < scores.length) {
        setCurrentIndex(nextIndex)
        setTimeout(() => {
          inputRefs.current[nextIndex]?.focus()
          inputRefs.current[nextIndex]?.select()
        }, 0)
      } else {
        // All done, save
        handleSave()
      }
    } else if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      setCurrentIndex(index - 1)
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus()
        inputRefs.current[index - 1]?.select()
      }, 0)
    } else if (e.key === 'ArrowDown' && index < scores.length - 1) {
      e.preventDefault()
      setCurrentIndex(index + 1)
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus()
        inputRefs.current[index + 1]?.select()
      }, 0)
    }
  }

  const autoSave = async () => {
    const validScores = scores
      .filter((entry) => typeof entry.score === 'number')
      .map((entry) => ({
        test_id: test.id,
        student_id: entry.student_id,
        score: entry.score as number
      }))

    if (validScores.length > 0) {
      try {
        await WeeklyTestsAPI.updateScores(validScores)
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await autoSave()
      onScoresUpdated()
      setOpen(false)
    } catch (error) {
      console.error('Failed to save scores:', error)
    } finally {
      setSaving(false)
    }
  }

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-green-500 text-white">A</Badge>
    if (percentage >= 80) return <Badge className="bg-blue-500 text-white">B</Badge>
    if (percentage >= 70) return <Badge className="bg-yellow-600 text-white">C</Badge>
    if (percentage >= 60) return <Badge className="bg-orange-500 text-white">D</Badge>
    return <Badge variant="destructive">F</Badge>
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Zap className="h-4 w-4" />
      Rapid Score
    </Button>
  )

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Rapid Scoring: {test.name}
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>Use Tab/Enter to move between fields. Max score: {test.max_score} points.</span>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {students.length} students
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {completedCount}/{students.length} scored
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Quick Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Keyboard className="h-4 w-4" />
              <span>
                <strong>Quick Tips:</strong> Tab/Enter = Next • ↑↓ = Navigate • Auto-saves every 3s
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / students.length) * 100}%` }}
          />
        </div>

        {/* Scoring Table */}
        <div className="max-h-[50vh] overflow-y-auto border rounded-lg">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="w-[100px]">Score</TableHead>
                <TableHead className="w-[80px]">%</TableHead>
                <TableHead className="w-[60px]">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((entry, index) => (
                <TableRow
                  key={entry.student_id}
                  className={`${index === currentIndex ? 'bg-blue-50 border-blue-200' : ''} ${
                    typeof entry.score === 'number' ? 'bg-green-50/30' : ''
                  }`}
                >
                  <TableCell className="font-mono text-sm">
                    {(index + 1).toString().padStart(2, '0')}
                  </TableCell>
                  <TableCell className="font-medium">{entry.student_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {entry.student_class}
                  </TableCell>
                  <TableCell>
                    <Input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="number"
                      min="0"
                      max={test.max_score}
                      value={entry.score}
                      onChange={(e) => updateScore(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={() => setCurrentIndex(index)}
                      className={`w-16 text-center ${
                        index === currentIndex ? 'ring-2 ring-blue-500' : ''
                      }`}
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell>
                    {typeof entry.score === 'number' && (
                      <span
                        className={`font-medium ${
                          entry.percentage >= 80
                            ? 'text-green-600'
                            : entry.percentage >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {entry.percentage}%
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {typeof entry.score === 'number' && getPerformanceBadge(entry.percentage)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="gap-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {completedCount === students.length ? (
              <span className="text-green-600 font-medium">✓ All students scored!</span>
            ) : (
              <span>{students.length - completedCount} students remaining</span>
            )}
          </div>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save & Close'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
