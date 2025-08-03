'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HomeworkAPI } from '@/lib/api/homework'
import { StudentsAPI } from '@/lib/api/students'
import { Database, Loader2, Trash2 } from 'lucide-react'

interface DemoDataButtonProps {
  onDataAdded: () => void
  hasData?: boolean
}

export function DemoDataButton({ onDataAdded, hasData = false }: DemoDataButtonProps) {
  const [loading, setLoading] = useState(false)

  const addDemoData = async () => {
    setLoading(true)
    try {
      // First, get all existing students
      const students = await StudentsAPI.getAll()

      if (students.length === 0) {
        // Add some demo students first
        await StudentsAPI.create({ name: 'Zhang Wei', class: 'Grade 5A', dob: '2014-03-15' })
        await StudentsAPI.create({ name: 'Li Ming', class: 'Grade 5A', dob: '2014-07-22' })
        await StudentsAPI.create({ name: 'Wang Mei', class: 'Grade 5B', dob: '2014-01-08' })

        // Refetch students after adding them
        const newStudents = await StudentsAPI.getAll()
        console.log('Added demo students:', newStudents)
      }

      // Get the latest student list
      const currentStudents = await StudentsAPI.getAll()

      // Get the EXACT same date range that's displayed on screen
      // This should match what's shown in the date picker
      const now = new Date()
      const today = now.toISOString().split('T')[0]

      console.log('Creating demo data for today:', today)

      // Create demo data for a wider range around today to ensure visibility
      const dates = []
      for (let i = -2; i <= 7; i++) {
        // 10 days total: 2 days ago to 7 days ahead
        const date = new Date(now)
        date.setDate(now.getDate() + i)
        dates.push(date.toISOString().split('T')[0])
      }

      console.log('Demo dates:', dates)

      // Create realistic homework patterns for each student
      const demoEntries = []

      currentStudents.forEach((student, index) => {
        // Different completion patterns for variety - more varied patterns
        const patterns = [
          [true, true, false, true, true, false, true, false, true, true], // Good student - 70%
          [false, true, false, true, false, true, false, false, true, false], // Average student - 40%
          [true, false, true, false, true, true, false, true, false, true] // Mixed student - 60%
        ]

        const pattern = patterns[index % patterns.length]

        dates.forEach((date, dateIndex) => {
          demoEntries.push({
            studentId: student.id,
            date: date,
            status: pattern[dateIndex % pattern.length] // Use modulo to repeat pattern if needed
          })
        })
      })

      console.log('Demo entries to create:', demoEntries.length, 'entries')
      console.log('Sample entries:', demoEntries.slice(0, 5))

      await HomeworkAPI.updateHomework(demoEntries)
      onDataAdded()

      console.log(
        `Demo homework data added for ${currentStudents.length} students over ${dates.length} days`
      )
    } catch (error) {
      console.error('Failed to add demo data:', error)
      alert('Failed to add demo data. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const wipeDemoData = async () => {
    setLoading(true)
    try {
      // We'll create an API endpoint to wipe homework data
      const response = await fetch('/api/homework/wipe', {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to wipe data')
      }

      onDataAdded() // Refresh the grid
      console.log('Demo homework data wiped successfully')
    } catch (error) {
      console.error('Failed to wipe demo data:', error)
      alert('Failed to wipe demo data. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  if (hasData) {
    return (
      <div className="flex gap-2">
        <Button onClick={addDemoData} disabled={loading} variant="outline" size="sm">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding More Data...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Add More Demo Data
            </>
          )}
        </Button>
        <Button onClick={wipeDemoData} disabled={loading} variant="destructive" size="sm">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wiping Data...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Wipe All Homework Data
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={addDemoData} disabled={loading} variant="outline" size="sm">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding Demo Data...
        </>
      ) : (
        <>
          <Database className="mr-2 h-4 w-4" />
          Add Demo Data
        </>
      )}
    </Button>
  )
}
