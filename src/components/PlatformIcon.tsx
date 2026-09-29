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
  if (s.includes('apple')) return 'apple';
  if (s.includes('canva')) return 'canva';
  if (s.includes('clubhouse')) return 'clubhouse';
  if (s.includes('composio')) return 'composio';
  if (s.includes('discord')) return 'discord';
  if (s.includes('facebook')) return 'facebook';
  if (s.includes('github')) return 'github';
  if (s.includes('google')) return 'google';
  if (s.includes('instagram')) return 'instagram';
  if (s.includes('linkedin')) return 'linkedin';
  if (s.includes('miro')) return 'miro';
  if (s.includes('monday')) return 'monday';
  if (s.includes('notion')) return 'notion';
  if (s.includes('gpt') || s.includes('openai') || s.includes('chatgpt')) return 'openai';
  if (s.includes('pinterest')) return 'pinterest';
  if (s.includes('shopify')) return 'shopify';
  if (s.includes('slack')) return 'slack';
  if (s.includes('spotify')) return 'spotify';
  if (s.includes('substack')) return 'substack';
  if (s.includes('tiktok')) return 'tiktok';
  if (s.includes('trello')) return 'trello';
  if (s.includes('youtube')) return 'youtube';
  return null;
}

const ASSETS: Partial<Record<PlatformType,string>> = { amazon:'amazon', apple:'apple', canva:'canva', clubhouse:'clubhouse', composio:'composio', discord:'discord', facebook:'facebook', github:'github', google:'google', instagram:'instagram', linkedin:'linkedin', miro:'miro', monday:'monday.com', notion:'notion', openai:'open ai_chatgpt', pinterest:'pintrest', shopify:'shopify', slack:'slack', spotify:'spotify', substack:'substack', tiktok:'tiktok', trello:'trello', youtube:'youtube' };
export default function PlatformIcon({platform,className='',size=24}:PlatformIconProps){
 const type=matchPlatform(platform); const asset=type && ASSETS[type];
 return asset ? <img src={`/platforms/${encodeURIComponent(asset)}.svg`} width={size} height={size} alt={platform} className={className} style={{objectFit:'contain'}} /> : <span className={className} style={{fontFamily:'var(--font-figtree)',fontSize:13}}>{platform}</span>;
}
