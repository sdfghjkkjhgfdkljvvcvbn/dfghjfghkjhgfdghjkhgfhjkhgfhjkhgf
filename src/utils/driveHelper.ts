/**
 * Google Drive Sharing URL Parser & Transformer
 * Parses standard Google Drive URLs and returns raw hotlink streaming links
 * optimized for HTML5 <img> and <video> tags.
 */
export function transformDriveUrl(url: string, mediaType: "image" | "video" = "image"): string {
  if (!url) return "";

  // If it doesn't look like a Google Drive URL, return as is (e.g., Unsplash, local assets)
  if (!url.includes("drive.google.com") && !url.includes("docs.google.com")) {
    return url;
  }

  try {
    let fileId = "";

    // Pattern 1: /file/d/[ID]/view or /file/d/[ID]/edit
    const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/);
    if (fileDMatch && fileDMatch[1]) {
      fileId = fileDMatch[1];
    }

    // Pattern 2: ?id=[ID] or &id=[ID]
    if (!fileId) {
      const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
      if (idParamMatch && idParamMatch[1]) {
        fileId = idParamMatch[1];
      }
    }

    // Pattern 3: /d/[ID]/view
    if (!fileId) {
      const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
      if (dMatch && dMatch[1]) {
        fileId = dMatch[1];
      }
    }

    // If we successfully found a file ID, build the appropriate direct URL
    if (fileId) {
      if (mediaType === "image") {
        // High-speed Google User Content CDN endpoint, supports standard hotlinking
        return `https://lh3.googleusercontent.com/d/${fileId}`;
      } else {
        // Direct streamable file download endpoint for video players
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
  } catch (error) {
    console.error("Error parsing Google Drive URL:", error);
  }

  return url;
}
