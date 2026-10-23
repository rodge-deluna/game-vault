import { useState, type FormEvent } from 'react'
import { errorClass, inputClass, primaryButtonClass, secondaryButtonClass } from '../ui'

// The API accepts 0.5 to 5 in 0.5 steps
const RATING_OPTIONS = Array.from({ length: 10 }, (_, i) => (i + 1) / 2)

type ReviewFormProps = {
  initialRating?: number
  initialComment?: string | null
  submitLabel: string
  onSubmit: (rating: number, comment: string | undefined) => Promise<void>
  onCancel?: () => void
}

function ReviewForm({
  initialRating = 5,
  initialComment,
  submitLabel,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState(initialComment ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // The API rejects an empty comment, so send none instead
      await onSubmit(rating, comment.trim() || undefined)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md bg-gray-900 p-4">
      <label className="flex items-center gap-3 text-sm">
        Rating
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-md border border-gray-700 bg-gray-950 px-2 py-1"
        >
          {RATING_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {value.toFixed(1)}
            </option>
          ))}
        </select>
        <span className="text-gray-400">/ 5</span>
      </label>

      <textarea
        placeholder="What did you think? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className={inputClass}
      />

      {error && <p className={errorClass}>{error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={secondaryButtonClass}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default ReviewForm
