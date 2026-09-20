import { YoutubeTranscript } from "youtube-transcript";

export interface TranscriptItem {
  // this TrasctiptItem may have the trascritp text or the caption text
  text: string;
  start: number;
  duration: number;
}

export interface YouTubeMetadata {
  title: string;
  description: string;
  thumbnailUrl: string;
}

export const extractYouTubeId = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url); // check if the provided URL is valid or not.[and this new URL(url) wii provide you parsedUrl.hostname, parsedUrl.pathname, parsedUrl.searchParams]

    // https://youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1) || null;
    }

    // YouTube URLs
    if (
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com" ||
      parsedUrl.hostname === "m.youtube.com"
    ) {
      // https://www.youtube.com/watch?v=VIDEO_ID
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return videoId;
      }

      // https://www.youtube.com/embed/VIDEO_ID
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return parsedUrl.pathname.split("/embed/")[1] || null;
      }

      // https://www.youtube.com/shorts/VIDEO_ID
      if (parsedUrl.pathname.startsWith("/shorts/")) {
        return parsedUrl.pathname.split("/shorts/")[1] || null;
      }
    }

    return null;
  } catch {
    return null;
  }
};

//Promise<YouTubeMetadata> this means that this function will eventually return the YouTubeMetadata object.
export const getYouTubeMetadata = async (
  videoId: string,
): Promise<YouTubeMetadata> => {
  const response = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
  );

  // HTTP 200 -> respose.ok = true : HTTP 401 -> response.ok = false : HTTP 500 -> respose.ok = false
  if (!response.ok) {
    throw new Error("Unable to fetch YouTube video metadata");
  }

  const data = await response.json();

  return {
    title: data.title ?? "Untitled Video",
    description: "",
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
};

export const getYouTubeTranscript = async (
  videoId: string,
): Promise<TranscriptItem[]> => {
  try {
    console.log("=================================");
    console.log("VIDEO ID:", videoId);
    console.log("Fetching YouTube transcript...");
    console.log("=================================");

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    console.log("Transcript snippets:", transcript.length);

    if (!transcript.length) {
      throw new Error("YouTube returned an empty transcript");
    }

    console.log("Transcript language:", transcript[0]?.lang ?? "unknown");

    return transcript.map((item) => ({
      text: item.text,
      start: Number(item.offset) / 1000,
      duration: Number(item.duration) / 1000,
    }));
  } catch (error) {
    console.error("=================================");
    console.error("TRANSCRIPT ERROR");
    console.error("=================================");
    console.error(error);
    console.error("=================================");

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch YouTube transcript",
    );
  }
};

export const transcriptToText = (transcript: TranscriptItem[]): string => {
  return transcript
    .map((item) => {
      const minutes = Math.floor(item.start / 60);

      const seconds = Math.floor(item.start % 60);

      const timestamp =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;

      return `[${timestamp}] ${item.text}`;
    })
    .join("\n");
};
