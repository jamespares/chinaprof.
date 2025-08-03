'use client'

import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HomeworkGrid } from '@/components/features/homework/homework-grid'
import { HomeworkAPI } from '@/lib/api/homework'
import type { HomeworkGridData } from '@/lib/api/homework'

function isoDaysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

export default function HomeworkCalendarPage() {
  const [startDate, setStartDate] = useState<string>(isoDaysAgo(13))
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [gridData, setGridData] = useState<HomeworkGridData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const loadGrid = async () => {
    setLoading(true)
    try {
      const data = await HomeworkAPI.getGridData(startDate, endDate)
      setGridData(data)
    } catch (error) {
      console.error('Failed to load homework grid', error)
    } finally {
      setLoading(false)
    }
  }

  // initial load + reload on date change
  useEffect(() => {
    loadGrid()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Homework Calendar</h1>
        <p className="text-muted-foreground">
          Red = Incomplete • Amber = Not&nbsp;Set • Green = Complete
        </p>
      </div>

      {/* Date-range selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" /> Choose Range
          </CardTitle>
          <CardDescription>Select the period to analyse homework completion.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-end gap-4 flex-wrap">
          <div className="flex flex-col gap-1 max-w-[160px]">
            <label htmlFor="start" className="text-sm font-medium">
              Start
            </label>
            <Input
              id="start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 max-w-[160px]">
            <label htmlFor="end" className="text-sm font-medium">
              End
            </label>
            <Input
              id="end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button onClick={loadGrid} className="gap-1" variant="outline" disabled={loading}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </CardContent>
      </Card>

      {loading && <div className="text-sm text-muted-foreground">Loading calendar…</div>}

      {gridData && !loading && (
        <HomeworkGrid
          data={gridData}
          // These callbacks are NOOPs as calendar is read-only; user can navigate to entry page to edit
          onUpdateHomework={() => {}}
          onBulkUpdate={() => {}}
        />
      )}
    </div>
  )
}
