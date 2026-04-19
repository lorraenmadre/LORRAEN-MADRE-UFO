import { Entity } from "./types";

export const INITIAL_ENTITIES: Entity[] = [
  // Top Structure
  {
    id: 'trust',
    type: 'trust',
    name: 'The Hand of Nisha Moura',
    symbol: 'The Trust',
    description: 'Top ownership structure.',
    vaultDocuments: [],
  },
  {
    id: 'church',
    type: 'church',
    name: 'Lilies of the Wish Well',
    description: '508(c)(1)(A) structure under the trust.',
    councilMembers: Array(12).fill(''),
    summaryTitleOverride: 'Executive Ministry',
  },
  {
    id: 'holding',
    type: 'holding_company',
    name: 'Sterling Drive Ventures',
    description: 'Parent company under the church.',
  },
  
  // Nodes
  {
    id: 'north-node',
    type: 'north_node',
    name: 'Sunshine Pocket Therapy',
    symbol: 'North Node',
    description: 'The vision and retirement plan.',
    summaryTitleOverride: 'Executive Vision',
    strategy: 'Multi-layered funding strategy for wealth preservation and transfer.',
    fundingStrategies: [
      'Sterling Drive Holding Co. Quarterly Dividends',
      'WishWell Ecosystem Royalty Stream (2% Gross)',
      'Real Estate Title Holding in Newcastle Vault',
      'AI Agentic Framework Licencing Fees'
    ],
    securityGoals: [
      '100% Tax Efficiency through 508(c)(1)(A) Trust Alignment',
      '7-Generation Wealth Transfer Structure',
      'Asset Protection through Tiered Entity Masking',
      'Sovereign Identity Preservation'
    ]
  },
  {
    id: 'south-node',
    type: 'south_node',
    name: 'The Tooth and Nail Foundation',
    symbol: 'South Node',
    description: 'Mission-based nonprofit foundation.',
    summaryTitleOverride: 'Executive Mission',
    strategy: 'Financial sustainability for the foundation.',
  },

  // Planets
  {
    id: 'sun',
    type: 'planet',
    symbol: 'Sun',
    name: 'LORRAEN MADRE',
    description: 'Brand Identity. Time, space, and story design. A creative, work, and play studio for women.',
    highLevelNature: 'Vitality & Core Identity',
    highLevelAstrology: 'The ego, the radiator of light.',
    highLevelSystem: 'Brand Identity Architecture',
    storyCardVideo: 'https://picsum.photos/seed/sun/400/225'
  },
  {
    id: 'moon',
    type: 'planet',
    symbol: 'Moon',
    name: 'Next Testimony',
    description: 'AI marketing production. Story production, testimony, content, and emotional proof.',
    highLevelNature: 'Reflection & Reception',
    highLevelAstrology: 'The emotional self, the weaver of dreams.',
    highLevelSystem: 'AI Content Production',
    storyCardVideo: 'https://picsum.photos/seed/moon/400/225'
  },
  {
    id: 'mars',
    type: 'planet',
    symbol: 'Mars',
    name: 'OMW Life',
    description: 'Business activation and movement.',
    highLevelNature: 'Action & Drive',
    highLevelAstrology: 'The warrior, the fuel of ambition.',
    highLevelSystem: 'Activation Logistics',
    storyCardVideo: 'https://picsum.photos/seed/mars/400/225'
  },
  {
    id: 'mercury',
    type: 'planet',
    symbol: 'Mercury',
    name: 'WishWell',
    description: 'System framework and internal logic.',
    highLevelNature: 'Communcation & Logic',
    highLevelAstrology: 'The messenger, the logic of the mind.',
    highLevelSystem: 'Internal System Framework',
    storyCardVideo: 'https://picsum.photos/seed/mercury/400/225'
  },
  {
    id: 'venus',
    type: 'planet',
    symbol: 'Venus',
    name: 'Ninth House Homeschool',
    description: 'Content library and education.',
    highLevelNature: 'Harmony & Value',
    highLevelAstrology: 'The lover, the value of relationships.',
    highLevelSystem: 'Educational Content Library',
    storyCardVideo: 'https://picsum.photos/seed/venus/400/225'
  },
  {
    id: 'saturn',
    type: 'planet',
    symbol: 'Saturn',
    name: 'Sanctuary Cell',
    description: 'Digital architecture and organization.',
    highLevelNature: 'Structure & Time',
    highLevelAstrology: 'The father of time, the grand architect.',
    highLevelSystem: 'Digital Stewardship & Structure',
    storyCardVideo: 'https://picsum.photos/seed/saturn/400/225'
  },
  {
    id: 'jupiter',
    type: 'planet',
    symbol: 'Jupiter',
    name: 'Honey and Higher Ground',
    description: 'Capital container and expansion.',
    highLevelNature: 'Expansion & Abundance',
    highLevelAstrology: 'The optimist, the expander of wealth.',
    highLevelSystem: 'Capital Container Management',
    storyCardVideo: 'https://picsum.photos/seed/jupiter/400/225'
  },
  {
    id: 'neptune',
    type: 'planet',
    symbol: 'Neptune',
    name: 'Higher Ground Railroad',
    description: 'Movie / myth / immersive narrative.',
    highLevelNature: 'Intuition & Dissolution',
    highLevelAstrology: 'The dreamer, the bridge between worlds.',
    highLevelSystem: 'Narrative Immersive Design',
    storyCardVideo: 'https://picsum.photos/seed/neptune/400/225'
  },
  {
    id: 'uranus',
    type: 'planet',
    symbol: 'Uranus',
    name: 'Soup Club',
    description: 'SaaS membership.',
    highLevelNature: 'Innovation & Community',
    highLevelAstrology: 'The rebel, the spark of genius.',
    highLevelSystem: 'SaaS Social Architecture',
    storyCardVideo: 'https://picsum.photos/seed/uranus/400/225'
  },
  {
    id: 'pluto',
    type: 'planet',
    symbol: 'Pluto',
    name: 'Pluto Complex',
    description: 'Agentic framework and agency.',
    highLevelNature: 'Power & Transformation',
    highLevelAstrology: 'The transformer, the deep architect.',
    highLevelSystem: 'Agentic Framework Logic',
    storyCardVideo: 'https://picsum.photos/seed/pluto/400/225'
  },

  // 10 Offerings
  { 
    id: 'wishopoly', 
    type: 'offering', 
    name: 'WISHOPOLY', 
    parentPlanetId: 'mercury', 
    description: 'Dynamic wishing integration.',
    intentions: 'Create a dynamic marketplace for wishes.' 
  },
  { 
    id: 'newcastle-offering', 
    type: 'offering', 
    name: 'Newcastle', 
    parentPlanetId: 'saturn', 
    description: 'Documentation and structure.',
    intentions: 'Automate legal documentation for family offices.',
    manifestations: 'Newcastle Vault v1.0',
    executiveSummary: 'Newcastle provides a secure container for family office assets and legal identities.'
  },
  { id: 'ollie-mode', type: 'offering', name: 'Ollie Mode', parentPlanetId: 'mars', description: 'Business activation tool.' },
  { id: 'minufi', type: 'offering', name: 'Minufi', parentPlanetId: 'jupiter', description: 'Financial tracking and growth.' },
  { id: 'daily-bread', type: 'offering', name: 'Daily Bread', parentPlanetId: 'venus', description: 'Resource management.' },
  { id: 'water-wine', type: 'offering', name: 'Water Wine', parentPlanetId: 'neptune', description: 'Narrative transformation.' },
  { id: 'fruitful-frameworks', type: 'offering', name: 'Fruitful Frameworks', parentPlanetId: 'mercury', description: 'Process templates.' },
  { 
    id: 'dream-backlog', 
    type: 'offering', 
    name: 'Dream Backlog', 
    parentPlanetId: 'neptune', 
    description: 'Immersive production.',
    leanValueCanvas: '{"problem": "Scattered inspiration", "solution": "A centralized backlog for immersive narrative dreams."}'
  },
  { id: 'light-scouts-offering', type: 'offering', name: 'Light Scouts', parentPlanetId: 'uranus', description: 'Membership community.' },
  { id: 'sunshine-pocket', type: 'offering', name: 'Sunshine Pocket Therapy', parentPlanetId: 'moon', description: 'AI marketing and emotional proof.' },
  { 
    id: 'athent', 
    type: 'offering', 
    name: 'Athent', 
    parentPlanetId: 'sun', 
    description: 'Authentic expression engine.',
    intentions: 'To enable radical authenticity in digital expression.',
    manifestations: 'Athent Portal Alpha',
    leanValueCanvas: '{"problem": "Performative digital identities", "solution": "An engine that prioritizes authentic self-representation."}',
    executiveSummary: 'Athent is the flagship offering for core brand identity.'
  },

  // 12 Domains (Dinosaurs)
  { id: 'ms-honey', type: 'dinosaur', name: 'Ms. Honey', zodiacSign: 'Cancer', house: '1st House', description: 'Home economics and self-formation.' },
  { id: 'madre-dino', type: 'dinosaur', name: 'LORRAEN MADRE', zodiacSign: 'Leo', house: '5th House', description: 'Flagship design intelligence persona.' },
  { id: 'raelle', type: 'dinosaur', name: 'Raelle', zodiacSign: 'Virgo', house: '6th House', description: 'Founder ether identity.' },
  { id: 'newcastle-ai', type: 'dinosaur', name: 'Newcastle AI', zodiacSign: 'Libra', house: '7th House', description: 'Legal and relational balance.' },
  { id: 'madre', type: 'dinosaur', name: 'Madre', zodiacSign: 'Scorpio', house: '8th House', description: 'Deep transformation architecture.' },
  { id: 'killer-gene', type: 'dinosaur', name: 'Killer Gene', zodiacSign: 'Sagittarius', house: '9th House', description: 'Teaching and homeschool learning.' },
  { id: 'malka-israel', type: 'dinosaur', name: 'Malka Israel', zodiacSign: 'Capricorn', house: '10th House', description: 'Authority and legacy structure.' },
  { id: 'light-scouts-dino', type: 'dinosaur', name: 'Light Scouts', zodiacSign: 'Aquarius', house: '11th House', description: 'Future community and youth domain.' },
  { id: 'saint-madre-ray', type: 'dinosaur', name: 'Saint Madre Ray', zodiacSign: 'Pisces', house: '12th House', description: 'Spiritual and compassionate domain.' },
  { id: 'lisi', type: 'dinosaur', name: 'Lisi', zodiacSign: 'Aries', house: '3rd House', description: 'Route optimization and support AI.' },
  { id: 'paradise-square', type: 'dinosaur', name: 'Paradise Square', zodiacSign: 'Taurus', house: '2nd House', description: 'Technology and fintech integration.' },
  { id: 'on-our-guard', type: 'dinosaur', name: 'On Our Guard', zodiacSign: 'Gemini', house: '4th House', description: 'Messaging and apparel communications.' },

  // Preloaded Satellites
  { id: 'sat-homeschool', type: 'satellite', name: 'Home School Satellite', description: 'External learning curriculum and progress tracking.' },
  { id: 'sat-church', type: 'satellite', name: 'Church Satellite', description: 'Affiliated spiritual community and ministry sync.' },
  { id: 'sat-trust', type: 'satellite', name: 'Trust Satellite', description: 'External asset management and legal entity sync.' },
  { id: 'sat-fund', type: 'satellite', name: 'Fund Satellite', description: 'External investment fund and liquidity radar.' },
  { id: 'sat-trading', type: 'satellite', name: 'Trading Satellite', description: 'External trading desk and market movement radar.' },
  { id: 'sat-insurance', type: 'satellite', name: 'Insurance Satellite', description: 'External health and property policy tracker.' },
  { id: 'sat-telemed', type: 'satellite', name: 'Telemedicine Satellite', description: 'Domestic violence development and telemedicine sync.' },
  { id: 'sat-coaching', type: 'satellite', name: 'Coaching Satellite', description: 'External coaching program and accountability loop.' },
];
