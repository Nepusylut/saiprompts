import React from 'react';

interface CompanyLogo {
  id: string;
  name: string;
  slug: string;
  domain: string;
  customLogoUrl?: string;
  svg: React.ReactNode;
}

const COMPANIES: CompanyLogo[] = [
  {
    id: 'google',
    name: 'Google',
    slug: 'google',
    domain: 'google.com',
    customLogoUrl: 'https://cdn.brandfetch.io/google.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    slug: 'microsoft',
    domain: 'microsoft.com',
    svg: (
      <svg className="h-5.5 w-5.5 shrink-0" viewBox="0 0 23 23" fill="none">
        <rect x="1" y="1" width="10" height="10" fill="#F25022" />
        <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
        <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
        <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
      </svg>
    ),
  },
  {
    id: 'openai',
    name: 'OpenAI',
    slug: 'openai',
    domain: 'openai.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#10A37F">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7712-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7469-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0813 4.779-2.7582a.7951.7951 0 0 0 .3927-.6813v-6.7369l2.0203 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4955 4.4955zm-8.8351-4.2863a4.4707 4.4707 0 0 1-.5355-3.003l.1419.0858 4.779 2.7582a.7951.7951 0 0 0 .7901 0l5.8338-3.3686v2.3372a.0758.0758 0 0 1-.0285.0617l-4.836 2.7915a4.504 4.504 0 0 1-6.1448-1.6628zm-1.208-9.8258a4.4755 4.4755 0 0 1 2.341-2.0203v5.6823a.7904.7904 0 0 0 .3975.6813l5.8338 3.3686-2.0203 1.1686a.0758.0758 0 0 1-.0711 0l-4.8313-2.7915a4.5088 4.5088 0 0 1-1.6496-6.0885zm12.9863 3.6358l-5.8338-3.3686 2.0203-1.1686a.0758.0758 0 0 1 .0711 0l4.8313 2.7915a4.5088 4.5088 0 0 1 1.6496 6.0885 4.4755 4.4755 0 0 1-2.341 2.0203v-5.6823a.7904.7904 0 0 0-.3975-.6813zm2.5912-3.003l-.1419-.0858-4.779-2.7582a.7951.7951 0 0 0-.7901 0l-5.8338 3.3686v-2.3372a.0758.0758 0 0 1 .0285-.0617l4.836-2.7915a4.504 4.504 0 0 1 6.6803 4.6658z" />
      </svg>
    ),
  },
  {
    id: 'meta',
    name: 'Meta',
    slug: 'meta',
    domain: 'meta.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#0668E1">
        <path d="M16.98 5.51c-1.83 0-3.32.96-4.98 2.87-1.66-1.91-3.15-2.87-4.98-2.87C3.12 5.51 0 8.68 0 12.56c0 3.87 3.12 7.04 7.02 7.04 1.83 0 3.32-.96 4.98-2.87 1.66 1.91 3.15 2.87 4.98 2.87 3.9 0 7.02-3.17 7.02-7.04 0-3.88-3.12-7.05-7.02-7.05zm-9.96 11.58c-2.49 0-4.51-2.05-4.51-4.53s2.02-4.53 4.51-4.53c1.39 0 2.53.68 3.73 2.06-1.12 1.53-2.39 3.9-3.73 7zm9.96 0c-1.34-3.1-2.61-5.47-3.73-7 1.2-1.38 2.34-2.06 3.73-2.06 2.49 0 4.51 2.05 4.51 4.53s-2.02 4.53-4.51 4.53z" />
      </svg>
    ),
  },
  {
    id: 'grok',
    name: 'Grok',
    slug: 'x',
    domain: 'grok.com',
    customLogoUrl: 'https://cdn.brandfetch.io/grok.com',
    svg: (
      <svg className="h-5.5 w-5.5 shrink-0" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" className="fill-slate-900 dark:fill-white" />
      </svg>
    ),
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    slug: 'anthropic',
    domain: 'anthropic.com',
    customLogoUrl: 'https://cdn.simpleicons.org/anthropic',
    svg: (
      <svg className="h-6 w-6 shrink-0 fill-slate-900 dark:fill-white" viewBox="0 0 24 24">
        <path d="M17.414 2.5H13.63L7.15 21.5h3.766l1.24-3.77h6.248l1.24 3.77h3.766L17.414 2.5zm-4.148 12.33L15.345 8.3l2.079 6.53h-4.158zM4.1 21.5h3.72L11.5 2.5H7.78L4.1 21.5z" />
      </svg>
    ),
  },
  {
    id: 'aws',
    name: 'AWS',
    slug: 'amazonwebservices',
    domain: 'aws.com',
    customLogoUrl: 'https://cdn.brandfetch.io/aws.com',
    svg: (
      <svg className="h-6 w-8 shrink-0" viewBox="0 0 40 24">
        <path fill="#FF9900" d="M13.8 19.3c-4.8 0-9.2-1.6-12.8-4.3-.3-.2-.1-.7.3-.5 3.9 2.5 8.8 3.8 13.9 3.8 5.7 0 10.9-1.6 15.1-4.2.4-.3.8.2.4.6-4.4 2.9-10.1 4.6-16.9 4.6z" />
        <path fill="#FF9900" d="M32.8 13.2c-.4-.5-2.7-.3-3.7-.1-.3 0-.4-.3-.1-.5 1.7-1.2 4.4-.9 4.8-.4.4.4-.1 3.1-1.7 4.5-.2.2-.5.1-.4-.1.4-.9 1.5-2.8 1.1-3.4z" />
        <path fill="#232F3E" className="dark:fill-slate-100" d="M7.8 12.3c0 .8.2 1.4.6 1.8.4.4 1 .5 1.8.5 1 0 1.7-.3 2.3-.9V8.8c-.4-.2-1-.3-1.7-.3-.9 0-1.6.2-2.1.7-.5.5-.9 1.2-.9 2.1zm-2.2 0c0-1.4.4-2.5 1.2-3.3.8-.8 1.9-1.2 3.3-1.2 1.1 0 2 .2 2.7.6V5.5l2.1-.4v10.2h-2.1v-1.1c-.7.9-1.7 1.3-3 1.3-1.3 0-2.3-.4-3-1.2-.8-.8-1.2-1.8-1.2-3zm14.6 3.1l-2.1-7.1h2.2l1.3 5.2 1.4-5.2h1.6l1.4 5.2 1.3-5.2h2.2l-2.1 7.1h-2.2l-1.4-4.8-1.4 4.8h-2.2zm11.7.3c-1.3 0-2.3-.3-3-.9-.7-.6-1.1-1.4-1.1-2.4 0-1.2.5-2.1 1.5-2.6 1-.5 2.3-.8 4.1-.8h1.2v-.4c0-.6-.2-1-.6-1.3-.4-.3-1-.5-1.7-.5-.7 0-1.3.2-1.7.5-.4.3-.6.8-.7 1.3l-2-.2c.2-1.1.7-1.9 1.6-2.5.9-.6 2.1-.9 3.6-.9 1.5 0 2.7.3 3.5 1 .8.7 1.2 1.6 1.2 2.8v4.2c0 .9.1 1.5.3 1.8v.2h-2.1c-.2-.3-.3-.8-.3-1.4-.6 1-1.7 1.6-3.1 1.6zm1.9-1.7c.8 0 1.5-.3 2.1-.9v-2h-1c-1.1 0-1.9.2-2.4.5-.5.3-.8.8-.8 1.4 0 .5.2.9.5 1.1.3.2.8.4 1.6.4z" />
      </svg>
    ),
  },
  {
    id: 'adobe',
    name: 'Adobe',
    slug: 'adobe',
    domain: 'adobe.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#FA0F00">
        <path d="M14.583 2.5H24v19.167zM0 2.5h9.417L0 21.667zM12 9.167l5.25 12.5h-3.833l-1.417-3.667H8.667z" />
      </svg>
    ),
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    slug: 'deepseek',
    domain: 'deepseek.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#4D6BFE">
        <path d="M21.8 11.2c-1.2-2.4-3.8-4.2-6.8-4.2-1.8 0-3.4.6-4.8 1.6C9 7.2 7.2 6.5 5.2 6.5c-1.2 0-2.3.3-3.2.8.8 1.2 1.8 2.2 3.1 2.8-1.5.5-2.8 1.4-3.8 2.6C.4 13.8 0 15.2 0 16.7c0 1.2.9 2.1 2.1 2.1 4.2 0 8.1-1.8 10.8-4.7 1.6.8 3.3 1.3 5.1 1.3 3.8 0 7.1-2.2 8.6-5.4-.8.5-1.7.8-2.6.9h-.2z" />
      </svg>
    ),
  },
  {
    id: 'zhipu',
    name: 'Zhipu AI',
    slug: 'zhipuai',
    domain: 'zhipuai.cn',
    customLogoUrl: 'https://cdn.brandfetch.io/zhipuai.cn',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#1C5238">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    id: 'suno',
    name: 'Suno',
    slug: 'suno',
    domain: 'suno.com',
    customLogoUrl: 'https://cdn.brandfetch.io/suno.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="suno-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF007A" />
            <stop offset="100%" stopColor="#7E22CE" />
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#suno-gradient-3)" />
        <path d="M12 5v14M8 8v8M16 8v8M4 11v2M20 11v2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    slug: 'midjourney',
    domain: 'midjourney.com',
    customLogoUrl: 'https://cdn.brandfetch.io/midjourney.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#0F172A" />
        <path d="M12 4.5L5.5 17.5h13L12 4.5zm0 3.2l3.8 7.8H8.2L12 7.7z" fill="#38BDF8" />
        <path d="M12 10.5l-2 4h4l-2-4z" fill="#0284C7" />
      </svg>
    ),
  },
  {
    id: 'canva',
    name: 'Canva',
    slug: 'canva',
    domain: 'canva.com',
    customLogoUrl: 'https://cdn.brandfetch.io/canva.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="canva-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C4CC" />
            <stop offset="50%" stopColor="#7D2AE8" />
            <stop offset="100%" stopColor="#FF2E93" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="11" fill="url(#canva-gradient-3)" />
        <path d="M12.5 16.2c-2.4 0-4.1-1.6-4.1-3.9 0-2.6 2.1-4.5 4.8-4.5 1.5 0 2.6.5 3.3 1.3l-1.2 1.2c-.5-.6-1.2-.9-2.1-.9-1.5 0-2.7 1.1-2.7 2.8 0 1.6 1.1 2.5 2.5 2.5.9 0 1.7-.4 2.2-1l1.2 1.1c-.8.9-2 1.4-3.9 1.4z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: 'github',
    name: 'GitHub',
    slug: 'github',
    domain: 'github.com',
    customLogoUrl: 'https://cdn.simpleicons.org/github',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" className="fill-slate-900 dark:fill-white" />
      </svg>
    ),
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    slug: 'gitlab',
    domain: 'gitlab.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
        <path fill="#FC6D26" d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 5.5 2a.43.43 0 0 1 .4.27l2.44 7.51h7.32l2.44-7.51a.43.43 0 0 1 .4-.27.42.42 0 0 1 .39.2l2.44 7.51 1.22 3.78a.84.84 0 0 1-.3.94z" />
        <path fill="#E24329" d="M22.65 14.39L12 22.13V12l8.21-2.3a.84.84 0 0 1 .98.3l1.46 4.39a.84.84 0 0 1-.3.94z" />
        <path fill="#FCA326" d="M12 22.13L1.35 14.39a.84.84 0 0 1-.3-.94l1.46-4.39a.84.84 0 0 1 .98-.3L12 12v10.13z" />
        <path fill="#E24329" d="M12 12L8.31 2.27a.43.43 0 0 0-.41-.27.42.42 0 0 0-.4.2L5.06 9.71 12 12z" />
        <path fill="#FC6D26" d="M12 12L5.06 9.71h13.88L12 12z" />
        <path fill="#E24329" d="M12 12l6.94-2.29-2.44-7.51a.42.42 0 0 0-.4-.2.43.43 0 0 0-.41.27L12 12z" />
      </svg>
    ),
  },
  {
    id: 'gitea',
    name: 'Gitea',
    slug: 'gitea',
    domain: 'gitea.io',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#609926">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
  },
  {
    id: 'gitee',
    name: 'Gitee',
    slug: 'gitee',
    domain: 'gitee.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#C71D23">
        <path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.333c0 .982.796 1.778 1.778 1.778h7.708a.593.593 0 0 1 .593.593v1.481a.593.593 0 0 1-.593.593H9.777c-2.946 0-5.333-2.387-5.333-5.333V9.778c0-2.946 2.387-5.333 5.333-5.333h8.297z" />
      </svg>
    ),
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    slug: 'cloudflare',
    domain: 'cloudflare.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#F38020">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
    ),
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    slug: 'nvidia',
    domain: 'nvidia.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#76B900">
        <path d="M11.23 6.06c-2.12.18-4.1.88-5.8 2.02a.45.45 0 00-.18.57l.6.98c.1.18.33.24.52.13 1.54-1 3.32-1.6 5.2-1.74 2.87-.2 5.67.6 7.82 2.27.17.13.42.1.53-.08l.63-.97a.45.45 0 00-.09-.58c-2.58-2.02-5.94-2.98-9.23-2.6zm-1.07 3.82c-1.55.15-3.02.68-4.29 1.55a.45.45 0 00-.14.58l.58.94c.1.18.34.23.52.12 1.13-.77 2.44-1.24 3.82-1.37 2.2-.2 4.38.41 6.08 1.72.16.12.4.1.5-.07l.61-.92a.45.45 0 00-.08-.58c-2.05-1.58-4.68-2.31-7.1-2.07zm-.83 3.68a5.2 5.2 0 00-2.88 1.13.45.45 0 00-.11.58l.56.91c.11.18.34.22.52.1 0 0 1.05-.72 2.25-.82 1.45-.13 2.92.27 4.05 1.14.16.12.4.1.51-.06l.58-.9a.45.45 0 00-.07-.58c-1.5-1.16-3.48-1.7-5.41-1.5zm.02 3.31c-.8.08-1.57.38-2.22.86a.45.45 0 00-.08.58l.5.83c.12.18.35.21.52.09.43-.31.94-.5 1.48-.56.96-.09 1.93.18 2.68.76.16.12.4.1.5-.06l.55-.84a.45.45 0 00-.06-.58 4.7 4.7 0 00-3.87-1.08z" />
      </svg>
    ),
  },
  {
    id: 'netlify',
    name: 'Netlify',
    slug: 'netlify',
    domain: 'netlify.com',
    svg: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#00C7B7">
        <path d="M6.175 16.825l3.825 3.825H6.175v-3.825zm11.65 0v3.825h-3.825l3.825-3.825zm-3.825-9.65L17.825 11h-3.825V7.175zm-3.825 0V11H6.175l3.825-3.825zM12 2L2 12l10 10 10-10L12 2z" />
      </svg>
    ),
  },
  {
    id: 'vercel',
    name: 'Vercel',
    slug: 'vercel',
    domain: 'vercel.com',
    customLogoUrl: 'https://cdn.brandfetch.io/vercel.com',
    svg: (
      <svg className="h-5.5 w-5.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 22.525H0l12-21.05 12 21.05z" className="fill-slate-900 dark:fill-white" />
      </svg>
    ),
  },
];

