const RAWG_BASE_URL = "https://api.rawg.io/api";

type RawgGame = {
    id: number;
    name: string;
    released: string | null;
    background_image: string | null;
    rating: number;
    genres: {
        name: string;
    }[];
    // RAWG returns null instead of [] for some user-submitted games
    platforms: {
        platform: {
            name: string;
        };
    }[] | null;
};

type RawgSearchResponse = {
    results: RawgGame[];
};

type RawgGameDetails = {
    id: number;
    name: string;
    released: string | null;
    background_image: string | null;
    genres: {
        name: string;
    }[];
};

export async function searchGames(search: string) {
    const apiKey = process.env.RAWG_API_KEY;

    if (!apiKey) {
        throw new Error("RAWG API key is not defined");
    }

    const url = new URL(`${RAWG_BASE_URL}/games`);

    url.searchParams.set("key", apiKey);
    url.searchParams.set("search", search);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch games from RAWG");
    }

    const data = await response.json() as RawgSearchResponse;

    return data.results.map((game) => ({
        externalId: game.id,
        title: game.name,
        releaseDate: game.released,
        backgroundImage: game.background_image,
        rating: game.rating,
        genres: game.genres.map((genre) => genre.name),
        platforms: (game.platforms ?? []).map(
            ({ platform }) => platform.name
        )
    }));
}

export async function getGameById(externalId: number) {
    const apiKey = process.env.RAWG_API_KEY;

    if (!apiKey) {
        throw new Error("RAWG API key is not defined");
    }

    const url = new URL(`${RAWG_BASE_URL}/games/${externalId}`);

    url.searchParams.set("key", apiKey);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch game from RAWG");
    }

    const game = await response.json() as RawgGameDetails;

    return {
        externalId: game.id,
        title: game.name,
        releaseDate: game.released,
        backgroundImage: game.background_image,
        genre: game.genres[0]?.name ?? null
    };
}
