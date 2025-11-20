import { useState } from 'react'

function App() {
  const [apiMessage, setApiMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchHello = async () => {
    setLoading(true)
    setError('')
    setApiMessage('')
    try {
      const envBase = import.meta.env.VITE_BACKEND_URL?.toString().trim()
      const inferredBase = (() => {
        try {
          const url = new URL(window.location.href)
          // If running on port 3000 (frontend), try 8000 for backend
          if (url.port === '3000') {
            url.port = '8000'
            return url.origin
          }
          return `${url.protocol}//${url.hostname}:8000`
        } catch {
          return ''
        }
      })()
      const baseUrl = envBase || inferredBase || ''
      const endpoint = baseUrl ? `${baseUrl}/api/hello` : '/api/hello'
      const res = await fetch(endpoint)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Request failed')
      setApiMessage(data.message || 'Success')
    } catch (e) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Hello, World!</h1>
        <p className="text-slate-300 mb-8">Your full-stack app is live. Click below to say hello from the backend.</p>

        <div className="space-y-4">
          <button
            onClick={fetchHello}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed px-5 py-3 font-medium transition-colors"
          >
            {loading ? 'Talking to backend…' : 'Fetch from Backend'}
          </button>

          {apiMessage && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300">
              {apiMessage}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-300">
              {error}
            </div>
          )}
        </div>

        <div className="mt-10 text-xs text-slate-400">
          Tip: set VITE_BACKEND_URL to your API base to control where requests go.
        </div>
      </div>
    </div>
  )
}

export default App
