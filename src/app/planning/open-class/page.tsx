'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList, Eye, FileText } from 'lucide-react'

export default function OpenClassPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-8 w-8 text-primary" />
          Open Class Planning
        </h1>
        <p className="text-muted-foreground">
          Prepare for open class demonstrations and observations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/30 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Lesson Preparation</CardTitle>
                <CardDescription className="text-sm">Coming Soon</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Plan detailed lesson structures for demonstration classes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/30 rounded-lg">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Observation Feedback</CardTitle>
                <CardDescription className="text-sm">Coming Soon</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Collect and analyze feedback from class observations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/30 rounded-lg">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Resource Management</CardTitle>
                <CardDescription className="text-sm">Coming Soon</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Organize materials and resources for demonstration lessons.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
