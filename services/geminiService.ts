
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ShoppingItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const imageGenerationModel = 'gemini-2.5-flash-image';
const chatModel = 'gemini-2.5-flash';

export const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const base64ToGenerativePart = (base64: string, mimeType: string) => {
    return {
        inlineData: { data: base64, mimeType: mimeType },
    };
};

export const generateImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: imageGenerationModel,
            contents: {
                parts: [
                    base64ToGenerativePart(base64Image, mimeType),
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data found in response");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. Please try again.");
    }
};

export const getShoppableLinks = async (base64Image: string, mimeType: string, userPrompt: string): Promise<ShoppingItem[]> => {
    const prompt = `Based on the provided image of a room and the user's request ("${userPrompt}"), identify 3 key furniture or decor items visible. For each item, provide a plausible item name, a short description, an estimated price, and a fictional but realistic-looking shoppable URL from a popular online retailer.`;
    
    try {
        const response = await ai.models.generateContent({
            model: chatModel,
            contents: {
                parts: [
                    base64ToGenerativePart(base64Image, mimeType),
                    { text: prompt },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            itemName: { type: Type.STRING },
                            description: { type: Type.STRING },
                            price: { type: Type.STRING },
                            purchaseUrl: { type: Type.STRING },
                        },
                        required: ["itemName", "description", "price", "purchaseUrl"],
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        const items: ShoppingItem[] = JSON.parse(jsonStr);
        return items;

    } catch (error) {
        console.error("Error getting shoppable links:", error);
        throw new Error("Failed to find shoppable items. Please try a different query.");
    }
};
