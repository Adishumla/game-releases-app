"use client";

import React, { useState, useCallback, useEffect } from "react";
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
}

export default function GameModal({
  gameDetails,
  formattedDate,
  onClose,
}: {
  gameDetails: GameDetails;
  formattedDate: string;
  onClose: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const changeImage = useCallback(
    (direction: "next" | "prev") => {
      const totalImages = gameDetails.screenshots.length;
      setCurrentImageIndex((prevIndex) => {
        const newIndex =
          direction === "next"
            ? (prevIndex + 1) % totalImages
            : (prevIndex - 1 + totalImages) % totalImages;
        return newIndex;
      });
    },
    [gameDetails.screenshots.length]
  );

  const currentImage =
    gameDetails.screenshots[currentImageIndex] ||
    gameDetails.background_image ||
    "/placeholder.png";

  useEffect(() => {
    const preload = async () => {
      const imagesToPreload = [
        currentImage,
        ...gameDetails.screenshots,
        gameDetails.background_image,
      ].filter((img): img is string => img !== null);

      console.log("Preloaded images:", imagesToPreload);
    };
    preload();
  }, [currentImage, gameDetails.screenshots, gameDetails.background_image]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-transform duration-300 scale-100"
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
            quality={85}
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
          {gameDetails.platforms && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1 text-gray-900">Platforms:</h3>
              <p className="text-gray-700">
                {gameDetails.platforms.join(", ")}
              </p>
            </div>
          )}
          {gameDetails.genres && (
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
        </div>
      </div>
    </div>
  );
}
