"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/src/components/ui/card";
import { format } from "date-fns";
import GameModal from "./GameModal";

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

export function GameCard({ game }: { game: FullGame }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const releaseDate = game.released ? new Date(game.released) : null;
  const isValidDate =
    releaseDate instanceof Date && !isNaN(releaseDate.getTime());
  const formattedDate = isValidDate
    ? format(releaseDate, "MMMM d, yyyy")
    : "TBA";

  const handleCardClick = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return (
    <>
      <Card
        className="overflow-hidden relative group cursor-pointer transition-transform duration-200 hover:scale-105"
        onClick={handleCardClick}
      >
        <div className="aspect-video relative">
          {game.background_image ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <Image
                src={game.background_image}
                alt={game.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-opacity duration-300 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  console.error(
                    `Failed to load image for game: ${game.name}`,
                    e
                  );
                  setImageLoading(false);
                }}
                loading="lazy"
                quality={75}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 transition-opacity group-hover:opacity-50" />
        </div>
        <CardContent className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-white text-xl font-bold mb-1 line-clamp-2">
            {game.name}
          </h3>
          <p className="text-white text-sm mb-1">
            Release Date: {formattedDate}
          </p>
          {game.metacritic && (
            <p className="text-white text-sm font-semibold">
              Metacritic: {game.metacritic}
            </p>
          )}
        </CardContent>
      </Card>

      {modalVisible && (
        <GameModal
          gameDetails={game}
          formattedDate={formattedDate}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
