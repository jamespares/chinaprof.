'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, RotateCcw } from 'lucide-react'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onDateRangeChange: (startDate: string, endDate: string) => void
  loading?: boolean
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  loading = false
}: DateRangePickerProps) {
  const [localStartDate, setLocalStartDate] = useState(startDate)
  const [localEndDate, setLocalEndDate] = useState(endDate)

  const handleApply = () => {
    if (localStartDate && localEndDate) {
      onDateRangeChange(localStartDate, localEndDate)
    }
  }

  // Quick preset functions
  const setThisWeek = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust when day is Sunday

    const monday = new Date(now.setDate(diff))
    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)

    const start = monday.toISOString().split('T')[0]
    const end = friday.toISOString().split('T')[0]

    setLocalStartDate(start)
    setLocalEndDate(end)
    onDateRangeChange(start, end)
  }

  const setLastWeek = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) - 7 // Previous Monday

    const monday = new Date(now.setDate(diff))
    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)

    const start = monday.toISOString().split('T')[0]
    const end = friday.toISOString().split('T')[0]

    setLocalStartDate(start)
    setLocalEndDate(end)
    onDateRangeChange(start, end)
  }

  const setThisMonth = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

    setLocalStartDate(start)
    setLocalEndDate(end)
    onDateRangeChange(start, end)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Date Range
        </CardTitle>
        <CardDescription>Select the date range for homework tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={localStartDate}
              onChange={(e) => setLocalStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={localEndDate}
              onChange={(e) => setLocalEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={setThisWeek} variant="outline" size="sm">
            This Week
          </Button>
          <Button onClick={setLastWeek} variant="outline" size="sm">
            Last Week
          </Button>
          <Button onClick={setThisMonth} variant="outline" size="sm">
            This Month
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleApply}
            disabled={!localStartDate || !localEndDate || loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Apply Date Range'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
