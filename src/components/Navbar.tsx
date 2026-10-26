import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Bookmark, 
  BookOpen, 
  Shield,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { CategoryType, MenuItem, SubmenuItem } from '../types';

interface NavbarProps {
  activeCategory: CategoryType | 'All';
  onSelectCategory: (category: CategoryType | 'All') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  savedCount: number;
  promptsCount?: number;
  onOpenSavedDrawer: () => void;
  onOpenAdmin: () => void;
  onOpenPromptsLibrary: () => void;
  onOpenAllArticles: (category?: CategoryType | 'All') => void;
  currentView: 'home' | 'articles' | 'post' | 'prompts' | 'admin' | string;
  onNavigateHome: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  menus?: MenuItem[];
  onSelectCustomMenu?: (menu: MenuItem, sub?: SubmenuItem) => void;
  currentCustomMenuId?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  savedCount,
  promptsCount = 16,
  onOpenSavedDrawer,
  onOpenAdmin,
  onOpenPromptsLibrary,
  onOpenAllArticles,
  currentView,
  onNavigateHome,
  darkMode = false,
  onToggleDarkMode,
  menus,
  onSelectCustomMenu,
  currentCustomMenuId,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promptsDropdownOpen, setPromptsDropdownOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  // 5-click rapid easter egg handler to open Author Portal
  const handleLogoClick = () => {
    onNavigateHome();
    const next = logoClickCount + 1;
    if (next >= 5) {
      setLogoClickCount(0);
      onOpenAdmin();
    } else {
      setLogoClickCount(next);
    }
  };

