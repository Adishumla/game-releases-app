"use client";

import React, { useMemo, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { GameCard } from "@/src/components/GameCard";
import { MonthSelector } from "@/src/components/MonthSelector";
import { SortSelect } from "@/src/components/ui/sort-select";
import { format } from "date-fns";

interface FullGame {
  id: number;
  name: string;
  released: string;
  background_image: string | null;
  metacritic: number | null;
  added: number;
  description: string;
  platforms: string[];
  genres: string[];
  screenshots: string[];
  website: string | null;
}

interface GameListProps {
  initialGames: FullGame[];
  currentMonth?: string;
}

export function GameList({
  initialGames,
  currentMonth = format(new Date(), "yyyy-MM"),
}: GameListProps) {
  const router = useRouter();

  const [activeMonth, setActiveMonth] = useState(currentMonth);
  const [sortBy, setSortBy] = useState<"release_date" | "popularity">(
    "release_date"
  );
  const [isPending, startTransition] = useTransition();

  const sortedGames = useMemo(() => {
    return [...initialGames].sort((a, b) => {
      if (sortBy === "release_date") {
        // Sort by earliest release first
        return new Date(a.released).getTime() - new Date(b.released).getTime();
      } else {
        // Sort by popularity (added) descending
        return b.added - a.added;
      }
    });
  }, [initialGames, sortBy]);

  const handleMonthChange = (newMonth: string) => {
    startTransition(() => {
      setActiveMonth(newMonth);
      // This navigates to a new URL, triggering server-side fetch and ISR caching
      router.push(`/?month=${newMonth}`, { scroll: false });
    });
  };

  const handleSort = (newSortBy: "release_date" | "popularity") => {
    setSortBy(newSortBy);
  };

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
