'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FileText, Download, Eye, User } from 'lucide-react'
import { StudentReport } from '@/components/features/reports/student-report'
import { StudentsAPI } from '@/lib/api/students'
import { ReportsAPI, type StudentReportData } from '@/lib/api/reports'
import type { Student } from '@/lib/types/database'

export default function ReportsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [reportData, setReportData] = useState<StudentReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const studentsData = await StudentsAPI.getAll()
      setStudents(studentsData)
    } catch (error) {
      console.error('Failed to load students:', error)
    }
  }

  const generateReport = async () => {
    if (!selectedStudent) return

    setLoading(true)
    try {
      const data = await ReportsAPI.getStudentReport(parseInt(selectedStudent))
      setReportData(data)
      setReportDialogOpen(true)
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate student reports and export data for parent communication
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-48">
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
          <Button onClick={generateReport} disabled={!selectedStudent || loading}>
            <FileText className="mr-2 h-4 w-4" />
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Student Progress Reports
            </CardTitle>
            <CardDescription>Per-student PDF reports in English and Chinese</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">• Homework completion rates</div>
              <div className="text-sm text-muted-foreground">• Grammar error tracking</div>
              <div className="text-sm text-muted-foreground">• Teacher comments and feedback</div>
              <div className="text-sm text-muted-foreground">• Test scores and progress</div>
            </div>
            <div className="mt-4 space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Export
            </CardTitle>
            <CardDescription>Export your data for backup or external systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                • CSV export for ManageBac integration
              </div>
              <div className="text-sm text-muted-foreground">• Complete database backup</div>
              <div className="text-sm text-muted-foreground">• Custom date range exports</div>
              <div className="text-sm text-muted-foreground">• Individual student data</div>
            </div>
            <div className="mt-4 space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                CSV Export
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Full Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>Select a student to generate their progress report</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <User className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No students added yet. Add students first to generate reports.
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {students.map((student) => (
                <Card
                  key={student.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedStudent(student.id.toString())}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.class}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Progress Report</DialogTitle>
            <DialogDescription>
              Comprehensive report showing homework, tests, grammar progress, and comments
            </DialogDescription>
          </DialogHeader>
          {reportData && <StudentReport reportData={reportData} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
