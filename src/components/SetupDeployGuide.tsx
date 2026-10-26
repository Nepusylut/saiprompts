import React, { useState } from 'react';
import { 
  Rocket, 
  Download, 
  Copy, 
  Check, 
  CheckCircle2, 
  Server, 
  Globe, 
  HardDrive, 
  Database, 
  Terminal, 
  FileCode, 
  ExternalLink, 
  Upload, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  Layers,
  ArrowRight,
  AlertCircle,
  Film,
  FileText,
  Video
} from 'lucide-react';
import { BlogPost, PromptData, MenuItem } from '../types';

interface SetupDeployGuideProps {
  posts: BlogPost[];
  prompts: PromptData[];
  menus: MenuItem[];
  onImportBackup?: (data: { posts?: BlogPost[]; prompts?: PromptData[]; menus?: MenuItem[] }) => void;
  onNotify?: (message: string) => void;
}

export const SetupDeployGuide: React.FC<SetupDeployGuideProps> = ({
  posts,
  prompts,
  menus,
  onImportBackup,
  onNotify
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'saving' | 'vercel' | 'cloudflare' | 'netlify' | 'github_render' | 'backup' | 'cli'>('saving');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  const copyToClipboard = (text: string, key: string, label?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (onNotify) {
      onNotify(label ? `Copied ${label} to clipboard!` : 'Copied to clipboard!');
    }
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  // Generate downloadable JSON content
  const handleDownloadBackupJson = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      counts: {
        posts: posts.length,
        prompts: prompts.length,
        menus: menus.length
      },
      posts,
      prompts,
      menus
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content_store_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onNotify) {
      onNotify('content_store backup downloaded successfully!');
    }
  };

  // Generate TypeScript code for src/data/blogData.ts
  const generateBlogDataTsCode = () => {
    const sanitizedPosts = JSON.stringify(posts, null, 2);
    return `// Paste this into src/data/blogData.ts to replace BLOG_POSTS permanently:
import { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = ${sanitizedPosts};
`;
  };

  const handleCopyBlogDataTs = () => {
    const code = generateBlogDataTsCode();
    copyToClipboard(code, 'blogDataTs', 'TypeScript blogData.ts array');
  };

  const handleDownloadBlogDataTs = () => {
    const code = generateBlogDataTsCode();
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blogPosts_export_${new Date().toISOString().split('T')[0]}.ts`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onNotify) {
      onNotify('Downloaded TypeScript posts export file!');
    }
  };

  // Handle file import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (onImportBackup) {
          onImportBackup({
            posts: Array.isArray(parsed.posts) ? parsed.posts : undefined,
            prompts: Array.isArray(parsed.prompts) ? parsed.prompts : undefined,
            menus: Array.isArray(parsed.menus) ? parsed.menus : undefined
          });
        }
        if (onNotify) {
          onNotify(`Imported backup with ${parsed.posts?.length || 0} articles!`);
        }
      } catch (err) {
        alert('Failed to parse JSON backup file. Please ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
            <Rocket className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Complete Setup & Free Deployment Masterguide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How to Save Your Articles & Deploy This Website 100% Free
          </h2>
          <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Everything you need to know about where your articles, prompts, and media files are stored (including Cloudflare R2 object storage), how to make permanent backups, and step-by-step guides to host this website free on <strong className="text-slate-900 dark:text-white">Cloudflare Pages</strong>, <strong className="text-slate-900 dark:text-white">Vercel</strong>, <strong className="text-slate-900 dark:text-white">Netlify</strong>, or <strong className="text-slate-900 dark:text-white">GitHub Pages</strong> with custom domains and SSL.
          </p>

          {/* Quick Storage Status Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-300">
              <Database className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Articles: <strong className="text-slate-900 dark:text-white">{posts.length}</strong></span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Prompts: <strong className="text-slate-900 dark:text-white">{prompts.length}</strong></span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-300">
              <Layers className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Menus: <strong className="text-slate-900 dark:text-white">{menus.length}</strong></span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Auto-Persistence Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Navigation Subtabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('saving')}
          className={`w-full h-[58px] min-h-[58px] flex items-center justify-center text-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-tight transition-all ${
            activeSubTab === 'saving'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <HardDrive className="h-3.5 w-3.5 shrink-0" />
          <span className="leading-tight text-center">
            <span className="block">1. How & Where</span>
            <span className="block">Articles Are Saved</span>
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('cloudflare')}
          className={`w-full h-[58px] min-h-[58px] flex items-center justify-center text-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-tight transition-all ${
            activeSubTab === 'cloudflare'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className={`h-3.5 w-3.5 shrink-0 ${activeSubTab === 'cloudflare' ? 'text-amber-200' : 'text-amber-500 dark:text-amber-400'}`} />
          <span className="leading-tight text-center">
            <span className="block">2. Free Deploy on</span>
            <span className="block">Cloudflare Pages</span>
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('vercel')}
          className={`w-full h-[58px] min-h-[58px] flex items-center justify-center text-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-tight transition-all ${
            activeSubTab === 'vercel'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="h-3.5 w-3.5 shrink-0" />
          <span className="leading-tight text-center">
            <span className="block">3. Free Deploy</span>
            <span className="block">on Vercel</span>
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('netlify')}
          className={`w-full h-[58px] min-h-[58px] flex items-center justify-center text-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-tight transition-all ${
            activeSubTab === 'netlify'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Rocket className="h-3.5 w-3.5 shrink-0" />
          <span className="leading-tight text-center">
            <span className="block">4. Free Deploy</span>
            <span className="block">on Netlify</span>
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('github_render')}
          className={`w-full h-[58px] min-h-[58px] flex items-center justify-center text-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-tight transition-all ${
            activeSubTab === 'github_render'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Server className="h-3.5 w-3.5 shrink-0" />
          <span className="leading-tight text-center">
            <span className="block">5. GitHub Pages &</span>
            <span className="block">Full-Stack Render</span>
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('backup')}
          className={`w-full h-[58px] min-h-[58px] flex items-center justify-center text-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-tight transition-all ${
            activeSubTab === 'backup'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Download className="h-3.5 w-3.5 shrink-0" />
          <span className="leading-tight text-center">
            <span className="block">6. Backup, Export</span>
            <span className="block">& Restore</span>
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('cli')}
          className={`w-full h-[58px] min-h-[58px] flex items-center justify-center text-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-tight transition-all ${
            activeSubTab === 'cli'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Terminal className="h-3.5 w-3.5 shrink-0" />
          <span className="leading-tight text-center">
            <span className="block">7. CLI</span>
            <span className="block">Commands</span>
          </span>
        </button>
      </div>

      {/* --- SUBTAB 1: HOW & WHERE ARTICLES ARE SAVED --- */}
      {activeSubTab === 'saving' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                How Do I Save These Articles & Where Are They Saved?
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your website supports a full multi-tier storage architecture: local browser storage, server file persistence, permanent code commits, and <strong>Cloudflare R2 Object Storage</strong> for zero-egress cost files and images.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Layer 1 Card */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    Tier 1: Client
                  </span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="h-4 w-4 text-indigo-600" />
                  Browser LocalStorage
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every time you click <strong>Save & Publish</strong> or delete a post, it is immediately cached in your browser:
                </p>
                <div className="rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2 text-[10px] font-mono text-slate-800 dark:text-slate-200 space-y-1">
                  <div>• aiprompt_custom_posts</div>
                  <div>• aiprompt_custom_prompts</div>
                  <div>• aiprompt_custom_menus</div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ✓ Instant auto-save that survives reloads.
                </p>
              </div>

              {/* Layer 2 Card */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                    Tier 2: Node Server
                  </span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-violet-600" />
                  data/content_store.json
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  When running with Node/Express (<code className="text-violet-700 dark:text-violet-300 font-mono text-[10px]">npm run dev</code> or server), changes automatically write to:
                </p>
                <div className="rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2 text-[10px] font-mono text-slate-800 dark:text-slate-200">
                  /data/content_store.json
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ✓ Managed via REST <code className="font-mono">/api/content</code>.
                </p>
              </div>

              {/* Layer 3 Card */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Tier 3: Source Code
                  </span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  src/data/blogData.ts
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Baked directly into the static site bundle during <code className="text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">npm run build</code>:
                </p>
                <div className="rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2 text-[10px] font-mono text-slate-800 dark:text-slate-200">
                  /src/data/blogData.ts
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ✓ 100% reliable for serverless hosting.
                </p>
              </div>

              {/* Layer 4: Cloudflare R2 Card */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    Tier 4: Cloud Storage
                  </span>
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Server className="h-4 w-4 text-amber-600" />
                  Cloudflare R2 Storage
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Store article JSON documents, images, and backups in <strong>Cloudflare R2</strong> (S3-compatible, <strong>$0 egress fees</strong>):
                </p>
                <div className="rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2 text-[10px] font-mono text-slate-800 dark:text-slate-200">
                  pub-xxx.r2.dev/articles/
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                  ✓ 10 GB free storage every month.
                </p>
              </div>
            </div>

            {/* Step-by-Step: How to permanently save your new articles into source code */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                How to Permanently Bake Your Created Articles into the Codebase
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                If you create new articles or prompt cards in this Admin screen and want them to be permanently part of the website source code for all visitors:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center">1</span>
                    Click "Copy TypeScript Code"
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Use the 1-click button below to copy the formatted code array of all your current articles.
                  </p>
                  <button
                    onClick={handleCopyBlogDataTs}
                    className="w-full mt-2 rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {copiedKey === 'blogDataTs' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'blogDataTs' ? 'Copied Code!' : 'Copy blogData.ts Array'}</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center">2</span>
                    Paste in src/data/blogData.ts
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Open <code className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">src/data/blogData.ts</code> and update the <code className="font-mono">BLOG_POSTS</code> constant with your copied array.
                  </p>
                  <button
                    onClick={handleDownloadBlogDataTs}
                    className="w-full mt-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download as .ts File</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center">3</span>
                    Download Backup JSON
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Always keep a backup JSON file of your entire database on your computer for 1-click restore anytime.
                  </p>
                  <button
                    onClick={handleDownloadBackupJson}
                    className="w-full mt-2 rounded-md bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download content_store.json</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cloudflare R2 Storage Guide */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500 text-white font-bold text-xs">
                    R2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Saving Articles & Media on Cloudflare R2 Storage
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cloudflare R2 provides S3-compatible cloud bucket storage with <strong>zero egress bandwidth charges</strong> and 10GB free tier.
                    </p>
                  </div>
                </div>
                <a
                  href="https://dash.cloudflare.com/?to=/:account/r2"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-bold transition-colors shrink-0"
                >
                  <span>Open Cloudflare R2</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-amber-700 dark:text-amber-400">1. Create R2 Bucket</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Log in to Cloudflare Dashboard → <strong>R2 Object Storage</strong> → <strong>Create Bucket</strong> (e.g. <code className="font-mono text-amber-600">my-aiprompt-content</code>).
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-amber-700 dark:text-amber-400">2. Enable Public Access or Custom Domain</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    In bucket Settings → <strong>Public Access</strong> → Enable <em>R2.dev subdomain</em> or connect your custom domain (e.g. <code className="font-mono text-amber-600">cdn.yourdomain.com</code>).
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-amber-700 dark:text-amber-400">3. Upload Articles & Images</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Upload your <code className="font-mono text-amber-600">content_store.json</code> or image folders. Paste the generated public URL directly into article covers or content!
                  </p>
                </div>
              </div>

              {/* R2 Wrangler / S3 Code Snippet */}
              <div className="rounded-lg bg-white dark:bg-slate-900 p-3.5 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span className="font-sans font-medium text-slate-600 dark:text-slate-300">Quick Cloudflare Wrangler CLI Upload Command:</span>
                  <button
                    onClick={() => copyToClipboard('npx wrangler r2 object put my-aiprompt-content/content_store.json --file=./data/content_store.json', 'wranglerR2', 'Wrangler R2 upload command')}
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 font-sans font-semibold"
                  >
                    {copiedKey === 'wranglerR2' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'wranglerR2' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-slate-800 dark:text-emerald-400 text-[11px] overflow-x-auto whitespace-pre bg-white dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 select-all font-mono">
                  npx wrangler r2 object put my-aiprompt-content/content_store.json --file=./data/content_store.json
                </div>
              </div>
            </div>

            {/* Where to store article images */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Where Should I Save Article Images, Covers & Assets?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                When adding cover images or screenshots to your articles:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                  <span className="font-bold text-amber-700 dark:text-amber-400">Method 1: Cloudflare R2 (Best for Production)</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    Upload images to your R2 bucket and paste the CDN URL (e.g. <code className="font-mono text-amber-600">https://cdn.yourdomain.com/covers/prompt-guide.png</code>). Zero bandwidth cost!
                  </p>
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Method 2: External CDNs (Unsplash, Imgur)</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    Paste any high-res image link from Unsplash or Imgur. Instant and requires no setup.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Method 3: Local /public Folder</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    Place image files inside <code className="font-mono text-slate-700 dark:text-slate-300">/public/images/</code>. Reference directly as <code className="font-mono text-indigo-600">/images/my-article.jpg</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* Writing Articles as Plain Text (.txt) - No Markdown Required */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Writing & Importing Plain Text (.txt) Articles — No Markdown Required
                </h4>
                <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  1-Click .txt Import
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                You do <strong>not</strong> need to learn or use any Markdown codes (like <code>##</code>, <code>*</code>, or tables). You can write your articles naturally in plain text:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">1. Write in Notepad or Any Text Editor</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    Write standard paragraphs. Just leave a blank empty line between paragraphs. Save the file as a simple <code>.txt</code> file on your computer.
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">2. Click "Upload .txt File"</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    In the Admin Portal, open the article creator and click <strong>Upload .txt File</strong>. The article text is populated instantly!
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">3. Set Headings & Prompts Directly</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    Below the text area, simply type section names into the <em>Heading Title</em> boxes and click <em>Attach Prompt</em> — zero markdown formatting codes needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Video Strategy: YouTube, Vimeo, Bilibili & Web Videos */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Film className="h-4 w-4 text-red-600 dark:text-red-400" />
                  Embedding Videos
                </h4>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  To add a video to any article, simply copy the video link from YouTube, Vimeo, Bilibili, Loom, or other websites (or a direct <code>.mp4</code> link) and paste it into the <strong>Video Link</strong> box when creating or editing an article.
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Supported links:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">YouTube</span>
                  <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Vimeo</span>
                  <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Bilibili</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">Direct MP4 / Web embeds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: FREE DEPLOY ON CLOUDFLARE PAGES --- */}
      {activeSubTab === 'cloudflare' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest font-mono mb-2">
                  100% Free Forever • Global Anycast CDN • Unlimited Bandwidth
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Deploying on Cloudflare Pages (Free, Fast & Unmetered)
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Cloudflare Pages offers unmetered global bandwidth, 500 builds per month for free, automatic SSL, custom domain routing, and seamless integration with Cloudflare R2 object storage.
                </p>
              </div>

              <a
                href="https://pages.cloudflare.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 text-white px-4 py-2 text-xs font-bold hover:bg-amber-700 transition-colors shrink-0"
              >
                <span>Go to Cloudflare Pages</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Method A: Git Connected (Continuous) */}
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 p-5 space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Method 1 • GitHub Connected (Recommended)
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Continuous Git Deployment in 4 Steps
                </h4>
                <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside leading-relaxed">
                  <li>
                    Push your project code to GitHub:
                    <div className="mt-1 rounded bg-slate-900 p-2 text-emerald-400 font-mono text-[11px] flex items-center justify-between">
                      <span>git push origin main</span>
                      <button
                        onClick={() => copyToClipboard('git push origin main', 'cfGitPush')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'cfGitPush' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </li>
                  <li>
                    Go to <a href="https://dash.cloudflare.com" target="_blank" rel="noreferrer" className="text-amber-600 underline font-semibold">dash.cloudflare.com</a> → <strong>Workers & Pages</strong> → <strong>Create Application</strong> → <strong>Pages</strong>.
                  </li>
                  <li>
                    Click <strong>Connect to Git</strong> and select your GitHub repository.
                  </li>
                  <li>
                    Fill in Build Settings:
                    <ul className="mt-1.5 pl-4 space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      <li>• Framework preset: <strong className="text-amber-600">Vite</strong></li>
                      <li>• Build command: <code className="text-indigo-600 font-bold">npm run build</code></li>
                      <li>• Build output directory: <code className="text-indigo-600 font-bold">dist</code></li>
                    </ul>
                  </li>
                  <li>Click <strong>Save and Deploy</strong>. Cloudflare compiles and serves your site in seconds!</li>
                </ol>
              </div>

              {/* Method B: Direct Upload via Wrangler CLI / Web */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Method 2 • Direct Wrangler CLI Deploy
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Instant Terminal Deploy with Cloudflare Wrangler
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  You can deploy directly to Cloudflare Pages from your terminal without even connecting a Git repository:
                </p>
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-emerald-400 flex items-center justify-between border border-slate-800">
                    <span>npm run build</span>
                    <button
                      onClick={() => copyToClipboard('npm run build', 'cfWranglerBuild')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cfWranglerBuild' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-amber-300 flex items-center justify-between border border-slate-800">
                    <span>npx wrangler pages deploy dist --project-name=aiprompt-blog</span>
                    <button
                      onClick={() => copyToClipboard('npx wrangler pages deploy dist --project-name=aiprompt-blog', 'cfWranglerDeploy')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cfWranglerDeploy' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ✓ Prompts you to log into Cloudflare in browser once, then instantly uploads the built assets to edge nodes.
                </p>
              </div>
            </div>

            {/* Cloudflare Pages Single Page App Redirects Rule */}
            <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    Single Page App (SPA) Routing on Cloudflare Pages
                  </h4>
                </div>
                <button
                  onClick={() => copyToClipboard('/*    /index.html   200', 'cfRedirects', 'public/_redirects')}
                  className="rounded bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 text-[10px] font-bold flex items-center gap-1 shadow-xs"
                >
                  {copiedKey === 'cfRedirects' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === 'cfRedirects' ? 'Copied' : 'Copy _redirects'}</span>
                </button>
              </div>
              <p className="text-xs text-amber-800/90 dark:text-amber-300/90">
                Cloudflare Pages uses the exact same standard <code className="font-mono font-bold">public/_redirects</code> file included in this codebase (<code className="font-mono">/* /index.html 200</code>). Deep URLs like <code className="font-mono">/admin</code> or individual article pages will never return 404!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 3: FREE DEPLOY ON VERCEL (RECOMMENDED) --- */}
      {activeSubTab === 'vercel' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest font-mono mb-2">
                  Recommended • 100% Free Forever
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Deploying on Vercel (Fastest & Simplest)
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Vercel provides a free Hobby tier with unlimited deployments, instant global Edge CDN, free automatic SSL certificates, and custom domain connection.
                </p>
              </div>

              <a
                href="https://vercel.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-bold hover:opacity-90 transition-opacity shrink-0"
              >
                <span>Go to Vercel</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Push your project code to GitHub
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Initialize git in your website folder and push to your private or public GitHub repository:
                  </p>
                  <div className="relative rounded-lg bg-slate-900 dark:bg-slate-950 p-3 text-xs font-mono text-emerald-400 border border-slate-800">
                    <pre className="overflow-x-auto whitespace-pre leading-relaxed">{`git init
git add .
git commit -m "Deploy complete AI Prompt blog"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main`}</pre>
                    <button
                      onClick={() => copyToClipboard(`git init\ngit add .\ngit commit -m "Deploy complete AI Prompt blog"\ngit branch -M main\ngit remote add origin https://github.com/<your-username>/<your-repo-name>.git\ngit push -u origin main`, 'gitCommands', 'Git commands')}
                      className="absolute top-2 right-2 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[10px] text-slate-200 flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === 'gitCommands' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'gitCommands' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Import into Vercel Dashboard
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Log in to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">vercel.com</a> with your GitHub account. Click <strong className="text-slate-900 dark:text-white">Add New...</strong> → <strong className="text-slate-900 dark:text-white">Project</strong>. Click <strong className="text-indigo-600">Import</strong> next to your repository.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Verify Build Configuration
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Vercel automatically detects the Vite configuration:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-sans">Framework Preset</span>
                      <strong className="text-indigo-600 dark:text-indigo-400">Vite</strong>
                    </div>
                    <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-sans">Build Command</span>
                      <strong className="text-indigo-600 dark:text-indigo-400">npm run build</strong>
                    </div>
                    <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-sans">Output Directory</span>
                      <strong className="text-indigo-600 dark:text-indigo-400">dist</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Click "Deploy" & Your Site is Live!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Within ~45 seconds, your website is globally distributed at:
                  </p>
                  <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-mono font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>https://&lt;your-project&gt;.vercel.app</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vercel Single Page App Rewrites */}
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                    Bonus: Single Page App (SPA) Route Rewrites
                  </h4>
                </div>
                <button
                  onClick={() => copyToClipboard(`{\n  "rewrites": [\n    { "source": "/(.*)", "destination": "/index.html" }\n  ]\n}`, 'vercelJson', 'vercel.json')}
                  className="rounded bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 text-[10px] font-bold flex items-center gap-1 shadow-xs"
                >
                  {copiedKey === 'vercelJson' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === 'vercelJson' ? 'Copied' : 'Copy vercel.json'}</span>
                </button>
              </div>
              <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80">
                To guarantee that visitors refreshing on <code className="font-mono font-bold">/admin</code> or deep links never hit a 404, we include a <code className="font-mono">vercel.json</code> rewrite file in your repository:
              </p>
              <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs text-indigo-300 border border-slate-800">
                <pre>{`{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 3: FREE DEPLOY ON NETLIFY --- */}
      {activeSubTab === 'netlify' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-widest font-mono mb-2">
                  100% Free Forever • Drag & Drop Option
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  Deploying on Netlify (Drag-and-Drop or Git)
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Netlify allows you to deploy either with zero-command Drag-and-Drop of your built folder, or continuously via GitHub.
                </p>
              </div>

              <a
                href="https://netlify.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 text-white px-4 py-2 text-xs font-bold hover:bg-teal-700 transition-colors shrink-0"
              >
                <span>Go to Netlify</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Method A: Zero-Code Drag & Drop */}
              <div className="rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/30 dark:bg-teal-950/20 p-5 space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  Method 1 • Zero-Git Drag & Drop
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Instant Drag & Drop in 60 Seconds
                </h4>
                <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside leading-relaxed">
                  <li>
                    Open terminal in your project and run:
                    <div className="mt-1 rounded bg-slate-900 p-2 text-emerald-400 font-mono text-[11px] flex items-center justify-between">
                      <span>npm run build</span>
                      <button
                        onClick={() => copyToClipboard('npm run build', 'npmBuild1')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'npmBuild1' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </li>
                  <li>This generates a production folder named <code className="font-mono text-teal-600 dark:text-teal-400 font-bold">dist</code>.</li>
                  <li>Go to <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-teal-600 underline font-semibold">app.netlify.com/drop</a> in your browser.</li>
                  <li>Drag the <code className="font-mono">dist</code> folder and drop it into the Netlify box.</li>
                  <li>Done! Your website is live immediately at <code className="font-mono text-teal-600">https://&lt;random-name&gt;.netlify.app</code>.</li>
                </ol>
              </div>

              {/* Method B: Git Connected */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Method 2 • Continuous Git Deploy
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Automatic Deploy on Every Git Push
                </h4>
                <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside leading-relaxed">
                  <li>Push your repository to GitHub.</li>
                  <li>In Netlify dashboard, click <strong className="text-slate-900 dark:text-white">Add new site</strong> → <strong className="text-slate-900 dark:text-white">Import an existing project</strong>.</li>
                  <li>Select your GitHub repository.</li>
                  <li>
                    Configure build settings:
                    <ul className="mt-1 pl-4 space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      <li>• Build command: <code className="text-indigo-600">npm run build</code></li>
                      <li>• Publish directory: <code className="text-indigo-600">dist</code></li>
                    </ul>
                  </li>
                  <li>Click <strong className="text-slate-900 dark:text-white">Deploy Site</strong>.</li>
                </ol>
              </div>
            </div>

            {/* Netlify Redirects tip */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Netlify Single-Page Redirects Rule</span>
                <button
                  onClick={() => copyToClipboard('/*    /index.html   200', 'netlifyRedirects')}
                  className="rounded bg-slate-200 dark:bg-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1"
                >
                  {copiedKey === 'netlifyRedirects' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === 'netlifyRedirects' ? 'Copied' : 'Copy _redirects'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                We've configured <code className="font-mono">public/_redirects</code> containing <code className="font-mono text-teal-600">/* /index.html 200</code> so browser reloads on deep paths work smoothly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 4: GITHUB PAGES & FULL-STACK RENDER --- */}
      {activeSubTab === 'github_render' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Alternative Free Deployments: GitHub Pages & Full-Stack Render
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose GitHub Pages for pure static hosting, or Render / Railway if you wish to keep the live Node.js Express server running online.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub Pages */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                  <Globe className="h-4 w-4 text-purple-600" />
                  GitHub Pages (100% Free)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Host your blog directly on GitHub's infrastructure at <code className="font-mono text-purple-600">https://&lt;username&gt;.github.io/&lt;repo&gt;/</code>.
                </p>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white">Setup Steps:</p>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed">
                    <li>Push your code to GitHub.</li>
                    <li>Go to your GitHub repo → <strong>Settings</strong> → <strong>Pages</strong>.</li>
                    <li>Under <em>Build and deployment</em>, set Source to <strong>GitHub Actions</strong>.</li>
                    <li>Select the <em>Static HTML</em> or <em>Node.js / Vite</em> action workflow.</li>
                    <li>Your site is automatically published on every commit!</li>
                  </ol>
                </div>
              </div>

              {/* Render Full-Stack */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                  <Server className="h-4 w-4 text-indigo-600" />
                  Render.com (Free Node.js Full-Stack)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  If you want the Node.js Express backend server (<code className="font-mono">server.ts</code>) to keep running live on the web so the <code className="font-mono">/api/content</code> routes are active:
                </p>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white">Render Configuration:</p>
                  <ul className="space-y-1.5 font-mono text-[11px]">
                    <li>• Type: <strong>Web Service</strong> (Free plan)</li>
                    <li>• Environment: <strong>Node</strong></li>
                    <li>• Build Command: <code className="text-indigo-600">npm install && npm run build</code></li>
                    <li>• Start Command: <code className="text-indigo-600">npm start</code></li>
                  </ul>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    ✓ Render builds your Vite app and starts <code className="font-mono">node dist/server.cjs</code> on port 3000 automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 5: LIVE BACKUP, EXPORT & RESTORE --- */}
      {activeSubTab === 'backup' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Live Backup, Export & Restore Utilities
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Safely download snapshots of your content, generate source code files, or restore an earlier backup.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Tool 1 */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <FileCode className="h-4 w-4 text-emerald-600" />
                    Complete JSON Snapshot
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Downloads a comprehensive JSON file with all {posts.length} articles, {prompts.length} prompts, and {menus.length} menus.
                  </p>
                </div>
                <button
                  onClick={handleDownloadBackupJson}
                  className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Backup JSON</span>
                </button>
              </div>

              {/* Tool 2 */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                    TypeScript Export
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Formats your current articles as ready-to-use TypeScript code for <code className="font-mono text-indigo-600">src/data/blogData.ts</code>.
                  </p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleCopyBlogDataTs}
                    className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    {copiedKey === 'blogDataTs' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedKey === 'blogDataTs' ? 'Copied to Clipboard!' : 'Copy TypeScript Code'}</span>
                  </button>
                  <button
                    onClick={handleDownloadBlogDataTs}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-1.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download .ts File</span>
                  </button>
                </div>
              </div>

              {/* Tool 3 */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <Upload className="h-4 w-4 text-purple-600" />
                    Restore Backup JSON
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Upload a previously saved <code className="font-mono">content_store.json</code> backup to restore your content immediately.
                  </p>
                </div>
                <label className="w-full cursor-pointer rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Choose JSON to Restore</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Toggle Raw JSON Inspector */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowJsonPreview(prev => !prev)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{showJsonPreview ? 'Hide Raw JSON Inspector' : 'Preview Live Raw JSON Data'}</span>
                </button>
                {showJsonPreview && (
                  <button
                    onClick={() => copyToClipboard(JSON.stringify({ posts, prompts, menus }, null, 2), 'rawJsonPreview')}
                    className="rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 text-[11px] font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    {copiedKey === 'rawJsonPreview' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'rawJsonPreview' ? 'Copied' : 'Copy Full JSON'}</span>
                  </button>
                )}
              </div>

              {showJsonPreview && (
                <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-200 max-h-96 overflow-y-auto border border-slate-800">
                  <pre>{JSON.stringify({ totalPosts: posts.length, totalPrompts: prompts.length, totalMenus: menus.length, samplePost: posts[0] }, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 7: CLI COMMANDS --- */}
      {activeSubTab === 'cli' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Essential Command Line (CLI) Commands
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run these commands in your project root terminal to build, test, and deploy your site:
            </p>

            <div className="space-y-4">
              {/* Command 1 */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">1. Start Local Development Server</span>
                  <button
                    onClick={() => copyToClipboard('npm run dev', 'cliDev')}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'cliDev' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'cliDev' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="rounded bg-slate-900 p-2.5 font-mono text-xs text-emerald-400">
                  npm run dev
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Starts Vite + Node Express server on <code className="font-mono text-indigo-500">http://localhost:3000</code>.
                </p>
              </div>

              {/* Command 2 */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">2. Build Production Bundle</span>
                  <button
                    onClick={() => copyToClipboard('npm run build', 'cliBuild')}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'cliBuild' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'cliBuild' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="rounded bg-slate-900 p-2.5 font-mono text-xs text-emerald-400">
                  npm run build
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Compiles production static assets into <code className="font-mono text-indigo-500">dist/</code> and bundles the server.
                </p>
              </div>

              {/* Command 3 */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">3. Verify TypeScript Code Quality</span>
                  <button
                    onClick={() => copyToClipboard('npm run lint', 'cliLint')}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'cliLint' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'cliLint' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="rounded bg-slate-900 p-2.5 font-mono text-xs text-emerald-400">
                  npm run lint
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Runs TypeScript type-checking to ensure 0 syntax errors.
                </p>
              </div>

              {/* Command 4 */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">4. Deploy to Cloudflare Pages (CLI)</span>
                  <button
                    onClick={() => copyToClipboard('npx wrangler pages deploy dist --project-name=aiprompt-blog', 'cliWrangler')}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'cliWrangler' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'cliWrangler' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="rounded bg-slate-900 p-2.5 font-mono text-xs text-amber-300">
                  npx wrangler pages deploy dist --project-name=aiprompt-blog
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instantly deploys your production <code className="font-mono text-indigo-400">dist/</code> folder directly to Cloudflare Pages.
                </p>
              </div>

              {/* Command 5 */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">5. Quick Deploy with Vercel CLI (Optional)</span>
                  <button
                    onClick={() => copyToClipboard('npx vercel', 'cliVercel')}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'cliVercel' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'cliVercel' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="rounded bg-slate-900 p-2.5 font-mono text-xs text-emerald-400">
                  npx vercel
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Deploy directly from your terminal to Vercel in 1 command without opening the browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
