'use client'

import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ColorToggle } from '@/components/ui/color-toggle'
import { Globe } from 'lucide-react'
import '@/lib/i18n'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState<'EN' | '中文'>(i18n.language === 'zh' ? '中文' : 'EN')

  const toggleLanguage = () => {
    const newLang = language === 'EN' ? 'zh' : 'en'
    const newLabel = language === 'EN' ? '中文' : 'EN'

    i18n.changeLanguage(newLang)
    setLanguage(newLabel)

    // Save preference to localStorage
    localStorage.setItem('i18nextLng', newLang)
  }

  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header with sidebar toggle */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-8">
              <SidebarTrigger className="mr-6 -ml-2" />
              <div className="flex flex-1 items-center justify-end">
                <div className="flex items-center gap-4 pr-2">
                  {/* Connection Status */}
                  <div className="hidden sm:flex items-center text-xs text-muted-foreground bg-accent/20 px-2 py-1 rounded-full border border-accent/30">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
                    {t('language.connected')}
                  </div>

                  {/* Language Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLanguage}
                    className="h-9 px-3 text-xs hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    {language}
                  </Button>

                  {/* Color Toggle */}
                  <ColorToggle />

                  {/* Theme Toggle */}
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 py-6 px-8">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  )
}
