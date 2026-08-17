
export default function DynamicQuestion({ question, value, onChange, error }) {
  const { key, label, type, unit, options } = question;

  return (
    <div className="space-y-3">
      <label className="block text-xl font-semibold text-brand-800">
        {label}
        {unit ? <span className="ml-1 text-sm font-normal text-gray-500">({unit})</span> : null}
      </label>

      {type === "number" && (
        <input
          type="number"
          inputMode="numeric"
          className={`w-full rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-600 ${
            error ? "border-red-400" : "border-gray-300"
          }`}
          value={value ?? ""}
          onChange={(e) => onChange(key, e.target.value)}
          placeholder={
            question.min !== null && question.max !== null
              ? `Between ${question.min} and ${question.max}`
              : undefined
          }
        />
      )}

      {type === "select" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {(options || []).map((opt) => {
            const selected = String(value) === String(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(key, opt.value)}
                className={`rounded-lg border px-4 py-3 text-left text-base transition ${
                  selected
                    ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                    : "border-gray-300 bg-white hover:border-brand-600"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      {type === "text" && (
        <input
          type="text"
          className={`w-full rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-600 ${
            error ? "border-red-400" : "border-gray-300"
          }`}
          value={value ?? ""}
          onChange={(e) => onChange(key, e.target.value)}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
