'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FileText, Copy, Download, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface WorksheetContent {
  title: string
  instructions: string
  gapFills: string[]
  corrections: string[]
  sentences: string[]
}

const grammarTopics = [
  { value: 'articles', label: 'Articles (a, an, the)' },
  { value: 'tenses', label: 'Verb Tenses' },
  { value: 'subject-verb', label: 'Subject-Verb Agreement' },
  { value: 'prepositions', label: 'Prepositions' },
  { value: 'word-order', label: 'Word Order' },
  { value: 'plurals', label: 'Plurals' },
  { value: 'pronouns', label: 'Pronouns' },
  { value: 'comparatives', label: 'Comparatives & Superlatives' }
]

const worksheetTemplates: Record<string, WorksheetContent> = {
  articles: {
    title: 'Articles Practice Worksheet',
    instructions:
      'Fill in the blanks with the correct article (a, an, the) or leave blank if no article is needed.',
    gapFills: [
      'I saw ____ elephant at ____ zoo yesterday.',
      'She is ____ university student studying ____ English literature.',
      '____ Sun rises in ____ east and sets in ____ west.',
      'He bought ____ apple and ____ orange from ____ market.',
      'Can you play ____ piano? I can play ____ guitar.'
    ],
    corrections: [
      'I need a help with my homework. (Remove "a")',
      'She is a best student in a class. (Change to "the")',
      'I went to a university to meet the professor. (Change to "the")',
      'The cats are cute animals. (Remove "the" before "cats")',
      'I love a music very much. (Remove "a")'
    ],
    sentences: [
      'Write about your favorite animal using articles correctly',
      'Describe your school day using at least 5 articles',
      'Tell me about your family members with correct article usage'
    ]
  },
  tenses: {
    title: 'Verb Tenses Practice Worksheet',
    instructions: 'Complete the sentences with the correct form of the verb in brackets.',
    gapFills: [
      'I _______ (go) to school every day.',
      'She _______ (study) English yesterday.',
      'They _______ (play) football now.',
      'We _______ (visit) London next summer.',
      'He _______ (finish) his homework already.'
    ],
    corrections: [
      'I am go to school every day. (Change to "go")',
      'She study English yesterday. (Change to "studied")',
      'They are play football now. (Change to "playing")',
      'We will visiting London next summer. (Change to "visit")',
      'He has finish his homework. (Change to "finished")'
    ],
    sentences: [
      'Write about what you did last weekend (past tense)',
      'Describe your daily routine (present tense)',
      'Tell me about your plans for tomorrow (future tense)'
    ]
  },
  'subject-verb': {
    title: 'Subject-Verb Agreement Practice',
    instructions: 'Choose the correct verb form that agrees with the subject.',
    gapFills: [
      'The cat _______ (sleep/sleeps) on the sofa.',
      'My friends _______ (is/are) very kind.',
      'Each student _______ (have/has) a textbook.',
      'The team _______ (play/plays) well together.',
      'Neither Tom nor his brothers _______ (like/likes) vegetables.'
    ],
    corrections: [
      'The dogs is playing in the park. (Change to "are")',
      'She don\'t like chocolate. (Change to "doesn\'t")',
      'My family are very supportive. (Change to "is")',
      'Each of the students have a laptop. (Change to "has")',
      'The information are very useful. (Change to "is")'
    ],
    sentences: [
      'Write about your family making sure verbs agree with subjects',
      'Describe your classroom using correct subject-verb agreement',
      'Tell me about your hobbies with proper verb forms'
    ]
  },
  prepositions: {
    title: 'Prepositions Practice Worksheet',
    instructions: 'Fill in the blanks with the correct preposition.',
    gapFills: [
      'I live _______ Beijing _______ China.',
      'The book is _______ the table _______ the lamp.',
      'We have English class _______ Monday _______ 9 AM.',
      'She walked _______ the park _______ her dog.',
      "The meeting is _______ three o'clock _______ the afternoon."
    ],
    corrections: [
      'I am good in English. (Change to "at")',
      'She arrived to school late. (Change to "at")',
      'We depend of our parents. (Change to "on")',
      'He is interested about music. (Change to "in")',
      'They live at Beijing. (Change to "in")'
    ],
    sentences: [
      'Describe your journey to school using prepositions of place',
      'Write about your daily schedule using prepositions of time',
      'Tell me about your room using prepositions of location'
    ]
  }
}

