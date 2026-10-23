import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { errorClass, inputClass, primaryButtonClass } from '../ui'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // RequireAuth stores the page the user was trying to open
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault() // stop the browser's default full-page form submit
    setSubmitting(true)
    setError(null)

    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError((err as Error).message)
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-sm">
      <h2 className="mb-6 text-2xl font-semibold">Log in</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputClass}
        />

        {error && <p className={errorClass}>{error}</p>}

        <button type="submit" disabled={submitting} className={`${primaryButtonClass} w-full`}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-400">
        No account?{' '}
        <Link to="/register" className="text-indigo-400 hover:underline">
          Register
        </Link>
      </p>
    </section>
  )
}

export default LoginPage
