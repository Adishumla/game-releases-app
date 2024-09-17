"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

type SortOption = "release_date" | "popularity";

interface Game {
  id: number;
  name: string;
  released: string;
  added: number;
}

interface ClientSideSortProps {
  initialGames: Game[];
  onSort: (sortedGames: Game[]) => void;
}

export function ClientSideSort({ initialGames, onSort }: ClientSideSortProps) {
  const [sortBy, setSortBy] = useState<SortOption>("release_date");

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    const sortedGames = [...initialGames].sort((a, b) => {
      if (newSortBy === "release_date") {
        return new Date(a.released).getTime() - new Date(b.released).getTime();
      } else {
        return a.added - b.added;
      }
    });
    onSort(sortedGames);
  };

  return (
    <Select value={sortBy} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="release_date">Release Date</SelectItem>
        <SelectItem value="popularity">Popularity</SelectItem>
      </SelectContent>
    </Select>
  );
}
