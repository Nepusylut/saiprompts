import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Star, 
  Tag
} from 'lucide-react';
import { PromptData } from '../types';

interface PromptCardProps {
  prompt: PromptData;
  onRemix?: (prompt: PromptData) => void;
  compact?: boolean;
  isSaved?: boolean;
  onToggleSave?: (prompt: PromptData) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ 
  prompt, 
  compact = false,
  isSaved = false,
  onToggleSave
}) => {
  const [copied, setCopied] = useState(false);
  const currentPromptText = prompt.promptText;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentPromptText);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const isPromptCat = [
    'AI Prompts', 'General Prompts', 'Music Prompts', 'Image Prompts', 'Video Prompts', 'Article Prompts'
  ].includes(prompt.category);

  const isTechCat = [
    'Technical Guides', 'Full-Stack Guides', 'AI System Guides', 'Cloud Architecture', 'Database Guides', 'Full-Stack Engineering'
  ].includes(prompt.category);

  const categoryBadgeColor = isPromptCat
    ? 'bg-emerald-500/10 text-emerald-800 border-emerald-300 dark:text-emerald-300 dark:border-emerald-800 dark:bg-emerald-950/50'
    : isTechCat
    ? 'bg-sky-500/10 text-sky-800 border-sky-300 dark:text-sky-300 dark:border-sky-800 dark:bg-sky-950/50'
    : 'bg-amber-500/10 text-amber-800 border-amber-300 dark:text-amber-300 dark:border-amber-800 dark:bg-amber-950/50';

  const categoryTagColor = isPromptCat
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
    : isTechCat
    ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800'
    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';

  return (
    <div 
      id={`prompt-card-${prompt.id}`}
      className="group relative my-6 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/80 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          {/* AI Tool Badge */}
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${categoryBadgeColor}`}>
            <Sparkles className="h-3.5 w-3.5" />
            {prompt.tool}
          </span>

          {/* Category Badge */}
          <span className={`hidden items-center gap-1 text-xs font-medium sm:inline-flex px-2.5 py-0.5 rounded-md border ${categoryTagColor}`}>
            <Tag className="h-3 w-3" />
            {prompt.category}
          </span>
        </div>

        {/* Copy Prompt Main Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            id={`copy-btn-${prompt.id}`}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all duration-200 active:scale-95 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                <span>Copied! ✓</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <div className="px-4 pt-4 sm:px-5">
        <h4 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
          {prompt.title}
        </h4>
        {prompt.description && (
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
            {prompt.description}
          </p>
        )}
      </div>

      {/* Main Prompt Text Block / Code Box */}
      <div className="relative p-4 sm:p-5">
        <pre className="overflow-x-auto rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-900 dark:text-slate-100 sm:text-sm whitespace-pre-wrap selection:bg-indigo-600 selection:text-white">
          <code>{currentPromptText}</code>
        </pre>
      </div>

      {/* Footer Info & Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/80 px-4 py-2.5 text-[11px] text-slate-500 dark:text-slate-400 sm:px-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {prompt.tags.map((tag, i) => (
            <span key={i} className="rounded bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 text-slate-700 dark:text-slate-300">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {prompt.rating && (
            <span className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="h-3 w-3 fill-amber-400" />
              {prompt.rating}
            </span>
          )}
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Posted by {prompt.author || 'Admin (Me)'}
          </span>
        </div>
      </div>
    </div>
  );
};
