const FIELDS = [
  { key: "waste_factor", label: "Waste factor", hint: "e.g. 0.10 = 10% extra material", step: "0.01" },
  { key: "permit_flat_fee", label: "Permit flat fee ($)", hint: "Added to every estimate", step: "1" },
  { key: "range_spread_pct", label: "Estimate range spread (%)", hint: "e.g. 12 = ±12% around the mid estimate", step: "0.5" },
];

export default function ModifiersEditor({ modifiers, onChange }) {
  return (
    <div className="rounded-xl border border-gray-200 p-5">
      <h3 className="mb-4 font-semibold text-brand-800">Global pricing modifiers</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {FIELDS.map(({ key, label, hint, step }) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <input
              type="number"
              step={step}
              value={modifiers[key]}
              onChange={(e) => onChange({ ...modifiers, [key]: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
            <p className="mt-1 text-xs text-gray-400">{hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
