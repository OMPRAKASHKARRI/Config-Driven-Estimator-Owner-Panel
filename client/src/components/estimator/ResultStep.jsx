function formatCurrency(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ResultStep({ result, businessName, onStartOver }) {
  return (
    <div className="space-y-6 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-brand-600">Your estimate</p>
        <h2 className="mt-2 text-3xl font-bold text-brand-800">
          {formatCurrency(result.estimate_low, result.currency)} –{" "}
          {formatCurrency(result.estimate_high, result.currency)}
        </h2>
      </div>

      <p className="mx-auto max-w-md text-gray-600">
        This is a preliminary estimate from {businessName || "our team"} based on the details you
        provided. A specialist will follow up to confirm final pricing after an on-site
        inspection.
      </p>

      <button
        type="button"
        onClick={onStartOver}
        className="rounded-lg border border-brand-600 px-5 py-2.5 font-medium text-brand-700 transition hover:bg-brand-50"
      >
        Start a new estimate
      </button>
    </div>
  );
}
