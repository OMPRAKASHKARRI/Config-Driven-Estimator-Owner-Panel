const NUMERIC_OPTION_FIELDS = [
  { field: "rate_per_sqft", label: "Rate ($/sq ft)" },
  { field: "multiplier", label: "Multiplier" },
  { field: "tear_off_per_sqft", label: "Tear-off ($/sq ft)" },
];

export default function QuestionEditor({ question, onChange }) {
  function updateField(field, value) {
    onChange({ ...question, [field]: value });
  }

  function updateOption(index, field, value) {
    const options = question.options.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt));
    onChange({ ...question, options });
  }

  return (
    <div className="rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-400">
            Question label
          </label>
          <input
            type="text"
            value={question.label}
            onChange={(e) => updateField("label", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>

        <label className="flex shrink-0 cursor-pointer items-center gap-2">
          <span className="text-sm text-gray-500">{question.active ? "Enabled" : "Disabled"}</span>
          <input
            type="checkbox"
            checked={question.active}
            onChange={(e) => updateField("active", e.target.checked)}
            className="h-5 w-5 accent-brand-600"
          />
        </label>
      </div>

      {question.type === "number" && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-400">Min</label>
            <input
              type="number"
              value={question.min ?? ""}
              onChange={(e) => updateField("min", e.target.value === "" ? null : Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-400">Max</label>
            <input
              type="number"
              value={question.max ?? ""}
              onChange={(e) => updateField("max", e.target.value === "" ? null : Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>
        </div>
      )}

      {question.type === "select" && question.options && (
        <div className="mt-4 space-y-3">
          {question.options.map((opt, i) => (
            <div key={opt.value} className="rounded-lg bg-gray-50 p-3">
              <input
                type="text"
                value={opt.label}
                onChange={(e) => updateOption(i, "label", e.target.value)}
                className="mb-2 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <div className="flex flex-wrap gap-3">
                {NUMERIC_OPTION_FIELDS.filter(({ field }) => opt[field] !== undefined).map(({ field, label }) => (
                  <div key={field}>
                    <label className="mb-1 block text-[11px] uppercase tracking-wide text-gray-400">{label}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={opt[field]}
                      onChange={(e) => updateOption(i, field, e.target.value)}
                      className="w-32 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
