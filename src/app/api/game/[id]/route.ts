import { NextResponse } from "next/server";
import { getGameDetails } from "@/src/lib/api";

export const revalidate = 86400; // Cache details for 24 hours

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
  }

  try {
    const details = await getGameDetails(id);
    return NextResponse.json(details);
  } catch (error) {
    console.error("Error fetching game details:", error);
    return NextResponse.json(
      { error: "Failed to fetch game details" },
      { status: 500 }
    );
  }
}
