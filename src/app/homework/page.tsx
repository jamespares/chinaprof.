'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { HomeworkGrid } from '@/components/features/homework/homework-grid'
import { HomeworkAPI, type HomeworkGridData } from '@/lib/api/homework'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Calendar, Keyboard, Zap, X } from 'lucide-react'
import { StudentsAPI } from '@/lib/api/students'
import type { Student } from '@/lib/types/database'

export default function HomeworkPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [homeworkStatus, setHomeworkStatus] = useState<Record<number, boolean | null>>({})
  const [loading, setLoading] = useState(false)
  const [rapidMode, setRapidMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const buttonRefs = useRef<HTMLButtonElement[]>([])
  const [gridData, setGridData] = useState<HomeworkGridData | null>(null)
  const [gridLoading, setGridLoading] = useState(false)

  // Load grid data for calendar tab
  const loadGridData = async () => {
    setGridLoading(true)
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const data = await HomeworkAPI.getGridData(startDate, endDate)
      setGridData(data)
    } catch (error) {
      console.error('Failed to load grid data:', error)
    } finally {
      setGridLoading(false)
    }
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const studentsData = await StudentsAPI.getAll()
      setStudents(studentsData)

      // Load homework status for selected date
      const status: Record<number, boolean | null> = {}
      for (const student of studentsData) {
        try {
          const homework = await HomeworkAPI.getByStudentAndDateRange(
            student.id,
            selectedDate,
            selectedDate
          )
          status[student.id] = homework.length > 0 ? homework[0].status : null
        } catch {
          status[student.id] = null
        }
      }
      setHomeworkStatus(status)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  // Load students and today's homework status
  useEffect(() => {
    loadData()
  }, [loadData])

  const handleStatusToggle = async (studentId: number, moveNext: boolean = false) => {
    const currentStatus = homeworkStatus[studentId]
    let newStatus: boolean

    // Cycle: null -> true -> false -> true -> ...
    if (currentStatus === null) {
      newStatus = true // Mark as complete
    } else {
      newStatus = !currentStatus // Toggle between true/false
    }

    try {
      await HomeworkAPI.markSingle(studentId, selectedDate, newStatus)

      // Update local state
      setHomeworkStatus((prev) => ({
        ...prev,
        [studentId]: newStatus
      }))

      // Move to next student in rapid mode
      if (rapidMode && moveNext) {
        const nextIndex = currentIndex + 1
        if (nextIndex < students.length) {
          setCurrentIndex(nextIndex)
          setTimeout(() => {
            buttonRefs.current[nextIndex]?.focus()
          }, 100)
        } else {
          // All done, exit rapid mode
          setRapidMode(false)
          setCurrentIndex(0)
        }
      }
    } catch (error) {
      console.error('Failed to update homework:', error)
    }
  }

  const updateHomeworkStatus = async (studentId: number, status: boolean | null) => {
    if (status === null) {
      // Handle deletion if needed
      return
    }

    try {
      await HomeworkAPI.markSingle(studentId, selectedDate, status)
      setHomeworkStatus((prev) => ({
        ...prev,
        [studentId]: status
      }))
    } catch (error) {
      console.error('Failed to update homework:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, studentId: number, index: number) => {
    if (!rapidMode) return

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleStatusToggle(studentId, true)
    } else if (e.key === '1' || e.key === 'c' || e.key === 'C') {
      e.preventDefault()
      updateHomeworkStatus(studentId, true)
      moveToNext(index)
    } else if (e.key === '0' || e.key === 'i' || e.key === 'I') {
      e.preventDefault()
      updateHomeworkStatus(studentId, false)
      moveToNext(index)
    } else if (e.key === '-' || e.key === 'n' || e.key === 'N') {
      e.preventDefault()
      updateHomeworkStatus(studentId, null)
      moveToNext(index)
    } else if (e.key === 'ArrowDown' && index < students.length - 1) {
      e.preventDefault()
      setCurrentIndex(index + 1)
      buttonRefs.current[index + 1]?.focus()
    } else if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      setCurrentIndex(index - 1)
      buttonRefs.current[index - 1]?.focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setRapidMode(false)
      setCurrentIndex(0)
    }
  }

  const moveToNext = (currentIndex: number) => {
    const nextIndex = currentIndex + 1
    if (nextIndex < students.length) {
      setCurrentIndex(nextIndex)
      setTimeout(() => {
        buttonRefs.current[nextIndex]?.focus()
      }, 100)
    } else {
      setRapidMode(false)
      setCurrentIndex(0)
    }
  }

  const startRapidMode = () => {
    setRapidMode(true)
    setCurrentIndex(0)
    setTimeout(() => {
      buttonRefs.current[0]?.focus()
    }, 100)
  }

  const getStatusDisplay = (status: boolean | null) => {
    if (status === true) {
      return {
        icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
        text: 'Complete',
        bgColor: 'bg-green-50 border-green-200 hover:bg-green-100'
      }
    } else if (status === false) {
      return {
        icon: <XCircle className="h-6 w-6 text-red-600" />,
        text: 'Incomplete',
        bgColor: 'bg-red-50 border-red-200 hover:bg-red-100'
      }
    } else {
      return {
        icon: <div className="h-6 w-6 border-2 border-gray-300 rounded-full" />,
        text: 'Not set',
        bgColor: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Homework Tracker</h1>
          <p className="text-muted-foreground">Mark homework completion for each student</p>
        </div>
        <div className="text-center py-12">
          <div className="text-sm text-muted-foreground">Loading students...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Homework Tracker</h1>
        <p className="text-muted-foreground">Mark homework completion for each student</p>
      </div>

      <Tabs defaultValue="entry" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entry">Daily Entry</TabsTrigger>
          <TabsTrigger value="calendar" onClick={loadGridData}>
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="space-y-6">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Select Date
              </CardTitle>
              <CardDescription>Choose the date to track homework completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-xs">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const yesterday = new Date()
                      yesterday.setDate(yesterday.getDate() - 1)
                      setSelectedDate(yesterday.toISOString().split('T')[0])
                    }}
                  >
                    Yesterday
                  </Button>
                  <Button
                    variant={rapidMode ? 'destructive' : 'default'}
                    onClick={rapidMode ? () => setRapidMode(false) : startRapidMode}
                    className="gap-2"
                  >
                    {rapidMode ? (
                      <>
                        <X className="h-4 w-4" />
                        Exit Rapid Mode
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Rapid Entry
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rapid Mode Instructions */}
          {rapidMode && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Keyboard className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium text-blue-900">Rapid Entry Mode Active</div>
                    <div className="text-sm text-blue-700 mt-1">
                      <Badge variant="outline" className="mr-2">
                        1/C
                      </Badge>
                      Complete
                      <Badge variant="outline" className="mr-2 ml-2">
                        0/I
                      </Badge>
                      Incomplete
                      <Badge variant="outline" className="mr-2 ml-2">
                        -/N
                      </Badge>
                      Not Set
                      <Badge variant="outline" className="mr-2 ml-2">
                        ↑↓
                      </Badge>
                      Navigate
                      <Badge variant="outline" className="ml-2">
                        Esc
                      </Badge>
                      Exit
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Student Homework List */}
          <Card>
            <CardHeader>
              <CardTitle>Homework for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
              <CardDescription>
                {rapidMode
                  ? 'Use keyboard shortcuts to quickly mark homework completion'
                  : 'Click on each student to mark their homework as complete, incomplete, or not set'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No students found. Add students first to track homework.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {students.map((student, index) => {
                    const status = homeworkStatus[student.id]
                    const display = getStatusDisplay(status)
                    const isCurrent = rapidMode && index === currentIndex

                    return (
                      <button
                        key={student.id}
                        ref={(el) => {
                          if (el) buttonRefs.current[index] = el
                        }}
                        onClick={() => handleStatusToggle(student.id, rapidMode)}
                        onKeyDown={(e) => handleKeyDown(e, student.id, index)}
                        onFocus={() => rapidMode && setCurrentIndex(index)}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${display.bgColor} ${
                          isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isCurrent && rapidMode && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1" />
                          )}
                          {display.icon}
                          <div className="text-left">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.class}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {rapidMode && isCurrent && (
                            <Badge variant="outline" className="text-xs">
                              #{(index + 1).toString().padStart(2, '0')}
                            </Badge>
                          )}
                          <div className="text-sm font-medium">{display.text}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          {gridLoading ? (
            <div className="text-center py-12">
              <div className="text-sm text-muted-foreground">Loading calendar...</div>
            </div>
          ) : gridData ? (
            <HomeworkGrid
              data={gridData}
              onUpdateHomework={async (studentId, date, status) => {
                try {
                  await HomeworkAPI.markSingle(studentId, date, status)
                  // Reload grid data to reflect changes
                  loadGridData()
                } catch (error) {
                  console.error('Failed to update homework:', error)
                }
              }}
              onBulkUpdate={async (date, updates) => {
                try {
                  await HomeworkAPI.bulkUpdateForDate(date, updates)
                  // Reload grid data to reflect changes
                  loadGridData()
                } catch (error) {
                  console.error('Failed to bulk update homework:', error)
                }
              }}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  Click &quot;Calendar View&quot; to load the homework grid.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
