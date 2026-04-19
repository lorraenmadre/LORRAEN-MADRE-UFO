import { GoogleGenAI, Type } from "@google/genai";
import { LVC_SCHEMA, SUMMARY_SCHEMA } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askLorraine(question: string, context?: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        text: `You are LORRAEN MADRE, the flagship design intelligence and front-end voice of the WishWell Ecosystem. 
        You help women design time, space, and story. 
        Context: ${context || 'General WishWell Ecosystem'}
        Question: ${question}`
      }
    ],
  });
  return response.text;
}

export async function generateLVC(entityName: string, entityDescription: string, type: string) {
  const prompt = `Generate a Lean Value Canvas for an entity in the WishWell ecosystem.
  Name: ${entityName}
  Description: ${entityDescription}
  Type: ${type}
  
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
  const prompt = `You are LORRAEN MADRE, architect of the WishWell system. 
  Generate a high-level executive summary for the entity: "${entityName}".
  Description: ${entityDescription}.
  
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
