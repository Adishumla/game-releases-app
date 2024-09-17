"use client";

import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

type SortOption = "release_date" | "popularity";

interface SortSelectProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
}

export function SortSelect({ value, onValueChange }: SortSelectProps) {
  const handleSortChange = useCallback(
    (newSortBy: SortOption) => {
      onValueChange(newSortBy);
    },
    [onValueChange]
  );

  return (
    <Select value={value} onValueChange={handleSortChange}>
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
