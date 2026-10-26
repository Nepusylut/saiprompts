import React from 'react';
import { 
  Sparkles, 
  BookOpen
} from 'lucide-react';
import { CategoryType } from '../types';
import { CompanyLogoMarquee } from './CompanyLogoMarquee';

interface HeroSectionProps {
  activeCategory: CategoryType | 'All';
  onSelectCategory: (category: CategoryType | 'All') => void;
  totalPromptsCount: number;
  totalArticlesCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeCategory,
  onSelectCategory,
  totalPromptsCount,
  totalArticlesCount,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-10 pb-0 sm:pt-14 transition-colors">
      {/* Subtle Background Lighting Accent */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 shadow-xs mb-5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Curated AI Prompts & Engineering Guides</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
          <span className="text-indigo-600 dark:text-[#5e22f5]">AIPrompt.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base lg:text-lg">
          Explore high-performing AI prompts and in-depth technical guides.
        </p>

        {/* Section Tabs: 3 Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onSelectCategory('All')}
            className="w-52 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white shadow-xs"
          >
            <span>All Content</span>
          </button>

          <button
            onClick={() => onSelectCategory('AI Prompts')}
            className={`w-52 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              activeCategory === 'AI Prompts' || activeCategory.endsWith('Prompts')
                ? 'bg-indigo-600 text-white shadow-md'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white shadow-xs'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Prompts</span>
          </button>

          <button
            onClick={() => onSelectCategory('Technical Guides')}
            className={`w-52 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              activeCategory === 'Technical Guides'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white shadow-xs'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Technical Guides</span>
          </button>
        </div>
      </div>

      {/* IT Company Logo Marquee Bar: Centered in exact middle between 3 buttons above and top featured guide below */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        <CompanyLogoMarquee />
      </div>
    </div>
  );
};

