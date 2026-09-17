import React from 'react';

export type PlatformType =
  | 'amazon'
  | 'apple'
  | 'canva'
  | 'clubhouse'
  | 'composio'
  | 'discord'
  | 'facebook'
  | 'github'
  | 'google'
  | 'instagram'
  | 'linkedin'
  | 'miro'
  | 'monday'
  | 'notion'
  | 'openai'
  | 'pinterest'
  | 'shopify'
  | 'slack'
  | 'spotify'
  | 'substack'
  | 'tiktok'
  | 'trello'
  | 'youtube';

interface PlatformIconProps {
  platform: string;
  className?: string;
  size?: number;
}

export function matchPlatform(platformString?: string): PlatformType | null {
  if (!platformString) return null;
  const s = platformString.toLowerCase();
  if (s.includes('amazon')) return 'amazon';
  if (s.includes('apple') || s.includes('watch') || s.includes('ios')) return 'apple';
  if (s.includes('canva') || s.includes('claude')) return 'canva';
  if (s.includes('clubhouse') || s.includes('gohighlevel') || s.includes('crm')) return 'clubhouse';
  if (s.includes('composio')) return 'composio';
  if (s.includes('discord') || s.includes('twitch')) return 'discord';
  if (s.includes('facebook') || s.includes('meta')) return 'facebook';
  if (s.includes('github') || s.includes('git')) return 'github';
  if (s.includes('google') || s.includes('website') || s.includes('web') || s.includes('newcastle')) return 'google';
  if (s.includes('instagram')) return 'instagram';
  if (s.includes('linkedin')) return 'linkedin';
  if (s.includes('miro')) return 'miro';
  if (s.includes('monday')) return 'monday';
  if (s.includes('notion')) return 'notion';
  if (s.includes('gpt') || s.includes('openai') || s.includes('chatgpt')) return 'openai';
  if (s.includes('pinterest')) return 'pinterest';
  if (s.includes('shopify')) return 'shopify';
  if (s.includes('slack')) return 'slack';
  if (s.includes('spotify') || s.includes('podcast')) return 'spotify';
  if (s.includes('substack')) return 'substack';
  if (s.includes('tiktok')) return 'tiktok';
  if (s.includes('trello')) return 'trello';
  if (s.includes('youtube') || s.includes('video')) return 'youtube';
  return null;
}

