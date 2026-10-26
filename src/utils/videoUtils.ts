import { VideoEmbedData } from '../types';

export interface ParsedVideoResult {
  isValid: boolean;
  type: 'youtube' | 'vimeo' | 'bilibili' | 'mp4' | 'other';
  embedSrc: string;
  originalUrl: string;
  platformName: string;
  videoId?: string;
  error?: string;
}

/**
 * Parses user input video links (YouTube, Vimeo, Bilibili, direct MP4, or web embeds)
 * and returns the appropriate iframe embed URL or media source.
 */
export function parseVideoUrl(input: string): ParsedVideoResult {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      type: 'other',
      embedSrc: '',
      originalUrl: '',
      platformName: 'Unknown',
      error: 'Please enter a valid video link'
    };
  }

  let raw = input.trim();

  // If user pasted an entire <iframe> embed code snippet, extract the src attribute
  const iframeSrcMatch = raw.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    raw = iframeSrcMatch[1].trim();
  }

  // 1. YouTube Detection
  // Matches:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  // - https://m.youtube.com/watch?v=VIDEO_ID
  const ytWatchMatch = raw.match(/(?:youtube\.com\/(?:watch\?.*?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytWatchMatch && ytWatchMatch[1]) {
    const videoId = ytWatchMatch[1];
    
    // Extract optional start time parameter
    let startSeconds = 0;
    const timeMatch = raw.match(/[?&](?:t|start)=(\d+)(?:s)?/i);
    if (timeMatch && timeMatch[1]) {
      startSeconds = parseInt(timeMatch[1], 10);
    }

    const embedSrc = startSeconds > 0
      ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&start=${startSeconds}`
      : `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;

    return {
      isValid: true,
      type: 'youtube',
      embedSrc,
      originalUrl: raw.startsWith('//') ? `https:${raw}` : raw,
      platformName: 'YouTube',
      videoId
    };
  }

  // 2. Vimeo Detection
  // Matches:
  // - https://vimeo.com/123456789
  // - https://player.vimeo.com/video/123456789
  const vimeoMatch = raw.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      isValid: true,
      type: 'vimeo',
      embedSrc: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`,
      originalUrl: raw.startsWith('//') ? `https:${raw}` : raw,
      platformName: 'Vimeo',
      videoId
    };
  }

  // 3. Bilibili Detection
  // Matches:
  // - https://www.bilibili.com/video/BV1xx411c7mD
  // - https://www.bilibili.com/video/av12345678
  // - //player.bilibili.com/player.html?bvid=...
  const bilibiliBvMatch = raw.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/i);
  const bilibiliAvMatch = raw.match(/bilibili\.com\/video\/av(\d+)/i);
  const bilibiliPlayerMatch = raw.match(/player\.bilibili\.com\/player\.html\?(bvid=[^&]+|aid=[^&]+)/i);

  if (bilibiliBvMatch && bilibiliBvMatch[1]) {
    const bvid = bilibiliBvMatch[1];
    return {
      isValid: true,
      type: 'bilibili',
      embedSrc: `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0&autoplay=0`,
      originalUrl: raw.startsWith('//') ? `https:${raw}` : raw,
      platformName: 'Bilibili',
      videoId: bvid
    };
  } else if (bilibiliAvMatch && bilibiliAvMatch[1]) {
    const aid = bilibiliAvMatch[1];
    return {
      isValid: true,
      type: 'bilibili',
      embedSrc: `https://player.bilibili.com/player.html?aid=${aid}&page=1&high_quality=1&danmaku=0&autoplay=0`,
      originalUrl: raw.startsWith('//') ? `https:${raw}` : raw,
      platformName: 'Bilibili',
      videoId: `av${aid}`
    };
  } else if (bilibiliPlayerMatch) {
    const cleanSrc = raw.startsWith('//') ? `https:${raw}` : raw;
    return {
      isValid: true,
      type: 'bilibili',
      embedSrc: cleanSrc,
      originalUrl: cleanSrc,
      platformName: 'Bilibili'
    };
  }

  // 4. Direct Video Files (HTML5 Video)
  // Matches: .mp4, .webm, .ogg, .mov, or Cloudflare R2 / S3 video files
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(raw)) {
    return {
      isValid: true,
      type: 'mp4',
      embedSrc: raw,
      originalUrl: raw,
      platformName: 'Direct Video File (MP4/WebM)'
    };
  }

  // 5. Common third-party embed platforms
  // Dailymotion
  const dailyMotionMatch = raw.match(/dailymotion\.com\/(?:video|embed\/video)\/([a-zA-Z0-9]+)/i);
  if (dailyMotionMatch && dailyMotionMatch[1]) {
    return {
      isValid: true,
      type: 'other',
      embedSrc: `https://www.dailymotion.com/embed/video/${dailyMotionMatch[1]}`,
      originalUrl: raw,
      platformName: 'Dailymotion'
    };
  }

  // Loom
  const loomMatch = raw.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
  if (loomMatch && loomMatch[1]) {
    return {
      isValid: true,
      type: 'other',
      embedSrc: `https://www.loom.com/embed/${loomMatch[1]}`,
      originalUrl: raw,
      platformName: 'Loom'
    };
  }

  // 6. Generic web URL / embed URL
  if (/^https?:\/\//i.test(raw)) {
    return {
      isValid: true,
      type: 'other',
      embedSrc: raw,
      originalUrl: raw,
      platformName: 'Web Video'
    };
  }

  return {
    isValid: false,
    type: 'other',
    embedSrc: '',
    originalUrl: raw,
    platformName: 'Invalid',
    error: 'Please enter a valid URL starting with https://'
  };
}

/**
 * Formats a video link into a full VideoEmbedData object
 */
export function createVideoEmbedData(
  url: string,
  title?: string,
  caption?: string
): VideoEmbedData | null {
  const parsed = parseVideoUrl(url);
  if (!parsed.isValid) return null;

  return {
    id: `video-${Date.now()}`,
    type: parsed.type,
    src: parsed.embedSrc,
    originalUrl: parsed.originalUrl,
    title: title?.trim() || `${parsed.platformName} Video Tutorial`,
    caption: caption?.trim() || undefined,
    aspectRatio: '16:9'
  };
}
