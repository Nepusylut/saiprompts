import React, { useState } from 'react';
import { Bookmark, X, Trash2, FileDown, BookOpen, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { PromptData, BlogPost } from '../types';
import { PromptCard } from './PromptCard';

interface SavedPromptsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPrompts: PromptData[];
  savedPosts: BlogPost[];
  onRemovePrompt: (id: string) => void;
  onRemovePost: (id: string) => void;
  onClearAll: () => void;
  onSelectPost?: (post: BlogPost) => void;
  onSelectPrompt?: (prompt: PromptData) => void;
}

export const SavedPromptsDrawer: React.FC<SavedPromptsDrawerProps> = ({
  isOpen,
  onClose,
  savedPrompts,
  savedPosts = [],
  onRemovePrompt,
  onRemovePost,
  onClearAll,
  onSelectPost,
  onSelectPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'prompts'>(
    savedPosts.length > 0 ? 'articles' : 'prompts'
  );

  if (!isOpen) return null;

  const totalBookmarks = savedPosts.length + savedPrompts.length;

  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      savedArticles: savedPosts,
      savedPrompts: savedPrompts,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aiprompt-saved-bookmarks-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-indigo-600 dark:text-indigo-400 fill-indigo-600/20" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Website Bookmarks ({totalBookmarks})</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === 'articles'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Articles ({savedPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === 'prompts'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Prompts ({savedPrompts.length})</span>
          </button>
        </div>

        {/* Content list */}
        <div className="my-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {activeTab === 'articles' ? (
            savedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500 dark:text-slate-400">
                <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No saved articles yet</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Click the bookmark button on any article card to save it here for quick reading.</p>
              </div>
            ) : (
              savedPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 p-3.5 transition-all hover:border-indigo-300 dark:hover:border-indigo-600 flex flex-col justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 pr-6">
                    <div>
                      <span className="inline-block rounded bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60 mb-1">
                        {post.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => onRemovePost(post.id)}
                      className="absolute right-2.5 top-2.5 rounded-md p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>

                    {onSelectPost && (
                      <button
                        onClick={() => {
                          onSelectPost(post);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            savedPrompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500 dark:text-slate-400">
                <Sparkles className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No saved prompts yet</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Bookmark prompt cards from the library to quickly access and view them here.</p>
              </div>
            ) : (
              savedPrompts.map((p) => (
                <div 
                  key={p.id} 
                  className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 p-3.5 transition-all hover:border-indigo-300 dark:hover:border-indigo-600 flex flex-col justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 pr-6">
                    <div>
                      <span className="inline-block rounded bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60 mb-1">
                        {p.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 font-normal">
                        {p.roleDescription || p.promptText}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemovePrompt(p.id)}
                      className="absolute right-2.5 top-2.5 rounded-md p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      {p.systemName || p.targetModel || 'AI Prompt'}
                    </span>

                    {onSelectPrompt && (
                      <button
                        onClick={() => {
                          onSelectPrompt(p);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <span>Read Prompt</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Actions Footer */}
        {totalBookmarks > 0 && (
          <div className="flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <button
              onClick={handleExportJSON}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <FileDown className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Export All Bookmarks</span>
            </button>
            <button
              onClick={onClearAll}
              className="inline-flex items-center justify-center rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

