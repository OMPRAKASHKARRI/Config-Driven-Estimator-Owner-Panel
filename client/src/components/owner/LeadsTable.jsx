import { Fragment, useState } from "react";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function LeadsTable({ leads }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!leads.length) {
    return <p className="text-gray-500">No leads yet.</p>;
  }

  return (
    <div className="space-y-3">
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 sm:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Estimate</th>
              <th className="px-4 py-3">Config v</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <Fragment key={lead._id}>
                <tr
                  onClick={() => setExpandedId(expandedId === lead._id ? null : lead._id)}
                  className="cursor-pointer border-t border-gray-100 hover:bg-brand-50"
                >
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{formatDate(lead.captured_at)}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(lead.estimate_low)} – {formatCurrency(lead.estimate_high)}
                  </td>
                  <td className="px-4 py-3">v{lead.config_version}</td>
                </tr>
                {expandedId === lead._id && (
                  <tr className="border-t border-gray-100 bg-gray-50">
                    <td colSpan={6} className="px-4 py-3">
                      <AnswersList answers={lead.answers} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 sm:hidden">
        {leads.map((lead) => (
          <div
            key={lead._id}
            onClick={() => setExpandedId(expandedId === lead._id ? null : lead._id)}
            className="rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{lead.name}</span>
              <span className="text-xs text-gray-400">v{lead.config_version}</span>
            </div>
            <p className="text-sm text-gray-500">{lead.phone} · {lead.email}</p>
            <p className="mt-1 text-sm text-gray-500">{formatDate(lead.captured_at)}</p>
            <p className="mt-2 font-semibold text-brand-700">
              {formatCurrency(lead.estimate_low)} – {formatCurrency(lead.estimate_high)}
            </p>
            {expandedId === lead._id && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <AnswersList answers={lead.answers} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnswersList({ answers }) {
  return (
    <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
      {Object.entries(answers).map(([key, value]) => (
        <div key={key} className="flex justify-between gap-4 sm:justify-start">
          <dt className="text-gray-400">{key}</dt>
          <dd className="font-medium">{String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}
