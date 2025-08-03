'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Mic, Users } from 'lucide-react'

export default function AssemblyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          Assembly Planning
        </h1>
        <p className="text-muted-foreground">
          Plan and organize school assemblies and presentations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/30 rounded-lg">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Presentation Content</CardTitle>
                <CardDescription className="text-sm">Coming Soon</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create and organize content for school assembly presentations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/30 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Student Participation</CardTitle>
                <CardDescription className="text-sm">Coming Soon</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Plan student involvement and participation in assemblies.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/30 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Event Coordination</CardTitle>
                <CardDescription className="text-sm">Coming Soon</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coordinate timing, logistics, and resources for assembly events.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
