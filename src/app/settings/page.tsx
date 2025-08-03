'use client'

import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useTheme } from '@/lib/theme-provider'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  Palette,
  Monitor,
  Database,
  Bell,
  Shield,
  Download,
  Trash2,
  RefreshCw,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Eye,
  EyeOff
} from 'lucide-react'

export default function SettingsPage() {
  const { i18n, t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [langLabel, setLangLabel] = useState(i18n.language === 'zh' ? '中文' : 'EN')
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [dataPrivacy, setDataPrivacy] = useState(true)
  const [compactView, setCompactView] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedNotifications = localStorage.getItem('notifications') !== 'false'
    const savedAutoSave = localStorage.getItem('autoSave') !== 'false'
    const savedDataPrivacy = localStorage.getItem('dataPrivacy') !== 'false'
    const savedCompactView = localStorage.getItem('compactView') === 'true'
    const savedShowPreview = localStorage.getItem('showPreview') !== 'false'

    setNotifications(savedNotifications)
    setAutoSave(savedAutoSave)
    setDataPrivacy(savedDataPrivacy)
    setCompactView(savedCompactView)
    setShowPreview(savedShowPreview)
  }, [])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh'
    const newLabel = newLang === 'zh' ? '中文' : 'EN'
    i18n.changeLanguage(newLang)
    localStorage.setItem('i18nextLng', newLang)
    setLangLabel(newLabel)
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
  }

  const handleSettingChange = (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotifications(value)
        localStorage.setItem('notifications', value.toString())
        break
      case 'autoSave':
        setAutoSave(value)
        localStorage.setItem('autoSave', value.toString())
        break
      case 'dataPrivacy':
        setDataPrivacy(value)
        localStorage.setItem('dataPrivacy', value.toString())
        break
      case 'compactView':
        setCompactView(value)
        localStorage.setItem('compactView', value.toString())
        break
      case 'showPreview':
        setShowPreview(value)
        localStorage.setItem('showPreview', value.toString())
        break
    }
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all application data? This cannot be undone.')) {
      // This would typically call an API to clear the database
      console.log('Clearing all data...')
    }
  }

  const exportData = () => {
    // This would typically call an API to export data
    console.log('Exporting data...')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Configure your ChinaProf experience with personalized preferences and settings.
        </p>
      </div>

      {/* Appearance Settings */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of your interface.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Theme</Label>
              <p className="text-xs text-muted-foreground">Choose your preferred color scheme</p>
            </div>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Compact View */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Compact View</Label>
              <p className="text-xs text-muted-foreground">Reduce spacing and show more content</p>
            </div>
            <Switch
              checked={compactView}
              onCheckedChange={(value) => handleSettingChange('compactView', value)}
            />
          </div>

          {/* Show Preview */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Show Preview</Label>
              <p className="text-xs text-muted-foreground">Display preview cards and thumbnails</p>
            </div>
            <Switch
              checked={showPreview}
              onCheckedChange={(value) => handleSettingChange('showPreview', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Language & Region
          </CardTitle>
          <CardDescription>Set your preferred language and regional settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Interface Language</Label>
              <p className="text-xs text-muted-foreground">
                Currently using: <Badge variant="outline">{langLabel}</Badge>
              </p>
            </div>
            <Button onClick={toggleLanguage} variant="outline" className="hover:bg-accent">
              Switch to {langLabel === 'EN' ? '中文' : 'English'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Data & Privacy
          </CardTitle>
          <CardDescription>Control how your data is stored and managed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Auto Save</Label>
              <p className="text-xs text-muted-foreground">
                Automatically save changes as you work
              </p>
            </div>
            <Switch
              checked={autoSave}
              onCheckedChange={(value) => handleSettingChange('autoSave', value)}
            />
          </div>

          {/* Data Privacy */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Local Storage Only</Label>
              <p className="text-xs text-muted-foreground">
                Keep all data stored locally on your device
              </p>
            </div>
            <Switch
              checked={dataPrivacy}
              onCheckedChange={(value) => handleSettingChange('dataPrivacy', value)}
            />
          </div>

          <Separator />

          {/* Data Management */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Data Management</Label>
            <div className="flex gap-3">
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button
                onClick={clearAllData}
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Manage how you receive updates and alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Notifications</Label>
              <p className="text-xs text-muted-foreground">Show system notifications and alerts</p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={(value) => handleSettingChange('notifications', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            System Information
          </CardTitle>
          <CardDescription>Application details and database status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Version</Label>
              <p className="font-medium">ChinaProf v0.1.0</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Database</Label>
              <div className="font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                SQLite (Local)
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Last Backup</Label>
              <p className="font-medium">Never</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Storage Used</Label>
              <p className="font-medium">~2.1 MB</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh System Status
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
