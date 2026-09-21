import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

const envCandidates = [
  path.join(process.cwd(), ".env.local"),
  path.join(process.cwd(), ".env"),
  path.join(process.cwd(), ".env.development"),
  path.join(process.cwd(), ".env.production"),
];

for (const envPath of envCandidates) {
  dotenv.config({ path: envPath });
}

export interface InstagramProfileData {
  username: string;
  fullName: string;
  externalUrl?: string;
  postsCount: number;
  followingCount: number;
  followersCount: number;
  profilePicUrl?: string;
  previewImageUrl?: string;
  indexLabel: string;
  sourceKeyIndex?: number;
  verifiedDemo?: boolean;
  updatedAt?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORAGE_FILE = path.join(DATA_DIR, "saved_instagram.json");

function ensureStorageDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getSavedProfiles(): InstagramProfileData[] {
  try {
    ensureStorageDir();
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => item && typeof item.username === "string");
      } else if (parsed && parsed.username) {
        return [parsed];
      }
    }
  } catch (err) {
    console.error("Error reading saved Instagram profiles:", err);
  }
  return [];
}

function deleteProfile(username: string): InstagramProfileData[] {
  try {
    ensureStorageDir();
    const currentList = getSavedProfiles();
    const cleanUser = username.toLowerCase().trim();
    const remaining = currentList.filter(
      (item) => item.username.toLowerCase().trim() !== cleanUser
    );
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(remaining, null, 2), "utf-8");
    return remaining;
  } catch (err) {
    console.error("Error deleting Instagram profile:", err);
    return [];
  }
}

function persistProfile(data: InstagramProfileData): { saved: InstagramProfileData; all: InstagramProfileData[] } {
  try {
    ensureStorageDir();
    const currentList = getSavedProfiles();
    const cleanUser = data.username.toLowerCase().trim();

    // Filter out any existing item with the same username
    const remaining = currentList.filter(
      (item) => item.username.toLowerCase().trim() !== cleanUser
    );

    const updatedItem: InstagramProfileData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Prepend new/updated profile so latest dropped appears first
    const updatedList = [updatedItem, ...remaining];
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(updatedList, null, 2), "utf-8");
    return { saved: updatedItem, all: updatedList };
  } catch (err) {
    console.error("Error saving Instagram profile list:", err);
    return { saved: data, all: [data] };
  }
}

// Apify API key rotation pool with support for APIFY_API_KEY, APIFY_TOKEN, and APIFY_API_KEY_1..5
function getApifyKeys(): string[] {
  const keys: string[] = [];
  const primary = process.env.APIFY_API_KEY?.trim() || process.env.APIFY_TOKEN?.trim();
  if (primary && !keys.includes(primary)) {
    keys.push(primary);
  }
  for (let i = 1; i <= 5; i++) {
    const key = process.env[`APIFY_API_KEY_${i}`]?.trim();
    if (key && !keys.includes(key)) {
      keys.push(key);
    }
  }
  return keys;
}

