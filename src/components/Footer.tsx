import React from 'react';
import { Sparkles, Shield } from 'lucide-react';
import { CategoryType } from '../types';

interface FooterProps {
  onSelectCategory: (category: CategoryType | 'All') => void;
  onOpenPromptsLibrary?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectCategory, 
  onOpenPromptsLibrary,
  onOpenAdmin 
}) => {
  const promptCategories: CategoryType[] = [
    'General Prompts',
    'Music Prompts',
    'Image Prompts',
    'Video Prompts',
    'Article Prompts',
    'Technical Guides'
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                AI<span className="text-indigo-600 dark:text-indigo-400">Prompt</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              A curated publication for AI prompts and technical guides across General, Music, Image, Video, and Article categories. Published by author.
            </p>
          </div>

          {/* Prompt Sections Column */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              AI Prompts
            </h4>
            <ul className="space-y-1.5 text-xs">
              {onOpenPromptsLibrary && (
                <li>
                  <button
                    onClick={onOpenPromptsLibrary}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-indigo-700 dark:text-indigo-300 block"
                  >
                    Prompt Library
                  </button>
                </li>
              )}
              {['General Prompts', 'Music Prompts', 'Image Prompts', 'Video Prompts', 'Article Prompts'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat as CategoryType)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Guides Column */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Technical Guides
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('Technical Guides')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold text-indigo-700 dark:text-indigo-300"
                >
                  All Technical Guides
                </button>
              </li>
              {['Full-Stack Guides', 'AI System Guides', 'Cloud Architecture', 'Database Guides'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat as CategoryType)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-slate-600 dark:text-slate-400"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© 2026 AIPrompt . All rights reserved.</p>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 font-medium"
              title="Admin Portal & Setup / Deploy Guide"
            >
              <Shield className="h-3 w-3" />
              <span>Admin & Deploy Guide</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
