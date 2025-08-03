export interface StudentReportData {
  student: {
    id: number
    name: string
    class: string
    dob: string
  }
  generated_at: string
  homework: {
    total_assignments: number
    completed_assignments: number
    completion_percentage: number
    recent_homework: Array<{
      id: number
      date: string
      status: boolean
    }>
  }
  grammar: {
    total_errors: number
    error_breakdown: Record<string, number>
    recent_errors: Array<{
      id: number
      date: string
      error_code: string
    }>
  }
  tests: {
    total_tests: number
    average_score: number
    recent_scores: Array<{
      id: number
      test_name: string
      score: number
      max_score: number
      percentage: number
    }>
  }
  comments: {
    total_comments: number
    recent_comments: Array<{
      id: number
      date: string
      comment: string
      subject_name: string
    }>
  }
}

export const ReportsAPI = {
  async getStudentReport(studentId: number): Promise<StudentReportData> {
    const response = await fetch(`/api/reports/student/${studentId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch student report')
    }
    return response.json()
  }
}
