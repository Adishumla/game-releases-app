import { NextResponse } from "next/server";

const API_KEY = process.env.RAWG_API_KEY;
const API_URL = "https://api.rawg.io/api";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const response = await fetch(`${API_URL}/games/${id}?key=${API_KEY}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch game details: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching game details:", error);
    return NextResponse.json(
      { error: "Failed to fetch game details" },
      { status: 500 }
    );
  }
}
