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
