/**
 * Mona Lisa Connect — connector catalog.
 *
 * This is the list of accounts a Lorraen Madre / New Castle client can link.
 * It is intentionally data-only so the dashboard, the seven agents, and the
 * Mona Lisa Stack protocol all read from one source of truth.
 *
 * `engine` decides how the connection is made:
 *   - 'nango'  → OAuth handled by Nango (self-hosted or Nango Cloud)
 *   - 'canopy' → consumer-permissioned insurance pull via Canopy Connect
 *   - 'native' → already handled in-app (the existing Google Drive flow)
 *
 * `integrationId` for engine 'nango' MUST match the integration's
 * "Unique Key" configured in the Nango dashboard.
 */

export type ConnectEngine = 'nango' | 'canopy' | 'native';

export type ConnectCategory =
  | 'Productivity'
  | 'Developer'
  | 'Communication'
  | 'Storage & Docs'
  | 'Finance & Capital'
  | 'Insurance & Risk'
  | 'Commerce'
  | 'Social & Publishing';

export interface Connector {
  /** Stable id used in Firestore + agent routing. */
  key: string;
  name: string;
  category: ConnectCategory;
  engine: ConnectEngine;
  /** Nango integration unique key (engine === 'nango'). */
  integrationId?: string;
  /** One line shown on the card. */
  blurb: string;
  /** WISH WELL house this account feeds, from the Mona Lisa Stack protocol. */
  house?: string;
  /** Emoji glyph — keeps the grid dependency-free. */
  glyph: string;
  /** Not yet wired end-to-end; card renders disabled. */
  comingSoon?: boolean;
}

export const CONNECTORS: Connector[] = [
  // --- Storage & Docs ---
  {
    key: 'google-drive',
    name: 'Google Drive',
    category: 'Storage & Docs',
    engine: 'native',
    blurb: 'The Vault — assets, exports, books, legal/admin docs, outputs.',
    house: 'House 6',
    glyph: '📁',
  },
  {
    key: 'notion',
    name: 'Notion',
    category: 'Storage & Docs',
    engine: 'nango',
    integrationId: 'notion',
    blurb: 'Fruitful Frameworks — receipts, operating rules, decisions.',
    house: 'House 6',
    glyph: '📓',
  },
  {
    key: 'dropbox',
    name: 'Dropbox',
    category: 'Storage & Docs',
    engine: 'nango',
    integrationId: 'dropbox',
    blurb: 'Overflow file storage and client deliverable handoff.',
    house: 'House 6',
    glyph: '🗂️',
  },

  // --- Productivity ---
  {
    key: 'monday',
    name: 'Monday.com',
    category: 'Productivity',
    engine: 'nango',
    integrationId: 'monday',
    blurb: 'Execution board and sprint tracking.',
    house: 'House 5',
    glyph: '📅',
  },
  {
    key: 'trello',
    name: 'Trello',
    category: 'Productivity',
    engine: 'nango',
    integrationId: 'trello',
    blurb: 'Dream Backlog — rabbit-hole capture for wishes and story sparks.',
    house: 'House 13',
    glyph: '🗒️',
  },
  {
    key: 'google-calendar',
    name: 'Google Calendar',
    category: 'Productivity',
    engine: 'nango',
    integrationId: 'google-calendar',
    blurb: 'Daily blocks, Panchang timing, the Space for Story Time calendar.',
    house: 'House 6',
    glyph: '🗓️',
  },

  // --- Developer ---
  {
    key: 'github',
    name: 'GitHub',
    category: 'Developer',
    engine: 'nango',
    // Nango "Unique Key" for the integration. The Nango getting-started flow
    // creates it as 'github-getting-started'; rename in Nango + here to 'github'
    // once you configure your own GitHub OAuth app.
    integrationId: 'github-getting-started',
    blurb: 'Technical source of truth — app repos, architecture, deploy issues.',
    house: 'House 3',
    glyph: '🐙',
  },
  {
    key: 'vercel',
    name: 'Vercel',
    category: 'Developer',
    engine: 'nango',
    integrationId: 'vercel',
    blurb: 'App deployment and domain connection.',
    house: 'House 3',
    glyph: '▲',
    comingSoon: true,
  },

  // --- Communication ---
  {
    key: 'slack',
    name: 'Slack',
    category: 'Communication',
    engine: 'nango',
    integrationId: 'slack',
    blurb: 'Agent communication, approval requests, daily updates, blockers.',
    house: 'House 3',
    glyph: '💬',
  },
  {
    key: 'gmail',
    name: 'Gmail',
    category: 'Communication',
    engine: 'nango',
    integrationId: 'google-mail',
    blurb: 'Founder inbox triage and outreach send.',
    house: 'House 3',
    glyph: '✉️',
  },

  // --- Commerce ---
  {
    key: 'shopify',
    name: 'Shopify',
    category: 'Commerce',
    engine: 'nango',
    integrationId: 'shopify',
    blurb: 'Product checkout and Sanctuary Cell revenue layer.',
    house: 'House 2',
    glyph: '🛍️',
  },
  {
    key: 'stripe',
    name: 'Stripe',
    category: 'Commerce',
    engine: 'nango',
    integrationId: 'stripe',
    blurb: 'Payments, subscriptions (New Castle Vibes), payout tracking.',
    house: 'House 2',
    glyph: '💳',
  },

  // --- Finance & Capital ---
  {
    key: 'quickbooks',
    name: 'QuickBooks',
    category: 'Finance & Capital',
    engine: 'nango',
    integrationId: 'quickbooks',
    blurb: 'Books, invoices, and the Three Kings cash review.',
    house: 'House 2',
    glyph: '📊',
  },
  {
    key: 'plaid',
    name: 'Bank accounts (Plaid)',
    category: 'Finance & Capital',
    engine: 'nango',
    integrationId: 'plaid',
    blurb: 'Balances and transactions for the Jupiter money check-in.',
    house: 'House 2',
    glyph: '🏦',
    comingSoon: true,
  },

  // --- Insurance & Risk ---
  {
    key: 'insurance-canopy',
    name: 'Insurance policies',
    category: 'Insurance & Risk',
    engine: 'canopy',
    blurb:
      'Link auto, home, renters, life, and umbrella policies from 100+ carriers. Powered by Canopy Connect.',
    house: 'House 8',
    glyph: '🛡️',
  },

  // --- Social & Publishing ---
  {
    key: 'linkedin',
    name: 'LinkedIn',
    category: 'Social & Publishing',
    engine: 'nango',
    integrationId: 'linkedin',
    blurb: 'Authority path — founder signal, investor visibility.',
    house: 'House 11',
    glyph: '🔗',
  },
  {
    key: 'youtube',
    name: 'YouTube',
    category: 'Social & Publishing',
    engine: 'nango',
    integrationId: 'youtube',
    blurb: 'Long-form authority and clip source material.',
    house: 'House 10',
    glyph: '▶️',
  },
];

export const CATEGORY_ORDER: ConnectCategory[] = [
  'Storage & Docs',
  'Productivity',
  'Developer',
  'Communication',
  'Commerce',
  'Finance & Capital',
  'Insurance & Risk',
  'Social & Publishing',
];

export function connectorByKey(key: string): Connector | undefined {
  return CONNECTORS.find((c) => c.key === key);
}
