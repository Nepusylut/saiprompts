import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Filter,
  Music,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Layers,
  Code,
  Cpu,
  Server,
  Database
} from 'lucide-react';
import { 
  BlogPost, 
  PromptData, 
  CategoryType,
  MenuItem,
  SubmenuItem
} from './types';
import { BLOG_POSTS, PROMPT_CATALOG, CATEGORIES_LIST, DEFAULT_MENUS } from './data/blogData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PostCard, getCategoryTheme } from './components/PostCard';
import { WebsiteIntroCard } from './components/WebsiteIntroCard';
import { ExploreFeaturesBanner } from './components/ExploreFeaturesBanner';
import { PostReader } from './components/PostReader';
import { PromptCard } from './components/PromptCard';
import { SavedPromptsDrawer } from './components/SavedPromptsDrawer';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'articles' | 'post' | 'prompts' | 'admin' | string>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [activeCustomMenu, setActiveCustomMenu] = useState<MenuItem | null>(null);

  // Dynamic Website Menus state with localStorage persistence
  const [menus, setMenus] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem('aiprompt_custom_menus');
      const loadedMenus: MenuItem[] = stored ? JSON.parse(stored) : DEFAULT_MENUS;
      // Filter out any previous default 'Tips' menu
      const sanitized = loadedMenus.filter(m => m.id !== 'tips' && m.title.trim().toLowerCase() !== 'tips');
      if (stored && sanitized.length !== loadedMenus.length) {
        try {
          localStorage.setItem('aiprompt_custom_menus', JSON.stringify(sanitized));
        } catch (_) {}
      }
      return sanitized;
    } catch (e) {
      return DEFAULT_MENUS;
    }
  });

  const handleSaveMenus = async (updatedMenus: MenuItem[]) => {
    setMenus(updatedMenus);
    try {
      localStorage.setItem('aiprompt_custom_menus', JSON.stringify(updatedMenus));
    } catch (e) {
      console.warn('localStorage error for menus:', e);
    }
    try {
      await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menus: updatedMenus })
      });
    } catch (err) {
      console.error('Failed to sync menus with server:', err);
    }
  };

  // Dark Mode State with localStorage persistence and system theme fallback
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('aiprompt_dark_mode');
      if (stored !== null) {
        return stored === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem('aiprompt_dark_mode', darkMode ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [darkMode]);

  // URL route handling for /admin
  useEffect(() => {
    const checkUrl = () => {
      if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
        setCurrentView('admin');
      }
    };
    checkUrl();
    window.addEventListener('popstate', checkUrl);
    return () => window.removeEventListener('popstate', checkUrl);
  }, []);

  useEffect(() => {
    if (currentView === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({ view: 'admin' }, '', '/admin');
      }
    } else if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
      window.history.pushState({ view: currentView }, '', '/');
    }
  }, [currentView]);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Dynamic Posts state with local storage persistence
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const stored = localStorage.getItem('aiprompt_custom_posts');
      return stored ? JSON.parse(stored) : BLOG_POSTS;
    } catch (e) {
      return BLOG_POSTS;
    }
  });

  // Dynamic Prompts state with local storage persistence
  const [prompts, setPrompts] = useState<PromptData[]>(() => {
    try {
      const stored = localStorage.getItem('aiprompt_custom_prompts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Strictly display prompts only: exclude any articles, section content, or non-prompt objects
          return parsed.filter(p => p && p.id && typeof p.promptText === 'string' && !('contentSections' in p) && !('paragraphs' in p));
        }
      }
      return PROMPT_CATALOG;
    } catch (e) {
      return PROMPT_CATALOG;
    }
  });

  // Initial sync from backend persistent storage
  useEffect(() => {
    let isMounted = true;
    const fetchPersistedContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          if (!isMounted) return;
          if (Array.isArray(data.posts) && data.posts.length > 0) {
            setPosts(data.posts);
            try { localStorage.setItem('aiprompt_custom_posts', JSON.stringify(data.posts)); } catch (_) {}
          } else {
            // Seed initial posts to backend if backend was empty
            try {
              const localPosts = localStorage.getItem('aiprompt_custom_posts');
              const seedPosts = localPosts ? JSON.parse(localPosts) : BLOG_POSTS;
              fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ posts: seedPosts })
              }).catch(() => {});
            } catch (_) {}
          }

          if (Array.isArray(data.prompts) && data.prompts.length > 0) {
            setPrompts(data.prompts);
            try { localStorage.setItem('aiprompt_custom_prompts', JSON.stringify(data.prompts)); } catch (_) {}
          } else {
            try {
              const localPrompts = localStorage.getItem('aiprompt_custom_prompts');
              const seedPrompts = localPrompts ? JSON.parse(localPrompts) : PROMPT_CATALOG;
              fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompts: seedPrompts })
              }).catch(() => {});
            } catch (_) {}
          }

          if (Array.isArray(data.menus) && data.menus.length > 0) {
            setMenus(data.menus);
            try { localStorage.setItem('aiprompt_custom_menus', JSON.stringify(data.menus)); } catch (_) {}
          } else {
            try {
              const localMenus = localStorage.getItem('aiprompt_custom_menus');
              const seedMenus = localMenus ? JSON.parse(localMenus) : DEFAULT_MENUS;
              fetch('/api/menus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ menus: seedMenus })
              }).catch(() => {});
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Backend storage sync notice:', err);
      }
    };
    fetchPersistedContent();
    return () => { isMounted = false; };
  }, []);

  const handleSavePosts = async (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem('aiprompt_custom_posts', JSON.stringify(updatedPosts));
    } catch (e) {
      console.warn('localStorage error for posts:', e);
    }
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: updatedPosts })
      });
    } catch (err) {
      console.error('Failed to sync posts with server:', err);
    }
  };

  const handleSavePrompts = async (updatedPrompts: PromptData[]) => {
    setPrompts(updatedPrompts);
    try {
      localStorage.setItem('aiprompt_custom_prompts', JSON.stringify(updatedPrompts));
    } catch (e) {
      console.warn('localStorage error for prompts:', e);
    }
    try {
      await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompts: updatedPrompts })
      });
    } catch (err) {
      console.error('Failed to sync prompts with server:', err);
    }
  };
  
  // Saved prompts state with localStorage persistence
  const [savedPrompts, setSavedPrompts] = useState<PromptData[]>(() => {
    try {
      const stored = localStorage.getItem('aiprompt_saved_prompts');
      return stored ? JSON.parse(stored) : [prompts[0] || PROMPT_CATALOG[0]];
    } catch (e) {
      return [prompts[0] || PROMPT_CATALOG[0]];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aiprompt_saved_prompts', JSON.stringify(savedPrompts));
    } catch (e) {
      console.error(e);
    }
  }, [savedPrompts]);

  // Saved articles state with localStorage persistence
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>(() => {
    try {
      const stored = localStorage.getItem('aiprompt_saved_posts');
      return stored ? JSON.parse(stored) : [posts[0] || BLOG_POSTS[0]].filter(Boolean);
    } catch (e) {
      return [posts[0] || BLOG_POSTS[0]].filter(Boolean);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aiprompt_saved_posts', JSON.stringify(savedPosts));
    } catch (e) {
      console.error(e);
    }
  }, [savedPosts]);

  const allPromptsMap = useMemo(() => {
    const map: Record<string, PromptData> = {};
    prompts.forEach(p => { map[p.id] = p; });
    posts.forEach(b => {
      b.prompts.forEach(p => { map[p.id] = p; });
    });
    return map;
  }, [posts, prompts]);

  const isTechCategory = (cat: string) => 
    cat === 'Technical Guides' || 
    cat === 'Full-Stack Guides' || 
    cat === 'AI System Guides' || 
    cat === 'Cloud Architecture' || 
    cat === 'Database Guides';

  const aiPromptPosts = useMemo(() => {
    return posts.filter(post => !isTechCategory(post.category));
  }, [posts]);

  const techGuidePosts = useMemo(() => {
    return posts.filter(post => isTechCategory(post.category));
  }, [posts]);

  // Filtered Posts (Prompt Articles & Technical Guides)
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      let matchesCategory = false;
      if (activeCategory === 'All') {
        matchesCategory = true;
      } else if (activeCategory === 'AI Prompts') {
        matchesCategory = !isTechCategory(post.category);
      } else if (activeCategory === 'Technical Guides') {
        matchesCategory = isTechCategory(post.category);
      } else {
        matchesCategory = post.category === activeCategory;
      }

      const matchesSearch = !searchQuery.trim() || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  // Filtered Prompts Catalog
  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      let matchesCategory = false;
      if (activeCategory === 'All') {
        matchesCategory = true;
      } else if (activeCategory === 'AI Prompts') {
        matchesCategory = !isTechCategory(prompt.category);
      } else if (activeCategory === 'Technical Guides') {
        matchesCategory = isTechCategory(prompt.category);
      } else {
        matchesCategory = prompt.category === activeCategory;
      }

      const matchesSearch = !searchQuery.trim() ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [prompts, activeCategory, searchQuery]);

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    setActiveCategory('All');
    setSelectedPost(null);
    setActiveCustomMenu(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCustomMenu = (menu: MenuItem, sub?: SubmenuItem) => {
    setActiveCustomMenu(menu);
    setCurrentView(menu.id);
    if (sub) {
      setActiveCategory(sub.categoryRef as CategoryType);
    } else {
      setActiveCategory('All');
    }
    setSearchQuery('');
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAllArticles = (category: CategoryType | 'All' = 'All') => {
    setCurrentView('articles');
    setActiveCategory(category);
    setSearchQuery('');
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPromptsLibrary = () => {
    setCurrentView('prompts');
    setActiveCategory('All');
    setSearchQuery('');
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSavePost = (post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedPosts(prev => {
      const exists = prev.some(p => p.id === post.id);
      if (exists) {
        return prev.filter(p => p.id !== post.id);
      } else {
        return [...prev, post];
      }
    });
  };

  const handleToggleSavePrompt = (prompt: PromptData) => {
    setSavedPrompts(prev => {
      const exists = prev.some(p => p.id === prompt.id);
      if (exists) {
        return prev.filter(p => p.id !== prompt.id);
      } else {
        return [...prev, prompt];
      }
    });
  };

  const handleRemoveSavedPrompt = (id: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handleRemoveSavedPost = (id: string) => {
    setSavedPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleClearAllSaved = () => {
    setSavedPrompts([]);
    setSavedPosts([]);
  };

  // Helper for Category Section Titles
  const getSectionTitle = (cat: CategoryType | 'All') => {
    switch (cat) {
      case 'Music Prompts':
        return { postTitle: 'Music Prompt Articles & Masterclasses', promptTitle: 'Music Prompts Library', icon: Music };
      case 'Image Prompts':
        return { postTitle: 'Image Prompt Articles & Render Guides', promptTitle: 'Image Prompts Library', icon: ImageIcon };
      case 'Video Prompts':
        return { postTitle: 'Video Script & Scene Direction Guides', promptTitle: 'Video Prompts Library', icon: VideoIcon };
      case 'Article Prompts':
        return { postTitle: 'Article Copywriting & Editorial Outlines', promptTitle: 'Article Prompts Library', icon: FileText };
      case 'General Prompts':
        return { postTitle: 'General Thinking & System Prompt Articles', promptTitle: 'General Prompts Library', icon: Sparkles };
      case 'Full-Stack Guides':
        return { postTitle: 'Full-Stack & Web Dev Architecture Guides', promptTitle: 'Full-Stack Code Prompts', icon: Code };
      case 'AI System Guides':
        return { postTitle: 'AI System & Agent Engineering Guides', promptTitle: 'AI Agent System Prompts', icon: Cpu };
      case 'Cloud Architecture':
        return { postTitle: 'Cloud & Infrastructure Security Guides', promptTitle: 'Cloud System Prompts', icon: Server };
      case 'Database Guides':
        return { postTitle: 'Database & Vector Storage Guides', promptTitle: 'Database Schema Prompts', icon: Database };
      case 'Technical Guides':
        return { postTitle: 'All Technical Engineering Guides', promptTitle: 'Technical Code Prompts', icon: BookOpen };
      case 'AI Prompts':
        return { postTitle: 'AI Prompt Articles & Masterclasses', promptTitle: 'All Copyable Prompts Library', icon: Layers };
      default:
        return { postTitle: 'Latest Articles & Guides', promptTitle: 'AI Prompts Catalog', icon: Sparkles };
    }
  };

  const sectionMeta = getSectionTitle(activeCategory);
  const SectionIcon = sectionMeta.icon;

  // On Home Page, show 4 latest articles (1 top featured + 3 below).
  // On All Articles Page, show ALL matching articles (filteredPosts without slice restriction).
  const displayPosts = useMemo(() => {
    if (currentView === 'home' && activeCategory === 'All') {
      return filteredPosts.slice(1, 4);
    }
    return filteredPosts;
  }, [filteredPosts, activeCategory, currentView]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          handleOpenAllArticles(cat);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        savedCount={savedPrompts.length + savedPosts.length}
        promptsCount={prompts.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenPromptsLibrary={handleOpenPromptsLibrary}
        onOpenAllArticles={(cat) => handleOpenAllArticles(cat || 'All')}
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        menus={menus}
        onSelectCustomMenu={handleSelectCustomMenu}
        currentCustomMenuId={activeCustomMenu?.id}
      />

      {/* Main View Area */}
      {currentView === 'admin' ? (
        <AdminPortal
          posts={posts}
          prompts={prompts}
          menus={menus}
          onSavePosts={handleSavePosts}
          onSavePrompts={handleSavePrompts}
          onSaveMenus={handleSaveMenus}
          onClose={handleNavigateHome}
          onSelectPostToView={(post) => {
            setSelectedPost(post);
            setCurrentView('post');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'prompts' ? (
        /* DEDICATED PROMPT LIBRARY TAB PAGE */
        <main className="flex-1 space-y-6">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl border border-orange-200/90 bg-gradient-to-r from-orange-100 via-amber-50 to-orange-200 text-orange-950 dark:border-amber-300/40 dark:bg-gradient-to-br dark:from-slate-900/85 dark:via-amber-800/60 dark:to-orange-950/90 dark:text-orange-100 dark:backdrop-blur-2xl dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_16px_48px_-12px_rgba(0,0,0,0.8),0_0_50px_rgba(245,158,11,0.35)] p-6 sm:p-8 lg:p-10 shadow-sm space-y-4">
              {/* Glass Top Glare Sheen Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent rounded-2xl opacity-0 dark:opacity-100" />

              <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight text-orange-950 dark:text-orange-100">
                Prompt Library
              </h1>
              <p className="text-sm sm:text-base text-orange-900/80 dark:text-orange-200/80 max-w-3xl leading-relaxed font-medium">
                Directly copy, test, and adapt high-performance system prompts and parameters.
              </p>

              {/* Prompt Category Filters (Glass Style Buttons in Dark Mode) */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`w-full lg:w-[165px] lg:min-w-[165px] inline-flex items-center justify-center text-center rounded-xl px-2 py-2 text-xs font-semibold transition-all ${
                    activeCategory === 'All'
                      ? 'bg-orange-600 text-white shadow-xs dark:bg-gradient-to-b dark:from-amber-400/90 dark:to-orange-600/90 dark:text-white dark:font-extrabold dark:border dark:border-white/50 dark:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.7),0_4px_20px_rgba(245,158,11,0.45)] dark:backdrop-blur-md'
                      : 'bg-white/70 border border-orange-300 text-orange-900 hover:bg-white dark:bg-slate-800/50 dark:backdrop-blur-md dark:border dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/20 dark:hover:border-white/40 dark:hover:text-white dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  All ({prompts.length})
                </button>
                {CATEGORIES_LIST.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(activeCategory === cat.name ? 'All' : cat.name as CategoryType)}
                    className={`w-full lg:w-[165px] lg:min-w-[165px] inline-flex items-center justify-center text-center rounded-xl px-2 py-2 text-xs font-semibold transition-all ${
                      activeCategory === cat.name
                        ? 'bg-orange-600 text-white shadow-xs dark:bg-gradient-to-b dark:from-amber-400/90 dark:to-orange-600/90 dark:text-white dark:font-extrabold dark:border dark:border-white/50 dark:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.7),0_4px_20px_rgba(245,158,11,0.45)] dark:backdrop-blur-md'
                        : 'bg-white/70 border border-orange-300 text-orange-900 hover:bg-white dark:bg-slate-800/50 dark:backdrop-blur-md dark:border dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/20 dark:hover:border-white/40 dark:hover:text-white dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)]'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 space-y-6">
            {filteredPrompts.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400 shadow-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-200">No copyable prompts match your search/category filter</p>
                <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">Try searching for different keywords or resetting filters.</p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 dark:text-orange-400 hover:underline"
                >
                  Reset Prompt Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPrompts.map(prompt => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isSaved={savedPrompts.some(sp => sp.id === prompt.id)}
                    onToggleSave={handleToggleSavePrompt}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      ) : currentView === 'articles' ? (
        /* DEDICATED ALL ARTICLES & CATEGORY PAGE */
        (() => {
          const isPromptCat = [
            'AI Prompts', 'General Prompts', 'Music Prompts', 'Image Prompts', 'Video Prompts', 'Article Prompts'
          ].includes(activeCategory);

          const isTechCat = [
            'Technical Guides', 'Full-Stack Guides', 'AI System Guides', 'Cloud Architecture', 'Database Guides', 'Full-Stack Engineering'
          ].includes(activeCategory);

          // Theme based on prompt instructions and photo color bands:
          // All Articles -> Light Purple (#601df0)
          // AI Prompts -> Soft Light Green (#26f034)
          // Technical Guides -> Sky Blue (#1f6cf0)
          const theme = isPromptCat ? {
            cardBg: 'bg-gradient-to-r from-emerald-100 via-teal-50 to-green-100 border-emerald-200/90 text-emerald-950 dark:border-emerald-300/40 dark:bg-gradient-to-br dark:from-slate-900/85 dark:via-emerald-800/50 dark:to-teal-950/90 dark:text-emerald-100 dark:backdrop-blur-2xl dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_16px_48px_-12px_rgba(0,0,0,0.8),0_0_50px_rgba(38,240,52,0.3)]',
            badgeBg: 'bg-emerald-500/20 border-emerald-600/30 text-emerald-900 dark:text-emerald-200',
            badgeIcon: 'text-[#26f034] dark:text-[#26f034]',
            titleColor: 'text-emerald-950 dark:text-emerald-100',
            descColor: 'text-emerald-900/80 dark:text-emerald-200/80',
            inputBorder: 'border-emerald-300 bg-white/90 text-emerald-950 placeholder-emerald-700/60 focus:border-[#26f034] dark:border-emerald-800 dark:bg-slate-900/90 dark:text-emerald-100 dark:placeholder-emerald-400',
            inputIcon: 'text-[#26f034]',
            btnActive: 'bg-[#26f034] text-slate-950 font-bold shadow-xs dark:bg-gradient-to-b dark:from-emerald-400/95 dark:to-green-600/95 dark:text-slate-950 dark:font-extrabold dark:border dark:border-white/60 dark:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(38,240,52,0.45)] dark:backdrop-blur-md',
            btnInactive: 'bg-white/70 border border-emerald-300 text-emerald-900 hover:bg-white dark:bg-slate-800/50 dark:backdrop-blur-md dark:border dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/20 dark:hover:border-white/40 dark:hover:text-white dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)]',
            resetText: 'text-[#26f034] dark:text-[#26f034]'
          } : isTechCat ? {
            cardBg: 'bg-gradient-to-r from-sky-100 via-blue-50 to-cyan-100 border-sky-200/90 text-sky-950 dark:border-sky-300/40 dark:bg-gradient-to-br dark:from-slate-900/85 dark:via-sky-800/60 dark:to-blue-950/90 dark:text-sky-100 dark:backdrop-blur-2xl dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_16px_48px_-12px_rgba(0,0,0,0.8),0_0_50px_rgba(14,165,233,0.35)]',
            badgeBg: 'bg-sky-500/20 border-sky-600/30 text-sky-900 dark:text-sky-200',
            badgeIcon: 'text-[#1f6cf0] dark:text-[#1f6cf0]',
            titleColor: 'text-sky-950 dark:text-sky-100',
            descColor: 'text-sky-900/80 dark:text-sky-200/80',
            inputBorder: 'border-sky-300 bg-white/90 text-sky-950 placeholder-sky-700/60 focus:border-[#1f6cf0] dark:border-sky-800 dark:bg-slate-900/90 dark:text-sky-100 dark:placeholder-sky-400',
            inputIcon: 'text-[#1f6cf0]',
            btnActive: 'bg-[#1f6cf0] text-white shadow-xs dark:bg-gradient-to-b dark:from-sky-400/95 dark:to-blue-600/95 dark:text-white dark:font-extrabold dark:border dark:border-white/60 dark:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(31,108,240,0.45)] dark:backdrop-blur-md',
            btnInactive: 'bg-white/70 border border-sky-300 text-sky-900 hover:bg-white dark:bg-slate-800/50 dark:backdrop-blur-md dark:border dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/20 dark:hover:border-white/40 dark:hover:text-white dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)]',
            resetText: 'text-[#1f6cf0] dark:text-[#1f6cf0]'
          } : {
            // Light Purple theme for All Articles
            cardBg: 'bg-gradient-to-r from-purple-100 via-fuchsia-50 to-indigo-100 border-purple-200/90 text-purple-950 dark:border-purple-300/40 dark:bg-gradient-to-br dark:from-slate-900/85 dark:via-purple-800/50 dark:to-indigo-950/90 dark:text-purple-100 dark:backdrop-blur-2xl dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_16px_48px_-12px_rgba(0,0,0,0.8),0_0_50px_rgba(96,29,240,0.3)]',
            badgeBg: 'bg-purple-500/20 border-purple-600/30 text-purple-900 dark:text-purple-200',
            badgeIcon: 'text-[#601df0] dark:text-[#601df0]',
            titleColor: 'text-purple-950 dark:text-purple-100',
            descColor: 'text-purple-900/80 dark:text-purple-200/80',
            inputBorder: 'border-purple-300 bg-white/90 text-purple-950 placeholder-purple-700/60 focus:border-[#601df0] dark:border-purple-800 dark:bg-slate-900/90 dark:text-purple-100 dark:placeholder-purple-400',
            inputIcon: 'text-[#601df0]',
            btnActive: 'bg-[#601df0] text-white shadow-xs dark:bg-gradient-to-b dark:from-purple-400/95 dark:to-indigo-600/95 dark:text-white dark:font-extrabold dark:border dark:border-white/60 dark:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(96,29,240,0.45)] dark:backdrop-blur-md',
            btnInactive: 'bg-white/70 border border-purple-300 text-purple-900 hover:bg-white dark:bg-slate-800/50 dark:backdrop-blur-md dark:border dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/20 dark:hover:border-white/40 dark:hover:text-white dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)]',
            resetText: 'text-[#601df0] dark:text-[#601df0]'
          };

          return (
            <main className="flex-1 space-y-6">
              <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
                <div className={`relative overflow-hidden rounded-2xl border ${theme.cardBg} p-6 sm:p-8 lg:p-10 shadow-sm space-y-3`}>
                  {/* Glass Top Glare Sheen Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent rounded-2xl opacity-0 dark:opacity-100" />
                  <h1 className={`text-3xl font-extrabold sm:text-4xl tracking-tight ${theme.titleColor}`}>
                    {activeCategory === 'All' ? 'All Engineering & AI Articles' : `${activeCategory} Articles`}
                  </h1>
                  <p className={`text-xs sm:text-sm max-w-none leading-relaxed font-medium ${theme.descColor}`}>
                    Browse our complete collection of deep-dive technical engineering tutorials, system prompt architecture guides, and AI masterclasses.
                  </p>

                  {/* Category Filter Pills (Glass Style Buttons in Dark Mode) */}
                  <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveCategory('All')}
                      className={`w-full lg:w-[165px] lg:min-w-[165px] inline-flex items-center justify-center text-center rounded-xl px-2 py-2 text-xs font-semibold transition-all ${
                        activeCategory === 'All'
                          ? theme.btnActive
                          : theme.btnInactive
                      }`}
                    >
                      All ({posts.length})
                    </button>
                    {CATEGORIES_LIST.map(cat => (
                      <button
                        key={cat.name}
                        onClick={() => setActiveCategory(activeCategory === cat.name ? 'All' : cat.name as CategoryType)}
                        className={`w-full lg:w-[165px] lg:min-w-[165px] inline-flex items-center justify-center text-center rounded-xl px-2 py-2 text-xs font-semibold transition-all ${
                          activeCategory === cat.name
                            ? theme.btnActive
                            : theme.btnInactive
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 space-y-6">
                {filteredPosts.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400 shadow-xs">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">No articles match your search or category filter</p>
                    <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">Try selecting another category or clearing search parameters.</p>
                    <button
                      onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                      className={`mt-4 inline-flex items-center gap-1.5 text-xs font-bold hover:underline ${theme.resetText}`}
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map(post => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onSelectPost={handleSelectPost}
                        isSaved={savedPosts.some(sp => sp.id === post.id)}
                        onToggleSave={handleToggleSavePost}
                      />
                    ))}
                  </div>
                )}
              </div>
            </main>
          );
        })()
      ) : currentView === 'home' ? (
        <main className="flex-1">
          {/* Hero Banner Section */}
          <HeroSection
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              handleOpenAllArticles(cat);
            }}
            totalPromptsCount={prompts.length}
            totalArticlesCount={posts.length}
          />

          {/* Main Content Container */}
          <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16 lg:px-8 space-y-12">
            {/* Website Introduction & Descriptions Banner */}
            <WebsiteIntroCard />

            {/* Section 1: Latest AI Prompts */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Latest AI Prompts
                  </h2>
                </div>
                <button
                  onClick={() => handleOpenAllArticles('AI Prompts')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  <span>View All Articles</span>
                  <span>→</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {aiPromptPosts.slice(0, 3).map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelectPost={handleSelectPost}
                    isSaved={savedPosts.some(sp => sp.id === post.id)}
                    onToggleSave={handleToggleSavePost}
                  />
                ))}
              </div>
            </section>

            {/* Section 2: Latest Technical Guides */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Latest Technical Guides
                  </h2>
                </div>
                <button
                  onClick={() => handleOpenAllArticles('Technical Guides')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  <span>View All Articles</span>
                  <span>→</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {techGuidePosts.slice(0, 3).map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelectPost={handleSelectPost}
                    isSaved={savedPosts.some(sp => sp.id === post.id)}
                    onToggleSave={handleToggleSavePost}
                  />
                ))}
              </div>

              {/* Blank new line / separator spacing */}
              <div className="py-2" />

              {/* Banner encouraging all articles exploration (Numbers removed) */}
              <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900 bg-gradient-to-r from-indigo-50/90 via-white to-violet-50/90 dark:from-indigo-950/80 dark:via-slate-900 dark:to-violet-950/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Want to browse all technical engineering & prompt articles?</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Explore our full catalog page or filter by specific topics like Full-Stack, AI System, Music, or Image Prompts.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenAllArticles('All')}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                  >
                    Browse All Articles
                  </button>
                </div>
              </div>

              {/* Blank new line / separator spacing */}
              <div className="py-2" />

              {/* Core Feature Pillars & Navigation Buttons (Moved from top under webcard) */}
              <ExploreFeaturesBanner
                onOpenPromptsLibrary={handleOpenPromptsLibrary}
                onOpenAllArticles={() => handleOpenAllArticles('All')}
              />
            </section>
          </div>
        </main>
      ) : selectedPost ? (
        /* Detailed Article Reader View */
        <PostReader
          post={posts.find(p => p.id === selectedPost.id) || selectedPost}
          allPromptsMap={allPromptsMap}
          onBack={handleNavigateHome}
          onSelectRelatedPost={(p) => {
            setSelectedPost(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          relatedPosts={posts.filter(b => b.id !== selectedPost.id && (b.category === selectedPost.category || selectedPost.category === 'All'))}
          isSaved={savedPosts.some(sp => sp.id === selectedPost.id)}
          onToggleSave={handleToggleSavePost}
        />
      ) : activeCustomMenu ? (
        /* DEDICATED CUSTOM MENU PAGE (e.g. Tips, etc.) */
        /* Exact same design and format as other pages except home page */
        (() => {
          const menuSubcategories = activeCustomMenu.submenus || [];
          
          // Filter articles for this custom menu
          const customPosts = posts.filter(post => {
            const matchesMenuCategory = activeCategory === 'All' 
              ? (post.category.toLowerCase().includes(activeCustomMenu.title.toLowerCase()) || 
                 menuSubcategories.some(s => s.title.toLowerCase() === post.category.toLowerCase() || s.categoryRef === post.category) ||
                 post.tags.some(t => t.toLowerCase().includes(activeCustomMenu.title.toLowerCase())))
              : (post.category === activeCategory);

            const matchesSearch = !searchQuery.trim() ||
              post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

            return (menuSubcategories.length === 0 || matchesMenuCategory) && matchesSearch;
          });

          // Elegant Theme matching other pages
          const theme = {
            cardBg: 'bg-gradient-to-r from-purple-100 via-indigo-50 to-violet-100 border-purple-200/90 text-purple-950 dark:border-purple-300/40 dark:bg-gradient-to-br dark:from-slate-900/85 dark:via-purple-800/50 dark:to-indigo-950/90 dark:text-purple-100 dark:backdrop-blur-2xl dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_16px_48px_-12px_rgba(0,0,0,0.8),0_0_50px_rgba(96,29,240,0.3)]',
            titleColor: 'text-purple-950 dark:text-purple-100',
            descColor: 'text-purple-900/80 dark:text-purple-200/80',
            btnActive: 'bg-[#601df0] text-white shadow-xs dark:bg-gradient-to-b dark:from-purple-400/95 dark:to-indigo-600/95 dark:text-white dark:font-extrabold dark:border dark:border-white/60 dark:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(96,29,240,0.45)] dark:backdrop-blur-md',
            btnInactive: 'bg-white/70 border border-purple-300 text-purple-900 hover:bg-white dark:bg-slate-800/50 dark:backdrop-blur-md dark:border dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/20 dark:hover:border-white/40 dark:hover:text-white dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)]',
            resetText: 'text-[#601df0] dark:text-[#601df0]'
          };

          const displayPosts = customPosts.length > 0 ? customPosts : posts;

          return (
            <main className="flex-1 space-y-6">
              <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
                <div className={`relative overflow-hidden rounded-2xl border ${theme.cardBg} p-6 sm:p-8 lg:p-10 shadow-sm space-y-3`}>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent rounded-2xl opacity-0 dark:opacity-100" />
                  <h1 className={`text-3xl font-extrabold sm:text-4xl tracking-tight ${theme.titleColor}`}>
                    {activeCategory === 'All' ? `${activeCustomMenu.title} Guides & Resources` : `${activeCategory} Articles`}
                  </h1>
                  <p className={`text-xs sm:text-sm max-w-none leading-relaxed font-medium ${theme.descColor}`}>
                    {activeCustomMenu.description || `Browse our collection of ${activeCustomMenu.title.toLowerCase()} articles, tips, and step-by-step guides.`}
                  </p>

                  {/* Category Filter Pills (2 buttons per line on mobile, 4 buttons per line on tablet) */}
                  <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveCategory('All')}
                      className={`w-full lg:w-[165px] lg:min-w-[165px] inline-flex items-center justify-center text-center rounded-xl px-2 py-2 text-xs font-semibold transition-all ${
                        activeCategory === 'All'
                          ? theme.btnActive
                          : theme.btnInactive
                      }`}
                    >
                      All ({displayPosts.length})
                    </button>
                    {menuSubcategories.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveCategory(activeCategory === sub.title ? 'All' : sub.title as any)}
                        className={`w-full lg:w-[165px] lg:min-w-[165px] inline-flex items-center justify-center text-center rounded-xl px-2 py-2 text-xs font-semibold transition-all ${
                          activeCategory === sub.title
                            ? theme.btnActive
                            : theme.btnInactive
                        }`}
                      >
                        <span className="truncate">{sub.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 space-y-6">
                {displayPosts.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400 shadow-xs">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">No articles match your search or filter</p>
                    <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">Try selecting another category or clearing search parameters.</p>
                    <button
                      onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                      className={`mt-4 inline-flex items-center gap-1.5 text-xs font-bold hover:underline ${theme.resetText}`}
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {displayPosts.map(post => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onSelectPost={handleSelectPost}
                        isSaved={savedPosts.some(sp => sp.id === post.id)}
                        onToggleSave={handleToggleSavePost}
                      />
                    ))}
                  </div>
                )}
              </div>
            </main>
          );
        })()
      ) : null}

      {/* Bookmarked Prompts & Articles Drawer */}
      <SavedPromptsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPrompts={savedPrompts}
        savedPosts={savedPosts}
        onRemovePrompt={handleRemoveSavedPrompt}
        onRemovePost={handleRemoveSavedPost}
        onClearAll={handleClearAllSaved}
        onSelectPost={(post) => {
          setSelectedPost(post);
          setCurrentView('post');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectPrompt={(prompt) => {
          setSearchQuery('');
          setActiveCategory(prompt.category || 'All');
          setCurrentView('prompts');
          setTimeout(() => {
            const el = document.getElementById(`prompt-card-${prompt.id}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-2', 'dark:ring-offset-slate-900', 'transition-all');
              setTimeout(() => {
                el.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-2', 'dark:ring-offset-slate-900');
              }, 2500);
            }
          }, 150);
        }}
      />

      {/* Global Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleOpenAllArticles();
        }}
        onOpenPromptsLibrary={handleOpenPromptsLibrary}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
