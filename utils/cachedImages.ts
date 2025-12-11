// utils/cachedImages.ts
import fs from "fs";
import path from "path";
import type { ImageProps } from "./types";

let cachedResults: ImageProps[] | null = null;

export default async function getResults(): Promise<ImageProps[]> {
  if (cachedResults) return cachedResults;

  const enigmasDir = path.join(process.cwd(), "public", "enigmas");
  if (!fs.existsSync(enigmasDir)) return [];

  const folderNames = fs.readdirSync(enigmasDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  cachedResults = folderNames.map((folder, idx) => {
    const folderPath = path.join(enigmasDir, folder);

    // IMAGE DETECTION
    const imageFile = fs.readdirSync(folderPath).find((f) =>
      /\.(jpe?g|png|webp|gif|avif)$/i.test(f)
    );

    if (!imageFile) {
      console.warn(`No image found in folder "${folder}"`);
    }

    // ---------------------------
    // LOAD tags.txt
    // ---------------------------
    const tagsFile = path.join(folderPath, "tags.txt");
    let tags: string[] = [];
    let computer = 0;
    let difficulty = 0;

if (fs.existsSync(tagsFile)) {
  try {
    const raw = fs.readFileSync(tagsFile, "utf8");

    // Split by newline OR comma
    const parts = raw
      .split(/[\n,]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // First element → computer
    if (parts.length >= 1) {
      const n = Number(parts[0]);
      if (!isNaN(n)) computer = n;
    }

    // Second element → difficulty
    if (parts.length >= 2) {
      const n = Number(parts[1]);
      if (!isNaN(n)) difficulty = n;
    }

    // Remaining elements → tags
    tags = parts.slice(2);
  } catch (err) {
    console.error(`Cannot read tags.txt in "${folder}"`, err);
  }
}

    return {
      id: idx + 1,
      folderName: folder,
      src: imageFile ? `/enigmas/${encodeURIComponent(folder)}/${encodeURIComponent(imageFile)}` : "",
      width: 720,
      height: 480,
      computer,
      difficulty,
      tags,
    };
  });

  return cachedResults;
}
