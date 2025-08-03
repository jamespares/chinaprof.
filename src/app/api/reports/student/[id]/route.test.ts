/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest'

// Simple test to verify the API route can be imported
describe('/api/reports/student/[id]', () => {
  it('should be importable without errors', async () => {
    // This is a basic smoke test to ensure the module can be loaded
    const module = await import('./route')
    expect(module.GET).toBeDefined()
    expect(typeof module.GET).toBe('function')
  })

  it('should handle invalid student IDs', async () => {
    const { GET } = await import('./route')

    const request = new Request('http://localhost:3000/api/reports/student/invalid')
    const response = await GET(request as any, { params: { id: 'invalid' } })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid student ID')
  })
})
