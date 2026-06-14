function valueLabel(value) {
  if (value == null) return '-';
  if (typeof value === 'object') return value.name || value.email || value.title || value._id || JSON.stringify(value);
  return String(value);
}

export function DataTable({ rows = [] }) {
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row).filter((key) => !['__v', 'passwordHash', 'refreshTokenHash'].includes(key))))).slice(0, 7);

  if (!rows.length) {
    return <div className="panel rounded-lg p-8 text-center text-sm text-stone-500">No records yet.</div>;
  }

  return (
    <div className="panel overflow-hidden rounded-lg">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase text-stone-500 dark:bg-stone-900">
          <tr>
            {columns.map((column) => (
              <th className="px-4 py-3 font-medium" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
          {rows.map((row) => (
            <tr key={row._id || row.id}>
              {columns.map((column) => (
                <td className="truncate px-4 py-3" key={column}>
                  {valueLabel(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
