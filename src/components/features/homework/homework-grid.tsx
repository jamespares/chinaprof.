'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Calendar, CheckCircle2, XCircle, MinusCircle, Users, TrendingUp } from 'lucide-react'
import type { HomeworkGridData, GridStudent } from '@/lib/api/homework'

interface HomeworkGridProps {
  data: HomeworkGridData
  onUpdateHomework: (studentId: number, date: string, status: boolean) => void
  onBulkUpdate: (date: string, updates: Array<{ studentId: number; status: boolean }>) => void
}

export function HomeworkGrid({ data, onUpdateHomework, onBulkUpdate }: HomeworkGridProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [bulkStatus, setBulkStatus] = useState<boolean>(true)

  // Get status color and icon for RAG display
  const getStatusDisplay = (status: boolean | null) => {
    if (status === true) {
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle2 className="h-3 w-3" />,
        label: 'Complete'
      }
    } else if (status === false) {
      return {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-3 w-3" />,
        label: 'Incomplete'
      }
    } else {
      return {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <MinusCircle className="h-3 w-3" />,
        label: 'Not Set'
      }
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  // Handle bulk update for selected date
  const handleBulkUpdate = () => {
    if (!selectedDate) return

    const updates = data.students.map((student) => ({
      studentId: student.student.id,
      status: bulkStatus
    }))

    onBulkUpdate(selectedDate, updates)
    setSelectedDate(null)
  }

  // Get overall completion stats
  const overallStats = {
    totalEntries: data.students.reduce((sum, student) => sum + student.homework.length, 0),
    completedEntries: data.students.reduce(
      (sum, student) => sum + student.homework.filter((hw) => hw.status === true).length,
      0
    ),
    averageCompletion: Math.round(
      data.students.reduce((sum, student) => sum + student.stats.percentage, 0) /
        (data.students.length || 1)
    )
  }

  if (data.students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Homework Tracker
          </CardTitle>
          <CardDescription>
            No students found. Add students first to track homework.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className={`${
            overallStats.averageCompletion >= 80
              ? 'border-green-200 bg-green-50'
              : overallStats.averageCompletion >= 60
                ? 'border-amber-200 bg-amber-50'
                : 'border-red-200 bg-red-50'
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${
                overallStats.averageCompletion >= 80
                  ? 'text-green-600'
                  : overallStats.averageCompletion >= 60
                    ? 'text-amber-600'
                    : 'text-red-600'
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                overallStats.averageCompletion >= 80
                  ? 'text-green-700'
                  : overallStats.averageCompletion >= 60
                    ? 'text-amber-700'
                    : 'text-red-700'
              }`}
            >
              {overallStats.averageCompletion}%
            </div>
            <p className="text-xs text-muted-foreground">Across all students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{overallStats.completedEntries}</div>
            <p className="text-xs text-muted-foreground">
              Out of {overallStats.totalEntries} assignments
            </p>
            {overallStats.totalEntries > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(overallStats.completedEntries / overallStats.totalEntries) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Tracked</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.students.length}</div>
            <p className="text-xs text-muted-foreground">{data.dates.length} days tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Update Controls */}
      {selectedDate && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Bulk update for {formatDate(selectedDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={bulkStatus}
                    onCheckedChange={(checked) => setBulkStatus(checked as boolean)}
                  />
                  <span className="text-sm">Mark as {bulkStatus ? 'Complete' : 'Incomplete'}</span>
                </div>
                <Button onClick={handleBulkUpdate} size="sm">
                  Update All
                </Button>
                <Button onClick={() => setSelectedDate(null)} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RAG Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Homework RAG Grid
          </CardTitle>
          <CardDescription>Red = Incomplete • Amber = Not Set • Green = Complete</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b font-medium min-w-[120px]">Student</th>
                  <th className="text-center p-2 border-b font-medium min-w-[100px]">
                    <div className="flex flex-col items-center gap-1">
                      <span>Completion</span>
                      <span className="text-xs text-muted-foreground font-normal">Rate / Done</span>
                    </div>
                  </th>
                  {data.dates.map((date) => (
                    <th
                      key={date}
                      className="text-center p-1 border-b font-medium min-w-[50px] cursor-pointer hover:bg-muted"
                      onClick={() => setSelectedDate(selectedDate === date ? null : date)}
                    >
                      <div className={`p-1 rounded ${selectedDate === date ? 'bg-blue-100' : ''}`}>
                        {formatDate(date)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.students.map((student) => (
                  <tr key={student.student.id} className="hover:bg-muted/50">
                    <td className="p-2 border-b">
                      <div>
                        <div className="font-medium">{student.student.name}</div>
                        <div className="text-xs text-muted-foreground">{student.student.class}</div>
                      </div>
                    </td>
                    <td className="p-2 border-b">
                      <div className="flex flex-col items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`text-sm font-bold px-3 py-1 ${
                            student.stats.percentage >= 80
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : student.stats.percentage >= 60
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          {student.stats.percentage}%
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {student.stats.completed}/
                          {student.homework.filter((hw) => hw.status !== null).length}
                        </div>
                      </div>
                    </td>
                    {student.homework.map((hw, index) => {
                      const display = getStatusDisplay(hw.status)
                      return (
                        <td key={`${student.student.id}-${hw.date}`} className="p-1 border-b">
                          <button
                            onClick={() => {
                              if (hw.status === null) {
                                onUpdateHomework(student.student.id, hw.date, true)
                              } else {
                                onUpdateHomework(student.student.id, hw.date, !hw.status)
                              }
                            }}
                            className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-colors ${display.color}`}
                            title={`${student.student.name} - ${formatDate(hw.date)}: ${display.label}`}
                          >
                            {display.icon}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
