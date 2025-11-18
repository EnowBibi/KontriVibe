/*-----------------------------------------------------------------------------------------------------
| @blocktype useLyricsGenerator
| @brief    Custom hook managing AI lyrics generation state and API communication
| @param    --
| @return   { generateLyrics, loading, error, lyrics, clearLyrics }
-----------------------------------------------------------------------------------------------------*/

import BASE_URL from "@/config/api";
import type {
  APIError,
  GenerateLyricsRequest,
  GenerateLyricsResponse,
} from "@/types/lyrics";
import { useCallback, useState } from "react";

export const useLyricsGenerator = () => {
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedMetadata, setGeneratedMetadata] = useState<{
    theme: string;
    mood: string;
    genre: string;
  } | null>(null);

  const generateLyrics = useCallback(async (request: GenerateLyricsRequest) => {
    setLoading(true);
    setError(null);

    try {
      const token = ""; // Retrieve from secure storage (AsyncStorage/SecureStore)
      // For now, assuming token is available from auth context

      const response = await fetch(`${BASE_URL}/api/ai/lyrics/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      const data: GenerateLyricsResponse | APIError = await response.json();

      if (!response.ok) {
        const error = data as APIError;
        throw new Error(error.message || "Failed to generate lyrics");
      }

      const result = data as GenerateLyricsResponse;
      setLyrics(result.lyrics);
      setGeneratedMetadata({
        theme: result.theme,
        mood: result.mood,
        genre: result.genre,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("[Lyrics Generation Error]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLyrics = useCallback(() => {
    setLyrics(null);
    setGeneratedMetadata(null);
    setError(null);
  }, []);

  return {
    generateLyrics,
    loading,
    error,
    lyrics,
    generatedMetadata,
    clearLyrics,
  };
};
