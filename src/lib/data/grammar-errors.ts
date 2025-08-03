// Common Chinese-English (CN-ESL) grammar errors
// Based on typical patterns Chinese learners make when learning English

export const COMMON_GRAMMAR_ERRORS = [
  // Article Errors
  { code: 'ART-001', error: 'Missing article', example: 'I have cat' },
  { code: 'ART-002', error: 'Wrong article (a/an)', example: 'I saw a elephant' },
  { code: 'ART-003', error: 'Unnecessary article', example: 'I like the music' },

  // Verb Tense Errors
  {
    code: 'TENSE-001',
    error: 'Simple past vs present perfect',
    example: 'I have seen him yesterday'
  },
  {
    code: 'TENSE-002',
    error: 'Present tense for past action',
    example: 'Yesterday I go to school'
  },
  { code: 'TENSE-003', error: 'Missing auxiliary verb', example: 'I not understand' },
  { code: 'TENSE-004', error: 'Double past tense', example: "I didn't went" },

  // Subject-Verb Agreement
  { code: 'SVA-001', error: 'Singular/plural mismatch', example: 'He have three books' },
  { code: 'SVA-002', error: "Missing 's' in 3rd person", example: 'She walk to school' },

  // Preposition Errors
  { code: 'PREP-001', error: 'Wrong preposition', example: 'Listen music' },
  { code: 'PREP-002', error: 'Missing preposition', example: 'I live Beijing' },
  { code: 'PREP-003', error: 'Extra preposition', example: 'Discuss about the topic' },

  // Word Order
  { code: 'WO-001', error: 'Adjective after noun', example: 'I have a car red' },
  { code: 'WO-002', error: 'Adverb position', example: 'I very like apples' },
  { code: 'WO-003', error: 'Question word order', example: 'You are from where?' },

  // Plurals
  { code: 'PLURAL-001', error: "Missing plural 's'", example: 'I have two book' },
  { code: 'PLURAL-002', error: 'Wrong plural form', example: 'Many sheeps' },

  // Pronouns
  { code: 'PRON-001', error: 'Wrong pronoun case', example: 'Me and my friend went' },
  { code: 'PRON-002', error: 'Missing pronoun', example: 'Is very hot today' },

  // Comparatives
  { code: 'COMP-001', error: 'Double comparative', example: 'More better than before' },
  { code: 'COMP-002', error: 'Wrong comparative form', example: 'More good than yesterday' },

  // Countable/Uncountable
  { code: 'COUNT-001', error: 'Wrong quantifier', example: 'Many water' },
  { code: 'COUNT-002', error: 'Plural uncountable noun', example: 'I need some advices' },

  // Modal Verbs
  { code: 'MODAL-001', error: 'Double modal', example: 'I will can do it' },
  { code: 'MODAL-002', error: 'Modal + infinitive', example: 'I can to swim' },

  // Gerund/Infinitive
  { code: 'GERUND-001', error: 'Wrong form after verb', example: 'I enjoy to read' },
  { code: 'GERUND-002', error: 'Wrong form after preposition', example: 'Good at play piano' },

  // Common Direct Translations
  { code: 'TRANS-001', error: 'Direct translation', example: 'Open the light' },
  { code: 'TRANS-002', error: 'Chinese word order', example: 'I today very busy' },
  { code: 'TRANS-003', error: "Missing copula 'be'", example: 'This book very interesting' }
] as const

export type GrammarErrorCode = (typeof COMMON_GRAMMAR_ERRORS)[number]['code']

export const getErrorByCode = (code: string) => {
  return COMMON_GRAMMAR_ERRORS.find((error) => error.code === code)
}

export const getErrorsByCategory = () => {
  const categories = {
    Articles: COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('ART')),
    'Verb Tenses': COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('TENSE')),
    'Subject-Verb Agreement': COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('SVA')),
    Prepositions: COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('PREP')),
    'Word Order': COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('WO')),
    Plurals: COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('PLURAL')),
    Pronouns: COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('PRON')),
    Comparatives: COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('COMP')),
    'Countable/Uncountable': COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('COUNT')),
    'Modal Verbs': COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('MODAL')),
    'Gerund/Infinitive': COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('GERUND')),
    'Direct Translation': COMMON_GRAMMAR_ERRORS.filter((e) => e.code.startsWith('TRANS'))
  }
  return categories
}
