import { useState, useEffect } from 'react'
import ThemeToggle from '../components/ThemeToggle'

// In dev, route admin API calls through Vite's proxy (see vite.config.ts) to
// avoid the production API's CORS restriction; in production hit it directly.
const API_BASE = import.meta.env.DEV ? '/api' : 'https://api.cameronjim.com'

interface Token {
  token: string
  campaign: string
  shortLink: string
  createdAt: string
  expiresAt?: number // absent for indefinite (never-expiring) links
}

interface Event {
  token: string
  timestamp: string
  type: string
  campaign?: string
  ipHash?: string
  userAgent?: string
}

interface AnalyticsItemProps {
  token: Token
  accessCount: number
  lastAccessed: string | null
  events: Event[]
  formatDate: (dateStr: string | number) => string
}

// Human-readable labels for the raw event types stored in DynamoDB.
const EVENT_LABELS: Record<string, string> = {
  validate: 'Page view',
  open_go: 'Link opened',
}

function AnalyticsItem({ token, accessCount, lastAccessed, events, formatDate }: AnalyticsItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={
        'collapse collapse-arrow rounded-box border border-base-300 bg-base-100 ' +
        (isExpanded ? 'collapse-open' : 'collapse-close')
      }
    >
      <div
        className="collapse-title flex cursor-pointer flex-wrap items-center justify-between gap-3 pr-12"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col">
          <span className="font-semibold">{token.campaign}</span>
          <span className="font-mono text-xs text-base-content/50">{token.token}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="badge badge-soft">
            {accessCount} {accessCount === 1 ? 'view' : 'views'}
          </span>
          {lastAccessed ? (
            <span className="text-base-content/60">Last: {formatDate(lastAccessed)}</span>
          ) : (
            <span className="text-base-content/40">No views yet</span>
          )}
        </div>
      </div>

      <div className="collapse-content">
        {events.length === 0 ? (
          <p className="text-sm text-base-content/50">No activity recorded for this link yet.</p>
        ) : (
          <div>
            <h4 className="mb-3 text-sm font-semibold text-base-content/70">
              Access history ({events.length})
            </h4>
            <ul className="timeline timeline-vertical timeline-compact">
              {events.map((event, index) => (
                <li key={index}>
                  {index > 0 && <hr />}
                  <div className="timeline-middle">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="timeline-end mb-3 flex flex-col">
                    <span className="text-sm font-medium">{EVENT_LABELS[event.type] || event.type}</span>
                    <span className="text-xs text-base-content/50">{formatDate(event.timestamp)}</span>
                  </div>
                  {index < events.length - 1 && <hr />}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function Admin() {
  const [password, setPassword] = useState('')
  // The bearer we actually send: a short-lived session token issued by the API,
  // never the raw password. Kept out of the browser's persisted password store.
  const [session, setSession] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [tokens, setTokens] = useState<Token[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState<'tokens' | 'events'>('tokens')

  // New token form
  const [newCampaign, setNewCampaign] = useState('')
  const [newDays, setNewDays] = useState('30')
  const [newCustomToken, setNewCustomToken] = useState('')
  const [newNoExpiry, setNewNoExpiry] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Resume an existing session (the short-lived token, not the password).
  useEffect(() => {
    const storedSession = sessionStorage.getItem('adminSession')
    if (storedSession) authenticate(storedSession, true)
  }, [])

  // Auto-dismiss the success toast after a few seconds.
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(id)
  }, [toast])

  // Authenticate with either the password (login) or an existing session token
  // (resume). On success the API returns a fresh session token, which is the
  // only credential we persist or send afterwards.
  async function authenticate(bearer: string, isResume: boolean) {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/admin/verify`, {
        headers: { Authorization: `Bearer ${bearer}` },
      })

      if (response.ok) {
        const data = await response.json().catch(() => ({}))
        const next = data.session || bearer
        setSession(next)
        sessionStorage.setItem('adminSession', next)
        setIsAuthenticated(true)
        setPassword('')
        loadTokens(next)
        loadEvents(next)
      } else {
        // A failed resume just drops you to the login screen, no error noise.
        setError(isResume ? '' : 'Invalid password')
        sessionStorage.removeItem('adminSession')
      }
    } catch (err) {
      setError('Connection error')
    }

    setIsLoading(false)
  }

  async function loadTokens(auth: string) {
    try {
      const response = await fetch(`${API_BASE}/admin/tokens`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
      const data = await response.json()
      setTokens(data.tokens || [])
    } catch (err) {
      console.error('Failed to load tokens:', err)
    }
  }

  async function loadEvents(auth: string) {
    try {
      const response = await fetch(`${API_BASE}/admin/events`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
      const data = await response.json()
      setEvents(data.events || [])
    } catch (err) {
      console.error('Failed to load events:', err)
    }
  }

  async function createToken(e: React.FormEvent) {
    e.preventDefault()
    const days = parseInt(newDays, 10)
    if (!newCampaign.trim()) return
    if (!newNoExpiry && (!Number.isInteger(days) || days < 1 || days > 365)) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/admin/tokens`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign: newCampaign.trim(),
          days: newNoExpiry ? undefined : days,
          customToken: newCustomToken.trim() || undefined,
          noExpiry: newNoExpiry,
        }),
      })

      if (response.ok) {
        setNewCampaign('')
        setNewCustomToken('')
        setNewNoExpiry(false)
        setToast('Link created')
        loadTokens(session)
      } else {
        // Surface the API's specific message (taken / reserved / out-of-range).
        const data = await response.json().catch(() => ({}))
        setError(data.error || 'Failed to create link')
      }
    } catch (err) {
      setError('Connection error')
    }

    setIsLoading(false)
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setToast('Link copied')
  }

  async function deleteToken(token: string) {
    if (!window.confirm('Delete this link? It will stop working immediately.')) return

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/admin/tokens`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete', token }),
      })

      if (response.ok) {
        setToast('Link deleted')
        loadTokens(session)
        loadEvents(session)
      } else {
        setError('Failed to delete link')
      }
    } catch (err) {
      setError('Connection error')
    }

    setIsLoading(false)
  }

  function formatDate(dateStr: string | number) {
    const date = typeof dateStr === 'number' ? new Date(dateStr * 1000) : new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function logout() {
    sessionStorage.removeItem('adminSession')
    setIsAuthenticated(false)
    setSession('')
    setPassword('')
    setTokens([])
    setEvents([])
  }

  // The days field is free-text so it can be cleared; valid = a positive integer.
  const daysValid =
    newDays !== '' &&
    Number.isInteger(parseInt(newDays, 10)) &&
    parseInt(newDays, 10) >= 1 &&
    parseInt(newDays, 10) <= 365

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
        <div className="card w-full max-w-sm border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4 p-8">
            <div className="text-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-base-content/60">Enter your password to continue</p>
            </div>

            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                authenticate(password, false)
              }}
            >
              <input
                type="password"
                className="input w-full border border-base-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
              />
              <button type="submit" className="btn btn-primary" disabled={isLoading || !password}>
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Verifying…
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {error && (
              <div className="alert alert-error alert-soft py-2 text-sm">
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur-sm">
        <div className="navbar mx-auto max-w-4xl px-6">
          <div className="navbar-start">
            <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          </div>
          <div className="navbar-end gap-1">
            <ThemeToggle />
            <button onClick={logout} className="btn btn-ghost btn-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div role="tablist" className="tabs tabs-box mb-8 w-fit">
          <button
            role="tab"
            className={'tab' + (activeTab === 'tokens' ? ' tab-active' : '')}
            onClick={() => setActiveTab('tokens')}
          >
            Create Links
          </button>
          <button
            role="tab"
            className={'tab' + (activeTab === 'events' ? ' tab-active' : '')}
            onClick={() => setActiveTab('events')}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'tokens' && (
          <div className="flex flex-col gap-8">
            {/* Create new token form */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Create New Link</h2>
              <div className="card border border-base-300 bg-base-100">
                <div className="card-body gap-4 p-6">
                  <form onSubmit={createToken} className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Campaign name</label>
                        <input
                          type="text"
                          className="input w-full border border-base-300"
                          value={newCampaign}
                          onChange={(e) => setNewCampaign(e.target.value)}
                          placeholder="e.g. Google SWE Intern 2026"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Custom link <span className="font-normal text-base-content/50">(optional)</span>
                        </label>
                        <input
                          type="text"
                          maxLength={64}
                          className="input w-full border border-base-300"
                          value={newCustomToken}
                          onChange={(e) => setNewCustomToken(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                          placeholder="e.g. dev → /dev"
                        />
                      </div>
                    </div>
                    <div className="grid items-end gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Expires in (days)</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          className="input w-full border border-base-300"
                          value={newNoExpiry ? '' : newDays}
                          onChange={(e) =>
                            setNewDays(e.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, ''))
                          }
                          placeholder="30"
                          disabled={newNoExpiry}
                        />
                      </div>
                      <label className="flex h-12 cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={newNoExpiry}
                          onChange={(e) => setNewNoExpiry(e.target.checked)}
                        />
                        <span className="text-sm font-medium">Never expires</span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary sm:self-start"
                      disabled={isLoading || !newCampaign.trim() || (!newNoExpiry && !daysValid)}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm" />
                          Creating…
                        </>
                      ) : (
                        'Create Link'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </section>

            {/* Existing tokens */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Active Links ({tokens.length})</h2>
              {tokens.length === 0 ? (
                <p className="text-sm text-base-content/50">No links created yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {tokens.map((token) => (
                    <div
                      key={token.token}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-box border border-base-300 bg-base-100 p-4"
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="font-semibold">{token.campaign}</span>
                        <span className="select-all break-all font-mono text-xs text-base-content/60">
                          {token.shortLink}
                        </span>
                      </div>
                      <div className="flex flex-col text-xs text-base-content/60">
                        <span>Created: {formatDate(token.createdAt)}</span>
                        <span>Expires: {token.expiresAt ? formatDate(token.expiresAt) : 'Never'}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-outline" onClick={() => copyToClipboard(token.shortLink)}>
                          Copy link
                        </button>
                        <button
                          className="btn btn-sm btn-outline btn-error"
                          onClick={() => deleteToken(token.token)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'events' && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Analytics by Link</h2>
              <button
                onClick={async () => {
                  await Promise.all([loadTokens(session), loadEvents(session)])
                  setToast('Refreshed')
                }}
                className="btn btn-sm btn-outline"
              >
                Refresh
              </button>
            </div>

            {tokens.length === 0 ? (
              <p className="text-sm text-base-content/50">No links created yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {tokens.map((token) => {
                  const tokenEvents = events.filter((e) => e.token === token.token)
                  // A "view" = the portfolio actually loaded (a validate event). The
                  // short-link redirect logs a separate open_go event for the same
                  // visit, so counting every event type would double-count one visit.
                  const views = tokenEvents.filter((e) => e.type === 'validate')
                  const lastAccessed = views.length > 0 ? views[0].timestamp : null
                  const accessCount = views.length

                  return (
                    <AnalyticsItem
                      key={token.token}
                      token={token}
                      accessCount={accessCount}
                      lastAccessed={lastAccessed}
                      events={tokenEvents}
                      formatDate={formatDate}
                    />
                  )
                })}
              </div>
            )}
          </section>
        )}

        {(toast || error) && (
          <div className="toast toast-end">
            {toast && (
              <div className="alert alert-success">
                <span>{toast}</span>
              </div>
            )}
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Admin
