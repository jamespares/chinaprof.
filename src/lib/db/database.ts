import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join } from 'path'

// Database connection singleton
let db: Database.Database | null = null

/**
 * Get or create the SQLite database connection
 * Database file will be stored in the user's app data directory
 */
export function getDatabase(): Database.Database {
  if (db) {
    return db
  }

  // For Phase 1, store the database file in the project root
  // In Phase 2, we'll move this to app data directory
  const dbPath = join(process.cwd(), 'chinaprof.db')

  db = new Database(dbPath)

  // Enable foreign key constraints
  db.pragma('foreign_keys = ON')

  // Initialize the database schema (with simple migrations)
  initializeSchema()

  return db
}

/**
 * Initialize the database schema from schema.sql file
 */
function initializeSchema() {
  if (!db) {
    throw new Error('Database not initialized')
  }

  try {
    // Read the schema file
    const schemaPath = join(process.cwd(), 'src/lib/db/schema.sql')
    const schema = readFileSync(schemaPath, 'utf8')

    // Check if this is a fresh database or needs migration
    const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all() as {
      name: string
    }[]
    const hasStudentsTable = tables.some((table) => table.name === 'students')

    if (hasStudentsTable) {
      // --- Existing database migrations ---
      // Ensure students table has class_id column (for old DBs)
      const preColumns: { name: string }[] = db.prepare(`PRAGMA table_info(students)`).all()
      const preHasClassId = preColumns.some((col) => col.name === 'class_id')
      if (!preHasClassId) {
        console.log('Pre-migrate: adding class_id column to students table')
        db.exec(`ALTER TABLE students ADD COLUMN class_id INTEGER`)
      }
    }

    // Execute the schema file (creates missing tables / indexes, idempotent)
    db.exec(schema)

    // Post-migration safety: create index if still missing
    if (hasStudentsTable) {
      const idxCheck = db.prepare(`PRAGMA index_list(students)`).all() as { name: string }[]
      const hasIdx = idxCheck.some((idx) => idx.name === 'idx_students_class')
      if (!hasIdx) {
        db.exec(`CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id)`)
      }
    }

    console.log('Database schema initialized / migrated successfully')
  } catch (error) {
    console.error('Failed to initialize database schema:', error)
    throw error
  }
}

/**
 * Close the database connection
 */
export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}

/**
 * Health check for database connection
 */
export function checkDatabaseHealth(): boolean {
  try {
    const db = getDatabase()
    const result = db.prepare('SELECT 1').get()
    return result !== undefined
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// Graceful shutdown handling
process.on('SIGINT', () => {
  closeDatabase()
  process.exit(0)
})

process.on('SIGTERM', () => {
  closeDatabase()
  process.exit(0)
})
