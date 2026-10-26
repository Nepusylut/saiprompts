export type AIToolType = 
  | 'ChatGPT'
  | 'Claude'
  | 'Midjourney'
  | 'Suno'
  | 'Stable Diffusion'
  | 'Cursor'
  | 'DeepSeek'
  | 'General';

export type PromptCategoryType = 
  | 'General Prompts'
  | 'Music Prompts'
  | 'Image Prompts'
  | 'Video Prompts'
  | 'Article Prompts';

export type TechGuideCategoryType =
  | 'Full-Stack Guides'
  | 'AI System Guides'
  | 'Cloud Architecture'
  | 'Database Guides';

export type CategoryType = 
  | 'AI Prompts'
  | 'Technical Guides'
  | PromptCategoryType
  | TechGuideCategoryType;

export interface ParameterItem {
  label: string;
  value: string;
  color?: string;
  badgeType?: 'param' | 'version' | 'setting' | 'model';
}

export interface PromptVariable {
  name: string;
  defaultValue: string;
  description: string;
}

export interface PromptData {
  id: string;
  title: string;
  description: string;
  tool: AIToolType;
  category: CategoryType;
  promptText: string;
  parameters: ParameterItem[];
  variables?: PromptVariable[];
  tags: string[];
  copyCount: number;
  rating?: number;
  author?: string;
  targetSectionIndex?: number;
  outputPreview?: {
    type: 'image' | 'code' | 'audio' | 'text';
    content: string;
    caption?: string;
  };
}

export interface VideoEmbedData {
  id: string;
  type: 'youtube' | 'vimeo' | 'bilibili' | 'mp4' | 'other';
  src: string;
  originalUrl?: string;
  title: string;
  poster?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  caption?: string;
  targetSectionIndex?: number;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: CategoryType;
  tags: string[];
  featuredTools: AIToolType[];
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    handle: string;
  };
  featuredImage?: string;
  videoUrl?: string;
  videoTitle?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  viewCount: number;
  prompts: PromptData[];
  videos?: VideoEmbedData[];
  toc: TableOfContentsItem[];
  contentSections: {
    id: string;
    heading: string;
    level: number;
    paragraphs: string[];
    promptIds?: string[];
    videoId?: string;
    codeSnippet?: {
      language: string;
      code: string;
      filename?: string;
    };
    callout?: {
      type: 'tip' | 'warning' | 'note' | 'pro';
      title: string;
      text: string;
    };
    imageShowcase?: {
      src: string;
      alt: string;
      caption?: string;
    };
  }[];
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: CategoryType | 'All' | string;
  selectedTool: AIToolType | 'All';
  selectedTag: string | 'All';
  sortBy: 'latest' | 'popular' | 'trending';
}

export interface SubmenuItem {
  id: string;
  title: string;
  categoryRef?: string;
  description?: string;
  order?: number;
}

export interface MenuItem {
  id: string;
  title: string;
  isCustom?: boolean;
  type?: 'page' | 'category' | 'link';
  description?: string;
  order?: number;
  submenus: SubmenuItem[];
}
