import { Type } from "@google/genai";

export type EntityType = 
  | 'trust' 
  | 'church' 
  | 'holding_company' 
  | 'north_node' 
  | 'south_node' 
  | 'planet' 
  | 'offering' 
  | 'dinosaur' 
  | 'asteroid' 
  | 'satellite';

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  symbol?: string; // e.g. "Sun", "Moon"
  description: string;
  highLevelNature?: string;
  highLevelAstrology?: string;
  highLevelSystem?: string;
  intentions?: string;
  manifestations?: string;
  parentPlanetId?: string; // for offerings/dinosaurs
  zodiacSign?: string; // for dinosaurs
  house?: string; // for dinosaurs/planets (mapped to departments)
  
  // Dynamic AI content
  leanValueCanvas?: string;
  executiveSummary?: string;
  
  // Offering specific
  userJourney?: string;
  customerAcquisitionCost?: string;
  maintenanceCost?: string;
  benefit?: string;
  
  // Church specific
  councilMembers?: string[];
  
  // Trust specific
  vaultDocuments?: string[];

  // Nodes/Summary overrides
  summaryTitleOverride?: string;
  strategy?: string;
  fundingStrategies?: string[];
  securityGoals?: string[];
  storyCardVideo?: string; // URL or placeholder
  
  // Logo/Icon override
  logoUrl?: string; // Data URL for uploaded logo
  isArchived?: boolean;
}

export interface Ecosystem {
  name: string;
  entities: Entity[];
}

// -----------------------------------------------------------------------------
// WISH WELL CORE LIFECYCLE
// -----------------------------------------------------------------------------
// A Wish is the moving object inside the ecosystem.
// The houses, planets, tools, and products are the map.
// The Wish moves through this lifecycle:
//
// WISH -> TASK -> STORY -> PRODUCT SIGNAL -> ACTION -> OUTCOME -> RECIPE
//
// These types do not replace the existing Entity model. They add the missing
// user-centered object that the rest of the system can organize around.

export type WishStatus =
  | 'captured'
  | 'clarifying'
  | 'ready_for_execution'
  | 'in_progress'
  | 'waiting_for_human'
  | 'completed'
  | 'archived';

export interface WishTask {
  id: string;
  action: string;
  owner?: string;
  destinationTool?: string;
  dependencies: string[];
  status: 'proposed' | 'approved' | 'in_progress' | 'done';
}

export interface WishStory {
  actor: string;
  situation: string;
  need: string;
  desiredOutcome: string;
  barriers: string[];
  acceptanceCriteria: string[];
}

export interface ProductSignal {
  problem: string;
  proposedIntervention?: string;
  affectedUsers: string[];
  reusable: boolean;
  evidenceNeeded: string[];
  productLane?: string;
}

export interface WishOutcome {
  summary: string;
  completedAt?: string;
  whatWorked: string[];
  whatFailed: string[];
  reusableLessons: string[];
}

export interface Wish {
  id: string;

  // Human input: what the person wants to become true.
  statement: string;
  currentState?: string;
  desiredState: string;

  // Context and ownership.
  ownerId: string;
  source: string;
  createdAt: string;

  // WISH WELL routing.
  houses: number[];
  planet?: string;

  // The transformation from desire into product-development evidence.
  tasks: WishTask[];
  story?: WishStory;
  productSignals: ProductSignal[];
  outcome?: WishOutcome;

  // Governance boundaries.
  approvalRequired: boolean;
  humanReviewRequired: boolean;

  status: WishStatus;
}

export const LVC_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    problem: { type: Type.STRING },
    solution: { type: Type.STRING },
    uniqueValueProposition: { type: Type.STRING },
    unfairAdvantage: { type: Type.STRING },
    customerSegments: { type: Type.STRING },
    keyMetrics: { type: Type.STRING },
    channels: { type: Type.STRING },
    costStructure: { type: Type.STRING },
    revenueStreams: { type: Type.STRING },
  },
  required: ['problem', 'solution', 'uniqueValueProposition', 'customerSegments'],
};

export const SUMMARY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overview: { type: Type.STRING },
    mission: { type: Type.STRING },
    targetAudience: { type: Type.STRING },
    keyOfferings: { type: Type.STRING },
    financialOutlook: { type: Type.STRING },
  },
  required: ['overview', 'mission'],
};
