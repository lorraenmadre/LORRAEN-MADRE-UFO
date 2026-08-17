import {
  ProductSignal,
  Wish,
  WishStory,
  WishTask,
} from './types';

// ============================================================================
// WISH COMPILER v0.1
// ============================================================================
// Read this file from top to bottom.
// It is intentionally plain TypeScript.
//
// The basic idea:
//
// HUMAN WISH
//    -> TASK
//    -> STORY
//    -> PRODUCT SIGNALS
//    -> WISH WELL ROUTING
//    -> HUMAN-GOVERNED ACTION
//
// This file does NOT make legal, medical, financial, insurance, or safety
// decisions. It only structures the wish and flags when human review is needed.

const HIGH_STAKES_WORDS = [
  'legal',
  'court',
  'custody',
  'medical',
  'therapy',
  'insurance',
  'safety',
  'violence',
  'abuse',
  'benefits',
  'credit',
  'tax',
];

// A simple lookup table connects ordinary language to WISH WELL houses.
// Later, AI can help classify a wish, but the routing rules should remain
// visible and reviewable instead of becoming mysterious model behavior.
const HOUSE_KEYWORDS: Record<number, string[]> = {
  1: ['identity', 'family', 'business', 'entity'],
  2: ['money', 'budget', 'income', 'asset', 'price', 'financial'],
  3: ['technology', 'communication', 'email', 'phone', 'ai'],
  4: ['home', 'house', 'housing', 'health', 'food', 'care'],
  5: ['project', 'build', 'create', 'product', 'play'],
  6: ['system', 'habit', 'routine', 'process', 'workflow'],
  7: ['contract', 'agreement', 'accountability', 'legal'],
  8: ['risk', 'insurance', 'safety', 'protection', 'compliance'],
  9: ['travel', 'therapy', 'education', 'school', 'research', 'trust'],
  10: ['story', 'legacy', 'press', 'public', 'authority'],
  11: ['community', 'partner', 'network', 'sponsor'],
  12: ['mind', 'body', 'soul', 'regulation', 'meditation'],
  13: ['creation', 'template', 'recipe', 'deal', 'alchemy'],
};

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

export function routeWishToHouses(statement: string): number[] {
  const text = normalize(statement);
  const houses: number[] = [];

  for (const [houseNumber, keywords] of Object.entries(HOUSE_KEYWORDS)) {
    const matchesHouse = keywords.some((keyword) => text.includes(keyword));

    if (matchesHouse) {
      houses.push(Number(houseNumber));
    }
  }

  // Every wish is ultimately part of the wish-to-deal / creation process.
  if (!houses.includes(13)) {
    houses.push(13);
  }

  return houses;
}

export function requiresHumanReview(statement: string): boolean {
  const text = normalize(statement);

  return HIGH_STAKES_WORDS.some((word) => text.includes(word));
}

export function createTask(statement: string, desiredState: string): WishTask {
  return {
    id: `task-${Date.now()}`,
    action: `Create an executable plan for: ${desiredState}`,
    dependencies: [
      'confirm the current state',
      'identify constraints',
      'identify people and resources involved',
    ],
    status: 'proposed',
  };
}

export function createStory(
  statement: string,
  currentState: string,
  desiredState: string,
): WishStory {
  return {
    actor: 'the person or household making the wish',
    situation: currentState,
    need: statement,
    desiredOutcome: desiredState,
    barriers: [],
    acceptanceCriteria: [
      'the desired state is specific enough to evaluate',
      'the next actions are understandable to the user',
      'high-stakes actions remain under human or licensed-professional review',
    ],
  };
}

export function identifyProductSignals(story: WishStory): ProductSignal[] {
  // In v0.1, we create one transparent signal from the story.
  // Later this can expand into several signals or use an AI model with a
  // structured schema and human approval.
  return [
    {
      problem: `A gap exists between "${story.situation}" and "${story.desiredOutcome}".`,
      affectedUsers: [story.actor],
      reusable: true,
      evidenceNeeded: [
        'user confirmation',
        'barriers encountered during execution',
        'outcome after the task is completed',
      ],
    },
  ];
}

export function compileWish(input: {
  id: string;
  ownerId: string;
  statement: string;
  currentState: string;
  desiredState: string;
  source?: string;
}): Wish {
  const task = createTask(input.statement, input.desiredState);
  const story = createStory(
    input.statement,
    input.currentState,
    input.desiredState,
  );

  const humanReviewRequired = requiresHumanReview(input.statement);

  return {
    id: input.id,
    ownerId: input.ownerId,
    statement: input.statement,
    currentState: input.currentState,
    desiredState: input.desiredState,
    source: input.source ?? 'manual',
    createdAt: new Date().toISOString(),
    houses: routeWishToHouses(input.statement),
    tasks: [task],
    story,
    productSignals: identifyProductSignals(story),
    approvalRequired: humanReviewRequired,
    humanReviewRequired,
    status: 'captured',
  };
}

// ---------------------------------------------------------------------------
// EXAMPLE
// ---------------------------------------------------------------------------
// This object is here so you can understand the code without needing the UI.
// Nothing happens automatically just because this example exists.

export const EXAMPLE_WISH = compileWish({
  id: 'wish-example-001',
  ownerId: 'example-user',
  statement: 'I wish I could relocate my family and keep school, housing, money, and healthcare stable.',
  currentState: 'The household is preparing for a major transition.',
  desiredState: 'The family is established in a stable new home with essential services connected.',
  source: 'cookbook',
});
