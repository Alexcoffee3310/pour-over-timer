
/**
 * Formats seconds into a time display string (MM:SS or HH:MM:SS)
 */
export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  if (hours > 0) {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  }
  return `${padZero(minutes)}:${padZero(seconds)}`;
}

/**
 * Adds a leading zero to numbers less than 10
 */
function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Converts hours, minutes, seconds to total seconds
 */
export function toSeconds(hours: number, minutes: number, seconds: number): number {
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Parse a time string (HH:MM:SS or MM:SS) to seconds
 */
export function parseTimeString(timeString: string): number {
  const parts = timeString.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 3) {
    // HH:MM:SS format
    return toSeconds(parts[0], parts[1], parts[2]);
  } else if (parts.length === 2) {
    // MM:SS format
    return toSeconds(0, parts[0], parts[1]);
  }
  
  return 0;
}

/**
 * Format seconds as a human-readable duration (e.g., "2m 30s")
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

