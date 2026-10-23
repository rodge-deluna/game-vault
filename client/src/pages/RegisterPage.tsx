import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { ApiError } from '../api'
import { useAuth } from '../auth/useAuth'
import { errorClass, inputClass, primaryButtonClass } from '../ui'

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await register(username, email, password)
      navigate('/', { replace: true })
    } catch (err) {
      // The API reports duplicate username/email as a generic 409
      setError(
        err instanceof ApiError && err.status === 409
          ? 'That username or email is already taken'
          : (err as Error).message,
      )
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-sm">
      <h2 className="mb-6 text-2xl font-semibold">Create an account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Username (min 3 characters)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          className={inputClass}
        />
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
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className={inputClass}
        />

        {error && <p className={errorClass}>{error}</p>}

        <button type="submit" disabled={submitting} className={`${primaryButtonClass} w-full`}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 hover:underline">
          Log in
        </Link>
      </p>
    </section>
  )
}

export default RegisterPage
