'use client'

import * as React from 'react'
import {
  Settings as SettingsIcon
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

// Reorganized menu structure with teacher-focused categories
const menuSections = [
  {
    key: 'overview',
    items: [
      {
        key: 'dashboard',
        url: '/dashboard'
      }
    ]
  },
  {
    key: 'manage',
    items: [
      {
        key: 'allStudents',
        url: '/students'
      },
      {
        key: 'myClasses',
        url: '/classes'
      },
      {
        key: 'mySubjects',
        url: '/subjects'
      }
    ]
  },
  {
    key: 'analysis',
    items: [
      {
        key: 'homework',
        url: '/homework'
      },
      {
        key: 'weeklySpellingTest',
        url: '/weekly-tests'
      },
      {
        key: 'essayMarking',
        url: '/essay-marking'
      },
      {
        key: 'grammar',
        url: '/grammar-errors'
      }
    ]
  },
  {
    key: 'planning',
    items: [
      {
        key: 'lessonPlans',
        url: '/lesson-plans'
      },
      {
        key: 'parentsEvening',
        url: '/planning/parents-evening'
      },
      {
        key: 'openClass',
        url: '/planning/open-class'
      },
      {
        key: 'assembly',
        url: '/planning/assembly'
      },
      {
        key: 'meetings',
        url: '/planning/meetings'
      }
    ]
  },
  {
    key: 'summary',
    items: [
      {
        key: 'reports',
        url: '/reports'
      }
    ]
  }
]

export function AppSidebar() {
  const { t } = useTranslation()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent className="no-scrollbar">
        {/* Navigation Sections */}
        {menuSections.map((section, index) => (
          <SidebarGroup key={section.key} className={index === 0 ? 'mt-6' : ''}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t(`navigation.sections.${section.key}`)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => {
                  const colorTheme = 'hover:bg-accent hover:text-accent-foreground'

                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${colorTheme}`}
                        >
                          <span>{t(`navigation.${item.key}`)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Settings Section */}
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/settings"
                    className="flex items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <span>{t('navigation.settings')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="text-xs text-muted-foreground text-center py-2 mt-2">
              ChinaProf v0.1.0
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
