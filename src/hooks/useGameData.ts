import { useState, useCallback, useEffect } from "react";
import { Game } from "@/src/lib/api";
import { format, addMonths, subMonths } from "date-fns";

export function useGameData(initialGames: Game[], initialMonth: string) {
  const [gameCache, setGameCache] = useState<Record<string, Game[]>>({
    [initialMonth]: initialGames,
  });
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const fetchGamesForMonth = useCallback(
    async (month: string) => {
      if (gameCache[month]) return;

      try {
        const res = await fetch(`/api/games?month=${month}`);
        if (!res.ok) {
          throw new Error("Failed to fetch games for month " + month);
        }
        const games: Game[] = await res.json();
        setGameCache((prev) => ({ ...prev, [month]: games }));
      } catch (err) {
        console.error(err);
      }
    },
    [gameCache]
  );

  const preloadAdjacentMonths = useCallback(
    (month: string) => {
      const prevMonth = format(subMonths(new Date(month), 1), "yyyy-MM");
      const nextMonth = format(addMonths(new Date(month), 1), "yyyy-MM");

      fetchGamesForMonth(prevMonth);
      fetchGamesForMonth(nextMonth);
    },
    [fetchGamesForMonth]
  );

  useEffect(() => {
    preloadAdjacentMonths(currentMonth);
  }, [currentMonth, preloadAdjacentMonths]);

  const changeMonth = useCallback(
    (newMonth: string) => {
      setCurrentMonth(newMonth);
      if (!gameCache[newMonth]) {
        fetchGamesForMonth(newMonth);
      }
      preloadAdjacentMonths(newMonth);
    },
    [gameCache, fetchGamesForMonth, preloadAdjacentMonths]
  );

  return {
    games: gameCache[currentMonth] || [],
    changeMonth,
    currentMonth,
  };
}
