'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Palette } from 'lucide-react'

type ColorTheme = 'lavender' | 'sky-blue' | 'military-green' | 'soft-orange' | 'china-red'

interface ThemeColors {
  primary: string
  accent: string
  ring: string
  glassGradientStart: string
  glassGradientEnd: string
  glassBorder: string
}

const colorThemes: Record<ColorTheme, ThemeColors> = {
  'lavender': {
    primary: '280 60% 75%',
    accent: '285 55% 85%',
    ring: '280 60% 75%',
    glassGradientStart: '280 60% 75%',
    glassGradientEnd: '285 55% 78%',
    glassBorder: '280 60% 80%'
  },
  'sky-blue': {
    primary: '213 94% 68%',
    accent: '212 100% 87%',
    ring: '213 94% 68%',
    glassGradientStart: '213 94% 68%',
    glassGradientEnd: '213 94% 72%',
    glassBorder: '213 94% 75%'
  },
  'military-green': {
    primary: '120 25% 45%',
    accent: '120 30% 75%',
    ring: '120 25% 45%',
    glassGradientStart: '120 25% 45%',
    glassGradientEnd: '125 30% 50%',
    glassBorder: '120 30% 55%'
  },
  'soft-orange': {
    primary: '25 85% 65%',
    accent: '30 80% 80%',
    ring: '25 85% 65%',
    glassGradientStart: '25 85% 65%',
    glassGradientEnd: '30 80% 70%',
    glassBorder: '25 80% 75%'
  },
  'china-red': {
    primary: '0 84% 60%',
    accent: '0 70% 85%',
    ring: '0 84% 60%',
    glassGradientStart: '0 84% 60%',
    glassGradientEnd: '5 80% 65%',
    glassBorder: '0 80% 70%'
  }
}

const themeNames: Record<ColorTheme, string> = {
  'lavender': 'Lavender',
  'sky-blue': 'Sky Blue',
  'military-green': 'Military Green',
  'soft-orange': 'Soft Orange',
  'china-red': 'China Red'
}

const themeColors: Record<ColorTheme, string> = {
  'lavender': '#C084FC',
  'sky-blue': '#60A5FA', 
  'military-green': '#6B8E23',
  'soft-orange': '#FB923C',
  'china-red': '#E53E3E'
}

export function ColorToggle() {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>('lavender')

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('color-theme') as ColorTheme
    if (savedTheme && colorThemes[savedTheme]) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (theme: ColorTheme) => {
    const colors = colorThemes[theme]
    const root = document.documentElement

    // Update CSS custom properties for ALL button variants
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--accent', colors.accent)
    root.style.setProperty('--ring', colors.ring)
    root.style.setProperty('--sidebar-primary', colors.primary)
    root.style.setProperty('--sidebar-ring', colors.ring)

    // Update glass button gradients and ALL other button styles
    const allButtonStyles = `
      /* Glass buttons - light mode */
      .glass-button, .btn-accent {
        background: linear-gradient(
          135deg,
          hsla(${colors.glassGradientStart} / 0.9) 0%,
          hsla(${colors.glassGradientEnd} / 0.8) 100%
        ) !important;
        border: 1px solid hsla(${colors.glassBorder} / 0.3) !important;
      }
      
      .glass-button:hover, .btn-accent:hover {
        background: linear-gradient(
          135deg,
          hsla(${colors.glassGradientStart} / 0.95) 0%,
          hsla(${colors.glassGradientEnd} / 0.9) 100%
        ) !important;
      }
      
      /* Glass buttons - dark mode */
      .dark .glass-button, .dark .btn-accent {
        background: linear-gradient(
          135deg,
          hsla(${colors.glassGradientStart} / 0.7) 0%,
          hsla(${colors.glassGradientEnd} / 0.6) 100%
        ) !important;
        border: 1px solid hsla(${colors.glassBorder} / 0.4) !important;
      }
      
      .dark .glass-button:hover, .dark .btn-accent:hover {
        background: linear-gradient(
          135deg,
          hsla(${colors.glassGradientStart} / 0.8) 0%,
          hsla(${colors.glassGradientEnd} / 0.7) 100%
        ) !important;
      }
      
      /* Default variant buttons */
      .bg-primary {
        background-color: hsl(${colors.primary}) !important;
      }
      
      .bg-primary:hover {
        background-color: hsl(${colors.primary} / 0.9) !important;
      }
      
      /* Dark mode adjustments for default buttons */
      .dark .bg-primary {
        background-color: hsl(${colors.primary} / 0.8) !important;
      }
      
      .dark .bg-primary:hover {
        background-color: hsl(${colors.primary} / 0.9) !important;
      }
      
      /* Any other primary colored elements */
      .text-primary {
        color: hsl(${colors.primary}) !important;
      }
      
      .border-primary {
        border-color: hsl(${colors.primary}) !important;
      }
      
      .border-l-primary {
        border-left-color: hsl(${colors.primary}) !important;
      }
    `

    // Remove existing dynamic styles
    const existingStyle = document.getElementById('dynamic-theme-styles')
    if (existingStyle) {
      existingStyle.remove()
    }

    // Add new dynamic styles
    const styleElement = document.createElement('style')
    styleElement.id = 'dynamic-theme-styles'
    styleElement.textContent = allButtonStyles
    document.head.appendChild(styleElement)
  }

  const selectTheme = (theme: ColorTheme) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    localStorage.setItem('color-theme', theme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => selectTheme('lavender')}>
          <div 
            className="mr-2 h-4 w-4 rounded border" 
            style={{ backgroundColor: themeColors.lavender }}
          />
          <span>Lavender</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => selectTheme('sky-blue')}>
          <div 
            className="mr-2 h-4 w-4 rounded border" 
            style={{ backgroundColor: themeColors['sky-blue'] }}
          />
          <span>Sky Blue</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => selectTheme('military-green')}>
          <div 
            className="mr-2 h-4 w-4 rounded border" 
            style={{ backgroundColor: themeColors['military-green'] }}
          />
          <span>Military Green</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => selectTheme('soft-orange')}>
          <div 
            className="mr-2 h-4 w-4 rounded border" 
            style={{ backgroundColor: themeColors['soft-orange'] }}
          />
          <span>Soft Orange</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => selectTheme('china-red')}>
          <div 
            className="mr-2 h-4 w-4 rounded border" 
            style={{ backgroundColor: themeColors['china-red'] }}
          />
          <span>China Red</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}