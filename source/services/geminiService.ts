
import { GoogleGenAI, Type } from "@google/genai";
import { BowlingBall, CoverstockType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMaintenanceAdvice = async (ball: BowlingBall) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me 3 expert maintenance tips for a bowling ball with these specs:
      Brand: ${ball.brand}
      Name: ${ball.name}
      Coverstock: ${ball.coverstock}
      Current Surface: ${ball.surfaceFinish}
      Total Games: ${ball.totalGames}
      
      Suggest specific cleaning intervals and surface adjustments if the lanes are heavy oil.`,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tip: { type: Type.STRING },
              rationale: { type: Type.STRING }
            },
            required: ["tip", "rationale"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};
