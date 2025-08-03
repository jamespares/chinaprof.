import { getDatabase } from '@/lib/db/database'

export default function DbPage() {
  const db = getDatabase()
  const tables = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    )
    .all() as { name: string }[]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">SQLite Tables</h1>
      <ul className="space-y-2">
        {tables.map((t) => (
          <li key={t.name}>
            <a href={`/db/${t.name}`} className="text-blue-600 hover:underline">
              {t.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
