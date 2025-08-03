import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { NextRequest } from 'next/server'
import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join } from 'path'

let testDb: InstanceType<typeof Database>

beforeAll(async () => {
  // prepare in-memory DB
  testDb = new Database(':memory:')
  const schema = readFileSync(join(process.cwd(), 'src', 'lib', 'db', 'schema.sql'), 'utf8')
  testDb.exec(schema)

  // Mock database
  vi.doMock('@/lib/db/database', () => ({
    getDatabase: () => testDb
  }))
})

afterAll(() => {
  testDb.close()
})

describe('/api/students', () => {
  it('GET returns empty array when no students exist', async () => {
    const { GET } = await import('./route')
    const request = new NextRequest('http://localhost:3000/api/students')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual([])
  })

  it('POST creates a new student', async () => {
    const { POST } = await import('./route')

    const requestBody = {
      name: 'Alice Chen',
      class: '5A',
      dob: '2013-05-15'
    }

    const request = new NextRequest('http://localhost:3000/api/students', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.id).toBeDefined()
    expect(typeof data.id).toBe('number')
  })

  it('GET returns created students', async () => {
    const { GET } = await import('./route')
    const request = new NextRequest('http://localhost:3000/api/students')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe('Alice Chen')
    expect(data[0].class).toBe('5A')
  })
})