export default function PlatformIcon({ platform, className = 'w-5 h-5', size = 20 }: PlatformIconProps) {
  const type = matchPlatform(platform);

  if (!type) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`flex items-center justify-center rounded bg-gray-100 text-[9px] font-mono uppercase text-gray-500 font-bold ${className}`}
        title={platform}
      >
        {platform.slice(0, 2)}
      </div>
    );
  }

  const s = size;

  switch (type) {
    case 'amazon':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Amazon">
          <rect width="24" height="24" rx="5" fill="#232F3E" />
          <path d="M12.8 14.2c-1.8 0-3.3-.3-4.6-.9-.3-.1-.3-.4 0-.6.9-.5 2.1-.8 3.5-.8 2.2 0 4.1.8 4.7 1.8.2.3 0 .5-.3.5h-3.3z" fill="#FFF" />
          <path d="M7 16.5c2.8 2 6.5 2 9.5.2.3-.2.6.1.4.4-3.2 2.3-7.5 2.3-10.4-.1-.3-.2 0-.5.5-.5z" fill="#FF9900" />
          <path d="M16.8 16.8c.4-.1.8-.4 1.1-.9.1-.1.2 0 .2.1 0 .5-.3 1.1-.6 1.4-.2.2-.4.1-.4 0-.1-.2-.2-.4-.3-.6z" fill="#FF9900" />
        </svg>
      );

    case 'apple':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Apple">
          <rect width="24" height="24" rx="5" fill="#555555" />
          <path d="M15.5 12.3c0-1.8 1.4-2.6 1.5-2.7-0.8-1.2-2.1-1.4-2.5-1.4-1.1-0.1-2.1 0.6-2.7 0.6s-1.4-0.6-2.3-0.6c-1.2 0-2.3 0.7-2.9 1.8-1.3 2.1-0.3 5.3 0.9 7.1 0.6 0.9 1.3 1.8 2.3 1.8s1.3-0.6 2.4-0.6 1.5 0.6 2.4 0.6c1 0 1.6-0.9 2.2-1.8 0.7-1 1-2 1-2.1-.1 0-1.9-0.7-1.9-2.8zM14.2 6.8c0.5-0.6 0.8-1.5 0.7-2.3-0.7 0-1.6 0.5-2.1 1.1-0.4 0.5-0.8 1.4-0.7 2.2 0.8 0.1 1.6-0.4 2.1-1z" fill="#FFFFFF" />
        </svg>
      );

    case 'canva':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Canva">
          <defs>
            <linearGradient id="canva-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00C4CC" />
              <stop offset="100%" stopColor="#7D2AE8" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5" fill="url(#canva-grad)" />
          <text x="12" y="16.5" fill="#FFFFFF" fontSize="11" fontFamily="cursive, sans-serif" fontWeight="bold" textAnchor="middle">Canva</text>
        </svg>
      );

    case 'clubhouse':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Clubhouse">
          <rect width="24" height="24" rx="5" fill="#F6F4EB" />
          <path d="M6 10l2 2m-2-5l2.5 1.5M6 16l2-1m3-6.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v3.5h.5c.8 0 1.5.7 1.5 1.5v.5h.5c.8 0 1.5.7 1.5 1.5v2.5c0 1.9-1.6 3.5-3.5 3.5h-1c-1.9 0-3.5-1.6-3.5-3.5V8.5z" fill="#FFD02F" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'composio':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Composio">
          <defs>
            <linearGradient id="comp-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="100%" stopColor="#0080FF" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5" fill="url(#comp-grad)" />
          <rect x="7" y="6" width="10" height="3" rx="1.5" fill="#000" />
          <rect x="5" y="10" width="10" height="3" rx="1.5" fill="#000" />
          <rect x="7" y="14" width="10" height="3" rx="1.5" fill="#000" />
        </svg>
      );

    case 'discord':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Discord / Stream">
          <rect width="24" height="24" rx="5" fill="#5865F2" />
          <path d="M17.5 7.5s-1.3-.8-2.7-.9c-.1.3-.3.8-.4 1.1-1.5-.2-3-.2-4.5 0-.1-.3-.3-.8-.4-1.1-1.4.1-2.7.9-2.7.9-1.7 2.6-2.2 5.2-1.9 7.7 1.2.9 2.3 1.4 3.4 1.8.3-.4.5-.8.7-1.3-.4-.2-.8-.4-1.1-.6.1-.1.2-.1.3-.2 2.2 1 4.5 1 6.7 0 .1.1.2.1.3.2-.3.2-.7.4-1.1.6.2.5.5.9.7 1.3 1.1-.4 2.2-.9 3.4-1.8.3-2.9-.5-5.5-2-7.7zM9.5 14c-.7 0-1.2-.6-1.2-1.3s.5-1.3 1.2-1.3 1.2.6 1.2 1.3-.5 1.3-1.2 1.3zm5 0c-.7 0-1.2-.6-1.2-1.3s.5-1.3 1.2-1.3 1.2.6 1.2 1.3-.5 1.3-1.2 1.3z" fill="#FFF" />
        </svg>
      );

    case 'facebook':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Facebook / Meta">
          <rect width="24" height="24" rx="5" fill="#1877F2" />
          <path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.8v2.1H8V14h2.4v7h3.1z" fill="#FFF" />
        </svg>
      );

    case 'github':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="GitHub">
          <rect width="24" height="24" rx="5" fill="#24292E" />
          <path fillRule="evenodd" clipRule="evenodd" d="M12 4a8 8 0 00-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1.1-2.7-1.1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2 0-.2-.4-1 .1-2.2 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.5 1.2.1 2 .1 2.2.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.7 4 .3.3.6.8.6 1.6v2.4c0 .2.2.5.6.4A8 8 0 0012 4z" fill="#FFF" />
        </svg>
      );

    case 'google':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Google">
          <rect width="24" height="24" rx="5" fill="#F8F9FA" />
          <path d="M18.8 12.2c0-.6-.1-1.2-.2-1.7H12v3.3h3.8c-.2 1-.7 1.8-1.5 2.4v2h2.4c1.4-1.3 2.1-3.3 2.1-6z" fill="#4285F4" />
          <path d="M12 19c1.9 0 3.5-.6 4.7-1.7l-2.4-2c-.6.4-1.4.7-2.3.7-1.8 0-3.3-1.2-3.8-2.8H5.7v2C6.9 17.5 9.2 19 12 19z" fill="#34A853" />
          <path d="M8.2 13.2c-.1-.4-.2-.8-.2-1.2s.1-.8.2-1.2V8.8H5.7C5.2 9.8 5 10.9 5 12s.2 2.2.7 3.2l2.5-2z" fill="#FBBC05" />
          <path d="M12 7c1 0 2 .4 2.7 1l2-2C15.5 5 13.9 4.3 12 4.3 9.2 4.3 6.9 5.8 5.7 8.1l2.5 2C8.7 8.2 10.2 7 12 7z" fill="#EA4335" />
        </svg>
      );

    case 'instagram':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Instagram">
          <defs>
            <linearGradient id="insta-grad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFD521" />
              <stop offset="50%" stopColor="#F50000" />
              <stop offset="100%" stopColor="#B900B4" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5" fill="url(#insta-grad)" />
          <rect x="6.5" y="6.5" width="11" height="11" rx="3" fill="none" stroke="#FFF" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2.8" fill="none" stroke="#FFF" strokeWidth="1.5" />
          <circle cx="15.5" cy="8.5" r="0.7" fill="#FFF" />
        </svg>
      );

    case 'linkedin':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="LinkedIn">
          <rect width="24" height="24" rx="5" fill="#0A66C2" />
          <path d="M7 10h2.5v7H7v-7zm1.2-3.8c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zM11.5 10H14v1c.4-.7 1.2-1.2 2.3-1.2 2.2 0 2.7 1.4 2.7 3.3V17h-2.5v-3.4c0-.9 0-1.9-1.2-1.9s-1.4.9-1.4 1.8V17h-2.4v-7z" fill="#FFF" />
        </svg>
      );

    case 'miro':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Miro">
          <rect width="24" height="24" rx="5" fill="#FFD02F" />
          <path d="M7.5 18L10 6h2l-1.5 12h-3zm3.5 0l2.5-12h2l-1.5 12h-3zm3.5 0l2.5-12h2l-1.5 12h-3z" fill="#050038" />
        </svg>
      );

    case 'monday':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Monday.com">
          <rect width="24" height="24" rx="5" fill="#FFFFFF" stroke="#EEE" strokeWidth="1" />
          <path d="M6 14.5c0 1.4 1.1 2.5 2.5 2.5S11 15.9 11 14.5V9.5C11 8.1 9.9 7 8.5 7S6 8.1 6 9.5v5z" fill="#FF155A" />
          <path d="M11.5 14.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5V11c0-1.4-1.1-2.5-2.5-2.5s-2.5 1.1-2.5 2.5v3.5z" fill="#FFCC00" />
          <circle cx="18" cy="15.5" r="1.8" fill="#00CA72" />
        </svg>
      );

    case 'notion':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Notion">
          <rect width="24" height="24" rx="5" fill="#000000" />
          <path d="M7 7.5L8.5 6l8 1.5v10.5l-2.5 1-8-1.5V7.5zm2.5 8.5V9.5l4 4.5V9l1.5.3v5.2l-3.8-4.3v4.8L9.5 16z" fill="#FFFFFF" />
        </svg>
      );

    case 'openai':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="OpenAI / ChatGPT">
          <rect width="24" height="24" rx="5" fill="#10A37F" />
          <path d="M16.8 11.2c-.3-1.6-1.5-2.8-3.1-3.1-.4-.6-.9-1-1.6-1.3-1.6-.6-3.4-.1-4.4 1.3-.7 0-1.4.3-2 .8-1.3 1.1-1.8 2.8-1.3 4.4-.3.5-.4 1.1-.3 1.7.3 1.6 1.5 2.8 3.1 3.1.4.6.9 1 1.6 1.3 1.6.6 3.4.1 4.4-1.3.7 0 1.4-.3 2-.8 1.3-1.1 1.8-2.8 1.3-4.4.3-.5.4-1.1.3-1.7z" fill="none" stroke="#FFF" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="1.5" fill="#FFF" />
        </svg>
      );

    case 'pinterest':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Pinterest">
          <rect width="24" height="24" rx="5" fill="#E60023" />
          <path d="M12 4.5c-4.1 0-7.5 3.4-7.5 7.5 0 3.2 2 5.9 4.9 7-.1-.6-.1-1.5.1-2.2l1.2-5.1s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.4-.2 1.1.5 1.9 1.6 1.9 1.9 0 3.4-2 3.4-5 0-2.6-1.9-4.4-4.5-4.4-3.1 0-4.9 2.3-4.9 4.7 0 .9.4 1.9.8 2.4.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4 0 .1-.1.2-.3.1-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.5 2.6 6.5 6.1 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2-1.3 2.7 1 .3 2.1.5 3.2.5 4.1 0 7.5-3.4 7.5-7.5s-3.4-7.5-7.5-7.5z" fill="#FFF" />
        </svg>
      );

    case 'shopify':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Shopify">
          <rect width="24" height="24" rx="5" fill="#95BF47" />
          <path d="M16.5 7.5l-1.8-.4c-.1 0-.1 0-.1.1l-.8 4.2c-.1.3-.3.4-.5.4-.2 0-.4-.1-.5-.4l-.8-4.2c0-.1 0-.1-.1-.1l-1.8.4c-.2 0-.2.2-.2.3l1.8 8.8c.1.3.3.5.6.5h3.4c.3 0 .5-.2.6-.5l1.8-8.8c.1-.1 0-.3-.1-.4z" fill="#FFF" />
        </svg>
      );

    case 'slack':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Slack">
          <rect width="24" height="24" rx="5" fill="#4A154B" />
          <path d="M8.5 11a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4zm0 1.2H6a1.2 1.2 0 000 2.4h2.5v-2.4zm2.5-2.4a1.2 1.2 0 00-2.4 0V12.3a1.2 1.2 0 102.4 0V9.8z" fill="#36C5F0" />
          <path d="M12.9 8.5a1.2 1.2 0 10-2.4 0 1.2 1.2 0 002.4 0zm1.2 0V6a1.2 1.2 0 10-2.4 0v2.5h2.4zm-2.4 2.5a1.2 1.2 0 000-2.4H9.2a1.2 1.2 0 100 2.4h2.5z" fill="#2EB67D" />
          <path d="M15.5 12.9a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4zm0-1.2H18a1.2 1.2 0 100-2.4h-2.5v2.4zm-2.5 2.4a1.2 1.2 0 002.4 0v-2.5a1.2 1.2 0 10-2.4 0v2.5z" fill="#ECB22E" />
          <path d="M11 15.5a1.2 1.2 0 102.4 0 1.2 1.2 0 00-2.4 0zm-1.2 0V18a1.2 1.2 0 102.4 0v-2.5H9.8zm2.4-2.5a1.2 1.2 0 000 2.4h2.5a1.2 1.2 0 100-2.4h-2.5z" fill="#E01E5A" />
        </svg>
      );

    case 'spotify':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Spotify">
          <rect width="24" height="24" rx="5" fill="#1ED760" />
          <circle cx="12" cy="12" r="7" fill="#000" />
          <path d="M8.5 10.3c2.4-.6 5-.4 6.9.7" stroke="#1ED760" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M9 12.2c1.9-.4 4.1-.3 5.6.6" stroke="#1ED760" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M9.5 14c1.5-.3 3.3-.2 4.4.4" stroke="#1ED760" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );

    case 'substack':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Substack">
          <rect width="24" height="24" rx="5" fill="#FF6719" />
          <rect x="6" y="6" width="12" height="2" rx="0.5" fill="#FFF" />
          <rect x="6" y="9.5" width="12" height="2" rx="0.5" fill="#FFF" />
          <path d="M6 13v5l6-3.5 6 3.5v-5H6z" fill="#FFF" />
        </svg>
      );

    case 'tiktok':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="TikTok">
          <rect width="24" height="24" rx="5" fill="#000000" />
          <path d="M14.5 6.5c.7.8 1.6 1.3 2.5 1.4v2.1c-1 0-1.9-.3-2.7-.8v4.6c0 2.2-1.8 3.9-4 3.9s-3.9-1.7-3.9-3.9 1.8-4 4-4c.4 0 .7.1 1.1.2v2.2c-.3-.1-.7-.2-1.1-.2-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8 1.8-.8 1.8-1.8V5h2.3v1.5z" fill="#25F4EE" />
          <path d="M15.5 7.5c.7.8 1.6 1.3 2.5 1.4v1.1c-1 0-1.9-.3-2.7-.8v4.6c0 2.2-1.8 3.9-4 3.9s-3.9-1.7-3.9-3.9 1.8-4 4-4c.4 0 .7.1 1.1.2v1.2c-.3-.1-.7-.2-1.1-.2-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8 1.8-.8 1.8-1.8V6h2.3v1.5z" fill="#FE2C55" />
          <path d="M15 7c.7.8 1.6 1.3 2.5 1.4v1.6c-1 0-1.9-.3-2.7-.8v4.6c0 2.2-1.8 3.9-4 3.9s-3.9-1.7-3.9-3.9 1.8-4 4-4c.4 0 .7.1 1.1.2v1.7c-.3-.1-.7-.2-1.1-.2-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8 1.8-.8 1.8-1.8V5.5h2.3V7z" fill="#FFF" />
        </svg>
      );

    case 'trello':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="Trello">
          <rect width="24" height="24" rx="5" fill="#0079BF" />
          <rect x="6.5" y="6.5" width="4.5" height="9.5" rx="1.5" fill="#FFF" />
          <rect x="13" y="6.5" width="4.5" height="6.5" rx="1.5" fill="#FFF" />
        </svg>
      );

    case 'youtube':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className={`rounded shadow-xs ${className}`} title="YouTube">
          <rect width="24" height="24" rx="5" fill="#FF0000" />
          <path d="M10 9l5 3-5 3V9z" fill="#FFF" />
        </svg>
      );

    default:
      return null;
  }
}
