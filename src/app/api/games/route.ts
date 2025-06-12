import { NextResponse } from "next/server";
import { getLatestPopularGames } from "@/src/lib/api";
import { format } from "date-fns";

export const revalidate = 86400; // Cache for 24 hours

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") || format(new Date(), "yyyy-MM");

  try {
    const games = await getLatestPopularGames(month);
    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
