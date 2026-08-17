export default function ContactStep({ contact, onChange, errors }) {
  const validationMessages = Object.values(errors).filter(
    (error) => typeof error === "string" && error.trim().length > 0
  );

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-brand-800">Almost done — where should we send your estimate?</h2>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
          <input
            type="text"
            className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-600 ${
              errors.name ? "border-red-400" : "border-gray-300"
            }`}
            value={contact.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Jane Homeowner"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Phone number</label>
          <input
            type="tel"
            className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-600 ${
              errors.phone ? "border-red-400" : "border-gray-300"
            }`}
            value={contact.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+1-614-555-0000"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email"
            className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-600 ${
              errors.email ? "border-red-400" : "border-gray-300"
            }`}
            value={contact.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="jane@example.com"
          />
        </div>
      </div>

      {validationMessages.length > 0 && (
        <ul className="list-inside list-disc space-y-1 text-sm text-red-600">
          {validationMessages.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
