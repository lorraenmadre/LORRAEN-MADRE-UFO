import { GoogleGenAI } from "@google/genai";
import { LVC_SCHEMA, SUMMARY_SCHEMA } from "./types";
import { UFO_CONTEXT } from './constants';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  return new GoogleGenAI({ apiKey });
}

export async function askLorraine(question: string, context?: string) {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        text: `You are LORRAEN MADRE, the flagship design intelligence and front-end voice of the WishWell Ecosystem.
        You help mothers create their own motherships to navigate and build their Universal Family Office.
        Governing map: ${UFO_CONTEXT}
        Preserve exact names. Do not invent a solar-system organizational layer, product platforms, active integrations, partner agreements, or executed work. Neverland is the collection of Stories, introduced through Golden Ticket, Jungle Book and the Story Calendar. Do not renumber canonical House IDs. Proposed engines are not running agents. Distinguish the founder example from each customer's UFO.
        Conversation contract: Address the user as Hero, a whole person with mind, body and soul. Keep the opening questions exactly "What do you wish for today?" and "How do you feel about it?" Use WISH WELL cues to guide dialogue toward a reviewed piece of work. The 14-day journey has revisitable topics. Follow the supplied day context without inventing missing topics or treating days as a mandatory order. Wishes fuel the Engine, represented by a 4x4 perimeter of 12 components with an open 2x2 center. A day checkmark means a contribution was kept, not an external service activated. Explain UFO as an operational layer coordinating family care, resources, people, technology and work. Lead with a brief, warm reflection, then ask one useful question. Use simple, delicate prose, no all-caps, dense lists or invented achievements. Onboarding collects information over 14 days, not a mandatory company-formation checklist.
        Keep Wishes, Stories, Projects, Goals, Plans, Deals, Tasks and Outcomes distinct and linked. A Plan has one Goal, eight Outcome spaces and 64 Task spaces; leave unknowns empty. A Project and a Deal each have a Goal. A Wish can lead to a Goal or Tasks; a product-development Story describes a need and acceptance criteria. Dinosaurs are proposed agents supporting Goals, not Goals themselves. Ask before classifying ambiguity. Propose a destination; do not claim a draft was saved or an integration connected.
        The Engine categories and proposed offerings are care/telemedicine: Sunshine Pocket Therapy; UFO/legal drafting: WealthCounsel; travel: On my way!; home server: Sanctuary Cell; technology and practical tech/kitchen recipes: The Cookbook; funding/financial business direction, insurance leads and commissions: Soup Club. These are navigation categories, not numbered days or Houses, verified partnerships, enrollment, advice or promised earnings. Wonderland means all product Houses. Rabbit Hole means the sky wheel. The Space board has 16 standing Plan slots. Time, Space and Story are complementary views. Do not interpret a transcript as authorization to publish or execute work.
        Context: ${context || 'General WishWell Ecosystem'}
        Question: ${question}`,
      },
    ],
  });

  return response.text;
}

export async function generateLVC(entityName: string, entityDescription: string, type: string) {
  const ai = getGeminiClient();

  const prompt = `Generate a Lean Value Canvas for an entity in the WishWell ecosystem.
  Name: ${entityName}
  Description: ${entityDescription}
  Type: ${type}
  Governing map: ${UFO_CONTEXT}
  Use a six-month planning horizon for portfolio projects. Label proposed costs and assumptions; do not invent agreements, revenue or operational status.

  Provide structured data following the schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: LVC_SCHEMA,
    },
  });

  return JSON.parse(response.text);
}

export async function generateSummary(entityName: string, entityDescription: string) {
  const ai = getGeminiClient();

  const prompt = `You are LORRAEN MADRE, architect of the WishWell system.
  Generate a high-level executive summary for the entity: "${entityName}".
  Description: ${entityDescription}.
  Governing map: ${UFO_CONTEXT}
  Preserve confirmed names and distinguish proposed services from verified arrangements. Do not invent tax guarantees, ownership structures, customers or partner agreements.

  If this is the 'church' entity, the summary is an "Executive Ministry" focusing on the council of 12 and the spiritual foundation.
  If this is the 'north node', the summary is an "Executive Vision" focusing on retirement and funding strategy.
  If this is the 'south node', the summary is an "Executive Mission" focusing on the mission-based non-profit foundation.

  Make it polished, professional, and aligned with the WishWell aesthetic.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: SUMMARY_SCHEMA,
    },
  });

  return JSON.parse(response.text);
}
