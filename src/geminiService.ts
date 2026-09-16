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
        Preserve exact names. Do not invent a solar-system organizational layer, product platforms, active integrations, partner agreements, or executed work. House 13 is the person choosing in the present. Proposed engines are not running agents. Distinguish the founder example from each customer's UFO.
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
