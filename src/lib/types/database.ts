// Database type definitions based on the Phase 1 data model

export interface Class {
  id: number
  name: string
  description?: string
  year_level?: number // Grade/Year level (1-12)
  teacher_id?: string // For future Phase 2 auth integration
}

export interface Student {
  id: number
  name: string
  class_id?: number // Reference to classes table
  class: string // Legacy field for backward compatibility
  dob: string // Date of birth as ISO string
  avatar_url?: string // Path to avatar image (stock or uploaded)
}

export interface Subject {
  id: number
  name: string
  teacher_id: string // Will be used in Phase 2 with auth
}

export interface LessonPlan {
  id: number
  subject_id: number
  week: number
  lesson_no: number
  intro: string
  objectives: string
  explanation: string
  activity: string
  quiz: string
  summary: string
}

export interface Resource {
  id: number
  lesson_id: number
  type: 'file' | 'url' | 'youtube'
  url_or_path: string
}

export interface Homework {
  id: number
  student_id: number
  date: string // ISO date string
  status: boolean // true = completed, false = not completed
}

export interface WeeklyTest {
  id: number
  name: string
  max_score: number
  created_at?: string
}

export interface WeeklyScore {
  id: number
  test_id: number
  student_id: number
  score: number
}

export interface GrammarError {
  id: number
  student_id: number
  subject_id: number
  date: string // ISO date string
  error_code: string // Common CN-ESL error codes
}

export interface Comment {
  id: number
  student_id: number
  subject_id: number
  date: string // ISO date string
  comment: string
  evidence: string
}

export interface Exam {
  id: number
  student_id: number
  name: string
  max_score: number
  score: number
  date: string // ISO date string
}

export interface EssayFeedback {
  id: number
  student_id: number
  subject_id: number
  date: string // ISO date string
  raw_text: string
  feedback_json: string // JSON string of feedback data
}
