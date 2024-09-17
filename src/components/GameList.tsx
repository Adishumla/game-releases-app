"use client";

import React, { useMemo, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { GameCard } from "@/src/components/GameCard";
import { MonthSelector } from "@/src/components/MonthSelector";
import { SortSelect } from "@/src/components/ui/sort-select";
import { useGameData } from "@/src/hooks/useGameData";
import { Game } from "@/src/lib/api";
import { format } from "date-fns";

interface GameListProps {
  initialGames: Game[];
  currentMonth?: string;
}

export function GameList({
  initialGames,
  currentMonth = format(new Date(), "yyyy-MM"),
}: GameListProps) {
  const router = useRouter();
  const {
    games,
    changeMonth,
    currentMonth: activeMonth,
    /*     error,  */
  } = useGameData(initialGames, currentMonth);
  const [sortBy, setSortBy] = useState<"release_date" | "popularity">(
    "release_date"
  );
  const [isPending, startTransition] = useTransition();

  const sortedGames = useMemo(() => {
    return [...games].sort((a, b) => {
      if (sortBy === "release_date") {
        return new Date(b.released).getTime() - new Date(a.released).getTime();
      } else {
        return b.added - a.added;
      }
    });
  }, [games, sortBy]);

  const handleMonthChange = (newMonth: string) => {
    startTransition(() => {
      changeMonth(newMonth);
      router.push(`/?month=${newMonth}`, { scroll: false });
    });
  };

  const handleSort = (newSortBy: "release_date" | "popularity") => {
    setSortBy(newSortBy);
  };

  /*   if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  } */

  return (
    <div>
      <div className="mb-6 flex text-black flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
        <MonthSelector
          currentMonth={activeMonth}
          onMonthChange={handleMonthChange}
          isPending={isPending}
        />
        <SortSelect value={sortBy} onValueChange={handleSort} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedGames.length > 0 ? (
          sortedGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p className="text-center mt-8">
            No games found for the selected month.
          </p>
        )}
      </div>
    </div>
  );
}
