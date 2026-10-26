import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Wand2, 
  Cpu 
} from 'lucide-react';

interface ExploreFeaturesBannerProps {
  onOpenPromptsLibrary?: () => void;
  onOpenAllArticles?: () => void;
}

export const ExploreFeaturesBanner: React.FC<ExploreFeaturesBannerProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 pt-4 pb-2">
      {/* 4 Different Contents Centered */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-5xl justify-center items-stretch text-center">
        {/* 1. Copy-Ready Prompts */}
        <div className="flex flex-col items-center text-center px-2 space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 mb-1 ring-1 ring-indigo-500/20 shadow-2xs">
            <Wand2 className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Copy-Ready Prompts</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xs">
            Instant copy with clean prompt code blocks.
          </p>
        </div>

        {/* 2. Technical Guides */}
        <div className="flex flex-col items-center text-center px-2 space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mb-1 ring-1 ring-emerald-500/20 shadow-2xs">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Technical Guides</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xs">
            In-depth architectural breakdowns and implementation steps.
          </p>
        </div>

        {/* 3. Tuned Parameters */}
        <div className="flex flex-col items-center text-center px-2 space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 mb-1 ring-1 ring-violet-500/20 shadow-2xs">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Tuned Parameters</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xs">
            Verified temperature, aspect ratios, seeds, and meta-tags.
          </p>
        </div>

        {/* 4. Production Verified */}
        <div className="flex flex-col items-center text-center px-2 space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 mb-1 ring-1 ring-amber-500/20 shadow-2xs">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Production Verified</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xs">
            Tested against ChatGPT, Claude, Midjourney, and Suno.
          </p>
        </div>
      </div>
    </div>
  );
};
