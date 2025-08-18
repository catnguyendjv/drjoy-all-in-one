import React, { useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

// Use Chrome sync so settings follow the signed-in user across browsers.
const sync = new Storage({ area: "sync" })

// A tiny helper to toggle secret visibility
function SecretInput({
  label,
  value,
  setValue,
  placeholder
}: {
  label: string
  value: string
  setValue: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type={show ? "text" : "password"}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            border: "1px solid #d1d5db"
          }}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          style={{
            padding: "0 12px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            cursor: "pointer"
          }}
          aria-label={show ? "Hide" : "Show"}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  )
}

export default function Options() {
  // Keys: customize names as needed
  const [redmineApiKey, setRedmineApiKey] = useStorage<string>(
    { key: "redmine.apiKey", instance: sync },
    ""
  )
  const [drjoyBearer, setDrjoyBearer] = useStorage<string>(
    { key: "drjoy.bearerToken", instance: sync },
    ""
  )
  const [drjoyEnv, setDrjoyEnv] = useStorage<string>(
    { key: "drjoy.env", instance: sync },
    "prod"
  )
  const [googleClientId, setGoogleClientId] = useStorage<string>(
    { key: "google.clientId", instance: sync },
    ""
  )
  const [googleClientSecret, setGoogleClientSecret] = useStorage<string>(
    {
      key: "google.clientSecret",
      instance: sync
    },
    ""
  )
  const [googleRefreshToken, setGoogleRefreshToken] = useStorage<string>(
    {
      key: "google.refreshToken",
      instance: sync
    },
    ""
  )

  const [status, setStatus] = useState<string>("")

  const handleClear = async () => {
    await Promise.all([
      sync.remove("redmine.apiKey"),
      sync.remove("drjoy.bearerToken"),
      sync.remove("drjoy.env"),
      sync.remove("google.clientId"),
      sync.remove("google.clientSecret"),
      sync.remove("google.refreshToken")
    ])
    setStatus("Cleared all saved values")
  }

  const handleExport = async () => {
    // Export as a masked JSON for debug (client secret / tokens partially masked)
    const mask = (s: string) => (s ? `${s.slice(0, 4)}***${s.slice(-3)}` : "")
    const payload = {
      redmineApiKey: mask(redmineApiKey || ""),
      drjoyBearer: mask(drjoyBearer || ""),
      drjoyEnv: drjoyEnv,
      googleClientId: mask(googleClientId || ""),
      googleClientSecret: mask(googleClientSecret || ""),
      googleRefreshToken: mask(googleRefreshToken || "")
    }
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setStatus("Copied masked settings to clipboard")
  }

  return (
    <div
      style={{
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        padding: 24,
        maxWidth: 720,
        margin: "0 auto"
      }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
        Extension Settings
      </h1>
      <p style={{ color: "#6b7280", marginBottom: 20 }}>
        These settings are saved in <b>chrome.storage.sync</b> so they can
        travel with your browser profile. For highly sensitive data, consider
        keeping tokens short-lived and rotating regularly.
      </p>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 16,
          marginBottom: 18,
          boxShadow: "0 2px 10px rgba(0,0,0,.04)"
        }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          Redmine
        </h2>
        <SecretInput
          label="Redmine API Key"
          value={redmineApiKey || ""}
          setValue={setRedmineApiKey}
          placeholder="e.g. 8f2f1c..."
        />
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 16,
          marginBottom: 18,
          boxShadow: "0 2px 10px rgba(0,0,0,.04)"
        }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          Dr.JOY
        </h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Environment
          </label>
          <select
            value={drjoyEnv || "dev-jackfruit"}
            onChange={(e) => setDrjoyEnv(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #d1d5db",
              minWidth: 180
            }}>
            <option value="master">master</option>
            <option value="staging">staging</option>
            <option value="develop">develop</option>
            <option value="dev-jackfruit">dev-jackfruit</option>
          </select>
        </div>
        <SecretInput
          label="Bearer Token"
          value={drjoyBearer || ""}
          setValue={setDrjoyBearer}
          placeholder="eyJhbGciOiJI..."
        />
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 16,
          marginBottom: 18,
          boxShadow: "0 2px 10px rgba(0,0,0,.04)"
        }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          Google OAuth
        </h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Client ID
          </label>
          <input
            type="text"
            value={googleClientId || ""}
            onChange={(e) => setGoogleClientId(e.target.value)}
            placeholder="xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #d1d5db"
            }}
            autoComplete="off"
          />
        </div>
        <SecretInput
          label="Client Secret"
          value={googleClientSecret || ""}
          setValue={setGoogleClientSecret}
          placeholder="GOCSPX-..."
        />
        <SecretInput
          label="Refresh Token"
          value={googleRefreshToken || ""}
          setValue={setGoogleRefreshToken}
          placeholder="1//0g..."
        />
      </section>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          type="button"
          onClick={handleExport}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            background: "#111827",
            color: "#fff",
            cursor: "pointer"
          }}>
          Copy masked settings
        </button>
        <button
          type="button"
          onClick={handleClear}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            cursor: "pointer"
          }}>
          Clear all
        </button>
        <span style={{ color: "#059669", marginLeft: 8 }}>{status}</span>
      </div>

      <hr style={{ margin: "24px 0", borderColor: "#e5e7eb" }} />
      <details>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>
          Tips / Notes
        </summary>
        <ul style={{ marginTop: 10, color: "#6b7280" }}>
          <li>
            Rotate sensitive credentials frequently. Prefer short-lived tokens
            when possible.
          </li>
          <li>
            If you need stronger at-rest protection, encrypt values before
            saving and store only ciphertext.
          </li>
          <li>
            Use background scripts to perform cross-origin requests; content
            scripts are subject to site CORS.
          </li>
        </ul>
      </details>
    </div>
  )
}
