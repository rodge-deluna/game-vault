import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { apiFetch } from '../api'
import type { GameWithStats } from '../types'
import { errorClass, inputClass, secondaryButtonClass } from '../ui'

type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

type GamesResponse = {
  data: GameWithStats[]
  pagination: Pagination
}

function GamesList() {
  const [games, setGames] = useState<GameWithStats[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Responses can arrive out of order while typing; ignore any that belong
    // to a search/page the user has already moved past.
    let ignore = false

    // sort=title keeps the order stable between pages
    const params = new URLSearchParams({ sort: 'title', page: String(page) })
    if (search.trim()) params.set('search', search.trim())

    apiFetch<GamesResponse>(`/games?${params}`)
      .then((body) => {
        if (ignore) return
        setGames(body.data)
        setPagination(body.pagination)
        setError(null)
      })
      .catch((err: Error) => {
        if (!ignore) setError(err.message)
      })

    return () => {
      ignore = true
    }
  }, [search, page])

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1) // a new search should start from the first page
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Games</h2>

      <input
        type="search"
        placeholder="Search games..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className={`${inputClass} mb-4`}
      />

      {error && <p className={errorClass}>Could not load games: {error}</p>}

      {!error && games.length === 0 && pagination && (
        <p className="text-gray-400">No games found.</p>
      )}

      <ul className="space-y-2">
        {games.map((game) => (
          <li key={game.id}>
            <Link
              to={`/games/${game.id}`}
              className="flex items-center justify-between rounded-md bg-gray-900 px-4 py-3 hover:bg-gray-800"
            >
              <div>
                <p className="font-medium">{game.title}</p>
                <p className="text-sm text-gray-400">
                  {game.genre ?? 'Unknown genre'}
                </p>
              </div>
              <span className="text-sm text-gray-300">
                {game.averageRating !== null
                  ? `${game.averageRating.toFixed(1)} / 5`
                  : 'No ratings yet'}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className={secondaryButtonClass}
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= pagination.totalPages}
            className={secondaryButtonClass}
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}

export default GamesList
