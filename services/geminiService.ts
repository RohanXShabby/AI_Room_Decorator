import { GoogleGenAI } from "@google/genai";
import { cleanBase64 } from "../utils/imageUtils";
import { CostEstimationResult } from "../types";

// Initialize the client. API key is expected in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRoomRedesign = async (
  imageBase64: string,
  style: string,
  additionalPrompt: string = ""
): Promise<string> => {
  try {
    const model = "gemini-2.5-flash-image"; 

    const promptText = `
      Generate a photorealistic image of this room redesign with a "${style}" interior design style.
      
      Instructions:
      - You must generate an image. Do not output text.
      - Maintain the exact structural perspective and geometry (walls, windows, doors, ceiling) of the original image.
      - Replace the furniture, decor, flooring, and wall finishes to strictly match the "${style}" aesthetic.
      ${additionalPrompt ? `- User requirement: ${additionalPrompt}` : ""}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64(imageBase64),
            },
          },
          {
            text: promptText,
          },
        ],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content received from Gemini.");
    }

    let generatedImageBase64 = "";

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!generatedImageBase64) {
        const textPart = parts.find(p => p.text)?.text;
        // If the model gets chatty, we throw a specific error, but the new prompt should prevent this.
        if (textPart) {
             throw new Error(`Model returned text instead of image. Please try again or simplify the prompt.`);
        }
        throw new Error("No image data found in response.");
    }

    return `data:image/jpeg;base64,${generatedImageBase64}`;

  } catch (error) {
    console.error("Error generating room redesign:", error);
    throw error;
  }
};

export const estimateRenovationCost = async (
  imageBase64: string,
  location: string,
  currency: string
): Promise<CostEstimationResult> => {
  try {
    const model = "gemini-2.5-flash"; 

    const promptText = `
      Act as a professional interior design estimator.
      Analyze the interior design shown in this image.
      
      Context:
      - User Location: ${location}
      - Currency: ${currency}
      
      Task:
      1. Identify key furniture, decor, and materials visible in the image.
      2. Create TWO separate cost estimates based on the market in ${location}:
         a) "Luxury" (High-End/Premium brands & materials)
         b) "Affordable" (Budget-friendly/IKEA/DIY alternatives)
      
      Output strictly valid JSON (no markdown backticks) with this structure. 
      IMPORTANT: 'cost' and 'total' fields must be NUMERIC STRINGS ONLY (e.g. "3000", not "$3,000" or "3000 USD"). The UI will handle currency formatting.
      
      {
        "luxury": {
          "tierName": "High Quality / Luxury",
          "description": "Brief summary of the premium approach.",
          "items": [
            { "item": "Sofa (Premium Leather)", "cost": "3000" },
            { "item": "Coffee Table (Solid Oak)", "cost": "800" }
          ],
          "total": "15000"
        },
        "affordable": {
          "tierName": "Low Cost / Affordable",
          "description": "Brief summary of the budget-friendly approach.",
          "items": [
            { "item": "Sofa (Fabric)", "cost": "500" },
            { "item": "Coffee Table (Veneer)", "cost": "100" }
          ],
          "total": "2500"
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: promptText,
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64(imageBase64),
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("Could not generate cost estimation.");
    }

    // Clean markdown just in case the model adds it despite responseMimeType
    const jsonString = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString) as CostEstimationResult;

  } catch (error) {
    console.error("Error estimating cost:", error);
    throw error;
  }
};