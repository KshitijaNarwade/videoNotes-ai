import { YoutubeTranscript } from "youtube-transcript";

const videoId = "dQw4w9WgXcQ";

const test = async () => {
  try {
    console.log("Testing transcript...");
    console.log("Video:", videoId);

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    console.log("Transcript count:", transcript.length);

    console.log("First 5 entries:", transcript.slice(0, 5));
  } catch (error) {
    console.error("Transcript failed:");
    console.error(error);
  }
};

test();
