#!/usr/bin/env node
/*
  ChinaProf Test Data Manager
  Usage:
    node scripts/test-data-manager.js seed   # populate DB with rich test data
    node scripts/test-data-manager.js clear  # wipe ALL data inserted by this script

  The script works directly with the SQLite database used by the app (chinaprof.db).
  It recreates the schema if the file is missing, then populates realistic data so that
  the UI components have something substantial to render.

  NOTE: `clear` will DELETE *all* rows from user-facing tables (students, homework, tests, etc.).
        Use with caution on a development database only.
*/

const fs = require('fs')
const path = require('path')
const Database = require('better-sqlite3')

// ---------- helpers ---------------------------------------------------------
function log(msg) {
  console.log(msg) // small wrapper for future enhancements
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function daysAgo(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

// ---------- database bootstrap ---------------------------------------------
function initDatabase() {
  const dbPath = path.join(process.cwd(), 'chinaprof.db')
  const db = new Database(dbPath)
  db.pragma('foreign_keys = ON')

  const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql')
  const schemaSql = fs.readFileSync(schemaPath, 'utf8')
  db.exec(schemaSql)
  return db
}

// ---------- data generation -------------------------------------------------
function seed(db) {
  log('🌱 Seeding database with test data...')

  // 1. Subjects (only insert if table empty)
  const subjectCount = db.prepare('SELECT COUNT(*) AS c FROM subjects').get().c
  let subjectIds = []
  if (subjectCount === 0) {
    log('📚 Inserting subjects')
    const subjects = ['English Writing', 'English Speaking', 'English Reading', 'English Grammar']
    const stmt = db.prepare('INSERT INTO subjects (name) VALUES (?)')
    const insertMany = db.transaction(() => {
      subjects.forEach((name) => {
        const id = stmt.run(name).lastInsertRowid
        subjectIds.push(id)
      })
    })
    insertMany()
  } else {
    subjectIds = db
      .prepare('SELECT id FROM subjects')
      .all()
      .map((r) => r.id)
  }

  // 2. Students (we always add – wipe existing first to keep totals consistent)
  db.prepare('DELETE FROM students').run()

  const names = [
    'Li Wei',
    'Wang Mei',
    'Zhang Jun',
    'Chen Ling',
    'Liu Xiao',
    'Yang Fei',
    'Wu Han',
    'Zhou Yun',
    'Xu Ming',
    'Ma Lin',
    'Sun Hao',
    'Gao Ran',
    'Deng Jie',
    'He Ping',
    'Qian Lei',
    'Guo Hui',
    'Fan Yi',
    'Peng Tao',
    'Xiao Chen',
    'Tang Yue',
    'Du Rui',
    'Shen Min',
    'Yan Jie',
    'Cai Feng',
    'Lin Qiao'
  ]

  const classes = ['Grade 7A', 'Grade 7B', 'Grade 8A', 'Grade 8B', 'Grade 9A']
  const insertStudent = db.prepare('INSERT INTO students (name, class, dob) VALUES (?, ?, ?)')

  const studentIds = []
  const insertStudentsTxn = db.transaction(() => {
    names.slice(0, 25).forEach((name) => {
      const dobYear = randomInt(2008, 2011)
      const dobMonth = String(randomInt(1, 12)).padStart(2, '0')
      const dobDay = String(randomInt(1, 28)).padStart(2, '0')
      const dob = `${dobYear}-${dobMonth}-${dobDay}`
      const cls = randomChoice(classes)
      const id = insertStudent.run(name, cls, dob).lastInsertRowid
      studentIds.push(id)
    })
  })
  insertStudentsTxn()
  log(`👥 Inserted ${studentIds.length} students`)

  // 3. Homework behaviour ---------------------------------------------------
  const insertHomework = db.prepare(
    'INSERT INTO homework (student_id, date, status) VALUES (?, ?, ?)'
  )

  const today = new Date()
  const homeworkTxn = db.transaction(() => {
    studentIds.forEach((sid) => {
      const completionRate = Math.random() * 0.55 + 0.4 // 40-95%
      for (let i = 0; i < 30; i++) {
        const date = daysAgo(today, i)
        const status = Math.random() < completionRate ? 1 : 0
        insertHomework.run(sid, date, status)
      }
    })
  })
  homeworkTxn()
  log('📒 Generated 30 days of homework records for each student')

  // 4. Weekly tests and scores ---------------------------------------------
  db.prepare('DELETE FROM weekly_scores').run()
  db.prepare('DELETE FROM weekly_tests').run()

  const tests = [
    { name: 'Unit 1 Vocabulary Test', max: 20 },
    { name: 'Unit 2 Grammar Test', max: 25 },
    { name: 'Unit 3 Reading Test', max: 30 },
    { name: 'Mid-term Writing Test', max: 40 },
    { name: 'Unit 4 Speaking Test', max: 20 },
    { name: 'Unit 5 Review Test', max: 35 },
    { name: 'Unit 6 Listening Test', max: 25 },
    { name: 'End-of-Term Exam', max: 50 }
  ]

  const insertTest = db.prepare('INSERT INTO weekly_tests (name, max_score) VALUES (?, ?)')
  const insertScore = db.prepare(
    'INSERT INTO weekly_scores (test_id, student_id, score) VALUES (?, ?, ?)'
  )

  const testIds = []
  const testsTxn = db.transaction(() => {
    tests.forEach((t) => {
      const id = insertTest.run(t.name, t.max).lastInsertRowid
      testIds.push({ id, max: t.max })
    })
  })
  testsTxn()

  const scoresTxn = db.transaction(() => {
    studentIds.forEach((sid) => {
      const ability = Math.random() * 0.55 + 0.3 // 30-85% typical ability
      testIds.forEach((t) => {
        const noise = (Math.random() - 0.5) * 0.2 // ±10%
        const performance = Math.max(0.2, Math.min(1, ability + noise))
        const score = Math.round(t.max * performance)
        insertScore.run(t.id, sid, score)
      })
    })
  })
  scoresTxn()
  log(`📝 Created ${tests.length} tests with scores for all students`)

  // 5. Grammar errors -------------------------------------------------------
  db.prepare('DELETE FROM grammar_errors').run()

  const errorCodes = [
    'ART-001',
    'ART-002',
    'ART-003',
    'TENSE-001',
    'TENSE-002',
    'TENSE-003',
    'TENSE-004',
    'SVA-001',
    'SVA-002',
    'PREP-001',
    'PREP-002',
    'PREP-003',
    'WO-001',
    'WO-002',
    'WO-003',
    'PLURAL-001',
    'PLURAL-002',
    'PRON-001',
    'PRON-002',
    'COMP-001',
    'COMP-002'
  ]

  const insertError = db.prepare(
    'INSERT INTO grammar_errors (student_id, subject_id, date, error_code) VALUES (?, ?, ?, ?)'
  )

  const errorTxn = db.transaction(() => {
    for (let day = 0; day < 90; day++) {
      const dateStr = daysAgo(today, day)
      const errorsToday = randomInt(5, 12)
      for (let i = 0; i < errorsToday; i++) {
        const sid = randomChoice(studentIds)
        const subj = randomChoice(subjectIds)
        let code
        const r = Math.random()
        if (r < 0.3) code = randomChoice(['ART-001', 'ART-002', 'ART-003'])
        else if (r < 0.5) code = randomChoice(['TENSE-001', 'TENSE-002', 'TENSE-003', 'TENSE-004'])
        else if (r < 0.65) code = randomChoice(['SVA-001', 'SVA-002'])
        else if (r < 0.8) code = randomChoice(['PREP-001', 'PREP-002', 'PREP-003'])
        else code = randomChoice(errorCodes)
        insertError.run(sid, subj, dateStr, code)
      }
    }
  })
  errorTxn()
  log('🔤 Inserted 90 days of grammar errors')

  // 6. Summary --------------------------------------------------------------
  const stats = db
    .prepare(
      `SELECT 
        (SELECT COUNT(*) FROM students) AS students,
        (SELECT COUNT(*) FROM homework) AS homework,
        (SELECT COUNT(*) FROM weekly_tests) AS tests,
        (SELECT COUNT(*) FROM weekly_scores) AS scores,
        (SELECT COUNT(*) FROM grammar_errors) AS errors`
    )
    .get()

  log('\n📊 Final counts:')
  Object.entries(stats).forEach(([k, v]) => log(`  ${k}: ${v}`))
  log('\n✅ Seeding complete')
}

// ---------- wipe data ------------------------------------------------------
function clear(db) {
  log('🧹 Clearing all data from database...')
  const tables = [
    'homework',
    'weekly_scores',
    'weekly_tests',
    'grammar_errors',
    'comments',
    'essay_feedback',
    'exams',
    'resources',
    'lesson_plans',
    'students',
    'subjects'
  ]
  const txn = db.transaction(() => {
    tables.forEach((t) => db.prepare(`DELETE FROM ${t}`).run())
  })
  txn()
  log('🗑️  All rows deleted')
}

// ---------- main -----------------------------------------------------------
const action = process.argv[2]
if (!action || !['seed', 'clear'].includes(action)) {
  console.error('Usage: node scripts/test-data-manager.js <seed|clear>')
  process.exit(1)
}

const db = initDatabase()
if (action === 'seed') seed(db)
if (action === 'clear') clear(db)

db.close()
