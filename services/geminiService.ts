import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

// Helper to get a fresh client instance with the current key
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
  if (!originalPrompt.trim()) return "";
  
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert photographic prompt engineer and Pinterest content strategist. Your goal is to rewrite the user's prompt to generate an EXTREMELY PHOTOREALISTIC image that looks like a high-end, trending Pin.

      Guidelines:
      1. PINTEREST VISUAL ANALYSIS: Make sure to include this: Pinterest Visual Analysis - Based on analysis of top performing pins:- Overall Aesthetic, Dominant Colors, Common Objects/Products. Use this analysis to enhance the composition, lighting, and styling of the image description.
      2. REALISM & QUALITY: Add keywords for "RAW photo", "8k uhd", "film grain", "natural skin texture", "imperfections", "soft natural lighting", "dof", "fujifilm", "realistic", "500 dpi", "high pixel density", "sharp focus".
      3. TEXT: If the prompt includes text/quotes (e.g. 'sign says "Hello"'), ensure the rewritten prompt explicitly specifies: 'text: "Hello"' and describes the font/typography clearly and legibly.
      4. OUTPUT: Return ONLY the enhanced prompt text.

      Original prompt: "${originalPrompt}"`,
    });
    return response.text?.trim() || originalPrompt;
  } catch (error) {
    console.error("Prompt Enhancement Error:", error);
    // Return original prompt if enhancement fails so flow isn't broken
    return originalPrompt;
  }
};

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  try {
    const ai = getAIClient();
    
    // API does not strictly support '1:2'. Map to nearest supported aspect ratio '9:16'.
    const apiAspectRatio = aspectRatio === '1:2' ? '9:16' : aspectRatio;

    // Use gemini-2.5-flash-image for standard access and high reliability
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: apiAspectRatio,
        },
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API");
    }

    const content = response.candidates[0].content;
    
    // Iterate through parts to find the image
    if (content?.parts) {
      for (const part of content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};