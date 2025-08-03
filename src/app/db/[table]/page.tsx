import { getDatabase } from '@/lib/db/database'

interface TablePageProps {
  params: {
    table: string
  }
}

export default function TablePage({ params }: TablePageProps) {
  const { table } = params
  const db = getDatabase()

  // Fetch first 100 rows for preview
  const rows = db.prepare(`SELECT * FROM ${table} LIMIT 100`).all() as Record<string, unknown>[]

  const columns = rows.length ? Object.keys(rows[0]) : []

  return (
    <div className="p-6 overflow-auto">
      <h1 className="text-2xl font-semibold mb-4">{table}</h1>
      {rows.length === 0 ? (
        <p>No data.</p>
      ) : (
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-2 border">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2 border whitespace-nowrap">
                    {String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
