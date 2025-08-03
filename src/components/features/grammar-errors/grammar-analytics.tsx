'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Users, Target, Download } from 'lucide-react'
import type { GrammarError, Student } from '@/lib/types/database'

interface GrammarAnalyticsProps {
  errors: GrammarError[]
  students: Student[]
}

interface ErrorAnalysis {
  errorCode: string
  errorName: string
  frequency: number
  percentage: number
  studentCount: number
}

interface StudentErrorAnalysis {
  studentId: number
  studentName: string
  studentClass: string
  totalErrors: number
  topError: string
  errorBreakdown: Record<string, number>
}

const ERROR_NAMES: Record<string, string> = {
  VT: 'Verb tenses',
  NG: 'Not using paragraphs',
  PREP: 'Prepositions (in, on, at etc.)',
  ART: 'Articles (a, an, the etc.)',
  SP: 'Spelling',
  NN: 'Noun number',
  VP: 'Verb person',
  VN: 'Verb number',
  WO: 'Word order',
  PRON: 'Pronouns (I, me, we, us, my etc.)',
  TV: 'Transitive/intransitive verb',
  MPS: 'Mixing parts of speech',
  PV: 'Phrasal verbs',
  QUANT: 'Quantifiers (many, much, a lot of etc.)',
  ADV: 'Adverbs',
  COMP: 'Comparatives (-er, -est)',
  CAP: 'Capital letters',
  WO2: 'Word order (e.g., subject-verb-object)',
  SVA: 'Subject-verb agreement',
  FULL: 'Full stops',
  CAPS: 'Capital letters',
  TASK: 'Does not understand the task',
  MW: 'Missing words',
  WO_SVO: 'Word order (SVO)'
}

export function GrammarAnalytics({ errors, students }: GrammarAnalyticsProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all')
  const [filteredErrors, setFilteredErrors] = useState<GrammarError[]>(errors)

  useEffect(() => {
    let filtered = [...errors]

    if (selectedStudent !== 'all') {
      filtered = filtered.filter((error) => error.student_id === parseInt(selectedStudent))
    }

    if (selectedTimeframe !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()

      switch (selectedTimeframe) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case 'term':
          cutoffDate.setMonth(now.getMonth() - 3)
          break
      }

      filtered = filtered.filter((error) => new Date(error.date) >= cutoffDate)
    }

    setFilteredErrors(filtered)
  }, [errors, selectedStudent, selectedTimeframe])

  const getErrorAnalysis = (): ErrorAnalysis[] => {
    const errorCounts: Record<string, { count: number; students: Set<number> }> = {}

    filteredErrors.forEach((error) => {
      if (!errorCounts[error.error_code]) {
        errorCounts[error.error_code] = { count: 0, students: new Set() }
      }
      errorCounts[error.error_code].count++
      errorCounts[error.error_code].students.add(error.student_id)
    })

    const totalErrors = filteredErrors.length

    return Object.entries(errorCounts)
      .map(([code, data]) => ({
        errorCode: code,
        errorName: ERROR_NAMES[code] || code,
        frequency: data.count,
        percentage: Math.round((data.count / totalErrors) * 100),
        studentCount: data.students.size
      }))
      .sort((a, b) => b.frequency - a.frequency)
  }

  const getStudentErrorAnalysis = (): StudentErrorAnalysis[] => {
    const studentErrors: Record<number, Record<string, number>> = {}

    filteredErrors.forEach((error) => {
      if (!studentErrors[error.student_id]) {
        studentErrors[error.student_id] = {}
      }
      if (!studentErrors[error.student_id][error.error_code]) {
        studentErrors[error.student_id][error.error_code] = 0
      }
      studentErrors[error.student_id][error.error_code]++
    })

    return students
      .map((student) => {
        const errors = studentErrors[student.id] || {}
        const totalErrors = Object.values(errors).reduce((sum, count) => sum + count, 0)
        const topErrorCode = Object.entries(errors).sort(([, a], [, b]) => b - a)[0]?.[0] || ''

        return {
          studentId: student.id,
          studentName: student.name,
          studentClass: student.class,
          totalErrors,
          topError: ERROR_NAMES[topErrorCode] || topErrorCode,
          errorBreakdown: errors
        }
      })
      .filter((student) => student.totalErrors > 0)
      .sort((a, b) => b.totalErrors - a.totalErrors)
  }

  const errorAnalysis = getErrorAnalysis()
  const studentAnalysis = getStudentErrorAnalysis()
  const totalErrors = filteredErrors.length
  const uniqueStudents = new Set(filteredErrors.map((e) => e.student_id)).size

  const exportData = () => {
    const csvData = [
      ['Error Type', 'Error Name', 'Frequency', 'Percentage', 'Students Affected'],
      ...errorAnalysis.map((error) => [
        error.errorCode,
        error.errorName,
        error.frequency.toString(),
        `${error.percentage}%`,
        error.studentCount.toString()
      ])
    ]

    const csvContent = csvData.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grammar-errors-analysis-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Grammar Error Analytics
          </h2>
          <p className="text-muted-foreground">
            Identify patterns and target areas for improvement
          </p>
        </div>

        <div className="flex gap-3">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="term">Past Term</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={exportData} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-red-500" />
              <div className="text-sm font-medium text-muted-foreground">Total Errors</div>
            </div>
            <div className="text-2xl font-bold">{totalErrors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium text-muted-foreground">Students Affected</div>
            </div>
            <div className="text-2xl font-bold">{uniqueStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium text-muted-foreground">Error Types</div>
            </div>
            <div className="text-2xl font-bold">{errorAnalysis.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium text-muted-foreground">Avg per Student</div>
            </div>
            <div className="text-2xl font-bold">
              {uniqueStudents > 0 ? Math.round(totalErrors / uniqueStudents) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Frequency Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Most Common Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {errorAnalysis.slice(0, 10).map((error, index) => (
                <div key={error.errorCode} className="flex items-center gap-3">
                  <div className="w-6 text-sm font-mono text-muted-foreground">#{index + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{error.errorName}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {error.errorCode}
                        </Badge>
                        <span className="text-sm font-medium">{error.frequency}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${error.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{error.percentage}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {error.studentCount} student{error.studentCount !== 1 ? 's' : ''} affected
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Error Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Students Needing Most Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentAnalysis.slice(0, 10).map((student, index) => (
                <div key={student.studentId} className="flex items-center gap-3">
                  <div className="w-6 text-sm font-mono text-muted-foreground">#{index + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="font-medium">{student.studentName}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {student.studentClass}
                        </span>
                      </div>
                      <Badge
                        variant={
                          student.totalErrors > 10
                            ? 'destructive'
                            : student.totalErrors > 5
                              ? 'default'
                              : 'secondary'
                        }
                        className="text-xs"
                      >
                        {student.totalErrors} errors
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Most common: <span className="font-medium">{student.topError}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
