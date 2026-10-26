import React from 'react';
import { Sparkles } from 'lucide-react';

export const WebsiteIntroCard: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900/90 p-8 sm:p-10 lg:p-12 shadow-sm transition-all">
      {/* Subtle ambient glow accents */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-violet-500/10 dark:bg-violet-500/15 blur-3xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Top Title at Left Side */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>About AIPrompt Platform</span>
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Engineering & Prompt Hub
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl lg:text-4xl leading-tight tracking-tight">
            Welcome to <span className="text-indigo-600 dark:text-indigo-400">AIPrompt</span>: Tested Prompts & Technical Engineering Guides
          </h2>
        </div>

        {/* Content at Right Side */}
        <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal lg:pt-1">
          <p>
            AIPrompt is an open platform built for prompt engineers, software developers, and generative AI creators. We provide thoroughly tested system prompts, tuned model parameters, and deep-dive technical engineering guides to help you achieve reliable, production-grade results across the modern AI ecosystem.
          </p>
          <p>
            Whether you are configuring arrangements and vocal meta-tags in Suno v4, tuning architectural rendering formulas in Midjourney v6.1, engineering multi-turn reasoning workflows with Claude 3.7 Sonnet and DeepSeek-R1, or deploying full-stack AI web applications with Node.js and React, our catalog is designed to provide immediate copy-ready utility and rigorous technical blueprints.
          </p>
        </div>
      </div>
    </section>
  );
};
