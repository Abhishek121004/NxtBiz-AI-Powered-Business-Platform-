export function ResourceForm({ config, value, onChange, onSubmit, onCancel, mode = 'create', pending }) {
  const fields = config.fields.filter((field) => !(mode === 'edit' && field.createOnly));

  function updateField(field, rawValue) {
    let nextValue = rawValue;
    if (field.type === 'checkbox') nextValue = Boolean(rawValue);
    if (field.type === 'number') nextValue = rawValue === '' ? '' : Number(rawValue);
    if (field.type === 'tags') nextValue = rawValue.split(',').map((item) => item.trim()).filter(Boolean);
    onChange({ ...value, [field.name]: nextValue });
  }

  function fieldValue(field) {
    const current = value[field.name];
    if (field.type === 'tags') return Array.isArray(current) ? current.join(', ') : current || '';
    if (field.type === 'checkbox') return Boolean(current);
    if (field.type === 'datetime-local' && current) return String(current).slice(0, 16);
    if (field.type === 'date' && current) return String(current).slice(0, 10);
    return current ?? '';
  }

  return (
    <form className="panel grid gap-4 rounded-lg p-5" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label className={field.type === 'textarea' ? 'md:col-span-2' : ''} key={field.name}>
            <span className="mb-1 block text-sm font-medium">{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea className="min-h-24 w-full rounded-md border border-stone-300 bg-white p-3 text-sm outline-none focus:border-mint dark:border-stone-700 dark:bg-stone-900" required={field.required} value={fieldValue(field)} onChange={(event) => updateField(field, event.target.value)} />
            ) : field.type === 'select' ? (
              <select className="input w-full" value={fieldValue(field)} onChange={(event) => updateField(field, event.target.value)}>
                <option value="">Select</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input className="h-5 w-5 accent-mint" type="checkbox" checked={fieldValue(field)} onChange={(event) => updateField(field, event.target.checked)} />
            ) : (
              <input className="input w-full" type={field.type || 'text'} required={field.required} value={fieldValue(field)} onChange={(event) => updateField(field, event.target.value)} />
            )}
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" disabled={pending}>
          {mode === 'edit' ? 'Save Changes' : 'Create'}
        </button>
        {onCancel ? (
          <button className="btn border border-stone-200 dark:border-stone-800" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
