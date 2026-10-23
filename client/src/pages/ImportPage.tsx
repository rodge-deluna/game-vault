import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ApiError, apiFetch } from '../api'
import type { ExternalGame, Game } from '../types'
import { errorClass, inputClass, primaryButtonClass, secondaryButtonClass } from '../ui'

// Import progress for each RAWG result, keyed by externalId
type ImportState =
  | { state: 'importing' }
  | { state: 'imported'; gameId: number }
  | { state: 'exists' }
  | { state: 'error'; message: string }

function ImportPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ExternalGame[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imports, setImports] = useState<Record<number, ImportState>>({})

  // Searches only on submit (not on every keystroke) since each search
  // calls the RAWG API, which has a request quota
  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setSearching(true)
    setError(null)

    try {
      const params = new URLSearchParams({ search: query.trim() })
      setResults(await apiFetch<ExternalGame[]>(`/external-games?${params}`))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSearching(false)
    }
  }

  async function importGame(externalId: number) {
    setImports((current) => ({ ...current, [externalId]: { state: 'importing' } }))

    let result: ImportState
    try {
      const game = await apiFetch<Game>(`/external-games/${externalId}/import`, { method: 'POST' })
      result = { state: 'imported', gameId: game.id }
    } catch (err) {
      result =
        err instanceof ApiError && err.status === 409
          ? { state: 'exists' }
          : { state: 'error', message: (err as Error).message }
    }

    setImports((current) => ({ ...current, [externalId]: result }))
  }

  return (
    <section>
      <h2 className="mb-1 text-xl font-semibold">Import games</h2>
      <p className="mb-4 text-sm text-gray-400">
        Search the RAWG database and add games to GameVault.
      </p>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="search"
          placeholder="Search RAWG..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={inputClass}
        />
        <button type="submit" disabled={searching} className={primaryButtonClass}>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className={`${errorClass} mb-4`}>{error}</p>}

      {results && results.length === 0 && <p className="text-gray-400">No results.</p>}

      <ul className="space-y-2">
        {results?.map((game) => {
          const importState = imports[game.externalId]

          return (
            <li key={game.externalId} className="flex items-center gap-4 rounded-md bg-gray-900 p-3">
              {game.backgroundImage ? (
                <img
                  src={game.backgroundImage}
                  alt=""
                  className="h-14 w-24 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="h-14 w-24 shrink-0 rounded bg-gray-800" />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{game.title}</p>
                <p className="truncate text-sm text-gray-400">
                  {[game.releaseDate?.slice(0, 4), game.genres.join(', ')]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>

              <div className="shrink-0 text-sm">
                {importState?.state === 'imported' ? (
                  <Link
                    to={`/games/${importState.gameId}`}
                    className="text-green-400 hover:underline"
                  >
                    Imported, view →
                  </Link>
                ) : importState?.state === 'exists' ? (
                  <span className="text-gray-400">Already in GameVault</span>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => importGame(game.externalId)}
                      disabled={importState?.state === 'importing'}
                      className={secondaryButtonClass}
                    >
                      {importState?.state === 'importing' ? 'Importing...' : 'Import'}
                    </button>
                    {importState?.state === 'error' && (
                      <span className={errorClass}>{importState.message}</span>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default ImportPage
