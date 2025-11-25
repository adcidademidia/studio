import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a Google Drive sharing URL into a direct image link.
 * @param url The Google Drive sharing URL.
 * @returns A direct image URL or an empty string if the URL is invalid.
 */
export function convertGoogleDriveLink(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') {
    return "";
  }
  const regex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  // Return the original URL if it doesn't match, in case it's already a direct link.
  return url;
}
