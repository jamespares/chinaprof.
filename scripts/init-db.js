// Simple script to test database initialization
const { getDatabase, checkDatabaseHealth } = require('../src/lib/db/database.ts')

console.log('🗄️  Initializing ChinaProf database...')

try {
  // Initialize database
  const db = getDatabase()
  console.log('✅ Database initialized successfully')

  // Check health
  const isHealthy = checkDatabaseHealth()
  console.log(`🏥 Database health check: ${isHealthy ? 'PASS' : 'FAIL'}`)

  // Test a simple query
  const result = db.prepare('SELECT COUNT(*) as count FROM students').get()
  console.log(`👥 Students in database: ${result.count}`)

  console.log('🎉 Database setup complete!')
} catch (error) {
  console.error('❌ Database initialization failed:', error.message)
  process.exit(1)
}
