import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { InstrumentParams, PricingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We simulate the output of a Quantum Path Integral engine using Gemini's reasoning capabilities
// to generate realistic financial data patterns and Sharia structuring advice.

export const simulateQuantumPricing = async (
  params: InstrumentParams
): Promise<PricingResult> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Act as a Quantum Financial Engine specializing in Islamic Derivatives.
    Perform a simulated "Quantum Path Integral" (qPATHINT) pricing for the following instrument:
    
    Type: ${params.type}
    Notional: ${params.notional} ${params.currency}
    Tenor: ${params.tenorMonths} months
    Fixed Profit Rate: ${params.fixedRate}%
    Barrier: ${params.barrierLevel ? params.barrierLevel : 'None'} (${params.barrierType || 'N/A'})
    
    The goal is to demonstrate that qPATHINT handles path-dependency (barriers/wa'd triggers) better than Classical Monte Carlo.
    
    Generate a JSON response containing:
    1. A 'quantumPrice' (more accurate).
    2. A 'classicalPrice' (slightly different, showing the inefficiency of classical methods).
    3. Greeks (Delta, Gamma).
    4. A tighter 'bidAskSpread' enabled by quantum accuracy.
    5. 'optimalPath': An array of 20 time-step objects representing the most probable asset price path.
    6. 'structuringNotes': A brief professional paragraph on the Wa'd (promise) structure mechanism.
    7. 'shariaCompliance': A brief note on why this structure is compliant (e.g., uses Arboune or Hamish Jiddiyah).
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          quantumPrice: { type: Type.NUMBER },
          classicalPrice: { type: Type.NUMBER },
          delta: { type: Type.NUMBER },
          gamma: { type: Type.NUMBER },
          bidAskSpread: { type: Type.NUMBER },
          confidence: { type: Type.NUMBER },
          structuringNotes: { type: Type.STRING },
          shariaCompliance: { type: Type.STRING },
          optimalPath: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.NUMBER },
                time: { type: Type.STRING },
                price: { type: Type.NUMBER },
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI Pricing Engine");
  }

  const data = JSON.parse(response.text);

  // Generate some "cloud" paths for visualization locally to save tokens
  // We will perturb the optimal path to create the visual effect of the path integral
  const paths: any[][] = [];
  const optimal = data.optimalPath;
  
  for (let i = 0; i < 10; i++) {
    const path = optimal.map((p: any) => ({
      ...p,
      price: p.price * (1 + (Math.random() - 0.5) * 0.15) // +/- 7.5% deviation
    }));
    paths.push(path);
  }

  return {
    fairValue: data.quantumPrice,
    delta: data.delta,
    gamma: data.gamma,
    bidAskSpread: data.bidAskSpread,
    classicalPrice: data.classicalPrice,
    quantumPrice: data.quantumPrice,
    confidence: data.confidence || 0.99,
    paths: paths,
    optimalPath: optimal,
    structuringNotes: data.structuringNotes,
    shariaCompliance: data.shariaCompliance
  };
};

export const generateTermSheetSummary = async (result: PricingResult, params: InstrumentParams): Promise<string> => {
   const model = "gemini-2.5-flash";
   const prompt = `
     Draft a concise Executive Summary for an Islamic Term Sheet based on these parameters:
     Instrument: ${params.type}
     Notional: ${params.notional} ${params.currency}
     Pricing (PV): ${result.quantumPrice}
     Key Clause: Unilateral Wa'd (Promise) from ${params.counterparty}
     
     Keep it professional, legalistic but readable. Max 150 words.
   `;

   const response = await ai.models.generateContent({
     model,
     contents: prompt,
   });

   return response.text || "Summary unavailable.";
}