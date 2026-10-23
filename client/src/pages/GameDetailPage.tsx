import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { apiFetch } from '../api'
import { useAuth } from '../auth/useAuth'
import ReviewForm from '../components/ReviewForm'
import {
  STATUSES,
  STATUS_LABELS,
  type BacklogEntry,
  type BacklogEntryWithGame,
  type GameWithStats,
  type Review,
  type Status,
} from '../types'
import { dangerButtonClass, errorClass, primaryButtonClass, secondaryButtonClass } from '../ui'

function GameDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()

  const [game, setGame] = useState<GameWithStats | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [backlogEntry, setBacklogEntry] = useState<BacklogEntry | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [editingReview, setEditingReview] = useState(false)

  // Bumping this re-runs the effect below, reloading everything after a change.
  // Simpler than patching each piece of state by hand, and keeps the average
  // rating in sync with the server.
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    Promise.all([
      apiFetch<GameWithStats>(`/games/${id}`),
      apiFetch<Review[]>(`/games/${id}/reviews`),
      // The API has no "is this game in my backlog?" endpoint, so fetch the
      // whole backlog and look for it
      user ? apiFetch<BacklogEntryWithGame[]>('/users/me/backlog') : Promise.resolve([]),
    ])
      .then(([gameData, reviewData, backlog]) => {
        if (ignore) return
        setGame(gameData)
        setReviews(reviewData)
        setBacklogEntry(backlog.find((entry) => entry.gameId === gameData.id) ?? null)
        setLoadError(null)
      })
      .catch((err: Error) => {
        if (!ignore) setLoadError(err.message)
      })

    return () => {
      ignore = true
    }
  }, [id, user, reloadKey])

  // Runs a backlog/review change, shows any error, then reloads the page data
  async function runAction(action: () => Promise<unknown>) {
    setBusy(true)
    setActionError(null)

    try {
      await action()
      setReloadKey((key) => key + 1)
    } catch (err) {
      setActionError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  if (loadError) return <p className={errorClass}>Could not load game: {loadError}</p>
  if (!game) return <p className="text-gray-400">Loading...</p>

  const myReview = user ? reviews.find((review) => review.userId === user.id) : undefined
  const otherReviews = reviews.filter((review) => review !== myReview)

  async function saveReview(rating: number, comment: string | undefined) {
    const body = { rating, comment }

    if (myReview) {
      await apiFetch(`/reviews/${myReview.id}`, { method: 'PUT', body })
    } else {
      await apiFetch(`/games/${id}/reviews`, { method: 'POST', body })
    }

    setEditingReview(false)
    setReloadKey((key) => key + 1)
  }

  return (
    <article className="space-y-8">
      <Link to="/" className="text-sm text-gray-400 hover:text-white">
        ← Back to games
      </Link>

      <header className="space-y-4">
        {game.backgroundImage && (
          <img
            src={game.backgroundImage}
            alt=""
            className="aspect-video w-full rounded-lg object-cover"
          />
        )}
        <div>
          <h2 className="text-3xl font-bold">{game.title}</h2>
          <p className="text-gray-400">
            {game.genre ?? 'Unknown genre'}
            {game.releaseDate && ` · ${new Date(game.releaseDate).getFullYear()}`}
          </p>
          <p className="mt-2">
            {game.averageRating !== null
              ? `${game.averageRating.toFixed(1)} / 5 from ${game.reviewCount} review${game.reviewCount === 1 ? '' : 's'}`
              : 'No ratings yet'}
          </p>
        </div>
      </header>

      {actionError && <p className={errorClass}>{actionError}</p>}

      <section className="rounded-md bg-gray-900 p-4">
        <h3 className="mb-3 font-semibold">Your backlog</h3>

        {!user ? (
          <p className="text-sm text-gray-400">
            <Link to="/login" className="text-indigo-400 hover:underline">
              Log in
            </Link>{' '}
            to track this game.
          </p>
        ) : backlogEntry ? (
          <div className="flex items-center gap-3">
            <select
              value={backlogEntry.status}
              disabled={busy}
              onChange={(e) =>
                runAction(() =>
                  apiFetch(`/games/${id}/backlog`, {
                    method: 'PATCH',
                    body: { status: e.target.value as Status },
                  }),
                )
              }
              className="rounded-md border border-gray-700 bg-gray-950 px-2 py-1"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <button
              disabled={busy}
              onClick={() =>
                runAction(() => apiFetch(`/games/${id}/backlog`, { method: 'DELETE' }))
              }
              className={dangerButtonClass}
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            disabled={busy}
            onClick={() => runAction(() => apiFetch(`/games/${id}/backlog`, { method: 'POST' }))}
            className={primaryButtonClass}
          >
            Add to backlog
          </button>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Reviews</h3>

        {user &&
          (!myReview ? (
            <ReviewForm submitLabel="Post review" onSubmit={saveReview} />
          ) : editingReview ? (
            <ReviewForm
              initialRating={myReview.rating}
              initialComment={myReview.comment}
              submitLabel="Save changes"
              onSubmit={saveReview}
              onCancel={() => setEditingReview(false)}
            />
          ) : (
            <div className="rounded-md border border-indigo-900 bg-gray-900 p-4">
              <p className="text-sm text-indigo-300">Your review</p>
              <p className="font-medium">{myReview.rating.toFixed(1)} / 5</p>
              {myReview.comment && <p className="mt-1 text-gray-300">{myReview.comment}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  disabled={busy}
                  onClick={() => setEditingReview(true)}
                  className={secondaryButtonClass}
                >
                  Edit
                </button>
                <button
                  disabled={busy}
                  onClick={() => {
                    if (window.confirm('Delete your review?')) {
                      runAction(() => apiFetch(`/reviews/${myReview.id}`, { method: 'DELETE' }))
                    }
                  }}
                  className={dangerButtonClass}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        {otherReviews.length === 0 && !myReview && (
          <p className="text-gray-400">No reviews yet.</p>
        )}

        <ul className="space-y-2">
          {otherReviews.map((review) => (
            <li key={review.id} className="rounded-md bg-gray-900 p-4">
              {/* The reviews endpoint returns userId but not username */}
              <p className="text-sm text-gray-400">Player #{review.userId}</p>
              <p className="font-medium">{review.rating.toFixed(1)} / 5</p>
              {review.comment && <p className="mt-1 text-gray-300">{review.comment}</p>}
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}

export default GameDetailPage
