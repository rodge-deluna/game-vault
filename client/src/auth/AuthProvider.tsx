import { useState, type ReactNode } from 'react'
import { apiFetch, getStoredAuth, setStoredAuth } from '../api'
import type { User } from '../types'
import { AuthContext } from './authContext'

type LoginResponse = { user: User; token: string }

// The token's payload (middle part) holds `exp`, the expiry time in seconds.
// Reading it only tells us when to stop using the token; the server still
// verifies the signature on every request.
function isTokenExpired(token: string) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(payload))
    return typeof exp === 'number' && exp * 1000 < Date.now()
  } catch {
    return true
  }
}

function loadInitialUser(): User | null {
  const stored = getStoredAuth()

  if (!stored || isTokenExpired(stored.token)) {
    setStoredAuth(null)
    return null
  }

  return stored.user as User
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadInitialUser)

  async function login(email: string, password: string) {
    const result = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setStoredAuth(result)
    setUser(result.user)
  }

  async function register(username: string, email: string, password: string) {
    await apiFetch<User>('/users', {
      method: 'POST',
      body: { username, email, password },
    })
    // Registration doesn't return a token, so log straight in
    await login(email, password)
  }

  function logout() {
    setStoredAuth(null)
    setUser(null)
  }

  return <AuthContext value={{ user, login, register, logout }}>{children}</AuthContext>
}
