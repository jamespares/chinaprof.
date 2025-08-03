'use client'

import { useState, useEffect } from 'react'
import { AddStudentDialog } from '@/components/features/students/add-student-dialog'
import { StudentsTable } from '@/components/features/students/students-table'
import { StudentsAPI } from '@/lib/api/students'
import type { Student } from '@/lib/types/database'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  // Load students on component mount
  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const studentsData = await StudentsAPI.getAll()
      setStudents(studentsData)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load students:', error)
      setLoading(false)
    }
  }

  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      const newStudent = await StudentsAPI.create(studentData)
      setStudents((prev) => [...prev, newStudent])

      console.log('Student added:', newStudent)
    } catch (error) {
      console.error('Failed to add student:', error)
      // TODO: Show error message to user
    }
  }

  const handleEditStudent = (student: Student) => {
    console.log('Edit student:', student)
    // TODO: Implement edit functionality
  }

  const handleDeleteStudent = async (studentId: number) => {
    try {
      await StudentsAPI.delete(studentId)
      setStudents((prev) => prev.filter((s) => s.id !== studentId))

      console.log('Student deleted:', studentId)
    } catch (error) {
      console.error('Failed to delete student:', error)
      // TODO: Show error message to user
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">My Students</h1>
            <p className="text-muted-foreground">
              Manage your student roster and track their progress
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-sm text-muted-foreground">Loading students...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Students</h1>
          <p className="text-muted-foreground">
            Manage your student roster and track their progress
          </p>
        </div>
        <AddStudentDialog onStudentAdded={handleAddStudent} />
      </div>

      <StudentsTable
        students={students}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
      />
    </div>
  )
}
