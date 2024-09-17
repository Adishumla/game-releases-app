import { format, startOfMonth, endOfMonth, parse, subMonths } from "date-fns";

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const API_URL = "https://api.rawg.io/api";

export interface Game {
  id: number;
  name: string;
  released: string;
  background_image: string | null;
  metacritic: number | null;
  added: number;
}

export interface GameDetails extends Game {
  description: string;
  platforms: string[];
  genres: string[];
  screenshots: string[];
  videos: {
    name: string;
    preview: string | null;
    data: {
      480: string;
      max: string;
    };
  }[];
  stores: {
    id: number;
    name: string;
    domain: string | null;
    url: string;
  }[];
  website: string | null;
}

interface ApiResponse<T> {
  results: T[];
}

interface ApiGameResponse {
  id: number;
  name: string;
  released: string;
  background_image: string | null;
  metacritic: number | null;
  added: number;
  description_raw?: string;
  platforms?: { platform: { name: string } }[];
  genres?: { name: string }[];
  stores?: {
    store: {
      id: number;
      name: string;
      domain: string | null;
    };
    url: string;
  }[];
  website?: string;
}

interface ApiScreenshotResponse {
  results: { image: string }[];
}

interface ApiVideoResponse {
  results: {
    name: string;
    preview: string | null;
    data: {
      480: string;
      max: string;
    };
  }[];
}

export async function getLatestPopularGames(
  monthString: string = format(new Date(), "yyyy-MM")
): Promise<Game[]> {
  const date = parse(monthString, "yyyy-MM", new Date());
  const startDate = format(startOfMonth(date), "yyyy-MM-dd");
  const endDate = format(endOfMonth(date), "yyyy-MM-dd");

  const url = `${API_URL}/games?key=${API_KEY}&dates=${startDate},${endDate}&ordering=-added&page_size=40`;
  console.log("Fetching games from URL:", url);

  const response = await fetch(url, {
    next: { revalidate: 86400 }, // 24 hours
  });

  if (!response.ok) {
    console.error("Failed to fetch games:", await response.text());
    throw new Error(
      `Failed to fetch games: ${response.status} ${response.statusText}`
    );
  }

  const data: ApiResponse<ApiGameResponse> = await response.json();
  console.log("Raw API response:", data);

  const popularGames = data.results
    .map((game) => ({
      id: game.id,
      name: game.name,
      released: game.released,
      background_image: game.background_image || null,
      metacritic: game.metacritic || null,
      added: game.added,
    }))
    .slice(0, 10);

  console.log("Processed popular games:", popularGames);

  return popularGames.sort(
    (a, b) => new Date(b.released).getTime() - new Date(a.released).getTime()
  );
}

export async function getGameDetails(id: number): Promise<GameDetails> {
  console.log(`Fetching details for game ID: ${id}`);

  try {
    const gameResponse = await fetch(`${API_URL}/games/${id}?key=${API_KEY}`);

    if (!gameResponse.ok) {
      console.error(
        `Failed to fetch game details: ${gameResponse.status} ${gameResponse.statusText}`
      );
      throw new Error(
        `Failed to fetch game details: ${gameResponse.status} ${gameResponse.statusText}`
      );
    }

    const gameData: ApiGameResponse = await gameResponse.json();
    console.log("Game data received:", gameData);

    // Fetch screenshots
    const screenshotsResponse = await fetch(
      `${API_URL}/games/${id}/screenshots?key=${API_KEY}`
    );
    if (!screenshotsResponse.ok) {
      console.error(
        `Failed to fetch screenshots: ${screenshotsResponse.status} ${screenshotsResponse.statusText}`
      );
    }
    const screenshotsData: ApiScreenshotResponse =
      await screenshotsResponse.json();

    // Fetch videos
    const videosResponse = await fetch(
      `${API_URL}/games/${id}/movies?key=${API_KEY}`
    );
    if (!videosResponse.ok) {
      console.error(
        `Failed to fetch videos: ${videosResponse.status} ${videosResponse.statusText}`
      );
    }
    const videosData: ApiVideoResponse = await videosResponse.json();

    const stores =
      gameData.stores?.map((storeData) => ({
        id: storeData.store.id,
        name: storeData.store.name || "Unknown Store",
        domain: storeData.store.domain || null,
        url: storeData.url || "#",
      })) || [];

    const processedData: GameDetails = {
      id: gameData.id,
      name: gameData.name || "Unknown",
      description: gameData.description_raw || "No description available",
      released: gameData.released || "TBA",
      background_image: gameData.background_image || null,
      metacritic: gameData.metacritic || null,
      added: gameData.added || 0,
      platforms:
        gameData.platforms?.map((p) => p.platform?.name).filter(Boolean) || [],
      genres: gameData.genres?.map((g) => g.name).filter(Boolean) || [],
      screenshots:
        screenshotsData.results?.map((s) => s.image).filter(Boolean) || [],
      videos:
        videosData.results
          .map((v) => ({
            name: v.name || "Untitled",
            preview: v.preview || null,
            data: v.data || {},
          }))
          .filter((v) => v.data.max) || [],
      stores: stores,
      website: gameData.website || null,
    };

    console.log("Processed game data:", processedData);
    return processedData;
  } catch (error) {
    console.error("Error in getGameDetails:", error);
    throw error;
  }
}

export function getPrefetchMonths(): string[] {
  const months = [];
  for (let i = 0; i < 3; i++) {
    months.push(format(subMonths(new Date(), i), "yyyy-MM"));
  }
  return months;
}
