// Shapes of the data returned by the GameVault API.

export type User = {
  id: number
  username: string
  email: string
}

export type Game = {
  id: number
  externalId: number | null
  title: string
  genre: string | null
  releaseDate: string | null
  backgroundImage: string | null
}

// GET /games and GET /games/:id add review stats to each game
export type GameWithStats = Game & {
  reviewCount: number
  averageRating: number | null
}

export type Review = {
  id: number
  rating: number
  comment: string | null
  gameId: number
  userId: number
}

export const STATUSES = ['WISHLIST', 'PLAYING', 'COMPLETED', 'DROPPED'] as const

export type Status = (typeof STATUSES)[number]

export const STATUS_LABELS: Record<Status, string> = {
  WISHLIST: 'Wishlist',
  PLAYING: 'Playing',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
}

export type BacklogEntry = {
  id: number
  userId: number
  gameId: number
  status: Status
}

// GET /users/me/backlog includes the game for each entry
export type BacklogEntryWithGame = BacklogEntry & {
  game: Game
}

// Result of GET /external-games (RAWG search)
export type ExternalGame = {
  externalId: number
  title: string
  releaseDate: string | null
  backgroundImage: string | null
  rating: number
  genres: string[]
  platforms: string[]
}