async function scrapeWithApify(
  username: string,
  keys: string[]
): Promise<{ data: InstagramProfileData | null; usedKeyIndex: number; error?: string }> {
  const maxKeysToTry = Math.min(keys.length, 2);
  for (let i = 0; i < maxKeysToTry; i++) {
    const key = keys[i];
    console.log(`[Apify Scraper] Attempting Apify API Key #${i + 1} for user @${username}...`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      // Attempt primary actor: apify~instagram-profile-scraper
      let response = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(key)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usernames: [username],
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      // Status 401 (invalid key), 402 (credit limit reached), 403, 429 (rate limit)
      if (response.status === 402 || response.status === 401 || response.status === 403 || response.status === 429) {
        console.warn(`[Apify Scraper] Key #${i + 1} exhausted or rejected (${response.status}). Rotating to next key...`);
        continue;
      }

      if (!response.ok) {
        // Try fallback actor: apify~instagram-scraper
        const fallbackCtrl = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackCtrl.abort(), 6000);
        response = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(key)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              directUrls: [`https://www.instagram.com/${username}/`],
              resultsType: "details",
            }),
            signal: fallbackCtrl.signal,
          }
        );
        clearTimeout(fallbackTimeout);
      }

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        console.warn(`[Apify Scraper] Key #${i + 1} response not ok (${response.status}): ${errText}. Rotating...`);
        continue;
      }

      const items = await response.json();
      if (Array.isArray(items) && items.length > 0) {
        const item = items[0];
        const data: InstagramProfileData = {
          username: item.username || username,
          fullName: item.fullName || item.name || item.username || username,
          externalUrl: item.externalUrl || item.url || (item.bioLinks && item.bioLinks[0]?.url) || undefined,
          postsCount: Number(item.postsCount ?? item.mediaCount ?? item.posts ?? 0),
          followingCount: Number(item.followsCount ?? item.followingCount ?? item.following ?? 0),
          followersCount: Number(item.followersCount ?? item.followers ?? 0),
          profilePicUrl: item.profilePicUrlHD || item.profilePicUrl || item.displayUrl || "",
          previewImageUrl:
            (item.latestPosts && item.latestPosts[0]?.displayUrl) ||
            item.profilePicUrlHD ||
            item.profilePicUrl ||
            "",
          indexLabel: "1 of 1",
          sourceKeyIndex: i + 1,
        };

        return { data, usedKeyIndex: i + 1 };
      }
    } catch (err: any) {
      console.warn(`[Apify Scraper] Exception with Key #${i + 1}: ${err.message}. Rotating...`);
      continue;
    }
  }

  return { data: null, usedKeyIndex: -1, error: "All Apify API keys exhausted or unavailable." };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize storage
  ensureStorageDir();

  // GET /api/saved-instagram - Read all currently saved permanent profiles
  app.get("/api/saved-instagram", (req, res) => {
    const list = getSavedProfiles();
    res.json({ success: true, data: list });
  });

  // POST /api/saved-instagram - Save/Update permanent profile in multi-user pool
  app.post(["/api/saved-instagram", "/api/save-instagram"], (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== "object" || !payload.username) {
        return res.status(400).json({ success: false, error: "Invalid profile data" });
      }
      const result = persistProfile(payload);
      console.log(`[Instagram Storage] Successfully saved profile for @${result.saved.username}. Total: ${result.all.length}`);
      res.json({ success: true, data: result.saved, all: result.all, message: "Profile saved permanently." });
    } catch (err: any) {
      console.error("Save profile error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Delete a saved profile
  app.delete("/api/saved-instagram/:username", (req, res) => {
    try {
      const username = req.params.username;
      const remaining = deleteProfile(username);
      res.json({ success: true, all: remaining, message: `Removed @${username}` });
    } catch (err: any) {
      console.error("Delete profile error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Endpoint: /api/instagram-lookup
  app.all("/api/instagram-lookup", async (req, res) => {
    try {
      const rawInput = (req.body?.username || req.query?.username || "").toString().trim();
      if (!rawInput) {
        return res.status(400).json({ success: false, error: "Username is required" });
      }

      // Clean username (remove '@' and URLs)
      let username = rawInput.replace(/^@/, "");
      if (username.includes("instagram.com/")) {
        username = username.split("instagram.com/")[1]?.split("/")[0]?.split("?")[0] || username;
      }
      username = username.replace(/[/?#].*$/, "").trim();

      const keys = getApifyKeys();

      // If keys are provided, try Apify rotation (Key 1 -> Key 5)
      if (keys.length > 0) {
        const scrapeRes = await scrapeWithApify(username, keys);
        if (scrapeRes.data) {
          // Persist the freshly scraped profile so it never vanishes
          const result = persistProfile(scrapeRes.data);
          return res.json({
            success: true,
            data: result.saved,
            all: result.all,
            message: `Scraped and saved permanently via Apify Key #${scrapeRes.usedKeyIndex}`,
          });
        }
      }

      // Resilient Fallback for user's entered Instagram:
      // Even if Apify keys are not yet configured or credits ran out,
      // create a clean, persistent profile card for the user's requested handle so it NEVER vanishes!
      const userProfile: InstagramProfileData = {
        username: username,
        fullName: username,
        externalUrl: `https://instagram.com/${username}`,
        postsCount: 0,
        followingCount: 0,
        followersCount: 0,
        profilePicUrl: "",
        previewImageUrl: "",
        indexLabel: "1 of 1",
        verifiedDemo: false,
      };

      const result = persistProfile(userProfile);
      const fallbackMessage = keys.length === 0
        ? `No Apify key configured. Profile @${username} was saved as a local fallback card until you add APIFY_API_KEY or APIFY_API_KEY_1..5 in a .env file.`
        : `Apify keys reached their limit or rejected the request. Profile @${username} was saved as a local fallback card.`;

      return res.json({
        success: true,
        data: result.saved,
        all: result.all,
        source: keys.length === 0 ? "fallback-no-apify" : "fallback-apify-limit",
        message: fallbackMessage,
      });
    } catch (error: any) {
      console.error("Instagram lookup error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    const list = getSavedProfiles();
    res.json({
      status: "ok",
      apifyKeysCount: getApifyKeys().length,
      savedCount: list.length,
      savedUsers: list.map((p) => p.username),
      configured: getApifyKeys().length > 0,
      envFiles: [".env", ".env.local", ".env.development", ".env.production"],
    });
  });

  // Vite middleware for development vs static production serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
