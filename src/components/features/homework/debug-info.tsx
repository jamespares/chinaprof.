'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Info } from 'lucide-react'
import type { HomeworkGridData } from '@/lib/api/homework'

interface DebugInfoProps {
  data: HomeworkGridData
}

export function DebugInfo({ data }: DebugInfoProps) {
  const totalEntries = data.students.reduce((sum, student) => sum + student.homework.length, 0)
  const completedEntries = data.students.reduce(
    (sum, student) => sum + student.homework.filter((hw) => hw.status === true).length,
    0
  )
  const incompleteEntries = data.students.reduce(
    (sum, student) => sum + student.homework.filter((hw) => hw.status === false).length,
    0
  )
  const notSetEntries = data.students.reduce(
    (sum, student) => sum + student.homework.filter((hw) => hw.status === null).length,
    0
  )

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Info className="h-5 w-5" />
          Debug Information
        </CardTitle>
        <CardDescription className="text-blue-800">Current homework data breakdown</CardDescription>
      </CardHeader>
      <CardContent className="text-blue-900">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <strong>Date Range:</strong> {data.dates[0]} to {data.dates[data.dates.length - 1]}
          </div>
          <div>
            <strong>Students:</strong> {data.students.length}
          </div>
          <div>
            <strong>Total Entries:</strong> {totalEntries}
          </div>
          <div>
            <strong>Completed:</strong> {completedEntries} (Green)
          </div>
          <div>
            <strong>Incomplete:</strong> {incompleteEntries} (Red)
          </div>
          <div>
            <strong>Not Set:</strong> {notSetEntries} (Amber)
          </div>
        </div>
        <div className="mt-3 text-sm">
          <strong>Individual Stats:</strong>
          {data.students.map((student) => (
            <div key={student.student.id} className="ml-2">
              {student.student.name}: {student.stats.completed}/
              {student.homework.filter((hw) => hw.status !== null).length} ={' '}
              {student.stats.percentage}%
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