  useEffect(() => {
    if (logoClickCount > 0) {
      const timer = setTimeout(() => {
        setLogoClickCount(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [logoClickCount]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const promptSubcategories: CategoryType[] = [
    'General Prompts',
    'Music Prompts',
    'Image Prompts',
    'Video Prompts',
    'Article Prompts'
  ];

  const techSubcategories: CategoryType[] = [
    'Full-Stack Guides',
    'AI System Guides',
    'Cloud Architecture',
    'Database Guides'
  ];

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${
      scrolled 
        ? 'border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm dark:border-slate-800 dark:bg-slate-950/95' 
        : 'border-b border-slate-200/80 bg-white/90 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/90'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 text-left focus:outline-none group select-none"
            title="AIPrompt Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-slate-900 dark:text-white text-lg">
                <span>AI</span>
                <span className="text-indigo-600 dark:text-[#5e22f5]">Prompt</span>
              </div>
            </div>
          </button>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={onNavigateHome}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              Home
            </button>

            {/* AI Prompts Dropdown / Group */}
            <div className="relative group">
              <button
                onClick={() => {
                  onSelectCategory('AI Prompts');
                  onOpenAllArticles('AI Prompts');
                }}
                onMouseEnter={() => setPromptsDropdownOpen(true)}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  (activeCategory === 'AI Prompts' || promptSubcategories.includes(activeCategory as CategoryType)) && currentView === 'articles'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>AI Prompts</span>
                <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
              </button>

              {/* Submenu Dropdown */}
              <div 
                className="absolute left-0 top-full pt-1 hidden group-hover:block w-52 z-50"
                onMouseLeave={() => setPromptsDropdownOpen(false)}
              >
                <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900 space-y-0.5">
                  <button
                    onClick={() => {
                      onSelectCategory('AI Prompts');
                      onOpenAllArticles('AI Prompts');
                    }}
                    className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                      activeCategory === 'AI Prompts' && currentView === 'articles'
                        ? 'bg-emerald-50 text-emerald-700 font-bold dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'text-slate-900 font-semibold hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>All AI Prompts</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">All</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />
                  {promptSubcategories.map((subCat) => (
                    <button
                      key={subCat}
                      onClick={() => {
                        onSelectCategory(subCat);
                        onOpenAllArticles(subCat);
                      }}
                      className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors flex items-center justify-between ${
                        activeCategory === subCat && currentView === 'articles'
                          ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                      }`}
                    >
                      <span>{subCat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Guides Dropdown / Group */}
            <div className="relative group">
              <button
                onClick={() => {
                  onSelectCategory('Technical Guides');
                  onOpenAllArticles('Technical Guides');
                }}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  (activeCategory === 'Technical Guides' || techSubcategories.includes(activeCategory as CategoryType)) && currentView === 'articles'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                <span>Technical Guides</span>
                <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
              </button>

              {/* Submenu Dropdown */}
              <div 
                className="absolute left-0 top-full pt-1 hidden group-hover:block w-56 z-50"
              >
                <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900 space-y-0.5">
                  <button
                    onClick={() => {
                      onSelectCategory('Technical Guides');
                      onOpenAllArticles('Technical Guides');
                    }}
                    className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                      activeCategory === 'Technical Guides' && currentView === 'articles'
                        ? 'bg-sky-50 text-sky-700 font-bold dark:bg-sky-950/60 dark:text-sky-300'
                        : 'text-slate-900 font-semibold hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>All Technical Guides</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">All</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />
                  {techSubcategories.map((subCat) => (
                    <button
                      key={subCat}
                      onClick={() => {
                        onSelectCategory(subCat);
                        onOpenAllArticles(subCat);
                      }}
                      className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors flex items-center justify-between ${
                        activeCategory === subCat && currentView === 'articles'
                          ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                      }`}
                    >
                      <span>{subCat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prompt Library Dedicated Tab Page Button */}
            <button
              onClick={onOpenPromptsLibrary}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                currentView === 'prompts'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <Sparkles className={`h-3.5 w-3.5 ${currentView === 'prompts' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
              <span>Prompt Library</span>
            </button>

            {/* All Articles (Moved next to Prompt Library) */}
            <button
              onClick={() => onOpenAllArticles('All')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                currentView === 'articles' && activeCategory === 'All'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              All Articles
            </button>

            {/* Dynamic Custom Menus (excluding tips) */}
            {menus?.filter(m => m.isCustom && m.id !== 'tips' && m.title.trim().toLowerCase() !== 'tips').map((customMenu) => (
              <div key={customMenu.id} className="relative group">
                <button
                  onClick={() => {
                    if (onSelectCustomMenu) {
                      onSelectCustomMenu(customMenu);
                    } else {
                      onOpenAllArticles(customMenu.title as any);
                    }
                  }}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    currentCustomMenuId === customMenu.id
                      ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{customMenu.title}</span>
                  {customMenu.submenus && customMenu.submenus.length > 0 && (
                    <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                  )}
                </button>

                {customMenu.submenus && customMenu.submenus.length > 0 && (
                  <div className="absolute left-0 top-full pt-1 hidden group-hover:block w-52 z-50">
                    <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900 space-y-0.5">
                      <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">
                        {customMenu.title} Submenus
                      </div>
                      {customMenu.submenus.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            if (onSelectCustomMenu) {
                              onSelectCustomMenu(customMenu, sub);
                            } else {
                              onOpenAllArticles(sub.categoryRef as any);
                            }
                          }}
                          className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                          <span>{sub.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Search Field & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Search Field */}
          <div className="relative hidden md:block w-44 lg:w-60">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search prompts & articles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-100 py-1.5 pl-8 pr-7 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-950 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Saved Prompts Drawer Trigger */}
          <button
            onClick={onOpenSavedDrawer}
            className="relative inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors shadow-xs"
            title="View saved bookmarks"
          >
            <Bookmark className="h-4 w-4" />
            {savedCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle Button (Next to Bookmark) */}
          <button
            onClick={onToggleDarkMode}
            className="relative inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors shadow-xs"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Mobile Menu Button (3 lines) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 lg:hidden hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open Mobile Menu Page"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Standalone Mobile/Tablet Menu Pop-Up Page Modal Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col h-[100dvh] w-full bg-slate-50/98 dark:bg-slate-950/98 backdrop-blur-2xl lg:hidden overflow-y-auto animate-in fade-in duration-200">
          {/* Top Header inside Popup Menu Page */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3.5 dark:border-slate-800/80 dark:bg-slate-900/90 backdrop-blur-md">
            <button 
              onClick={() => {
                handleLogoClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-slate-900 dark:text-white text-lg">
                <span>AI</span>
                <span className="text-indigo-600 dark:text-[#5e22f5]">Prompt</span>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleDarkMode}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-slate-200/80 p-2 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close menu page"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Menu Page Main Content */}
          <div className="flex-1 px-4 py-6 sm:px-6 space-y-6 max-w-2xl mx-auto w-full">
            {/* Search Input Box */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search prompts, guides & articles..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Section 1: Core Navigation */}
            <div className="space-y-2">
              <span className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Navigation Menu
              </span>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    onNavigateHome();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all flex items-center justify-between ${
                    currentView === 'home' 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                      : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <span>Home Page</span>
                  <span className="text-xs opacity-75">→</span>
                </button>

                <button
                  onClick={() => {
                    onOpenPromptsLibrary();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all flex items-center justify-between ${
                    currentView === 'prompts'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className={`h-4 w-4 ${currentView === 'prompts' ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`} />
                    <span>Prompt Library</span>
                  </div>
                  <span className="text-xs opacity-75">→</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAllArticles('All');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all flex items-center justify-between ${
                    currentView === 'articles' && activeCategory === 'All'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <span>All Articles Page</span>
                  <span className="text-xs opacity-75">→</span>
                </button>

                <button
                  onClick={() => {
                    onOpenSavedDrawer();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-indigo-500" />
                    <span>Saved Bookmarks</span>
                  </div>
                  {savedCount > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                      {savedCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Section 2: Technical Guides Subcategories */}
            <div className="space-y-2">
              <span className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Technical Engineering Guides
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onSelectCategory('Technical Guides');
                    onOpenAllArticles('Technical Guides');
                    setMobileMenuOpen(false);
                  }}
                  className={`col-span-2 rounded-xl px-3.5 py-2.5 text-left text-xs font-bold border transition-all ${
                    activeCategory === 'Technical Guides' && currentView === 'articles'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-950/40 dark:border-sky-800 dark:text-sky-200'
                  }`}
                >
                  All Technical Guides →
                </button>
                {techSubcategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onSelectCategory(cat);
                      onOpenAllArticles(cat);
                      setMobileMenuOpen(false);
                    }}
                    className={`rounded-xl px-3 py-2.5 text-left text-xs font-medium border transition-all truncate ${
                      activeCategory === cat && currentView === 'articles'
                        ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: AI Prompts Subcategories */}
            <div className="space-y-2 pb-2">
              <span className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                AI Prompts Masterclasses
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onSelectCategory('AI Prompts');
                    onOpenAllArticles('AI Prompts');
                    setMobileMenuOpen(false);
                  }}
                  className={`col-span-2 rounded-xl px-3.5 py-2.5 text-left text-xs font-bold border transition-all ${
                    activeCategory === 'AI Prompts' && currentView === 'articles'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
                  }`}
                >
                  All AI Prompt Articles →
                </button>
                {promptSubcategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onSelectCategory(cat);
                      onOpenAllArticles(cat);
                      setMobileMenuOpen(false);
                    }}
                    className={`rounded-xl px-3 py-2.5 text-left text-xs font-medium border transition-all truncate ${
                      activeCategory === cat && currentView === 'articles'
                        ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 4: Dynamic Custom Menus */}
            {menus && menus.filter(m => m.isCustom && m.id !== 'tips' && m.title.trim().toLowerCase() !== 'tips').length > 0 && (
              <div className="space-y-2 pb-6">
                <span className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Custom Pages & Menus
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {menus.filter(m => m.isCustom && m.id !== 'tips' && m.title.trim().toLowerCase() !== 'tips').map((customMenu) => (
                    <div key={customMenu.id} className="space-y-1.5">
                      <button
                        onClick={() => {
                          if (onSelectCustomMenu) {
                            onSelectCustomMenu(customMenu);
                          } else {
                            onOpenAllArticles(customMenu.title as any);
                          }
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-left text-xs font-bold border transition-all flex items-center justify-between ${
                          currentCustomMenuId === customMenu.id
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{customMenu.title} Page</span>
                        </div>
                        <span className="text-xs">→</span>
                      </button>

                      {customMenu.submenus && customMenu.submenus.length > 0 && (
                        <div className="grid grid-cols-2 gap-1.5 pl-2">
                          {customMenu.submenus.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                if (onSelectCustomMenu) {
                                  onSelectCustomMenu(customMenu, sub);
                                } else {
                                  onOpenAllArticles(sub.categoryRef as any);
                                }
                                setMobileMenuOpen(false);
                              }}
                              className="rounded-lg px-2.5 py-1.5 text-left text-[11px] font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 truncate"
                            >
                              {sub.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