export function GrammarWorksheetGenerator() {
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [generatedWorksheet, setGeneratedWorksheet] = useState<string>('')
  const [showInstructions, setShowInstructions] = useState(false)

  const generateWorksheet = () => {
    if (!selectedTopic) return

    const template = worksheetTemplates[selectedTopic]
    if (!template) return

    const worksheet = `# ${template.title}

**Name:** _____________________________ **Date:** _______________ **Class:** ___________

---

## Instructions
${template.instructions}

---

## Part A: Gap Fill Exercises
*Fill in the blanks with the correct answers.*

${template.gapFills
  .map(
    (item, index) =>
      `${index + 1}. ${item}

   _______________________________________________
`
  )
  .join('\n')}

---

## Part B: Error Correction
*Find and correct the mistakes in these sentences.*

${template.corrections
  .map(
    (item, index) =>
      `${index + 1}. ${item.split(' (')[0]}

   **Correction:** ___________________________________
`
  )
  .join('\n')}

---

## Part C: Sentence Writing
*Write complete sentences following the instructions.*

${template.sentences
  .map(
    (prompt, index) =>
      `${index + 1}. ${prompt}

   _______________________________________________
   
   _______________________________________________
   
   _______________________________________________
`
  )
  .join('\n')}

---

## Teacher Notes
- **Topic Focus:** ${grammarTopics.find((t) => t.value === selectedTopic)?.label}
- **Recommended Time:** 30-45 minutes
- **Difficulty Level:** Intermediate
- **Follow-up Activities:** Review answers as a class, create additional examples

---

*Generated with ChinaProf - Teacher Productivity App*`

    setGeneratedWorksheet(worksheet)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedWorksheet)
      alert('Worksheet copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadAsMarkdown = () => {
    const blob = new Blob([generatedWorksheet], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedTopic}-grammar-worksheet.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Grammar Worksheet Generator
          </CardTitle>
          <CardDescription>
            Generate targeted grammar worksheets with gap fills, corrections, and writing exercises.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grammar-topic">Select Grammar Topic</Label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a grammar topic..." />
              </SelectTrigger>
              <SelectContent>
                {grammarTopics.map((topic) => (
                  <SelectItem key={topic.value} value={topic.value}>
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={generateWorksheet} disabled={!selectedTopic}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Worksheet
            </Button>
            <Button variant="outline" onClick={() => setShowInstructions(!showInstructions)}>
              <Info className="h-4 w-4 mr-2" />
              How to Use
            </Button>
          </div>

          {showInstructions && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>How to use the generated worksheet:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Click "Generate Worksheet" to create a grammar exercise</li>
                  <li>Copy the markdown text and paste it into any document editor</li>
                  <li>Or download as a .md file and convert to PDF using online tools</li>
                  <li>Print or share digitally with students</li>
                  <li>The worksheet includes dotted lines for handwritten answers</li>
                </ol>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {generatedWorksheet && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Generated Worksheet</CardTitle>
                <CardDescription>Copy this markdown text or download as a file</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-accent/20">
                  {grammarTopics.find((t) => t.value === selectedTopic)?.label}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button onClick={downloadAsMarkdown} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download .md File
              </Button>
            </div>

            <div className="relative">
              <Textarea
                value={generatedWorksheet}
                readOnly
                className="min-h-[400px] font-mono text-sm"
                placeholder="Generated worksheet will appear here..."
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
