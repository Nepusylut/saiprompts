import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Eye, 
  Share2, 
  Check, 
  Lightbulb, 
  AlertTriangle, 
  Award,
  List,
  Bookmark,
  Film
} from 'lucide-react';
import { BlogPost, PromptData, VideoEmbedData } from '../types';
import { PromptCard } from './PromptCard';
import { VideoEmbed } from './VideoEmbed';

interface PostReaderProps {
  post: BlogPost;
  allPromptsMap: Record<string, PromptData>;
  onBack: () => void;
  onSelectRelatedPost?: (post: BlogPost) => void;
  relatedPosts?: BlogPost[];
  isSaved?: boolean;
  onToggleSave?: (post: BlogPost) => void;
}

export const PostReader: React.FC<PostReaderProps> = ({
  post,
  allPromptsMap,
  onBack,
  onSelectRelatedPost,
  relatedPosts = [],
  isSaved = false,
  onToggleSave
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [activeTocId, setActiveTocId] = useState<string>(post.toc[0]?.id || '');

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveTocId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Back Navigation & Share & Bookmark */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles & Prompts</span>
        </button>

        <div className="flex items-center gap-2">
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(post)}
              className={`inline-flex items-center justify-center rounded-lg border p-1.5 text-xs font-semibold transition-all shadow-xs ${
                isSaved
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
              title={isSaved ? "Remove bookmark" : "Bookmark this article"}
              aria-label="Bookmark article"
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
            </button>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
          >
            {copiedShare ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>Share Article</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Article Content + Sticky Sidebar */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left/Main Column: Article Body */}
        <main className="lg:col-span-8">
          {/* Post Category */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-md border border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              {post.category}
            </span>
          </div>

          {/* Post Title */}
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 sm:text-lg leading-relaxed font-normal">
              {post.subtitle}
            </p>
          )}

          {/* Author Metadata Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 dark:border-slate-800 py-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{post.author.name || 'Admin (Me)'}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{post.author.role} • {post.author.handle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              {/* One Click Bookmark Icon Button in Metadata Bar */}
              {onToggleSave && (
                <button
                  onClick={() => onToggleSave(post)}
                  className={`inline-flex items-center justify-center rounded-lg p-1.5 font-sans transition-all shadow-2xs active:scale-90 ${
                    isSaved
                      ? 'bg-indigo-600 text-white border border-indigo-500 shadow-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                  title={isSaved ? "Remove bookmark" : "Bookmark this article"}
                  aria-label="Bookmark article"
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-white text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                </button>
              )}

              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {post.viewCount.toLocaleString()} views
              </span>
            </div>
          </div>

          {/* Featured Image - Only rendered if photo was added */}
          {post.featuredImage && post.featuredImage.trim() !== '' && (
            <div className="my-8 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="h-auto w-full max-h-[450px] object-cover"
              />
            </div>
          )}

          {/* Featured / Top Article Video (YouTube, Vimeo, Bilibili, MP4, etc.) */}
          {(() => {
            const assignedVideoIds = new Set(
              post.contentSections.map(s => s.videoId).filter(Boolean) as string[]
            );
            // Also exclude videos explicitly targeted to any section
            const topVideos = (post.videos || []).filter(v => 
              !assignedVideoIds.has(v.id) && (typeof v.targetSectionIndex !== 'number' || v.targetSectionIndex === -1)
            );

            if (topVideos.length > 0) {
              return (
                <div className="my-8 space-y-4">
                  {topVideos.map(vid => (
                    <div key={vid.id} className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <Film className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Video Tutorial</span>
                      </div>
                      <VideoEmbed video={vid} />
                    </div>
                  ))}
                </div>
              );
            }

            if (post.videoUrl && post.videoUrl.trim() !== '') {
              const fallbackVideo = {
                id: 'primary-video',
                type: 'youtube' as const,
                src: post.videoUrl,
                title: post.videoTitle || `${post.title} Video Guide`,
                aspectRatio: '16:9' as const
              };
              return (
                <div className="my-8 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <Film className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Video Tutorial</span>
                  </div>
                  <VideoEmbed video={fallbackVideo} />
                </div>
              );
            }

            return null;
          })()}

          {/* Post Content Sections */}
          <div className="mt-8 space-y-10 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {post.contentSections.map((section, sIdx) => (
              <section id={section.heading ? section.id : undefined} key={section.id} className="scroll-mt-24 space-y-4">
                {section.heading && (
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl border-b border-slate-200 dark:border-slate-800 pb-2">
                    {section.heading.replace(/^#+\s*/, '')}
                  </h2>
                )}

                {/* Paragraphs */}
                {section.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {p}
                  </p>
                ))}

                {/* Callout Box */}
                {section.callout && (
                  <div className={`my-6 rounded-xl border p-4.5 ${
                    section.callout.type === 'tip'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/80 dark:bg-emerald-950/60 dark:text-emerald-200'
                      : section.callout.type === 'pro'
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-900/80 dark:bg-indigo-950/60 dark:text-indigo-200'
                      : section.callout.type === 'warning'
                      ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/80 dark:bg-amber-950/60 dark:text-amber-200'
                      : 'border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                      {section.callout.type === 'tip' && <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                      {section.callout.type === 'pro' && <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                      {section.callout.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                      <span>{section.callout.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed opacity-90">{section.callout.text}</p>
                  </div>
                )}

                {/* Embedded Prompts for this section */}
                {(() => {
                  const sectionPrompts: any[] = [];
                  const seenIds = new Set<string>();

                  // 1) Prompts explicitly listed in section.promptIds
                  (section.promptIds || []).forEach(pId => {
                    const pr = allPromptsMap[pId] || post.prompts.find(p => p.id === pId);
                    if (pr && !seenIds.has(pr.id)) {
                      sectionPrompts.push(pr);
                      seenIds.add(pr.id);
                    }
                  });

                  // 2) Prompts from post.prompts assigned to this section index (sIdx)
                  (post.prompts || []).forEach((pr, pIdx) => {
                    if (!seenIds.has(pr.id)) {
                      if (typeof pr.targetSectionIndex === 'number' && pr.targetSectionIndex === sIdx) {
                        sectionPrompts.push(pr);
                        seenIds.add(pr.id);
                      } else if (typeof pr.targetSectionIndex !== 'number' && post.contentSections.length > 1) {
                        if (Math.min(pIdx + 1, post.contentSections.length - 1) === sIdx) {
                          sectionPrompts.push(pr);
                          seenIds.add(pr.id);
                        }
                      } else if (typeof pr.targetSectionIndex !== 'number' && post.contentSections.length <= 1 && sIdx === 0) {
                        sectionPrompts.push(pr);
                        seenIds.add(pr.id);
                      }
                    }
                  });

                  return sectionPrompts.map(pr => (
                    <PromptCard key={pr.id} prompt={pr} />
                  ));
                })()}

                {/* Embedded Videos for this section */}
                {(() => {
                  const sectionVideos: VideoEmbedData[] = [];
                  const seenVideoIds = new Set<string>();

                  // 1) Explicit section.videoId
                  if (section.videoId && post.videos) {
                    const found = post.videos.find(v => v.id === section.videoId);
                    if (found && !seenVideoIds.has(found.id)) {
                      sectionVideos.push(found);
                      seenVideoIds.add(found.id);
                    }
                  }

                  // 2) Videos with targetSectionIndex matching this section index
                  if (post.videos) {
                    post.videos.forEach(v => {
                      if (!seenVideoIds.has(v.id) && typeof v.targetSectionIndex === 'number' && v.targetSectionIndex === sIdx) {
                        sectionVideos.push(v);
                        seenVideoIds.add(v.id);
                      }
                    });
                  }

                  return sectionVideos.length > 0 ? (
                    <div className="my-5 space-y-4">
                      {sectionVideos.map(vid => (
                        <div key={vid.id} className="space-y-1">
                          {vid.title && (
                            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              <Film className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>{vid.title}</span>
                            </div>
                          )}
                          <VideoEmbed video={vid} />
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}

                {/* Code Snippet */}
                {section.codeSnippet && (
                  <div className="my-6 overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-xs">
                    {section.codeSnippet.filename && (
                      <div className="border-b border-slate-300 dark:border-slate-800 bg-slate-200/80 dark:bg-slate-900 px-4 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>{section.codeSnippet.filename}</span>
                        <span className="uppercase text-[10px] text-indigo-700 dark:text-indigo-400 font-bold">{section.codeSnippet.language}</span>
                      </div>
                    )}
                    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-900 dark:text-slate-100">
                      <code>{section.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}

            {/* Fallback for any prompts attached to article but not mapped in section promptIds */}
            {(() => {
              const renderedPromptIds = new Set<string>();
              post.contentSections.forEach(sec => {
                (sec.promptIds || []).forEach(id => renderedPromptIds.add(id));
              });
              const remainingPrompts = (post.prompts || []).filter(p => !renderedPromptIds.has(p.id));
              return remainingPrompts.length > 0 ? (
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Attached AI Prompts</h3>
                  {remainingPrompts.map(pr => (
                    <PromptCard key={pr.id} prompt={pr} />
                  ))}
                </div>
              ) : null;
            })()}
          </div>

          {/* Tags Footer */}
          <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-6">
            <h4 className="text-xs font-mono uppercase text-slate-400 dark:text-slate-500 mb-2">Article Tags</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-3 py-1 text-xs text-slate-700 dark:text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </main>

        {/* Right Column: Sticky Table of Contents & Related Articles Sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Table of Contents Sticky Widget */}
            {post.toc && post.toc.length > 0 && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  <List className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Table of Contents</span>
                </div>
                <nav className="mt-4 space-y-2 text-xs">
                  {post.toc.map(item => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left transition-colors py-1 ${
                        item.level === 3 ? 'pl-4 text-slate-500 dark:text-slate-400' : 'font-medium'
                      } ${
                        activeTocId === item.id
                          ? 'text-indigo-600 dark:text-indigo-400 font-bold border-l-2 border-indigo-600 dark:border-indigo-400 pl-2'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      {item.text.replace(/^#+\s*/, '')}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Related Articles list */}
            {relatedPosts.length > 0 && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
                  Related Technical Guides
                </h4>
                <div className="space-y-3">
                  {relatedPosts.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelatedPost?.(rel)}
                      className="group cursor-pointer rounded-lg border border-slate-200 dark:border-slate-800 p-3 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
                    >
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
                        {rel.title}
                      </h5>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{rel.readTime} • {rel.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
