import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { validateToken } from '../config/api'
import Portfolio from '../components/Portfolio'

type LoadingState = 'loading' | 'valid' | 'invalid'

function TokenGate() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [state, setState] = useState<LoadingState>('loading')
  const validatedTokenRef = useRef<string | null>(null)

  useEffect(() => {
    if (!token) {
      navigate('/expired')
      return
    }

    // Validate each token exactly once. Without this latch, React StrictMode's
    // double-invoked effect (and any re-render) would fire a second validate
    // request, logging a duplicate analytics event for a single visit.
    if (validatedTokenRef.current === token) return
    validatedTokenRef.current = token

    const checkToken = async () => {
      const result = await validateToken(token)

      if (result.valid) {
        setState('valid')
      } else {
        setState('invalid')
        // Small delay before redirect for UX
        setTimeout(() => navigate('/expired'), 100)
      }
    }

    checkToken()
  }, [token, navigate])

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-200 text-base-content/70">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm">Loading…</p>
      </div>
    )
  }

  if (state === 'invalid') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-200 text-base-content/70">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm">Redirecting…</p>
      </div>
    )
  }

  return <Portfolio />
}

export default TokenGate
