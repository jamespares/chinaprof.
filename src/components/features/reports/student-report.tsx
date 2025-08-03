'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  GraduationCap,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react'
import { COMMON_GRAMMAR_ERRORS } from '@/lib/data/grammar-errors'
import type { StudentReportData } from '@/lib/api/reports'

interface StudentReportProps {
  reportData: StudentReportData
}

export function StudentReport({ reportData }: StudentReportProps) {
  const { student, homework, grammar, tests, comments } = reportData

  const getGrammarErrorName = (errorCode: string) => {
    const error = COMMON_GRAMMAR_ERRORS.find((e) => e.code === errorCode)
    return error?.error || errorCode
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-green-500">Excellent</Badge>
    if (percentage >= 80) return <Badge className="bg-blue-500">Good</Badge>
    if (percentage >= 70) return <Badge className="bg-yellow-500">Satisfactory</Badge>
    if (percentage >= 60) return <Badge className="bg-orange-500">Needs Improvement</Badge>
    return <Badge variant="destructive">Requires Attention</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{student.name} - Progress Report</h1>
        <p className="text-muted-foreground">
          Class: {student.class} • Generated: {formatDate(reportData.generated_at)}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Homework</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{homework.completion_percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {homework.completed_assignments} of {homework.total_assignments} completed
            </p>
            <Progress value={homework.completion_percentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.average_score}%</div>
            <p className="text-xs text-muted-foreground">
              Based on {tests.total_tests} test{tests.total_tests !== 1 ? 's' : ''}
            </p>
            {tests.total_tests > 0 && (
              <div className="mt-2">{getPerformanceBadge(tests.average_score)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grammar Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{grammar.total_errors}</div>
            <p className="text-xs text-muted-foreground">Total logged errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments.total_comments}</div>
            <p className="text-xs text-muted-foreground">Teacher observations</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Test Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Test Scores
            </CardTitle>
            <CardDescription>Latest test performance</CardDescription>
          </CardHeader>
          <CardContent>
            {tests.recent_scores.length === 0 ? (
              <p className="text-sm text-muted-foreground">No test scores recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {tests.recent_scores.slice(0, 5).map((score) => (
                  <div key={score.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{score.test_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {score.score} / {score.max_score} points
                      </div>
                    </div>
                    <Badge
                      variant={
                        score.percentage >= 80
                          ? 'default'
                          : score.percentage >= 60
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {score.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grammar Error Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Common Grammar Issues
            </CardTitle>
            <CardDescription>Areas needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(grammar.error_breakdown).length === 0 ? (
              <p className="text-sm text-muted-foreground">No grammar errors recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(grammar.error_breakdown)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([errorCode, count]) => (
                    <div key={errorCode} className="flex items-center justify-between">
                      <div className="text-sm">{getGrammarErrorName(errorCode)}</div>
                      <Badge variant="outline">{count}x</Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Teacher Comments
            </CardTitle>
            <CardDescription>Recent observations and feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {comments.recent_comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {comments.recent_comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-muted pl-3">
                    <div className="text-sm leading-relaxed">{comment.comment}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {comment.subject_name}
                      </Badge>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(comment.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Homework Completion Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Homework Progress
            </CardTitle>
            <CardDescription>Recent assignment completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm text-muted-foreground">
                  {homework.completed_assignments}/{homework.total_assignments}
                </span>
              </div>
              <Progress value={homework.completion_percentage} className="h-2" />

              {homework.recent_homework.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent Assignments (Last 30 days)</div>
                  <div className="grid grid-cols-7 gap-1">
                    {homework.recent_homework.slice(-14).map((hw, index) => (
                      <div
                        key={hw.id}
                        className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                          hw.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}
                        title={`${formatDate(hw.date)}: ${hw.status ? 'Completed' : 'Missing'}`}
                      >
                        {hw.status ? '✓' : '✗'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
