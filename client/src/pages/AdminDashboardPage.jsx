import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminConfig, saveAdminConfig, fetchLeads } from "../services/api.js";
import QuestionEditor from "../components/owner/QuestionEditor.jsx";
import ModifiersEditor from "../components/owner/ModifiersEditor.jsx";
import LeadsTable from "../components/owner/LeadsTable.jsx";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("config");

  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [saveErrors, setSaveErrors] = useState([]);

  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [leadsError, setLeadsError] = useState(null);

  useEffect(() => {
    fetchAdminConfig()
      .then(setConfig)
      .catch((err) => handleAuthError(err))
      .finally(() => setLoadingConfig(false));

    fetchLeads()
      .then(setLeads)
      .catch((err) => {
        handleAuthError(err);
        setLeadsError(err.message);
      })
      .finally(() => setLoadingLeads(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAuthError(err) {
    if (err.status === 401 || err.status === 403) {
      localStorage.removeItem("wantace_admin_token");
      navigate("/admin/login");
    }
  }

  function updateQuestion(index, updated) {
    const questions = config.questions.map((q, i) => (i === index ? updated : q));
    setConfig({ ...config, questions });
  }

  function updateModifiers(modifiers) {
    setConfig({ ...config, modifiers });
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    setSaveErrors([]);
    try {
      const updated = await saveAdminConfig({
        business: config.business,
        questions: config.questions,
        modifiers: config.modifiers,
      });
      setConfig(updated);
      setSaveMessage(`Saved as configuration v${updated.config_version}. Live immediately - no redeploy needed.`);
    } catch (err) {
      setSaveErrors(err.details || [err.message]);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("wantace_admin_token");
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-brand-50 pb-16">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="font-bold text-brand-800">Owner Dashboard</h1>
            {config && <p className="text-xs text-gray-400">{config.business.name} · config v{config.config_version}</p>}
          </div>
          <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-brand-700">
            Log out
          </button>
        </div>
        <div className="mx-auto flex max-w-4xl gap-6 px-4 text-sm">
          <TabButton active={tab === "config"} onClick={() => setTab("config")}>
            Configuration
          </TabButton>
          <TabButton active={tab === "leads"} onClick={() => setTab("leads")}>
            Leads ({leads.length})
          </TabButton>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {tab === "config" && (
          <>
            {loadingConfig && <p className="text-gray-500">Loading configuration...</p>}
            {!loadingConfig && config && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {config.questions.map((q, i) => (
                    <QuestionEditor key={q.key} question={q} onChange={(updated) => updateQuestion(i, updated)} />
                  ))}
                </div>

                <ModifiersEditor modifiers={config.modifiers} onChange={updateModifiers} />

                {saveErrors.length > 0 && (
                  <ul className="list-inside list-disc space-y-1 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {saveErrors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}
                {saveMessage && (
                  <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{saveMessage}</p>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-brand-600 px-6 py-2.5 font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            )}
          </>
        )}

        {tab === "leads" && (
          <>
            {loadingLeads && <p className="text-gray-500">Loading leads...</p>}
            {leadsError && <p className="text-red-600">{leadsError}</p>}
            {!loadingLeads && !leadsError && <LeadsTable leads={leads} />}
          </>
        )}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`border-b-2 py-3 font-medium ${
        active ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500 hover:text-brand-700"
      }`}
    >
      {children}
    </button>
  );
}
