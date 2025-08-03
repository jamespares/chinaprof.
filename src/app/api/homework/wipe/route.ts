import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db/database'

// DELETE /api/homework/wipe - Wipe all homework data for testing
export async function DELETE() {
  try {
    const db = getDatabase()

    // Delete all homework entries
    const result = db.prepare('DELETE FROM homework').run()

    console.log(`Wiped ${result.changes} homework entries`)

    return NextResponse.json({
      success: true,
      deleted: result.changes,
      message: `Successfully deleted ${result.changes} homework entries`
    })
  } catch (error) {
    console.error('Failed to wipe homework data:', error)
    return NextResponse.json({ error: 'Failed to wipe homework data' }, { status: 500 })
  }
}
