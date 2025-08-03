'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { StudentAvatar } from './student-avatar'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarPickerProps {
  currentAvatar?: string | null
  studentName: string
  onAvatarChange: (avatarUrl: string | null) => void
  className?: string
}

// Stock avatar options (you'll add these images to public/avatars/stock/)
const STOCK_AVATARS = [
  '/avatars/stock/student-1.png',
  '/avatars/stock/student-2.png',
  '/avatars/stock/student-3.png',
  '/avatars/stock/student-4.png',
  '/avatars/stock/student-5.png',
  '/avatars/stock/student-6.png',
  '/avatars/stock/student-7.png',
  '/avatars/stock/student-8.png'
]

export function AvatarPicker({
  currentAvatar,
  studentName,
  onAvatarChange,
  className
}: AvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleStockSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl)
    onAvatarChange(avatarUrl)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file)
    setSelectedAvatar(objectUrl)
    onAvatarChange(objectUrl)

    // TODO: In a real app, you'd upload this to a server
    // For now, we're just using the object URL
  }

  const handleRemoveAvatar = () => {
    setSelectedAvatar(null)
    onAvatarChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Current Avatar Preview */}
      <div className="flex items-center gap-3">
        <StudentAvatar student={{ name: studentName, avatar_url: selectedAvatar }} size="xl" />
        <div>
          <Label className="text-sm font-medium">Current Avatar</Label>
          <p className="text-xs text-muted-foreground">
            {selectedAvatar ? 'Custom avatar selected' : 'Using initials'}
          </p>
        </div>
        {selectedAvatar && (
          <Button variant="outline" size="sm" onClick={handleRemoveAvatar} className="ml-auto">
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      {/* Stock Avatars */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Choose from stock avatars</Label>
        <div className="grid grid-cols-4 gap-2">
          {STOCK_AVATARS.map((avatarUrl, index) => (
            <button
              key={index}
              onClick={() => handleStockSelect(avatarUrl)}
              className={cn(
                'p-2 rounded-lg border-2 transition-colors hover:bg-muted',
                selectedAvatar === avatarUrl ? 'border-primary bg-primary/10' : 'border-border'
              )}
            >
              <StudentAvatar
                student={{ name: studentName, avatar_url: avatarUrl }}
                size="lg"
                className="mx-auto"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Custom Upload */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Or upload custom image</Label>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG up to 2MB. Images will be cropped to square.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
