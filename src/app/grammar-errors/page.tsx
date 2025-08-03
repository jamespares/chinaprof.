'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Download, Plus } from 'lucide-react'
import { StudentsAPI } from '@/lib/api/students'
import { SubjectsAPI } from '@/lib/api/subjects'
import { COMMON_GRAMMAR_ERRORS, getErrorsByCategory } from '@/lib/data/grammar-errors'
import { GrammarAnalytics } from '@/components/features/grammar-errors/grammar-analytics'
import { GrammarWorksheetGenerator } from '@/components/features/grammar/grammar-worksheet-generator'
import type { Student, Subject } from '@/lib/types/database'

interface GrammarError {
  id: number
  student_id: number
  subject_id: number
  date: string
  error_code: string
  lesson_ref?: string
  student_name?: string
  subject_name?: string
}

export default function GrammarErrorsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedErrorCode, setSelectedErrorCode] = useState<string>('')
  const [lessonRef, setLessonRef] = useState<string>('')
  const [grammarErrors, setGrammarErrors] = useState<GrammarError[]>([])
  const [allGrammarErrors, setAllGrammarErrors] = useState<GrammarError[]>([])
  const [loading, setLoading] = useState(false)

  const errorCategories = getErrorsByCategory()

  // Load students and subjects on mount
  useEffect(() => {
    loadStudents()
    loadSubjects()
    loadAllGrammarErrors()
  }, [])

  const loadStudents = async () => {
    try {
      const studentsData = await StudentsAPI.getAll()
      setStudents(studentsData)
    } catch (error) {
      console.error('Failed to load students:', error)
    }
  }

  const loadSubjects = async () => {
    try {
      const subjectsData = await SubjectsAPI.getAll()
      setSubjects(subjectsData)
    } catch (error) {
      console.error('Failed to load subjects:', error)
    }
  }

  const loadGrammarErrors = async (studentId: number) => {
    try {
      const response = await fetch(`/api/grammar-errors?studentId=${studentId}`)
      if (response.ok) {
        const errors = await response.json()
        setGrammarErrors(errors)
      }
    } catch (error) {
      console.error('Failed to load grammar errors:', error)
    }
  }

  const loadAllGrammarErrors = async () => {
    try {
      const response = await fetch('/api/grammar-errors')
      if (response.ok) {
        const errors = await response.json()
        setAllGrammarErrors(errors)
      }
    } catch (error) {
      console.error('Failed to load all grammar errors:', error)
    }
  }

  // Load grammar errors when student is selected
  useEffect(() => {
    if (selectedStudent) {
      loadGrammarErrors(parseInt(selectedStudent))
    } else {
      setGrammarErrors([])
    }
  }, [selectedStudent])

  const handleLogError = async () => {
    if (!selectedStudent || !selectedSubject || !selectedErrorCode) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/grammar-errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: parseInt(selectedStudent),
          subjectId: parseInt(selectedSubject),
          errorCode: selectedErrorCode,
          lessonRef: lessonRef
        })
      })

      if (response.ok) {
        // Reset form
        setSelectedErrorCode('')
        setSelectedSubject('')
        setLessonRef('')

        // Reload grammar errors
        loadGrammarErrors(parseInt(selectedStudent))
        loadAllGrammarErrors() // Refresh analytics data too

        console.log('Grammar error logged successfully')
      } else {
        throw new Error('Failed to log grammar error')
      }
    } catch (error) {
      console.error('Failed to log grammar error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getErrorDetails = (errorCode: string) => {
    return COMMON_GRAMMAR_ERRORS.find((error) => error.code === errorCode)
  }

  const exportToCSV = () => {
    if (grammarErrors.length === 0) return

    const csvData = [
      ['Date', 'Student', 'Error Code', 'Error Type', 'Example', 'Lesson Ref'],
      ...grammarErrors.map((error) => {
        const errorDetails = getErrorDetails(error.error_code)
        return [
          error.date,
          students.find((s) => s.id === error.student_id)?.name || 'Unknown',
          error.error_code,
          errorDetails?.error || 'Unknown',
          errorDetails?.example || '',
          error.lesson_ref || ''
        ]
      })
    ]

    const csvContent = csvData.map((row) => row.map((field) => `"${field}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grammar-errors-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Grammar Errors</h1>
          <p className="text-muted-foreground">
            Log and track common Chinese-English grammar errors
          </p>
        </div>
        {grammarErrors.length > 0 && (
          <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      <Tabs defaultValue="log-errors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="log-errors">Log Errors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
          <TabsTrigger value="worksheets">Generate Worksheets</TabsTrigger>
        </TabsList>

        <TabsContent value="log-errors" className="space-y-6">
          {/* Log New Error */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Log Grammar Error
              </CardTitle>
              <CardDescription>
                Quickly log common grammar mistakes made by students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="student">Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.name} ({student.class})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lesson">Lesson Reference (Optional)</Label>
                <Input
                  id="lesson"
                  placeholder="e.g., Unit 3, Page 45"
                  value={lessonRef}
                  onChange={(e) => setLessonRef(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="error">Grammar Error</Label>
                <Select value={selectedErrorCode} onValueChange={setSelectedErrorCode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select common error type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    {Object.entries(errorCategories).map(([category, errors]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                          {category}
                        </div>
                        {errors.map((error) => (
                          <SelectItem key={error.code} value={error.code}>
                            <div className="flex flex-col">
                              <span>{error.error}</span>
                              <span className="text-xs text-muted-foreground">
                                Example: &ldquo;{error.example}&rdquo;
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleLogError}
                disabled={!selectedStudent || !selectedSubject || !selectedErrorCode || loading}
                className="w-full btn-accent"
              >
                {loading ? 'Logging Error...' : 'Log Grammar Error'}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Errors */}
          {selectedStudent && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Errors for{' '}
                  {students.find((s) => s.id.toString() === selectedStudent)?.name}
                </CardTitle>
                <CardDescription>Grammar errors logged for this student</CardDescription>
              </CardHeader>
              <CardContent>
                {grammarErrors.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No grammar errors logged yet for this student.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {grammarErrors.map((error) => {
                      const errorDetails = getErrorDetails(error.error_code)
                      return (
                        <div
                          key={error.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{error.error_code}</Badge>
                              <span className="text-sm text-muted-foreground">{error.date}</span>
                            </div>
                            <div className="font-medium">{errorDetails?.error}</div>
                            <div className="text-sm text-muted-foreground">
                              Example: &ldquo;{errorDetails?.example}&rdquo;
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <GrammarAnalytics errors={allGrammarErrors} students={students} />
        </TabsContent>

        <TabsContent value="worksheets">
          <GrammarWorksheetGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
