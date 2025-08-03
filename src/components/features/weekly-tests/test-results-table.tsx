'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Trophy, Medal, Award, TrendingDown, Download, BarChart3 } from 'lucide-react'
import { WeeklyTestsAPI } from '@/lib/api/weekly-tests'
import type { WeeklyTest, WeeklyScore, Student } from '@/lib/types/database'

interface TestResultsTableProps {
  test: WeeklyTest
  students: Student[]
  onClose?: () => void
}

interface StudentResult {
  studentId: number
  studentName: string
  studentClass: string
  score: number
  percentage: number
  rank: number
  grade: string
  gradeColor: string
}

export function TestResultsTable({ test, students, onClose }: TestResultsTableProps) {
  const [scores, setScores] = useState<WeeklyScore[]>([])
  const [sortBy, setSortBy] = useState<string>('rank')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScores()
  }, [test.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadScores = async () => {
    setLoading(true)
    try {
      const testScores = await WeeklyTestsAPI.getScores(test.id)
      setScores(testScores)
    } catch (error) {
      console.error('Failed to load scores:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGradeInfo = (percentage: number) => {
    if (percentage >= 98)
      return { grade: 'A+', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
    if (percentage >= 94)
      return { grade: 'A', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
    if (percentage >= 91)
      return { grade: 'A-', color: 'bg-green-100 text-green-800 border-green-200' }
    if (percentage >= 87) return { grade: 'B+', color: 'bg-blue-100 text-blue-800 border-blue-200' }
    if (percentage >= 84) return { grade: 'B', color: 'bg-blue-100 text-blue-800 border-blue-200' }
    if (percentage >= 79) return { grade: 'B-', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' }
    if (percentage >= 75)
      return { grade: 'C+', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    if (percentage >= 72)
      return { grade: 'C', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    if (percentage >= 64)
      return { grade: 'C-', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    if (percentage >= 56) return { grade: 'D', color: 'bg-red-100 text-red-700 border-red-200' }
    if (percentage >= 49) return { grade: 'D-', color: 'bg-red-100 text-red-700 border-red-200' }
    if (percentage >= 42) return { grade: 'F+', color: 'bg-red-200 text-red-900 border-red-300' }
    return { grade: 'F', color: 'bg-red-200 text-red-900 border-red-300' }
  }

  const getStudentResults = (): StudentResult[] => {
    const scoreMap = new Map(scores.map((score) => [score.student_id, score.score]))

    const results = students
      .map((student) => {
        const score = scoreMap.get(student.id)
        if (score === undefined) return null

        const percentage = Math.round((score / test.max_score) * 100)
        const gradeInfo = getGradeInfo(percentage)

        return {
          studentId: student.id,
          studentName: student.name,
          studentClass: student.class,
          score,
          percentage,
          rank: 0, // Will be set below
          grade: gradeInfo.grade,
          gradeColor: gradeInfo.color
        }
      })
      .filter((result): result is StudentResult => result !== null)
      .sort((a, b) => b.percentage - a.percentage) // Sort by percentage descending

    // Assign ranks
    results.forEach((result, index) => {
      result.rank = index + 1
    })

    // Apply sorting
    if (sortBy === 'name') {
      results.sort((a, b) => a.studentName.localeCompare(b.studentName))
    } else if (sortBy === 'class') {
      results.sort((a, b) => a.studentClass.localeCompare(b.studentClass))
    } else if (sortBy === 'percentage') {
      results.sort((a, b) => b.percentage - a.percentage)
    }
    // Default is already by rank

    return results
  }

  const results = getStudentResults()
  const average =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0
  const topPerformer = results[0]
  const needsSupport = results.filter((r) => r.percentage < 70)

  const exportResults = () => {
    const csvData = [
      ['Rank', 'Student', 'Class', 'Score', 'Percentage', 'Grade'],
      ...results.map((result) => [
        result.rank.toString(),
        result.studentName,
        result.studentClass,
        result.score.toString(),
        `${result.percentage}%`,
        result.grade
      ])
    ]

    const csvContent = csvData.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${test.name}-results-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />
    if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />
    if (rank === 3) return <Award className="h-4 w-4 text-amber-600" />
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">Loading results...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            {test.name} Results
          </h2>
          <p className="text-muted-foreground">
            Ranked performance analysis • Max score: {test.max_score} points
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">By Rank</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
              <SelectItem value="class">By Class</SelectItem>
              <SelectItem value="percentage">By Score</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={exportResults} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>

          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <div className="text-sm font-medium text-muted-foreground">Top Score</div>
            </div>
            <div className="text-2xl font-bold">
              {topPerformer ? `${topPerformer.percentage}%` : 'N/A'}
            </div>
            {topPerformer && (
              <div className="text-sm text-muted-foreground">{topPerformer.studentName}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium text-muted-foreground">Class Average</div>
            </div>
            <div className="text-2xl font-bold">{average}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium text-muted-foreground">Students Tested</div>
            </div>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium text-muted-foreground">Need Support</div>
            </div>
            <div className="text-2xl font-bold">{needsSupport.length}</div>
            <div className="text-sm text-muted-foreground">Below 70%</div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Percentage</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow
                    key={result.studentId}
                    className={`${
                      result.percentage >= 90
                        ? 'bg-green-50/50'
                        : result.percentage >= 80
                          ? 'bg-blue-50/50'
                          : result.percentage >= 70
                            ? 'bg-yellow-50/50'
                            : result.percentage >= 60
                              ? 'bg-orange-50/50'
                              : 'bg-red-50/50'
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRankIcon(result.rank)}
                        <span className="font-mono text-lg font-bold">
                          #{result.rank.toString().padStart(2, '0')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{result.studentName}</TableCell>
                    <TableCell className="text-muted-foreground">{result.studentClass}</TableCell>
                    <TableCell className="text-center font-mono">
                      {result.score}/{test.max_score}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`font-bold text-lg ${
                          result.percentage >= 90
                            ? 'text-green-600'
                            : result.percentage >= 80
                              ? 'text-blue-600'
                              : result.percentage >= 70
                                ? 'text-yellow-600'
                                : result.percentage >= 60
                                  ? 'text-orange-600'
                                  : 'text-red-600'
                        }`}
                      >
                        {result.percentage}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`font-bold ${result.gradeColor}`}>
                        {result.grade}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No scores recorded for this test yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
