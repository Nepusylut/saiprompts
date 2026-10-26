import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  Save, 
  RefreshCw, 
  X, 
  ExternalLink, 
  Search,
  CheckCircle2,
  BookOpen,
  Wand2,
  Upload,
  Image as ImageIcon,
  FileText,
  ArrowLeft,
  List,
  Layers,
  FolderPlus,
  Tag,
  Rocket,
  Film,
  Video
} from 'lucide-react';
import { 
  BlogPost, 
  PromptData, 
  CategoryType, 
  AIToolType,
  MenuItem,
  SubmenuItem,
  VideoEmbedData
} from '../types';
import { AI_TOOLS_LIST, CATEGORIES_LIST, DEFAULT_MENUS } from '../data/blogData';
import { SetupDeployGuide } from './SetupDeployGuide';
import { parseVideoUrl, createVideoEmbedData } from '../utils/videoUtils';
import { VideoEmbed } from './VideoEmbed';

interface AdminPortalProps {
  posts: BlogPost[];
  prompts: PromptData[];
  menus?: MenuItem[];
  onSavePosts: (posts: BlogPost[]) => void;
  onSavePrompts: (prompts: PromptData[]) => void;
  onSaveMenus?: (menus: MenuItem[]) => void;
  onClose: () => void;
  onSelectPostToView: (post: BlogPost) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  posts,
  prompts,
  menus,
  onSavePosts,
  onSavePrompts,
  onSaveMenus,
  onClose,
  onSelectPostToView
}) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<'posts' | 'prompts' | 'menus' | 'guide'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const handleImportBackup = (backupData: { posts?: BlogPost[]; prompts?: PromptData[]; menus?: MenuItem[] }) => {
    if (backupData.posts && Array.isArray(backupData.posts)) {
      onSavePosts(backupData.posts);
    }
    if (backupData.prompts && Array.isArray(backupData.prompts)) {
      onSavePrompts(backupData.prompts);
    }
    if (backupData.menus && Array.isArray(backupData.menus) && onSaveMenus) {
      onSaveMenus(backupData.menus);
    }
    showNotification('Backup successfully restored to Admin Portal!');
  };

  // Menu & Submenu Management State
  const currentMenus = menus || DEFAULT_MENUS;
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Partial<MenuItem> | null>(null);
  const [isSubmenuModalOpen, setIsSubmenuModalOpen] = useState(false);
  const [selectedParentMenuId, setSelectedParentMenuId] = useState<string | null>(null);
  const [editingSubmenu, setEditingSubmenu] = useState<Partial<SubmenuItem> | null>(null);

  // Article Edit / Create Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [mainArticleText, setMainArticleText] = useState<string>('');
  const [videoUrlInput, setVideoUrlInput] = useState<string>('');
  const [videoTitleInput, setVideoTitleInput] = useState<string>('');

  // Nested AI Prompt Pop-up Modal State (Inside Article Modal)
  const [isNestedPromptModalOpen, setIsNestedPromptModalOpen] = useState(false);
  const [nestedPrompt, setNestedPrompt] = useState<Partial<PromptData>>({
    title: '',
    description: '',
    tool: 'ChatGPT',
    category: 'General Prompts',
    promptText: ''
  });

  // Section Video Modal State (Add Video to a specific Section)
  const [isSectionVideoModalOpen, setIsSectionVideoModalOpen] = useState(false);
  const [sectionVideoTargetIdx, setSectionVideoTargetIdx] = useState<number>(0);
  const [sectionVideoUrlInput, setSectionVideoUrlInput] = useState<string>('');
  const [sectionVideoTitleInput, setSectionVideoTitleInput] = useState<string>('');

  // Standalone Prompt Edit Modal State (for editing existing prompt cards in Prompts manager)
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Partial<PromptData> | null>(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<{ 
    type: 'post' | 'prompt' | 'menu' | 'submenu'; 
    id: string; 
    title: string;
    parentMenuId?: string;
  } | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim().toLowerCase();
    const p = password.trim();
    if ((u === 'admin' || u === 'admin@aiprompt.com') && p === 'admin123') {
      setIsLoggedIn(true);
      setAuthError('');
      showNotification('Successfully authenticated into Author Admin Portal.');
    } else {
      setAuthError('Invalid credentials. (Username/Email: admin@aiprompt.com or admin, Password: admin123)');
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    setIsLoggedIn(true);
    setAuthError('');
    showNotification('Logged in as Author (Admin)');
  };

  // --- POST & GUIDE CREATION HANDLERS ---

  const handleOpenNewTechGuide = () => {
    const newId = `post-${Date.now()}`;
    setEditingPost({
      id: newId,
      slug: `new-tech-guide-${Date.now()}`,
      title: '',
      subtitle: '',
      excerpt: '',
      category: 'Technical Guides',
      tags: ['Technical Guide', 'Architecture'],
      featuredTools: ['ChatGPT'],
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      author: {
        name: 'Admin (Me)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Content Author',
        handle: '@admin'
      },
      featuredImage: '',
      isFeatured: false,
      isTrending: true,
      viewCount: 1,
      prompts: [],
      toc: [{ id: 'sec-1', text: 'Overview', level: 2 }],
      contentSections: []
    });
    setVideoUrlInput('');
    setVideoTitleInput('');
    setMainArticleText('## Overview\nWrite your article text paragraphs here...');
    setIsPostModalOpen(true);
  };

  const handleOpenNewAIPrompt = () => {
    const newId = `post-${Date.now()}`;
    setEditingPost({
      id: newId,
      slug: `new-ai-prompt-${Date.now()}`,
      title: '',
      subtitle: '',
      excerpt: '',
      category: 'AI Prompts',
      tags: ['AI Prompt', 'Prompt Engineering'],
      featuredTools: ['ChatGPT'],
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '3 min read',
      author: {
        name: 'Admin (Me)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Content Author',
        handle: '@admin'
      },
      featuredImage: '',
      isFeatured: false,
      isTrending: true,
      viewCount: 1,
      prompts: [],
      toc: [{ id: 'sec-1', text: 'Overview', level: 2 }],
      contentSections: []
    });
    setVideoUrlInput('');
    setVideoTitleInput('');
    setMainArticleText('## Overview\nWrite your article text paragraphs here...');
    setIsPostModalOpen(true);
  };

  const parseArticleToSectionsAndToc = (
    text: string, 
    defaultTitle: string, 
    attachedPrompts: (PromptData & { targetSectionIndex?: number })[]
  ) => {
    // 1. Clean out raw prompt annotation lines
    const lines = text
      .split('\n')
      .filter(line => !line.trim().startsWith('### AI Prompt:') && !line.trim().startsWith('# AI Prompt:') && !line.trim().startsWith('AI Prompt:'));

    const sections: Array<{ id: string; heading: string; level: number; paragraphs: string[] }> = [];
    let currentSec: { id: string; heading: string; level: number; paragraphs: string[] } | null = null;
    let currentParagraphLines: string[] = [];

    const flushParagraph = () => {
      if (currentParagraphLines.length > 0) {
        const paraText = currentParagraphLines.join('\n').trim();
        if (paraText) {
          if (!currentSec) {
            currentSec = {
              id: 'sec-1',
              heading: defaultTitle || 'Overview',
              level: 2,
              paragraphs: []
            };
            sections.push(currentSec);
          }
          currentSec.paragraphs.push(paraText);
        }
        currentParagraphLines = [];
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      const headingMatch = trimmed.match(/^(#{1,6}|\uFF03{1,6})\s*(.*)$/);

      if (headingMatch) {
        flushParagraph();
        const hashCount = headingMatch[1].length;
        let headingText = headingMatch[2].trim();
        // Remove extra leading hashes or colons
        headingText = headingText.replace(/^#+\s*/, '').replace(/:\s*$/, '').trim();

        if (headingText) {
          currentSec = {
            id: `sec-${sections.length + 1}`,
            heading: headingText,
            level: hashCount === 1 ? 2 : hashCount,
            paragraphs: []
          };
          sections.push(currentSec);
        } else {
          currentParagraphLines.push(trimmed);
        }
      } else if (!trimmed) {
        flushParagraph();
      } else {
        currentParagraphLines.push(trimmed);
      }
    });

    flushParagraph();

    if (sections.length === 0) {
      sections.push({
        id: 'sec-1',
        heading: defaultTitle ? defaultTitle.replace(/^#+\s*/, '').trim() : 'Overview',
        level: 2,
        paragraphs: ['Article content details.']
      });
    }

    const contentSections = sections.map((sec) => ({
      id: sec.id,
      heading: sec.heading.replace(/^#+\s*/, '').trim(),
      level: sec.level,
      paragraphs: sec.paragraphs.length > 0 ? sec.paragraphs : ['Section content details.'],
      promptIds: [] as string[]
    }));

    (attachedPrompts || []).forEach((p, idx) => {
      let targetIdx = -1;

      if (typeof p.targetSectionIndex === 'number' && p.targetSectionIndex >= 0 && p.targetSectionIndex < contentSections.length) {
        targetIdx = p.targetSectionIndex;
      }

      if (targetIdx === -1) {
        if (contentSections.length > 1) {
          targetIdx = Math.min(idx + 1, contentSections.length - 1);
        } else {
          targetIdx = 0;
        }
      }

      if (contentSections[targetIdx]) {
        contentSections[targetIdx].promptIds.push(p.id);
      }
    });

    const toc = sections.map(sec => ({
      id: sec.id,
      text: sec.heading.replace(/^#+\s*/, '').trim(),
      level: sec.level
    }));

    return { contentSections, toc };
  };

  // Update a single section's heading title directly from its section card
  const handleUpdateSectionHeading = (sectionIndex: number, newHeading: string) => {
    const parsed = parseArticleToSectionsAndToc(
      mainArticleText,
      'Overview',
      editingPost?.prompts || []
    );
    if (parsed.contentSections[sectionIndex]) {
      parsed.contentSections[sectionIndex].heading = newHeading;
      const updatedText = parsed.contentSections.map((sec) => {
        const h = `## ${sec.heading.trim() ? sec.heading.trim() : `Section ${sec.id.replace('sec-', '')}`}`;
        const body = sec.paragraphs.join('\n\n').trim();
        return body ? `${h}\n${body}` : h;
      }).join('\n\n\n');
      setMainArticleText(updatedText);
    }
  };

  // Update a single section's paragraphs directly from its section card
  const handleUpdateSectionParagraphs = (sectionIndex: number, newParagraphsText: string) => {
    const parsed = parseArticleToSectionsAndToc(
      mainArticleText,
      'Overview',
      editingPost?.prompts || []
    );
    if (parsed.contentSections[sectionIndex]) {
      const newParas = newParagraphsText
        .split('\n\n')
        .map(p => p.trim())
        .filter(Boolean);
      parsed.contentSections[sectionIndex].paragraphs = newParas.length > 0 ? newParas : [newParagraphsText.trim()];
      const updatedText = parsed.contentSections.map((sec) => {
        const h = `## ${sec.heading.trim() ? sec.heading.trim() : `Section ${sec.id.replace('sec-', '')}`}`;
        const body = sec.paragraphs.join('\n\n').trim();
        return body ? `${h}\n${body}` : h;
      }).join('\n\n\n');
      setMainArticleText(updatedText);
    }
  };

  // Add a new section with its own distinct heading title
  const handleAddNewSection = () => {
    const parsed = parseArticleToSectionsAndToc(
      mainArticleText,
      'Overview',
      editingPost?.prompts || []
    );
    const nextIdx = parsed.contentSections.length + 1;
    const newSectionHeading = `Section ${nextIdx} Heading`;
    const snippet = `\n\n## ${newSectionHeading}\nWrite section paragraphs here...`;

    if (!mainArticleText.trim()) {
      setMainArticleText(`## Overview\nWrite section paragraphs here...\n\n## ${newSectionHeading}\nWrite section paragraphs here...`);
    } else {
      const startsWithHeading = mainArticleText.trim().startsWith('#');
      if (!startsWithHeading) {
        setMainArticleText(`## Overview\n${mainArticleText.trim()}${snippet}`);
      } else {
        setMainArticleText(prev => prev.trim() + snippet);
      }
    }
    showNotification(`Added Section ${nextIdx}! You can edit its heading title and content directly.`);
  };

  // Delete a section
  const handleRemoveSection = (sectionIndex: number) => {
    const parsed = parseArticleToSectionsAndToc(
      mainArticleText,
      'Overview',
      editingPost?.prompts || []
    );
    if (parsed.contentSections.length <= 1) {
      alert('An article must have at least one section.');
      return;
    }

    const removedSecHeading = parsed.contentSections[sectionIndex]?.heading || `Section ${sectionIndex + 1}`;
    const remaining = parsed.contentSections.filter((_, idx) => idx !== sectionIndex);

    const updatedText = remaining.map((sec) => {
      const h = `## ${sec.heading.trim() ? sec.heading.trim() : 'Section'}`;
      const body = sec.paragraphs.join('\n\n').trim();
      return body ? `${h}\n${body}` : h;
    }).join('\n\n\n');

    // Reassign prompts and videos targetSectionIndex if needed
    if (editingPost) {
      const updatedPrompts = (editingPost.prompts || []).map(p => {
        if (p.targetSectionIndex === sectionIndex) {
          return { ...p, targetSectionIndex: 0 };
        } else if (typeof p.targetSectionIndex === 'number' && p.targetSectionIndex > sectionIndex) {
          return { ...p, targetSectionIndex: p.targetSectionIndex - 1 };
        }
        return p;
      });

      const updatedVideos = (editingPost.videos || []).map(v => {
        if (v.targetSectionIndex === sectionIndex) {
          return { ...v, targetSectionIndex: 0 };
        } else if (typeof v.targetSectionIndex === 'number' && v.targetSectionIndex > sectionIndex) {
          return { ...v, targetSectionIndex: v.targetSectionIndex - 1 };
        }
        return v;
      });

      setEditingPost({ ...editingPost, prompts: updatedPrompts, videos: updatedVideos });
    }

    setMainArticleText(updatedText);
    showNotification(`Removed section "${removedSecHeading}".`);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(JSON.parse(JSON.stringify(post)));
    const sectionTexts: string[] = [];
    (post.contentSections || []).forEach(sec => {
      const cleanH = (sec.heading || '').replace(/^#+\s*/, '').trim();
      if (cleanH) {
        sectionTexts.push(`## ${cleanH}`);
      }
      sec.paragraphs.forEach(p => {
        if (!p.trim().startsWith('### AI Prompt:') && !p.trim().startsWith('# AI Prompt:') && !p.trim().startsWith('AI Prompt:')) {
          sectionTexts.push(p);
        }
      });
    });

    const initialVideoUrl = post.videoUrl || (post.videos && post.videos.length > 0 ? (post.videos[0].originalUrl || post.videos[0].src) : '');
    const initialVideoTitle = post.videoTitle || (post.videos && post.videos.length > 0 ? post.videos[0].title : '');
    setVideoUrlInput(initialVideoUrl);
    setVideoTitleInput(initialVideoTitle);

    setMainArticleText(sectionTexts.length > 0 ? sectionTexts.join('\n\n') : (post.excerpt ? `## Overview\n${post.excerpt}` : '## Overview\nWrite section paragraphs here...'));
    setIsPostModalOpen(true);
  };

  // Upload photo handler converting device file to base64
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size is too large. Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditingPost(prev => prev ? ({ ...prev, featuredImage: reader.result as string }) : null);
          showNotification('Photo uploaded successfully from device!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload and load plain text (.txt) file into article editor
  const handleTxtFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt') && file.type && !file.type.includes('text')) {
      alert('Please select a plain text file (.txt).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setMainArticleText(text);

        // Auto-suggest title if current title is blank
        if (editingPost && (!editingPost.title || !editingPost.title.trim())) {
          const rawName = file.name.replace(/\.txt$/i, '').replace(/[-_]+/g, ' ').trim();
          if (rawName) {
            const formattedTitle = rawName
              .split(' ')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            setEditingPost(prev => prev ? ({ ...prev, title: formattedTitle }) : null);
          }
        }

        showNotification(`Loaded article text from "${file.name}"! No markdown required.`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Upload and add .txt file as a new section in Live Article Structure & Prompt Placement
  const handleSectionStructureTxtFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt') && file.type && !file.type.includes('text')) {
      alert('Please select a plain text file (.txt).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const cleanText = text.trim();
        const rawName = file.name.replace(/\.txt$/i, '').replace(/[-_]+/g, ' ').trim();
        const formattedHeading = rawName
          ? rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : 'New Section';

        setMainArticleText(prev => {
          if (!prev.trim()) {
            return `## ${formattedHeading}\n${cleanText}`;
          }
          return `${prev.trim()}\n\n## ${formattedHeading}\n${cleanText}`;
        });

        showNotification(`Added section "${formattedHeading}" from uploaded .txt file!`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Upload .txt file directly into an existing individual section's content
  const handleSingleSectionTxtUpload = (sectionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt') && file.type && !file.type.includes('text')) {
      alert('Please select a plain text file (.txt).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        handleUpdateSectionParagraphs(sectionIndex, text.trim());
        showNotification(`Uploaded .txt content into Section ${sectionIndex + 1}!`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Opening the pop-up modal to add an AI Prompt directly into the article
  const handleOpenAddPromptModal = (targetSectionIdx?: number) => {
    setNestedPrompt({
      id: `prompt-${Date.now()}`,
      title: '',
      description: '',
      tool: (editingPost?.featuredTools?.[0] as AIToolType) || 'Suno',
      category: (editingPost?.category as CategoryType) || 'Music Prompts',
      promptText: '',
      targetSectionIndex: typeof targetSectionIdx === 'number' ? targetSectionIdx : undefined,
      tags: ['Prompt'],
      copyCount: 0,
      author: 'Admin (Me)',
      parameters: []
    });
    setIsNestedPromptModalOpen(true);
  };

  // Saving the AI Prompt from the Pop-up Box into the Article
  const handleSaveNestedPrompt = () => {
    if (!nestedPrompt.title?.trim() || !nestedPrompt.promptText?.trim()) {
      alert('Prompt title and full prompt text are required.');
      return;
    }

    const createdPrompt: PromptData = {
      id: nestedPrompt.id || `prompt-${Date.now()}`,
      title: nestedPrompt.title,
      description: nestedPrompt.description || '',
      tool: (nestedPrompt.tool as AIToolType) || (editingPost?.featuredTools?.[0] as AIToolType) || 'Suno',
      category: (nestedPrompt.category as CategoryType) || (editingPost?.category as CategoryType) || 'Music Prompts',
      promptText: nestedPrompt.promptText,
      targetSectionIndex: typeof nestedPrompt.targetSectionIndex === 'number' ? nestedPrompt.targetSectionIndex : undefined,
      parameters: nestedPrompt.parameters || [],
      variables: nestedPrompt.variables || [],
      tags: nestedPrompt.tags || ['Prompt'],
      copyCount: 0,
      author: nestedPrompt.author || 'Admin (Me)'
    };

    // Attach to editingPost.prompts
    setEditingPost(prev => {
      if (!prev) return null;
      const currentPrompts = prev.prompts ? [...prev.prompts] : [];
      return {
        ...prev,
        prompts: [...currentPrompts, createdPrompt]
      };
    });

    setIsNestedPromptModalOpen(false);
    showNotification(`Added AI Prompt "${createdPrompt.title}" to article!`);
  };

  // Update an attached prompt directly within its section card
  const handleUpdateAttachedPrompt = (promptId: string, updates: Partial<PromptData>) => {
    setEditingPost(prev => {
      if (!prev) return null;
      const updatedPrompts = (prev.prompts || []).map(p =>
        p.id === promptId ? { ...p, ...updates } : p
      );
      return { ...prev, prompts: updatedPrompts };
    });
  };

  const handleRemoveAttachedPrompt = (promptId: string) => {
    setEditingPost(prev => {
      if (!prev) return null;
      return {
        ...prev,
        prompts: (prev.prompts || []).filter(p => p.id !== promptId)
      };
    });
  };

  // Open modal to add video to a specific section (or from top toolbar)
  const handleOpenAddSectionVideoModal = (targetSectionIdx: number = 0) => {
    setSectionVideoTargetIdx(targetSectionIdx);
    setSectionVideoUrlInput('');
    setSectionVideoTitleInput('');
    setIsSectionVideoModalOpen(true);
  };

  // Save the video for the section
  const handleSaveSectionVideo = () => {
    const rawUrl = sectionVideoUrlInput.trim();
    if (!rawUrl) {
      alert('Please enter a video URL.');
      return;
    }

    const parsed = parseVideoUrl(rawUrl);
    if (!parsed.isValid) {
      alert(parsed.error || 'Please enter a valid video URL (YouTube, Vimeo, Bilibili, or MP4).');
      return;
    }

    const videoObj: VideoEmbedData = {
      id: `sec-video-${Date.now()}`,
      type: parsed.type,
      src: parsed.embedSrc,
      originalUrl: parsed.originalUrl,
      title: sectionVideoTitleInput.trim() || `${parsed.platformName} Video Guide`,
      aspectRatio: '16:9',
      targetSectionIndex: sectionVideoTargetIdx
    };

    setEditingPost(prev => {
      if (!prev) return null;
      const currentVideos = prev.videos ? [...prev.videos] : [];
      return {
        ...prev,
        videos: [...currentVideos, videoObj]
      };
    });

    setIsSectionVideoModalOpen(false);
    showNotification(`Added ${parsed.platformName} video to Section ${sectionVideoTargetIdx + 1}!`);
  };

  // Update an existing section video
  const handleUpdateSectionVideo = (videoId: string, updates: Partial<VideoEmbedData>) => {
    setEditingPost(prev => {
      if (!prev) return null;
      const updated = (prev.videos || []).map(v =>
        v.id === videoId ? { ...v, ...updates } : v
      );
      return { ...prev, videos: updated };
    });
  };

  // Remove a section video
  const handleRemoveSectionVideo = (videoId: string) => {
    setEditingPost(prev => {
      if (!prev) return null;
      return {
        ...prev,
        videos: (prev.videos || []).filter(v => v.id !== videoId)
      };
    });
    showNotification('Video removed from section.');
  };

  const handleSavePost = () => {
    if (!editingPost || !editingPost.title?.trim()) {
      alert('Title is required.');
      return;
    }

    const { contentSections, toc } = parseArticleToSectionsAndToc(
      mainArticleText,
      'Overview',
      editingPost.prompts || []
    );

    // Process video link if provided
    let finalVideos: VideoEmbedData[] = editingPost.videos ? [...editingPost.videos] : [];
    const trimmedVideoUrl = videoUrlInput.trim();
    const trimmedVideoTitle = videoTitleInput.trim() || `${editingPost.title || 'Video'} Tutorial`;

    if (trimmedVideoUrl) {
      const parsedVideo = createVideoEmbedData(trimmedVideoUrl, trimmedVideoTitle);
      if (parsedVideo) {
        // Update or prepend the video
        const existingIdx = finalVideos.findIndex(v => v.id === 'featured-video' || v.originalUrl === trimmedVideoUrl || v.type === parsedVideo.type);
        if (existingIdx >= 0) {
          finalVideos[existingIdx] = parsedVideo;
        } else {
          finalVideos = [parsedVideo, ...finalVideos];
        }
      }
    } else {
      // If user cleared the video input, clean unassigned videos
      finalVideos = finalVideos.filter(v => v.id !== 'featured-video');
    }

    const completePost: BlogPost = {
      id: editingPost.id || `post-${Date.now()}`,
      slug: editingPost.slug || editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: editingPost.title || 'Untitled Article',
      subtitle: editingPost.subtitle || '',
      excerpt: editingPost.excerpt || '',
      category: (editingPost.category as CategoryType) || 'Technical Guides',
      tags: editingPost.tags && editingPost.tags.length > 0 ? editingPost.tags : ['AI'],
      featuredTools: editingPost.featuredTools || ['ChatGPT'],
      publishedAt: editingPost.publishedAt || new Date().toISOString().split('T')[0],
      readTime: editingPost.readTime || '5 min read',
      author: editingPost.author || {
        name: 'Admin (Me)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Content Author',
        handle: '@admin'
      },
      featuredImage: (editingPost.featuredImage && editingPost.featuredImage.trim()) ? editingPost.featuredImage.trim() : '',
      videoUrl: trimmedVideoUrl || undefined,
      videoTitle: trimmedVideoTitle || undefined,
      isFeatured: !!editingPost.isFeatured,
      isTrending: !!editingPost.isTrending,
      viewCount: editingPost.viewCount || 1,
      prompts: editingPost.prompts || [],
      videos: finalVideos,
      toc,
      contentSections
    };

    const existsIndex = posts.findIndex(p => p.id === completePost.id);
    let updatedPosts: BlogPost[];
    if (existsIndex >= 0) {
      updatedPosts = [...posts];
      updatedPosts[existsIndex] = completePost;
    } else {
      updatedPosts = [completePost, ...posts];
    }

    onSavePosts(updatedPosts);

    // Sync attached AI prompts to global prompts library (only section prompts, not article section content)
    if (completePost.prompts && completePost.prompts.length > 0) {
      let updatedPrompts = [...prompts];
      completePost.prompts.forEach(p => {
        const cleanPrompt: PromptData = {
          id: p.id,
          title: p.title,
          description: p.description || '',
          tool: p.tool,
          category: p.category,
          promptText: p.promptText,
          parameters: p.parameters || [],
          variables: p.variables || [],
          tags: p.tags || ['Prompt'],
          copyCount: p.copyCount || 0,
          rating: p.rating,
          author: p.author || 'Admin (Me)',
          outputPreview: p.outputPreview
        };
        const idx = updatedPrompts.findIndex(existing => existing.id === cleanPrompt.id);
        if (idx >= 0) {
          updatedPrompts[idx] = cleanPrompt;
        } else {
          updatedPrompts.unshift(cleanPrompt);
        }
      });
      onSavePrompts(updatedPrompts);
    }

    setIsPostModalOpen(false);
    setEditingPost(null);
    showNotification(`Saved "${completePost.title}" successfully!`);
  };

  const handleDeleteConfirmed = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'post') {
      const deletedPost = posts.find(p => p.id === deleteTarget.id);
      const updatedPosts = posts.filter(p => p.id !== deleteTarget.id);
      onSavePosts(updatedPosts);

      // Cascade delete: also remove any prompts contained within the deleted article from the Prompt Library
      if (deletedPost && deletedPost.prompts && deletedPost.prompts.length > 0) {
        const deletedPromptIds = new Set(deletedPost.prompts.map(p => p.id));
        const updatedPrompts = prompts.filter(p => !deletedPromptIds.has(p.id));
        onSavePrompts(updatedPrompts);
      }

      showNotification(`Deleted article "${deleteTarget.title}" and its included prompts`);
    } else if (deleteTarget.type === 'prompt') {
      const updatedPrompts = prompts.filter(p => p.id !== deleteTarget.id);
      onSavePrompts(updatedPrompts);
      showNotification(`Deleted prompt "${deleteTarget.title}"`);
    } else if (deleteTarget.type === 'menu') {
      const updatedMenus = currentMenus.filter(m => m.id !== deleteTarget.id);
      if (onSaveMenus) onSaveMenus(updatedMenus);
      showNotification(`Deleted website menu "${deleteTarget.title}"`);
    } else if (deleteTarget.type === 'submenu' && deleteTarget.parentMenuId) {
      const updatedMenus = currentMenus.map(m => {
        if (m.id === deleteTarget.parentMenuId) {
          return {
            ...m,
            submenus: m.submenus.filter(s => s.id !== deleteTarget.id)
          };
        }
        return m;
      });
      if (onSaveMenus) onSaveMenus(updatedMenus);
      showNotification(`Deleted submenu "${deleteTarget.title}"`);
    }
    setDeleteTarget(null);
  };

  // --- MENU & SUBMENU MANAGEMENT HANDLERS ---

  const handleOpenAddMenu = () => {
    setEditingMenu({
      id: '',
      title: '',
      description: '',
      type: 'page',
      isCustom: true,
      submenus: []
    });
    setIsMenuModalOpen(true);
  };

  const handleOpenEditMenu = (menu: MenuItem) => {
    setEditingMenu(JSON.parse(JSON.stringify(menu)));
    setIsMenuModalOpen(true);
  };

  const handleSaveMenu = () => {
    if (!editingMenu || !editingMenu.title?.trim()) {
      alert('Menu title is required.');
      return;
    }
    const cleanTitle = editingMenu.title.trim();
    const menuId = editingMenu.id?.trim() || cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || `menu-${Date.now()}`;
    const newMenu: MenuItem = {
      id: menuId,
      title: cleanTitle,
      description: editingMenu.description?.trim() || '',
      type: editingMenu.type || 'page',
      isCustom: editingMenu.isCustom !== undefined ? editingMenu.isCustom : true,
      order: editingMenu.order || (currentMenus.length + 1),
      submenus: editingMenu.submenus || []
    };

    const existingIndex = currentMenus.findIndex(m => m.id === newMenu.id);
    let updated: MenuItem[];
    if (existingIndex >= 0) {
      updated = [...currentMenus];
      updated[existingIndex] = { ...updated[existingIndex], ...newMenu };
    } else {
      updated = [...currentMenus, newMenu];
    }

    if (onSaveMenus) {
      onSaveMenus(updated);
    }
    setIsMenuModalOpen(false);
    setEditingMenu(null);
    showNotification(`Saved website menu "${newMenu.title}" successfully!`);
  };

  const handleOpenAddSubmenu = (parentMenuId: string) => {
    setSelectedParentMenuId(parentMenuId);
    setEditingSubmenu({
      id: '',
      title: '',
      categoryRef: 'All',
      description: ''
    });
    setIsSubmenuModalOpen(true);
  };

  const handleOpenEditSubmenu = (parentMenuId: string, sub: SubmenuItem) => {
    setSelectedParentMenuId(parentMenuId);
    setEditingSubmenu(JSON.parse(JSON.stringify(sub)));
    setIsSubmenuModalOpen(true);
  };

  const handleSaveSubmenu = () => {
    if (!selectedParentMenuId || !editingSubmenu || !editingSubmenu.title?.trim()) {
      alert('Submenu title is required.');
      return;
    }
    const cleanTitle = editingSubmenu.title.trim();
    const subId = editingSubmenu.id?.trim() || cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || `sub-${Date.now()}`;
    const newSub: SubmenuItem = {
      id: subId,
      title: cleanTitle,
      categoryRef: editingSubmenu.categoryRef?.trim() || cleanTitle,
      description: editingSubmenu.description?.trim() || ''
    };

    const updated = currentMenus.map(m => {
      if (m.id === selectedParentMenuId) {
        const subs = m.submenus || [];
        const existIdx = subs.findIndex(s => s.id === newSub.id);
        let updatedSubs: SubmenuItem[];
        if (existIdx >= 0) {
          updatedSubs = [...subs];
          updatedSubs[existIdx] = newSub;
        } else {
          updatedSubs = [...subs, newSub];
        }
        return { ...m, submenus: updatedSubs };
      }
      return m;
    });

    if (onSaveMenus) {
      onSaveMenus(updated);
    }
    setIsSubmenuModalOpen(false);
    setEditingSubmenu(null);
    setSelectedParentMenuId(null);
    showNotification(`Saved submenu "${newSub.title}" successfully!`);
  };

  // --- PROMPT MANAGEMENT ---

  const handleEditPrompt = (prompt: PromptData) => {
    setEditingPrompt(JSON.parse(JSON.stringify(prompt)));
    setIsPromptModalOpen(true);
  };

  const handleSavePrompt = () => {
    if (!editingPrompt || !editingPrompt.title?.trim() || !editingPrompt.promptText?.trim()) {
      alert('Prompt title and prompt text are required.');
      return;
    }

    const completePrompt: PromptData = {
      id: editingPrompt.id || `prompt-${Date.now()}`,
      title: editingPrompt.title,
      description: editingPrompt.description || '',
      tool: (editingPrompt.tool as AIToolType) || 'ChatGPT',
      category: (editingPrompt.category as CategoryType) || 'General Prompts',
      promptText: editingPrompt.promptText,
      parameters: editingPrompt.parameters || [],
      variables: editingPrompt.variables || [],
      tags: editingPrompt.tags || ['Prompt'],
      copyCount: editingPrompt.copyCount || 0,
      author: editingPrompt.author || 'Admin (Me)'
    };

    const existsIndex = prompts.findIndex(p => p.id === completePrompt.id);
    let updatedPrompts: PromptData[];
    if (existsIndex >= 0) {
      updatedPrompts = [...prompts];
      updatedPrompts[existsIndex] = completePrompt;
    } else {
      updatedPrompts = [completePrompt, ...prompts];
    }

    onSavePrompts(updatedPrompts);
    setIsPromptModalOpen(false);
    setEditingPrompt(null);
    showNotification(`Prompt "${completePrompt.title}" saved successfully!`);
  };

  // Filtered Lists for Admin View
  const filteredPostsList = posts.filter(p => {
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const filteredPromptsList = prompts.filter(p => {
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tool.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Render Login View if not logged in
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 font-sans text-slate-800 dark:text-slate-200 overflow-y-auto">
        <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold tracking-tight text-xl text-slate-900 dark:text-white">AI<span className="text-indigo-600 dark:text-indigo-400">Prompt</span></span>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Author Admin Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Close Admin Screen"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/60 p-3.5 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
            <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Author Login</p>
              <p className="mt-0.5 text-[11px] text-indigo-700 dark:text-indigo-300">
                Log in to post, edit, or delete articles and prompt library items.
              </p>
            </div>
          </div>

          {authError && (
            <div className="mb-4 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 p-3 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Username / Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@aiprompt.com or admin"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Sign In
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
            <button
              onClick={handleQuickDemoLogin}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>1-Click Author Demo Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED IN DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans antialiased flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-xl animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Status Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-xl text-slate-900 dark:text-white">AI<span className="text-indigo-600 dark:text-indigo-400">Prompt</span></span>
            <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 uppercase tracking-widest font-mono">
              AUTHOR PORTAL
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenNewTechGuide}
            className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Tech Guide</span>
          </button>

          <button
            onClick={handleOpenNewAIPrompt}
            className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 px-3.5 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New AI Prompt</span>
          </button>

          <button
            onClick={handleOpenAddMenu}
            className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950 px-3.5 py-2 text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider hover:bg-purple-100 dark:hover:bg-purple-900 transition-all flex items-center gap-1.5"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span>New Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`rounded-lg px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs ${
              activeTab === 'guide'
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900'
            }`}
            title="Setup, Article Saving & Free Deploy Guide"
          >
            <Rocket className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 group-hover:scale-110" />
            <span>Setup & Deploy Guide</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
            title="Return to Public Site"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>Public Site</span>
          </button>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 transition-colors shadow-xs"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Console Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Articles</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{posts.length}</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Prompt Library Items</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{prompts.length}</p>
            </div>
            <div className="p-3 bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900 rounded-lg text-violet-600 dark:text-violet-400">
              <Wand2 className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Article Views</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {posts.reduce((acc, p) => acc + (p.viewCount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Eye className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Website Menus</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{currentMenus.length}</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900 rounded-lg text-purple-600 dark:text-purple-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('posts')}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'posts'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Article ({posts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'prompts'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Prompt Library ({prompts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('menus')}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'menus'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Website Menus ({currentMenus.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'guide'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-white'
              }`}
            >
              <Rocket className="h-3.5 w-3.5 text-emerald-500" />
              <span>Setup & Deploy Guide</span>
            </button>
          </div>

          {activeTab !== 'guide' && (
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder={activeTab === 'menus' ? 'Search menus & submenus...' : `Search ${activeTab === 'posts' ? 'articles' : 'prompt library'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none"
              >
                <option value="All">All Categories</option>
                {CATEGORIES_LIST.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* --- TECHNICAL GUIDES / ARTICLES MANAGER TAB --- */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800 uppercase font-mono text-[10px] tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Article Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Published / Read</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredPostsList.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-start gap-3">
                            {post.featuredImage && post.featuredImage.trim() !== '' ? (
                              <img
                                src={post.featuredImage}
                                alt=""
                                className="h-10 w-12 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5"
                              />
                            ) : (
                              <div className="h-10 w-12 rounded flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400">
                                <FileText className="h-4 w-4" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer" onClick={() => handleEditPost(post)}>
                                  {post.title}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {post.excerpt}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-block rounded border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-700 dark:text-indigo-300">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          <div>{post.publishedAt}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">{post.readTime}</div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                onSelectPostToView(post);
                                onClose();
                              }}
                              className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="Preview Article"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() => handleEditPost(post)}
                              className="rounded border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950 p-1.5 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all"
                              title="Edit Article"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteTarget({ type: 'post', id: post.id, title: post.title })}
                              className="rounded border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 p-1.5 text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white transition-all"
                              title="Delete Article"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- PROMPTS MANAGER TAB --- */}
        {activeTab === 'prompts' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPromptsList.map((prompt) => (
                <div key={prompt.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">
                          {prompt.tool}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800">
                          {prompt.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{prompt.title}</h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditPrompt(prompt)}
                        className="rounded border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950 p-1.5 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all"
                        title="Edit Prompt"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'prompt', id: prompt.id, title: prompt.title })}
                        className="rounded border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 p-1.5 text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white transition-all"
                        title="Delete Prompt"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{prompt.description}</p>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-200 line-clamp-3">
                    {prompt.promptText}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- WEBSITE MENUS & SUBMENUS ARCHITECTURE TAB --- */}
        {activeTab === 'menus' && (
          <div className="space-y-6">
            {/* Top Info Banner with Quick Actions */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <List className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Website Navigation & Dynamic Menus</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Manage all website menus and submenus. You can create new pages (such as a <strong>Tips</strong> page, technical hubs, or resource pages) with matching page design and formatting, add new submenus to current menus, or edit and delete items.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddMenu}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xs shrink-0"
              >
                <FolderPlus className="h-4 w-4" />
                <span>Add New Menu</span>
              </button>
            </div>

            {/* Menus List Grid */}
            <div className="grid grid-cols-1 gap-6">
              {currentMenus
                .filter(menu => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    menu.title.toLowerCase().includes(q) ||
                    (menu.description && menu.description.toLowerCase().includes(q)) ||
                    menu.submenus?.some(s => s.title.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q)))
                  );
                })
                .map((menu) => (
                  <div
                    key={menu.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    {/* Menu Card Header */}
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                          <Layers className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                              {menu.title}
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                              ID: #{menu.id}
                            </span>
                            {menu.isCustom ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase tracking-wide">
                                Custom Page
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase tracking-wide">
                                System Menu
                              </span>
                            )}
                          </div>
                          {menu.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {menu.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleOpenAddSubmenu(menu.id)}
                          className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all flex items-center gap-1.5"
                          title="Add Submenu"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Submenu</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditMenu(menu)}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Edit Menu Details"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        {menu.id !== 'home' && (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ type: 'menu', id: menu.id, title: menu.title })}
                            className="rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                            title="Delete Menu"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Submenus Section */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                          Submenus & Dropdown Links ({menu.submenus?.length || 0})
                        </p>
                      </div>

                      {(!menu.submenus || menu.submenus.length === 0) ? (
                        <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                          <p>No submenus configured for this menu.</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            Click <strong>"Add Submenu"</strong> above to attach categories or dropdown subpages.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {menu.submenus.map((sub) => (
                            <div
                              key={sub.id}
                              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 flex flex-col justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-xs text-slate-900 dark:text-white">
                                    {sub.title}
                                  </span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    {sub.categoryRef || 'General'}
                                  </span>
                                </div>
                                {sub.description && (
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                                    {sub.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditSubmenu(menu.id, sub)}
                                  className="p-1 rounded text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                                  title="Edit Submenu"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget({ type: 'submenu', id: sub.id, title: sub.title, parentMenuId: menu.id })}
                                  className="p-1 rounded text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                                  title="Delete Submenu"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- SETUP, SAVE & DEPLOY GUIDE TAB --- */}
        {activeTab === 'guide' && (
          <SetupDeployGuide
            posts={posts}
            prompts={prompts}
            menus={currentMenus}
            onImportBackup={handleImportBackup}
            onNotify={showNotification}
          />
        )}
      </main>

      {/* --- RICH ARTICLE / TECH GUIDE / AI PROMPT CREATION & EDITING FULL PAGE --- */}
      {isPostModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 flex flex-col justify-between">
          {/* Full Page Sticky Header */}
          <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Admin Console</span>
              </button>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Edit3 className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {posts.some(p => p.id === editingPost.id)
                    ? 'Edit Content Page'
                    : editingPost.category === 'AI Prompts'
                      ? 'New AI Prompt Page'
                      : 'New Tech Guide Page'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePost}
                className="rounded-lg bg-indigo-600 px-4.5 py-1.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-md"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>
            </div>
          </header>

          {/* Main Full Page Form Area */}
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {posts.some(p => p.id === editingPost.id)
                      ? 'Edit Article & AI Prompt Configuration'
                      : editingPost.category === 'AI Prompts'
                        ? 'Create New AI Prompt Guide Page'
                        : 'Create New Technical Guide Page'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Configure article headers, section titles for Table of Contents, and attach interactive AI prompt blocks.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-md">
                  {editingPost.category || 'Technical Guides'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                    placeholder="e.g. suno ai country music prompts"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={editingPost.subtitle || ''}
                    onChange={(e) => setEditingPost(prev => prev ? ({ ...prev, subtitle: e.target.value }) : null)}
                    placeholder="e.g. Comprehensive guide to Suno country templates and music styles"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Category
                  </label>
                  <select
                    value={editingPost.category || 'Technical Guides'}
                    onChange={(e) => setEditingPost(prev => prev ? ({ ...prev, category: e.target.value as CategoryType }) : null)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                  >
                    {CATEGORIES_LIST.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Read Time */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={editingPost.readTime || '5 min read'}
                    onChange={(e) => setEditingPost(prev => prev ? ({ ...prev, readTime: e.target.value }) : null)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(editingPost.tags || []).join(', ')}
                    onChange={(e) => setEditingPost(prev => prev ? ({ ...prev, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }) : null)}
                    placeholder="AI Prompt, Country Music, Suno"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Featured Image with Device Upload */}
                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                      Featured Image / Photo <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(optional — leave empty for no photo)</span>
                    </label>
                    {editingPost.featuredImage && (
                      <button
                        type="button"
                        onClick={() => setEditingPost(prev => prev ? ({ ...prev, featuredImage: '' }) : null)}
                        className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={editingPost.featuredImage || ''}
                      onChange={(e) => setEditingPost(prev => prev ? ({ ...prev, featuredImage: e.target.value }) : null)}
                      placeholder="Image URL (optional — leave empty if you don't want a photo)"
                      className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                    <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/80 px-4 py-2.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors shrink-0">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {editingPost.featuredImage ? (
                    <div className="mt-2 relative inline-flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <img src={editingPost.featuredImage} alt="Featured Preview" className="h-16 w-24 object-cover rounded border border-slate-200 dark:border-slate-700" />
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Photo attached to article</p>
                        <button
                          type="button"
                          onClick={() => setEditingPost(prev => prev ? ({ ...prev, featuredImage: '' }) : null)}
                          className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete photo (article will display category default webcard color)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      No photo attached. This article will show without photo and will use the default category webcard color ({
                        [
                          'General Prompts', 'Music Prompts', 'Image Prompts', 'Video Prompts', 'Article Prompts', 'AI Prompts'
                        ].includes(editingPost.category || '') || (editingPost.category || '').toLowerCase().includes('prompt')
                          ? 'Light Green for AI Prompts'
                          : [
                              'General Guides', 'Full-Stack Guides', 'AI System Guides', 'Technical Guides', 'Cloud Architecture', 'Database Guides'
                            ].includes(editingPost.category || '') || (editingPost.category || '').toLowerCase().includes('guide') || (editingPost.category || '').toLowerCase().includes('tech')
                          ? 'Light Blue for Technical Guides'
                          : 'Light Purple for Articles'
                      }).
                    </p>
                  )}
                </div>

                {/* Excerpt / Summary */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Excerpt / Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editingPost.excerpt || ''}
                    onChange={(e) => setEditingPost(prev => prev ? ({ ...prev, excerpt: e.target.value }) : null)}
                    placeholder="Short description shown on article cards..."
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* VIDEO LINK & PLAYER CONFIGURATION (OPTIONAL) */}
                <div className="space-y-3 md:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Film className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <label className="text-[11px] font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 font-bold">
                        Video Link <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(optional — YouTube, Vimeo, Bilibili, MP4, or Web Video)</span>
                      </label>
                    </div>
                    {videoUrlInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrlInput('');
                          setVideoTitleInput('');
                        }}
                        className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Remove Video</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Add a video to accompany this article. YouTube, Vimeo, and Bilibili provide free high-speed video hosting and unlimited streaming for your readers without using storage quotas.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Video URL / Link
                      </label>
                      <input
                        type="text"
                        value={videoUrlInput}
                        onChange={(e) => setVideoUrlInput(e.target.value)}
                        placeholder="e.g. https://www.youtube.com/watch?v=... or https://www.bilibili.com/video/BV... or https://vimeo.com/..."
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Video Title / Caption (Optional)
                      </label>
                      <input
                        type="text"
                        value={videoTitleInput}
                        onChange={(e) => setVideoTitleInput(e.target.value)}
                        placeholder="e.g. Step-by-Step Video Guide"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Live Video Preview Box */}
                  {(() => {
                    if (!videoUrlInput.trim()) return null;
                    const parsed = parseVideoUrl(videoUrlInput.trim());
                    if (!parsed.isValid) {
                      return (
                        <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          <span>{parsed.error || 'Please enter a valid video link starting with https://'}</span>
                        </div>
                      );
                    }

                    const previewVideoObj: VideoEmbedData = {
                      id: 'preview-video',
                      type: parsed.type,
                      src: parsed.embedSrc,
                      originalUrl: parsed.originalUrl,
                      title: videoTitleInput.trim() || `${parsed.platformName} Tutorial`,
                      aspectRatio: '16:9'
                    };

                    return (
                      <div className="mt-2 space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{parsed.platformName} detected — live player preview:</span>
                          </span>
                        </div>
                        <VideoEmbed video={previewVideoObj} />
                      </div>
                    );
                  })()}
                </div>

                {/* ARTICLE SECTION - MAIN ARTICLE TEXT AREA WITH .TXT FILE IMPORT */}
                <div className="space-y-2.5 md:col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-bold">
                      <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Article Content (.txt file or plain text)</span>
                    </label>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Upload / Load .txt File Button */}
                      <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors shadow-2xs">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload .txt File</span>
                        <input
                          type="file"
                          accept=".txt,text/plain"
                          onChange={handleTxtFileUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={handleAddNewSection}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Section</span>
                      </button>
                    </div>
                  </div>

                  {/* Informational tip: Plain text supported, no markdown needed */}
                  <div className="rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 p-2.5 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Plain text supported:</strong> No markdown required! You can write standard paragraphs separated by empty lines, or upload any <code>.txt</code> file directly. You can name your sections and attach AI prompts in the section cards below.
                    </p>
                  </div>

                  {/* Realtime TOC Preview Badge list */}
                  {(() => {
                    if (!editingPost) return null;
                    const parsed = parseArticleToSectionsAndToc(
                      mainArticleText, 
                      'Overview', 
                      editingPost.prompts || []
                    );
                    return parsed.toc && parsed.toc.length > 0 ? (
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <List className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          Table of Contents ({parsed.toc.length}):
                        </span>
                        {parsed.toc.map((t, idx) => (
                          <span key={t.id || idx} className="inline-flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded text-[11px] font-medium text-indigo-600 dark:text-indigo-400 shadow-2xs">
                            <span className="font-mono text-[9px] text-slate-400">{idx + 1}.</span> {t.text}
                          </span>
                        ))}
                      </div>
                    ) : null;
                  })()}

                  <textarea
                    rows={8}
                    value={mainArticleText}
                    onChange={(e) => setMainArticleText(e.target.value)}
                    placeholder="Write or paste your article text here (.txt). Paragraphs separated by blank lines are formatted automatically — no markdown syntax required..."
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none font-sans leading-relaxed"
                  />
                </div>

                {/* LIVE ARTICLE SECTION & PROMPT PLACEMENT MAP */}
                <div className="space-y-4 md:col-span-2 border-t border-slate-200 dark:border-slate-800 pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Live Article Structure & Prompt Placement</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Each section heading creates a Table of Contents entry (distinct from article title). Prompts appear directly under their assigned section.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddNewSection}
                        className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all flex items-center gap-1.5 shadow-2xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Section</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenAddPromptModal()}
                        className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Prompt</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenAddSectionVideoModal(0)}
                        className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all flex items-center gap-1.5 shadow-2xs"
                      >
                        <Film className="h-3.5 w-3.5" />
                        <span>Add Video</span>
                      </button>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all shadow-2xs">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload .txt File</span>
                        <input
                          type="file"
                          accept=".txt,text/plain"
                          onChange={handleSectionStructureTxtFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {(() => {
                    const parsed = parseArticleToSectionsAndToc(
                      mainArticleText,
                      'Overview',
                      editingPost.prompts || []
                    );

                    return (
                      <div className="space-y-4">
                        {parsed.contentSections.map((sec, sIdx) => {
                          const sectionPrompts = (editingPost.prompts || []).filter((pr, pIdx) => {
                            if (typeof pr.targetSectionIndex === 'number') {
                              return pr.targetSectionIndex === sIdx;
                            }
                            // Auto assignment logic
                            if (parsed.contentSections.length > 1) {
                              return Math.min(pIdx + 1, parsed.contentSections.length - 1) === sIdx;
                            }
                            return sIdx === 0;
                          });

                          const sectionVideos = (editingPost.videos || []).filter((v) => {
                            return typeof v.targetSectionIndex === 'number' && v.targetSectionIndex === sIdx;
                          });

                          return (
                            <div
                              key={sec.id}
                              className="rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-slate-50 dark:bg-slate-950 p-4 space-y-3 shadow-2xs"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                                <div className="flex-1 flex items-center gap-2.5 min-w-0">
                                  <span className="text-[10px] font-mono font-bold bg-indigo-600 text-white px-2.5 py-1 rounded uppercase shrink-0 shadow-2xs">
                                    Section {sIdx + 1}
                                  </span>
                                  <div className="flex-1 flex items-center gap-2 min-w-0">
                                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 shrink-0 font-mono">
                                      Heading Title:
                                    </label>
                                    <input
                                      type="text"
                                      value={sec.heading}
                                      onChange={(e) => handleUpdateSectionHeading(sIdx, e.target.value)}
                                      placeholder={`Enter Section ${sIdx + 1} heading title (e.g. Overview, Key Method)`}
                                      className="flex-1 min-w-[160px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
                                  <label className="cursor-pointer text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline flex items-center gap-1 px-2 py-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors">
                                    <Upload className="h-3 w-3" />
                                    <span>Upload .txt to Section</span>
                                    <input
                                      type="file"
                                      accept=".txt,text/plain"
                                      onChange={(e) => handleSingleSectionTxtUpload(sIdx, e)}
                                      className="hidden"
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAddPromptModal(sIdx)}
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline flex items-center gap-1 px-2 py-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                                  >
                                    <Plus className="h-3 w-3" />
                                    <span>Attach Prompt</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAddSectionVideoModal(sIdx)}
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline flex items-center gap-1 px-2 py-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                                  >
                                    <Film className="h-3 w-3" />
                                    <span>Add Video</span>
                                  </button>
                                  {parsed.contentSections.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSection(sIdx)}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                                      title="Delete this section"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Section Paragraph snippet / editable content */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Section Paragraphs
                                  </label>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {sec.paragraphs.length} paragraph{sec.paragraphs.length === 1 ? '' : 's'}
                                  </span>
                                </div>
                                <textarea
                                  rows={3}
                                  value={sec.paragraphs.join('\n\n')}
                                  onChange={(e) => handleUpdateSectionParagraphs(sIdx, e.target.value)}
                                  placeholder={`Write or edit paragraphs for Section ${sIdx + 1}...`}
                                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none leading-relaxed"
                                />
                              </div>

                              {/* Videos placed directly in this Section */}
                              {sectionVideos.length > 0 && (
                                <div className="space-y-2.5 pt-1">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold flex items-center gap-1.5">
                                    <Film className="h-3 w-3" />
                                    <span>Videos in Section {sIdx + 1} ({sectionVideos.length}):</span>
                                  </span>
                                  {sectionVideos.map((vid) => (
                                    <div
                                      key={vid.id}
                                      className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-3.5 space-y-3 shadow-2xs"
                                    >
                                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                            {vid.type.toUpperCase()}
                                          </span>
                                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                                            {vid.title || 'Section Video'}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">Move to:</span>
                                          <select
                                            value={typeof vid.targetSectionIndex === 'number' ? vid.targetSectionIndex : sIdx}
                                            onChange={(e) => {
                                              const val = parseInt(e.target.value, 10);
                                              handleUpdateSectionVideo(vid.id, { targetSectionIndex: val });
                                            }}
                                            className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-800 dark:text-slate-200 focus:outline-none"
                                            title="Reassign video to another section"
                                          >
                                            {parsed.contentSections.map((s, idxOption) => (
                                              <option key={s.id} value={idxOption}>
                                                Section {idxOption + 1}: {s.heading}
                                              </option>
                                            ))}
                                          </select>

                                          <button
                                            type="button"
                                            onClick={() => handleRemoveSectionVideo(vid.id)}
                                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors shrink-0"
                                            title="Remove video from section"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <div>
                                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                                            Video Title / Caption
                                          </label>
                                          <input
                                            type="text"
                                            value={vid.title}
                                            onChange={(e) => handleUpdateSectionVideo(vid.id, { title: e.target.value })}
                                            placeholder="e.g. Demonstration Walkthrough"
                                            className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                                            Video Link / URL
                                          </label>
                                          <input
                                            type="text"
                                            value={vid.originalUrl || vid.src}
                                            onChange={(e) => {
                                              const newUrl = e.target.value;
                                              const p = parseVideoUrl(newUrl);
                                              if (p.isValid) {
                                                handleUpdateSectionVideo(vid.id, {
                                                  originalUrl: p.originalUrl,
                                                  src: p.embedSrc,
                                                  type: p.type
                                                });
                                              } else {
                                                handleUpdateSectionVideo(vid.id, { originalUrl: newUrl });
                                              }
                                            }}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                                          />
                                        </div>
                                      </div>

                                      {/* Embedded Video Player Preview */}
                                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <VideoEmbed video={vid} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Prompts placed directly under this section */}
                              {sectionPrompts.length > 0 ? (
                                <div className="space-y-2.5 pt-1">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold block">
                                    Prompt Framework in Section {sIdx + 1}:
                                  </span>
                                  {sectionPrompts.map((p) => {
                                    return (
                                      <div
                                        key={p.id}
                                        className="rounded-xl border border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs space-y-3 p-4 transition-all"
                                      >
                                        {/* Top Header Row: Tool Badge, Category, Section Selector & Remove */}
                                        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <div className="flex items-center gap-1.5">
                                              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                                                AI Tool:
                                              </span>
                                            </div>
                                            <select
                                              value={p.tool}
                                              onChange={(e) => handleUpdateAttachedPrompt(p.id, { tool: e.target.value as AIToolType })}
                                              className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                                            >
                                              {AI_TOOLS_LIST.map(t => (
                                                <option key={t.name} value={t.name}>{t.name}</option>
                                              ))}
                                            </select>

                                            <span className="text-slate-300 dark:text-slate-700">|</span>

                                            <div className="flex items-center gap-1.5">
                                              <Tag className="h-3 w-3 text-slate-400" />
                                              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                                                Category:
                                              </span>
                                            </div>
                                            <select
                                              value={p.category}
                                              onChange={(e) => handleUpdateAttachedPrompt(p.id, { category: e.target.value as CategoryType })}
                                              className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                                            >
                                              <option value="General Prompts">General Prompts</option>
                                              <option value="Music Prompts">Music Prompts</option>
                                              <option value="Image Prompts">Image Prompts</option>
                                              <option value="Video Prompts">Video Prompts</option>
                                              <option value="Article Prompts">Article Prompts</option>
                                            </select>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">Move to:</span>
                                            <select
                                              value={typeof p.targetSectionIndex === 'number' ? p.targetSectionIndex : sIdx}
                                              onChange={(e) => {
                                                const val = parseInt(e.target.value, 10);
                                                setEditingPost(prev => {
                                                  if (!prev) return null;
                                                  const updated = (prev.prompts || []).map((item) =>
                                                    item.id === p.id ? { ...item, targetSectionIndex: val } : item
                                                  );
                                                  return { ...prev, prompts: updated };
                                                });
                                              }}
                                              className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-800 dark:text-slate-200 focus:outline-none"
                                              title="Reassign prompt to another section"
                                            >
                                              {parsed.contentSections.map((s, idxOption) => (
                                                <option key={s.id} value={idxOption}>
                                                  Section {idxOption + 1}: {s.heading}
                                                </option>
                                              ))}
                                            </select>

                                            <button
                                              type="button"
                                              onClick={() => handleRemoveAttachedPrompt(p.id)}
                                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors shrink-0"
                                              title="Delete this prompt from article"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </div>

                                        {/* Prompt Title Input */}
                                        <div className="space-y-1">
                                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                                            Prompt Title
                                          </label>
                                          <input
                                            type="text"
                                            value={p.title}
                                            onChange={(e) => handleUpdateAttachedPrompt(p.id, { title: e.target.value })}
                                            placeholder="e.g. Master React Component Refactor Prompt"
                                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                          />
                                        </div>

                                        {/* Prompt Description Input */}
                                        <div className="space-y-1">
                                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                                            Description / Usage Note
                                          </label>
                                          <input
                                            type="text"
                                            value={p.description || ''}
                                            onChange={(e) => handleUpdateAttachedPrompt(p.id, { description: e.target.value })}
                                            placeholder="Brief explanation of how to use this prompt..."
                                            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none transition-all"
                                          />
                                        </div>

                                        {/* Prompt Text Textarea (Code / Framework Box) */}
                                        <div className="space-y-1">
                                          <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-bold block">
                                              Prompt Text (Framework Content)
                                            </label>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                              Edit directly same as section paragraphs
                                            </span>
                                          </div>
                                          <textarea
                                            rows={5}
                                            value={p.promptText}
                                            onChange={(e) => handleUpdateAttachedPrompt(p.id, { promptText: e.target.value })}
                                            placeholder="Write or edit prompt text here (supports parameters, markdown, system instructions)..."
                                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 p-3 font-mono text-xs leading-relaxed text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="p-2.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400">
                                  No AI Prompt box in this section yet. Click "+ Attach Prompt to Section {sIdx + 1}" above to add one.
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Add Another Section Button */}
                        <button
                          type="button"
                          onClick={handleAddNewSection}
                          className="w-full py-3 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Another Section with Heading Title</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-5">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePost}
                  className="rounded-lg bg-indigo-600 px-6 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-indigo-700 shadow-sm flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* --- NESTED AI PROMPT POP-UP DIALOG (INSIDE ARTICLE CREATION) --- */}
      {isNestedPromptModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/75 p-4 font-sans text-slate-800 dark:text-slate-200 overflow-y-auto backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add AI Prompt to Article
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNestedPromptModalOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Prompt Title *
                </label>
                <input
                  type="text"
                  value={nestedPrompt.title || ''}
                  onChange={(e) => setNestedPrompt(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Master React Component Refactor Prompt"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    AI Tool
                  </label>
                  <select
                    value={nestedPrompt.tool || 'ChatGPT'}
                    onChange={(e) => setNestedPrompt(prev => ({ ...prev, tool: e.target.value as AIToolType }))}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                  >
                    {AI_TOOLS_LIST.map(t => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Prompt Category
                  </label>
                  <select
                    value={nestedPrompt.category || 'General Prompts'}
                    onChange={(e) => setNestedPrompt(prev => ({ ...prev, category: e.target.value as CategoryType }))}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="General Prompts">General Prompts</option>
                    <option value="Music Prompts">Music Prompts</option>
                    <option value="Image Prompts">Image Prompts</option>
                    <option value="Video Prompts">Video Prompts</option>
                    <option value="Article Prompts">Article Prompts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={nestedPrompt.description || ''}
                  onChange={(e) => setNestedPrompt(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief summary of how to use this prompt..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Full Prompt Text *
                </label>
                <textarea
                  rows={5}
                  value={nestedPrompt.promptText || ''}
                  onChange={(e) => setNestedPrompt(prev => ({ ...prev, promptText: e.target.value }))}
                  placeholder="Enter full prompt here..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 p-3 font-mono text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setIsNestedPromptModalOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNestedPrompt}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-indigo-700 shadow-xs flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Save Prompt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD / EMBED VIDEO TO SECTION POP-UP MODAL --- */}
      {isSectionVideoModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/75 p-4 font-sans text-slate-800 dark:text-slate-200 overflow-y-auto backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Video to Section {sectionVideoTargetIdx + 1}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSectionVideoModalOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Paste a video link from YouTube, Vimeo, Bilibili, or any web video URL to embed it directly within <strong>Section {sectionVideoTargetIdx + 1}</strong>.
              </p>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  Target Section
                </label>
                {(() => {
                  const parsed = parseArticleToSectionsAndToc(
                    mainArticleText,
                    'Overview',
                    editingPost?.prompts || []
                  );
                  return (
                    <select
                      value={sectionVideoTargetIdx}
                      onChange={(e) => setSectionVideoTargetIdx(parseInt(e.target.value, 10))}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                    >
                      {parsed.contentSections.map((sec, idx) => (
                        <option key={sec.id} value={idx}>
                          Section {idx + 1}: {sec.heading}
                        </option>
                      ))}
                    </select>
                  );
                })()}
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  Video URL / Link *
                </label>
                <input
                  type="text"
                  value={sectionVideoUrlInput}
                  onChange={(e) => setSectionVideoUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or https://www.bilibili.com/video/..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  Video Title / Caption (Optional)
                </label>
                <input
                  type="text"
                  value={sectionVideoTitleInput}
                  onChange={(e) => setSectionVideoTitleInput(e.target.value)}
                  placeholder="e.g. Detailed Walkthrough & Code Demonstration"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Live Preview within modal */}
              {(() => {
                if (!sectionVideoUrlInput.trim()) return null;
                const parsed = parseVideoUrl(sectionVideoUrlInput.trim());
                if (!parsed.isValid) {
                  return (
                    <div className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{parsed.error || 'Please enter a valid video link'}</span>
                    </div>
                  );
                }

                const previewObj: VideoEmbedData = {
                  id: 'modal-preview',
                  type: parsed.type,
                  src: parsed.embedSrc,
                  originalUrl: parsed.originalUrl,
                  title: sectionVideoTitleInput.trim() || `${parsed.platformName} Tutorial`,
                  aspectRatio: '16:9'
                };

                return (
                  <div className="mt-2 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{parsed.platformName} player preview:</span>
                    </span>
                    <VideoEmbed video={previewObj} />
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setIsSectionVideoModalOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSectionVideo}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-indigo-700 shadow-xs flex items-center gap-2"
              >
                <Film className="h-4 w-4" />
                <span>Add Video</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STANDALONE EDIT PROMPT MODAL (FOR PROMPTS TAB) --- */}
      {isPromptModalOpen && editingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 font-sans text-slate-800 dark:text-slate-200 overflow-y-auto backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {prompts.some(p => p.id === editingPrompt.id) ? 'Edit AI Prompt' : 'Create New AI Prompt'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPromptModalOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Prompt Title *
                </label>
                <input
                  type="text"
                  value={editingPrompt.title || ''}
                  onChange={(e) => setEditingPrompt(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                  placeholder="e.g. Cinematic Sci-Fi Scene Generator"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    AI Tool
                  </label>
                  <select
                    value={editingPrompt.tool || 'ChatGPT'}
                    onChange={(e) => setEditingPrompt(prev => prev ? ({ ...prev, tool: e.target.value as AIToolType }) : null)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                  >
                    {AI_TOOLS_LIST.map(t => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Prompt Category
                  </label>
                  <select
                    value={editingPrompt.category || 'General Prompts'}
                    onChange={(e) => setEditingPrompt(prev => prev ? ({ ...prev, category: e.target.value as CategoryType }) : null)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="General Prompts">General Prompts</option>
                    <option value="Music Prompts">Music Prompts</option>
                    <option value="Image Prompts">Image Prompts</option>
                    <option value="Video Prompts">Video Prompts</option>
                    <option value="Article Prompts">Article Prompts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editingPrompt.description || ''}
                  onChange={(e) => setEditingPrompt(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  placeholder="Brief explanation of when to use this prompt..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Full Prompt Text *
                </label>
                <textarea
                  rows={5}
                  value={editingPrompt.promptText || ''}
                  onChange={(e) => setEditingPrompt(prev => prev ? ({ ...prev, promptText: e.target.value }) : null)}
                  placeholder="Enter full prompt here..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 p-3 font-mono text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setIsPromptModalOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePrompt}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-indigo-700 shadow-xs flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Prompt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 font-sans text-slate-800 dark:text-slate-200 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base">
              <AlertTriangle className="h-5 w-5" />
              <span>Confirm Deletion</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete the {deleteTarget.type === 'post' ? 'article' : deleteTarget.type === 'prompt' ? 'prompt' : deleteTarget.type === 'menu' ? 'website menu' : 'submenu'}: <strong className="text-slate-900 dark:text-white">"{deleteTarget.title}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT MENU MODAL --- */}
      {isMenuModalOpen && editingMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 font-sans text-slate-800 dark:text-slate-200 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {editingMenu.id ? 'Edit Website Menu' : 'Add New Website Menu'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Menu Title *
                </label>
                <input
                  type="text"
                  value={editingMenu.title || ''}
                  onChange={(e) => setEditingMenu(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                  placeholder="e.g. Tips, Tutorials, Resources, Best Practices"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  This title appears directly in the main top website navigation and mobile drawer.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Page Description
                </label>
                <textarea
                  rows={2}
                  value={editingMenu.description || ''}
                  onChange={(e) => setEditingMenu(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  placeholder="e.g. Pro tips, cheat sheets, quick hacks, and best practices for AI & tech."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Displays at the top webcard header when users open this page.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setIsMenuModalOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMenu}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-indigo-700 shadow-xs flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Menu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT SUBMENU MODAL --- */}
      {isSubmenuModalOpen && editingSubmenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 font-sans text-slate-800 dark:text-slate-200 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {editingSubmenu.id ? 'Edit Submenu' : 'Add New Submenu'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmenuModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Submenu Title *
                </label>
                <input
                  type="text"
                  value={editingSubmenu.title || ''}
                  onChange={(e) => setEditingSubmenu(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                  placeholder="e.g. Quick Tips, Prompt Hacks, Cloud Tutorials"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Category Reference / Filter Tag
                </label>
                <input
                  type="text"
                  value={editingSubmenu.categoryRef || ''}
                  onChange={(e) => setEditingSubmenu(prev => prev ? ({ ...prev, categoryRef: e.target.value }) : null)}
                  placeholder="e.g. General Prompts, Full-Stack Guides, Tips"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Matches articles, prompts, or guides categorized under this keyword when clicked.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingSubmenu.description || ''}
                  onChange={(e) => setEditingSubmenu(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  placeholder="Brief summary shown in the navigation dropdown"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setIsSubmenuModalOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSubmenu}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-indigo-700 shadow-xs flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Submenu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
