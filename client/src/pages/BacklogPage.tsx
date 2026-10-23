import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { apiFetch } from '../api'
import { STATUSES, STATUS_LABELS, type BacklogEntryWithGame, type Status } from '../types'
import { dangerButtonClass, errorClass } from '../ui'

function BacklogPage() {
  const [entries, setEntries] = useState<BacklogEntryWithGame[] | null>(null)
  const [filter, setFilter] = useState<Status | 'ALL'>('ALL')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    apiFetch<BacklogEntryWithGame[]>('/users/me/backlog')
      .then((data) => {
        if (!ignore) setEntries(data)
      })
      .catch((err: Error) => {
        if (!ignore) setError(err.message)
      })

    return () => {
      ignore = true
    }
  }, [])

  // Here we update local state from the response instead of refetching:
  // the list is the only thing on the page that changes.
  async function changeStatus(gameId: number, status: Status) {
    setError(null)
    try {
      await apiFetch(`/games/${gameId}/backlog`, { method: 'PATCH', body: { status } })
      setEntries((current) =>
        current?.map((entry) => (entry.gameId === gameId ? { ...entry, status } : entry)) ??
        null,
      )
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function remove(gameId: number) {
    setError(null)
    try {
      await apiFetch(`/games/${gameId}/backlog`, { method: 'DELETE' })
      setEntries((current) => current?.filter((entry) => entry.gameId !== gameId) ?? null)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (!entries) {
    return error ? (
      <p className={errorClass}>Could not load backlog: {error}</p>
    ) : (
      <p className="text-gray-400">Loading...</p>
    )
  }

  const visible = filter === 'ALL' ? entries : entries.filter((entry) => entry.status === filter)

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">My Backlog</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['ALL', ...STATUSES] as const).map((value) => {
          const count =
            value === 'ALL' ? entries.length : entries.filter((e) => e.status === value).length

          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-3 py-1 text-sm ${
                filter === value ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {value === 'ALL' ? 'All' : STATUS_LABELS[value]} ({count})
            </button>
          )
        })}
      </div>

      {error && <p className={`${errorClass} mb-4`}>{error}</p>}

      {entries.length === 0 ? (
        <p className="text-gray-400">
          Your backlog is empty.{' '}
          <Link to="/" className="text-indigo-400 hover:underline">
            Browse games
          </Link>{' '}
          to add some.
        </p>
      ) : visible.length === 0 ? (
        <p className="text-gray-400">No games with this status.</p>
      ) : (
        <ul className="space-y-2">
          {visible.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-4 rounded-md bg-gray-900 px-4 py-3"
            >
              <Link to={`/games/${entry.gameId}`} className="font-medium hover:text-indigo-300">
                {entry.game.title}
              </Link>
              <div className="flex items-center gap-2">
                <select
                  value={entry.status}
                  onChange={(e) => changeStatus(entry.gameId, e.target.value as Status)}
                  className="rounded-md border border-gray-700 bg-gray-950 px-2 py-1 text-sm"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
                <button onClick={() => remove(entry.gameId)} className={dangerButtonClass}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default BacklogPage
