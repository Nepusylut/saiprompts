import React from 'react';
import { Film, ExternalLink, Play, Tv } from 'lucide-react';
import { VideoEmbedData } from '../types';

interface VideoEmbedProps {
  video: VideoEmbedData;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ video }) => {
  const getAspectClass = () => {
    switch (video.aspectRatio) {
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
      case '16:9':
      default:
        return 'aspect-video';
    }
  };

  const getPlatformLabel = () => {
    switch (video.type) {
      case 'youtube':
        return { name: 'YouTube', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60' };
      case 'vimeo':
        return { name: 'Vimeo', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/60' };
      case 'bilibili':
        return { name: 'Bilibili', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/60' };
      case 'mp4':
        return { name: 'MP4 Video', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60' };
      default:
        return { name: 'Web Video', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60' };
    }
  };

  const platform = getPlatformLabel();
  const directLink = video.originalUrl || video.src;

  return (
    <div id={`video-embed-${video.id}`} className="my-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className={`relative w-full overflow-hidden ${getAspectClass()} bg-slate-950`}>
        {video.type === 'youtube' && (
          <iframe
            src={video.src}
            title={video.title || 'YouTube Video Player'}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}

        {video.type === 'vimeo' && (
          <iframe
            src={video.src}
            title={video.title || 'Vimeo Video Player'}
            className="h-full w-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}

        {video.type === 'bilibili' && (
          <iframe
            src={video.src}
            title={video.title || 'Bilibili Video Player'}
            className="h-full w-full border-0"
            sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
            allowFullScreen
          />
        )}

        {video.type === 'mp4' && (
          <video
            src={video.src}
            controls
            poster={video.poster}
            preload="metadata"
            className="h-full w-full object-contain"
          >
            Your browser does not support HTML5 video tags.
          </video>
        )}

        {video.type === 'other' && (
          <iframe
            src={video.src}
            title={video.title || 'Web Video Player'}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>

      {/* Video Bar with Title, Platform Badge & External Link */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${platform.color}`}>
            <Play className="h-2.5 w-2.5 fill-current" />
            <span>{platform.name}</span>
          </span>
          <span className="font-semibold text-slate-900 dark:text-white truncate">
            {video.title || 'Video Tutorial'}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {video.caption && (
            <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:inline">
              {video.caption}
            </span>
          )}
          {directLink && !directLink.startsWith('data:') && (
            <a
              href={directLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              title="Open video on source website"
            >
              <span>Watch on {platform.name}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
