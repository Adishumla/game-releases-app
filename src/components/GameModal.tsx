"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GameDetails {
  id: number;
  name: string;
  released: string;
  background_image: string | null;
  metacritic: number | null;
  description: string;
  platforms: string[];
  genres: string[];
  screenshots: string[];
  website: string | null;
  added: number;
}

export default function GameModal({
  gameDetails,
  formattedDate,
  loading,
  error,
  onClose,
}: {
  gameDetails: GameDetails | null;
  formattedDate: string;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const changeImage = useCallback(
    (direction: "next" | "prev") => {
      if (!gameDetails || !gameDetails.screenshots) return;
      const totalImages = gameDetails.screenshots.length;
      setCurrentImageIndex((prevIndex) => {
        const newIndex =
          direction === "next"
            ? (prevIndex + 1) % totalImages
            : (prevIndex - 1 + totalImages) % totalImages;
        return newIndex;
      });
    },
    [gameDetails]
  );

  if (loading && !gameDetails && !error) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  if (error && !gameDetails) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!gameDetails) return null;

  const currentImage =
    gameDetails.screenshots[currentImageIndex] ||
    gameDetails.background_image ||
    "/placeholder.png";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video">
          <Image
            src={currentImage}
            alt={`${gameDetails.name} screenshot ${currentImageIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-t-lg"
            priority
            quality={75}
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
          >
            <X size={24} />
          </button>
          {gameDetails.screenshots.length > 1 && (
            <>
              <button
                onClick={() => changeImage("prev")}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => changeImage("next")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            {gameDetails.name}
          </h2>
          <p className="text-gray-700 mb-4">Released: {formattedDate}</p>
          <p className="text-gray-800 mb-4">{gameDetails.description}</p>
          {gameDetails.platforms?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1 text-gray-900">Platforms:</h3>
              <p className="text-gray-700">
                {gameDetails.platforms.join(", ")}
              </p>
            </div>
          )}
          {gameDetails.genres?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1 text-gray-900">Genres:</h3>
              <p className="text-gray-700">{gameDetails.genres.join(", ")}</p>
            </div>
          )}
          {gameDetails.website && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1 text-gray-900">Website:</h3>
              <a
                href={gameDetails.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {gameDetails.website}
              </a>
            </div>
          )}
          {gameDetails.stores?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1 text-gray-900">Where to Buy:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {gameDetails.stores.map((store) => (
                  <li key={store.id}>
                    <a
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {store.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
