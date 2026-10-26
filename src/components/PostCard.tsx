import React from 'react';
import { Clock, ArrowRight, Sparkles, Video, BookOpen, Layers, Bookmark } from 'lucide-react';
import { BlogPost } from '../types';

export interface PostCardProps {
  post: BlogPost;
  onSelectPost: (post: BlogPost) => void;
  isSaved?: boolean;
  onToggleSave?: (post: BlogPost, e: React.MouseEvent) => void;
  pageTopCardBg?: string;
}

export const getCategoryTheme = (category: string = '') => {
  const cat = (category || '').toLowerCase();

  const isPromptCat = 
    cat.includes('prompt') || 
    ['general prompts', 'music prompts', 'image prompts', 'video prompts', 'article prompts', 'ai prompts'].includes(cat);

  const isTechCat = 
    cat.includes('guide') || 
    cat.includes('tech') || 
    cat.includes('full-stack') || 
    cat.includes('system') || 
    cat.includes('architecture') || 
    cat.includes('database') ||
    ['general guides', 'full-stack guides', 'ai system guides', 'technical guides', 'cloud architecture', 'database guides'].includes(cat);

  if (isPromptCat) {
    // All Prompts articles webcard default color: Light Green
    return {
      type: 'prompt',
      gradient: 'bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 dark:from-emerald-950/90 dark:via-slate-900 dark:to-teal-950/90',
      border: 'border-emerald-200 dark:border-emerald-800/80',
      hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500',
      text: 'text-emerald-950 dark:text-emerald-100',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800',
      categoryPill: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
      iconBoxBg: 'bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800 shadow-xs',
      Icon: Sparkles,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      actionText: 'text-emerald-700 dark:text-emerald-400',
    };
  }

  if (isTechCat) {
    // All Technical Guides articles webcard default color: Light Blue
    return {
      type: 'tech',
      gradient: 'bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 dark:from-sky-950/90 dark:via-slate-900 dark:to-cyan-950/90',
      border: 'border-sky-200 dark:border-sky-800/80',
      hoverBorder: 'hover:border-sky-400 dark:hover:border-sky-500',
      text: 'text-sky-950 dark:text-sky-100',
      badge: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800',
      categoryPill: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800',
      iconBoxBg: 'bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-sky-800 shadow-xs',
      Icon: BookOpen,
      iconColor: 'text-sky-600 dark:text-sky-400',
      actionText: 'text-sky-700 dark:text-sky-400',
    };
  }

  // All other Articles webcard default color: Light Purple
  return {
    type: 'article',
    gradient: 'bg-gradient-to-br from-purple-100 via-violet-50 to-fuchsia-100 dark:from-purple-950/90 dark:via-slate-900 dark:to-indigo-950/90',
    border: 'border-purple-200 dark:border-purple-800/80',
    hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-500',
    text: 'text-purple-950 dark:text-purple-100',
    badge: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800',
    categoryPill: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800',
    iconBoxBg: 'bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-800 shadow-xs',
    Icon: Layers,
    iconColor: 'text-purple-600 dark:text-purple-400',
    actionText: 'text-purple-700 dark:text-purple-400',
  };
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onSelectPost,
  isSaved = false,
  onToggleSave,
}) => {
  const hasPhoto = Boolean(post.featuredImage && post.featuredImage.trim() !== '');
  const hasVideo = Boolean(post.videoUrl && post.videoUrl.trim() !== '') || Boolean(post.videos && post.videos.length > 0);
  const catTheme = getCategoryTheme(post.category);
  const IconComponent = catTheme.Icon;

  // Upper part background color when no photo uploaded:
  // Light green for Prompts, Light blue for Technical Guides, Light purple for all Articles
  const upperBg = catTheme.gradient;

  return (
    <article 
      id={`post-card-${post.id}`}
      onClick={() => onSelectPost(post)}
      className={`group relative cursor-pointer overflow-hidden rounded-xl bg-white dark:bg-slate-900 transition-all duration-200 hover:shadow-md flex flex-col justify-between shadow-xs border ${
        hasPhoto
          ? 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500'
          : `${catTheme.border} ${catTheme.hoverBorder}`
      }`}
    >
      <div>
        {/* One-Click Bookmark Button */}
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(post, e);
            }}
            className={`absolute right-3 top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md shadow-sm transition-all duration-200 active:scale-90 ${
              isSaved
                ? 'bg-indigo-600 text-white border border-indigo-500 shadow-indigo-500/30'
                : 'bg-white/85 dark:bg-slate-900/85 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80'
            }`}
            title={isSaved ? "Remove bookmark" : "Bookmark article (1-click)"}
            aria-label="Bookmark article"
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-white text-white' : ''}`} />
          </button>
        )}

        {/* Featured Image Header if present; else Category Default Color Header */}
        {hasPhoto ? (
          <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />

            {/* Badges Overlay */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 text-[11px] font-semibold text-slate-800 dark:text-slate-200 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                {post.category}
              </span>
              {hasVideo && (
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white shadow-xs">
                  <Video className="h-3 w-3" /> Video Included
                </span>
              )}
            </div>
          </div>
        ) : (
          /* NO PHOTO UPLOADED: Show default category webcard color header:
             - Light Green for Prompts
             - Light Blue for Technical Guides
             - Light Purple for All Articles */
          <div className={`relative h-44 w-full overflow-hidden flex flex-col items-center justify-center p-6 border-b text-center ${upperBg} ${catTheme.border}`}>
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#00000010_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${catTheme.iconBoxBg}`}>
                <IconComponent className={`h-6 w-6 ${catTheme.iconColor}`} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${catTheme.text}`}>
                {post.category}
              </span>
            </div>

            {/* Badges Overlay */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
              <span className={`rounded-md px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md border shadow-xs ${catTheme.badge}`}>
                {post.category}
              </span>
              {hasVideo && (
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white shadow-xs">
                  <Video className="h-3 w-3" /> Video Included
                </span>
              )}
            </div>
          </div>
        )}

        {/* Card Body Content - Default White Background in Light Mode */}
        <div className="p-5 bg-white dark:bg-slate-900">
          <div className="mb-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${catTheme.categoryPill}`}>
              <IconComponent className={`h-2.5 w-2.5 ${catTheme.iconColor}`} />
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 dark:text-slate-500">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 sm:text-lg line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Footer Info - White background in light mode */}
      <div className="border-t border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-5 py-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        {/* Author Avatar & Name */}
        <div className="flex items-center gap-2">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="h-6 w-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <span className="font-medium text-slate-700 dark:text-slate-300">{post.author.name || 'Admin (Me)'}</span>
        </div>

        {/* Read Post Action */}
        <div className={`flex items-center gap-1 font-semibold ${catTheme.actionText} group-hover:translate-x-1 transition-transform`}>
          <span>Read Guide</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </article>
  );
};

