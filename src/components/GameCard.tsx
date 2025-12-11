"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/src/components/ui/card";
import { format } from "date-fns";
import GameModal from "./GameModal";
import type { Game, GameDetails } from "@/src/lib/api";

export function GameCard({ game }: { game: Game }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = (() => {
    const releaseDate = game.released ? new Date(game.released) : null;
    const isValidDate =
      releaseDate instanceof Date && !isNaN(releaseDate.getTime());
    return isValidDate ? format(releaseDate, "MMMM d, yyyy") : "TBA";
  })();

  const loadGameDetails = useCallback(async () => {
    if (!gameDetails && !isLoadingDetails) {
      setIsLoadingDetails(true);
      try {
        const res = await fetch(`/api/game/${game.id}`, {
          cache: "force-cache",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch game details");
        }
        const details: GameDetails = await res.json();
        setGameDetails(details);
      } catch (err) {
        console.error(err);
        setError("Failed to load game details");
      } finally {
        setIsLoadingDetails(false);
      }
    }
  }, [game.id, gameDetails, isLoadingDetails]);

  const handleCardClick = useCallback(async () => {
    setModalVisible(true);
    loadGameDetails();
  }, [loadGameDetails]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return (
    <>
      <Card
        className="overflow-hidden relative group cursor-pointer transition-transform duration-200 hover:scale-105 rounded-lg shadow-md hover:shadow-lg"
        onClick={handleCardClick}
        onMouseEnter={loadGameDetails}
        onFocus={loadGameDetails}
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
                className={`object-cover transition-opacity duration-300 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoadingComplete={() => setImageLoading(false)}
                onError={(e) => {
                  console.error(
                    `Failed to load image for game: ${game.name}`,
                    e
                  );
                  setImageLoading(false);
                  setError("Failed to load image");
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity group-hover:opacity-70" />
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
          <div className="mt-2 flex space-x-3">
            <a
              href={`https://store.steampowered.com/search/?term=${encodeURIComponent(game.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xs underline hover:text-blue-300"
              onClick={(e) => e.stopPropagation()}
            >
              Steam
            </a>
            <a
              href={`https://gg.deals/search/?q=${encodeURIComponent(game.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xs underline hover:text-blue-300"
              onClick={(e) => e.stopPropagation()}
            >
              GG.deals
            </a>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </CardContent>
      </Card>

      {modalVisible && (
        <GameModal
          gameDetails={gameDetails}
          formattedDate={formattedDate}
          loading={isLoadingDetails}
          error={error}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
