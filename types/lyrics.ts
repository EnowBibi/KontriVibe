/*-----------------------------------------------------------------------------------------------------
| @blocktype lyricsTypes
| @brief    TypeScript interfaces for AI lyrics generation feature
| @param    --
| @return   --
-----------------------------------------------------------------------------------------------------*/

export interface GenerateLyricsRequest {
  theme: string;
  mood: string;
  genre: string;
  language?: "en" | "fr" | "pid";
  customPrompt?: string;
}

export interface GenerateLyricsResponse {
  success: boolean;
  lyrics: string;
  theme: string;
  mood: string;
  genre: string;
  generatedAt: string;
  contentId?: string;
}

export interface LyricsHistory {
  id: string;
  lyrics: string;
  theme: string;
  mood: string;
  genre: string;
  createdAt: string;
  isSaved: boolean;
}

export interface APIError {
  success: false;
  message: string;
  code?: string;
}
