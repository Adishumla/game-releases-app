import { Suspense } from "react";
import {
  getLatestPopularGames,
  getGameDetails,
  Game,
  GameDetails,
} from "@/src/lib/api";
import { GameList } from "@/src/components/GameList";
import { format } from "date-fns";

export const revalidate = 86400;

type FullGame = Game & GameDetails;

export default async function Home({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  const currentMonth = searchParams.month || format(new Date(), "yyyy-MM");
  const initialGames = await getLatestPopularGames(currentMonth);

  const gamesWithDetails: FullGame[] = [];
  for (const g of initialGames) {
    const details = await getGameDetails(g.id);
    gamesWithDetails.push({ ...g, ...details });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Latest Popular Games
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <GameList initialGames={gamesWithDetails} currentMonth={currentMonth} />
      </Suspense>
    </div>
  );
}