export const CompanyLogoMarquee: React.FC = () => {
  // Duplicate array for infinite seamless looping ticker
  const duplicatedLogos = [...COMPANIES, ...COMPANIES];

  return (
    <div className="w-full">
      {/* Container matching the webcard length (max-w-7xl) with taller height padding (py-5) & smooth rounded corners */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 py-5 px-6 shadow-xs min-h-[72px] flex items-center transition-colors">
        
        {/* Soft edge fade overlays matching rounded-2xl container corners */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent rounded-l-2xl" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent rounded-r-2xl" />

        {/* Moving Marquee track */}
        <div className="flex w-max animate-marquee items-center gap-10 sm:gap-14">
          {duplicatedLogos.map((item, index) => {
            const initialSrc = item.customLogoUrl || `https://cdn.simpleicons.org/${item.slug}`;

            return (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center gap-3 text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 transition-colors cursor-pointer group shrink-0"
              >
                <div className="flex h-7 w-7 items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <img
                    src={initialSrc}
                    alt={`${item.name} logo`}
                    className={`h-6 w-6 object-contain shrink-0 ${['github', 'anthropic', 'vercel'].includes(item.id) ? 'dark:invert' : ''}`}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const step = parseInt(target.dataset.errorStep || '0', 10);
                      if (step === 0) {
                        target.dataset.errorStep = '1';
                        target.src = `https://logo.clearbit.com/${item.domain}`;
                      } else if (step === 1) {
                        target.dataset.errorStep = '2';
                        target.src = `https://cdn.simpleicons.org/${item.slug}`;
                      } else {
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'block';
                        }
                      }
                    }}
                  />
                  <div style={{ display: 'none' }} className="h-6 w-6 shrink-0">
                    {item.svg}
                  </div>
                </div>
                <span className="text-sm font-semibold tracking-wide text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400 whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
