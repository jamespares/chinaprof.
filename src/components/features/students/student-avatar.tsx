'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface StudentAvatarProps {
  student: {
    name: string
    avatar_url?: string | null
  }
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
  xl: 'h-16 w-16 text-lg'
}

export function StudentAvatar({ student, size = 'md', className }: StudentAvatarProps) {
  // Get initials from name (first letter of first and last name)
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {student.avatar_url && (
        <AvatarImage src={student.avatar_url} alt={`${student.name}'s avatar`} />
      )}
      <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
        {getInitials(student.name)}
      </AvatarFallback>
    </Avatar>
  )
}
