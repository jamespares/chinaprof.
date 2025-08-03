'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
import { PenTool, Send, FileText, Star, Clock, User } from 'lucide-react'
import { StudentsAPI } from '@/lib/api/students'
import { SubjectsAPI } from '@/lib/api/subjects'
import type { Student, Subject } from '@/lib/types/database'

interface EssayFeedback {
  id: number
  student_id: number
  subject_id: number
  date: string
  raw_text: string
  feedback_json: string
  student_name?: string
  subject_name?: string
}

export default function EssayMarkingPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [essayText, setEssayText] = useState<string>('')
  const [ageGroup, setAgeGroup] = useState<string>('')
  const [taskType, setTaskType] = useState<string>('')
  const [rubric, setRubric] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [recentFeedback, setRecentFeedback] = useState<EssayFeedback[]>([])

  // Load students and subjects on mount
  useEffect(() => {
    loadStudents()
    loadSubjects()
    loadRecentFeedback()
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

  const loadRecentFeedback = async () => {
    try {
      const response = await fetch('/api/essay-feedback')
      if (response.ok) {
        const feedbackData = await response.json()
        setRecentFeedback(feedbackData)
      }
    } catch (error) {
      console.error('Failed to load recent feedback:', error)
    }
  }

  const handleMarkEssay = async () => {
    if (!essayText.trim() || !selectedStudent || !selectedSubject) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // For now, create a mock AI response
      // In a real implementation, this would call OpenAI API
      const mockFeedback = {
        score: Math.floor(Math.random() * 20) + 70, // 70-90 score
        strengths: [
          'Good use of vocabulary',
          'Clear paragraph structure',
          'Appropriate length for task'
        ],
        improvements: [
          'Work on verb tense consistency',
          'Add more connecting words',
          'Check article usage (a, an, the)'
        ],
        errors: [
          { type: 'TENSE-001', line: 2, text: 'I have went to school' },
          { type: 'ART-001', line: 5, text: 'I like cat very much' }
        ],
        comments:
          'This is a well-structured essay with good ideas. Focus on grammar accuracy for higher scores.'
      }

      // Save to database
      const response = await fetch('/api/essay-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: parseInt(selectedStudent),
          subjectId: parseInt(selectedSubject),
          rawText: essayText,
          feedbackJson: JSON.stringify(mockFeedback),
          ageGroup,
          taskType,
          rubric
        })
      })

      if (response.ok) {
        setFeedback(mockFeedback)
        loadRecentFeedback()
        // Clear form
        setEssayText('')
        setSelectedStudent('')
        setSelectedSubject('')
        setAgeGroup('')
        setTaskType('')
        setRubric('')
      }
    } catch (error) {
      console.error('Failed to mark essay:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Essay Marking</h1>
        <p className="text-muted-foreground">
          AI-powered essay analysis with detailed feedback and error identification
        </p>
      </div>

      <Tabs defaultValue="mark-essay" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mark-essay">Mark New Essay</TabsTrigger>
          <TabsTrigger value="recent-feedback">Recent Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="mark-essay" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Essay Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Essay Input
                </CardTitle>
                <CardDescription>
                  Paste the student's essay and provide context for AI analysis
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

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age Group</Label>
                    <Select value={ageGroup} onValueChange={setAgeGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elementary">Elementary (6-11)</SelectItem>
                        <SelectItem value="junior">Junior High (12-14)</SelectItem>
                        <SelectItem value="senior">Senior High (15-18)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task">Task Type</Label>
                    <Select value={taskType} onValueChange={setTaskType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select task" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="narrative">Narrative Writing</SelectItem>
                        <SelectItem value="descriptive">Descriptive Writing</SelectItem>
                        <SelectItem value="expository">Expository Writing</SelectItem>
                        <SelectItem value="persuasive">Persuasive Writing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rubric">Rubric</Label>
                    <Input
                      id="rubric"
                      placeholder="e.g., IELTS Band 6-7"
                      value={rubric}
                      onChange={(e) => setRubric(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="essay">Essay Text</Label>
                  <Textarea
                    id="essay"
                    placeholder="Paste the student's essay here..."
                    className="min-h-[200px]"
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleMarkEssay}
                  disabled={loading || !essayText.trim() || !selectedStudent || !selectedSubject}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Essay...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Mark Essay with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Feedback Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  AI Feedback
                </CardTitle>
                <CardDescription>Detailed analysis and suggestions for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                {feedback ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="text-lg font-semibold">Score: {feedback.score}/100</span>
                      </div>
                      <Badge
                        variant={
                          feedback.score >= 80
                            ? 'default'
                            : feedback.score >= 60
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {feedback.score >= 80
                          ? 'Excellent'
                          : feedback.score >= 60
                            ? 'Good'
                            : 'Needs Work'}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">Strengths:</h4>
                        <ul className="text-sm space-y-1">
                          {feedback.strengths.map((strength: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500">✓</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-orange-700 mb-2">Areas for Improvement:</h4>
                        <ul className="text-sm space-y-1">
                          {feedback.improvements.map((improvement: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-orange-500">→</span>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-red-700 mb-2">Grammar Errors Found:</h4>
                        <div className="space-y-2">
                          {feedback.errors.map((error: any, index: number) => (
                            <div
                              key={index}
                              className="p-2 bg-red-50 rounded border-l-2 border-red-300"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="destructive" className="text-xs">
                                  {error.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Line {error.line}
                                </span>
                              </div>
                              <p className="text-sm">{error.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded border-l-2 border-blue-300">
                        <h4 className="font-medium text-blue-700 mb-2">Teacher Comments:</h4>
                        <p className="text-sm">{feedback.comments}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Submit an essay to see AI-powered feedback and analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent-feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Essay Feedback</CardTitle>
              <CardDescription>Previously marked essays and their feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {recentFeedback.length > 0 ? (
                <div className="space-y-4">
                  {recentFeedback.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{item.student_name}</span>
                          <Badge variant="outline">{item.subject_name}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.raw_text.substring(0, 150)}...
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No essay feedback history yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
