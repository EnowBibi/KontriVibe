/*-----------------------------------------------------------------------------------------------------
 | @hook usePost
 | @brief Custom hook for managing post creation and fetching operations
 ----------------------------------------------------------------------------------------------------*/

import BASE_URL from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

interface CreatePostPayload {
  authorId: string;
  content: string;
  visibility: "public" | "private";
  relatedChallengeId?: string;
  relatedSongId?: string;
  aiGenerated?: boolean;
  media?: any;
}

export const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*-------------------------------------------------------------------------------------------------
   | @function createPost
   | @brief    Creates a new post with optional media upload
   | @param    payload - Post creation data
   | @return   Promise with post creation response
   ----------------------------------------------------------------------------------------------------*/
  const createPost = async (payload: CreatePostPayload) => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem("authToken");
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof CreatePostPayload]) {
          formData.append(key, payload[key as keyof CreatePostPayload]);
        }
      });

      const response = await fetch(`${BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error };
};
