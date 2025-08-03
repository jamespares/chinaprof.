'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MoreHorizontal, Edit, Trash2, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { Student } from '@/lib/types/database'

interface StudentsTableProps {
  students: Student[]
  onEditStudent: (student: Student) => void
  onDeleteStudent: (studentId: number) => void
}

export function StudentsTable({ students, onEditStudent, onDeleteStudent }: StudentsTableProps) {
  // Get homework completion stats for a student
  const getHomeworkStats = async (studentId: number) => {
    try {
      const response = await fetch(`/api/students/${studentId}/stats`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to get homework stats:', error)
    }
    return { homeworkCompletion: 0, testCompletion: 0 }
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Roster
          </CardTitle>
          <CardDescription>Your current students will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No students yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started by adding your first student to begin tracking their progress.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Student Roster
        </CardTitle>
        <CardDescription>
          {students.length} student{students.length !== 1 ? 's' : ''} in your classes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Homework Rate</TableHead>
              <TableHead>Test Rate</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-accent-text">
                    {student.class}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      --% {/* TODO: Calculate homework completion */}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                      --% {/* TODO: Calculate test completion */}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditStudent(student)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit student
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteStudent(student.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
