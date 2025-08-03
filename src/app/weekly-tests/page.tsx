'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { TestTube, Plus, MoreHorizontal, Edit3, BarChart3, Zap } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AddTestDialog } from '@/components/features/weekly-tests/add-test-dialog'
import { TestScoringDialog } from '@/components/features/weekly-tests/test-scoring-dialog'
import { RapidScoringDialog } from '@/components/features/weekly-tests/rapid-scoring-dialog'
import { TestResultsTable } from '@/components/features/weekly-tests/test-results-table'
import { StudentsAPI } from '@/lib/api/students'
import { WeeklyTestsAPI } from '@/lib/api/weekly-tests'
import type { WeeklyTest, Student, WeeklyScore } from '@/lib/types/database'

export default function WeeklyTestsPage() {
  const { t } = useTranslation()

  const [tests, setTests] = useState<WeeklyTest[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [testScores, setTestScores] = useState<Record<number, WeeklyScore[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [selectedTest, setSelectedTest] = useState<WeeklyTest | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [testsData, studentsData] = await Promise.all([
        WeeklyTestsAPI.getAll(),
        StudentsAPI.getAll()
      ])

      setTests(testsData)
      setStudents(studentsData)

      // Load scores for each test
      const scoresData: Record<number, WeeklyScore[]> = {}
      for (const test of testsData) {
        try {
          const scores = await WeeklyTestsAPI.getScores(test.id)
          scoresData[test.id] = scores
        } catch (error) {
          console.error(`Failed to load scores for test ${test.id}:`, error)
          scoresData[test.id] = []
        }
      }
      setTestScores(scoresData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTestAdded = (newTest: WeeklyTest) => {
    setTests((prev) => [newTest, ...prev])
    setTestScores((prev) => ({ ...prev, [newTest.id]: [] }))
  }

  const handleScoresUpdated = () => {
    loadData() // Reload all data to get updated scores
  }

  const handleViewResults = (test: WeeklyTest) => {
    setSelectedTest(test)
    setShowResults(true)
  }

  const getTestStats = (testId: number) => {
    const scores = testScores[testId] || []
    const totalStudents = students.length
    const scoredStudents = scores.length

    if (scoredStudents === 0) {
      return {
        completion: 0,
        average: 0,
        scoredCount: 0,
        totalCount: totalStudents
      }
    }

    const test = tests.find((t) => t.id === testId)
    if (!test) return { completion: 0, average: 0, scoredCount: 0, totalCount: totalStudents }

    const totalScore = scores.reduce((sum, score) => sum + score.score, 0)
    const average = Math.round((totalScore / scoredStudents / test.max_score) * 100)
    const completion = Math.round((scoredStudents / totalStudents) * 100)

    return {
      completion,
      average,
      scoredCount: scoredStudents,
      totalCount: totalStudents
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{t('weeklyTests.title')}</h1>
            <p className="text-muted-foreground">{t('weeklyTests.subtitle')}</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-sm text-muted-foreground">{t('weeklyTests.loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t('weeklyTests.title')}</h1>
          <p className="text-muted-foreground">{t('weeklyTests.subtitle')}</p>
        </div>
        <AddTestDialog onTestAdded={handleTestAdded} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            {t('weeklyTests.overview')}
            {tests.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({tests.length} {tests.length === 1 ? 'test' : 'tests'})
              </span>
            )}
          </CardTitle>
          <CardDescription>{t('weeklyTests.overviewDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12">
              <TestTube className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">{t('weeklyTests.noStudentsTitle')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('weeklyTests.noStudentsDesc')}
              </p>
            </div>
          ) : tests.length === 0 ? (
            <div className="text-center py-12">
              <TestTube className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">{t('weeklyTests.noTestsTitle')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t('weeklyTests.noTestsDesc')}</p>
              <AddTestDialog
                onTestAdded={handleTestAdded}
                trigger={
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('weeklyTests.createFirst')}
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('weeklyTests.table.testName')}</TableHead>
                    <TableHead>Max Score</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Class Average</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right min-w-[200px]">Quick Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => {
                    const stats = getTestStats(test.id)
                    return (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <TestTube className="h-4 w-4 text-muted-foreground" />
                            {test.name}
                          </div>
                        </TableCell>
                        <TableCell>{test.max_score} points</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                stats.completion === 100
                                  ? 'default'
                                  : stats.completion > 0
                                    ? 'secondary'
                                    : 'outline'
                              }
                            >
                              {stats.completion}%
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ({stats.scoredCount}/{stats.totalCount})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {stats.scoredCount > 0 ? (
                            <Badge
                              variant={
                                stats.average >= 80
                                  ? 'default'
                                  : stats.average >= 60
                                    ? 'secondary'
                                    : 'destructive'
                              }
                            >
                              {stats.average}%
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">No scores yet</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(test.created_at || new Date().toISOString())}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Primary Action: Rapid Score */}
                            <RapidScoringDialog
                              test={test}
                              students={students}
                              onScoresUpdated={handleScoresUpdated}
                              trigger={
                                <Button size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700">
                                  <Zap className="h-3 w-3" />
                                  Score
                                </Button>
                              }
                            />

                            {/* Secondary Action: View Results */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleViewResults(test)}
                            >
                              <BarChart3 className="h-3 w-3" />
                              Results
                            </Button>

                            {/* More Options Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">More options</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <TestScoringDialog
                                    test={test}
                                    students={students}
                                    onScoresUpdated={handleScoresUpdated}
                                    trigger={
                                      <div className="flex items-center cursor-pointer w-full">
                                        <Edit3 className="mr-2 h-4 w-4" />
                                        Detailed Score
                                      </div>
                                    }
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit3 className="mr-2 h-4 w-4" />
                                  Edit Test
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
          <div className="overflow-y-auto p-6">
            {selectedTest && (
              <TestResultsTable
                test={selectedTest}
                students={students}
                onClose={() => setShowResults(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
