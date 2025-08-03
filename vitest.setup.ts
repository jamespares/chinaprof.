import { vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

// Make React available globally for JSX in tests
global.React = React

// Stub window.matchMedia for tests
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () =>
    ({
      matches: false,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    }) as unknown as MediaQueryList
}

// Mock translations so components using react-i18next don't blow up
vi.mock('react-i18next', () => {
  // Create a simple translation map based on the English locale
  const translations: Record<string, string> = {
    'navigation.dashboard': 'Dashboard',
    'navigation.allStudents': 'Students',
    'navigation.myClasses': 'My Classes',
    'navigation.mySubjects': 'My Subjects',
    'navigation.homework': 'Homework',
    'navigation.weeklySpellingTest': 'Weekly Spelling Test',
    'navigation.essayMarking': 'Essay Marking',
    'navigation.grammar': 'Grammar',
    'navigation.lessonPlans': 'Lesson Plans',
    'navigation.parentsEvening': 'Parents Evening',
    'navigation.openClass': 'Open Class',
    'navigation.assembly': 'Assembly',
    'navigation.meetings': 'Meetings',
    'navigation.reports': 'Reports',
    'navigation.settings': 'Settings',
    'navigation.sections.overview': 'Overview',
    'navigation.sections.manage': 'Manage',
    'navigation.sections.analysis': 'Analysis',
    'navigation.sections.planning': 'Planning',
    'navigation.sections.summary': 'Summary'
  }

  return {
    useTranslation: () => ({
      t: (key: string) => translations[key] || key,
      i18n: {
        language: 'en',
        changeLanguage: () => Promise.resolve()
      }
    })
  }
})
