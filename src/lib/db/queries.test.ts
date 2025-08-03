import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'

let testDb: InstanceType<typeof Database>
let studentQueries: typeof import('./queries')

beforeAll(async () => {
  // prepare in-memory DB
  testDb = new Database(':memory:')
  const schema = readFileSync(join(dirname(__dirname), 'db', 'schema.sql'), 'utf8')
  testDb.exec(schema)

  // dynamic, non-hoisted mock so TDZ is impossible
  vi.doMock('./database', () => ({
    getDatabase: () => testDb
  }))

  // import the module that relies on getDatabase AFTER the mock is in place
  studentQueries = await import('./queries')
})

afterAll(() => {
  testDb.close()
})

describe('studentQueries', () => {
  it('creates and fetches a student', () => {
    const id = studentQueries.studentQueries.create({
      name: 'Alice',
      class: '5A',
      dob: '2013-05-01'
    })
    const alice = studentQueries.studentQueries.getById(id)
    expect(alice?.name).toBe('Alice')
    expect(alice?.class).toBe('5A')
  })

  it('deletes a student', () => {
    const id = studentQueries.studentQueries.create({
      name: 'Bob',
      class: '6B',
      dob: '2012-03-15'
    })
    studentQueries.studentQueries.delete(id)
    expect(studentQueries.studentQueries.getById(id)).toBeUndefined()
  })
})
