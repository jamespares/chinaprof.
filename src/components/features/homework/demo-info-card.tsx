'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, Users, Calendar, TrendingUp } from 'lucide-react'

export function DemoInfoCard() {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Info className="h-5 w-5" />
          Demo Data Information
        </CardTitle>
        <CardDescription className="text-blue-800">
          Click "Add Demo Data" to populate the homework tracker with realistic test data
        </CardDescription>
      </CardHeader>
      <CardContent className="text-blue-900">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">Creates 3 demo students if none exist</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Adds current week homework data</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Shows different completion patterns</span>
          </div>
        </div>
        <div className="mt-3 text-sm">
          <strong>Test the RAG Grid:</strong> Click on individual cells to toggle completion status.
          Click date headers to bulk update entire days. The "Wipe Data" button will appear after
          adding demo data.
        </div>
      </CardContent>
    </Card>
  )
}
