import { Suspense } from "react";
import { getLatestPopularGames } from "@/src/lib/api";
import { GameList } from "@/src/components/GameList";
import { format } from "date-fns";

export const revalidate = 86400; // Once per day

export default async function Home({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  const currentMonth = searchParams.month || format(new Date(), "yyyy-MM");
  const initialGames = await getLatestPopularGames(currentMonth);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Latest Popular Games
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <GameList initialGames={initialGames} currentMonth={currentMonth} />
      </Suspense>
    </div>
  );
}
