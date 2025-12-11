import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FormData, MemeResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are "MemeBot Nepal", an expert in Nepali meme culture, social media trends, and viral content creation. 
Your knowledge is deep and authentic.

**Your Cultural Context Knowledge:**
- Famous Templates: "Bahun/Bahuney jokes", "Load-shedding nostalgia", "Kathmandu vs. Outside valley", "Dhulo/Pollution in KTM", "Bihe/Marriage pressure", "Exam stress", "MOMO supremacy", "Public Bus conductors".
- Language: Authentic mix of Nepali (Devanagari or Romanized), English, and "Tanglish" (e.g., "Bro le k bhaneko yesto", "Cringey parale").
- References: Local politicians (Balen, Rabi, old netas), viral tiktokers, classic Nepali movie dialogues ("Harke Halwo", "Kabbadi").

**Your Task:**
Generate 3 distinct content ideas based on the user's input parameters. 
Ensure the humor is culturally relevant to Nepal. 
Use Romanized Nepali for dialogue/text to make it readable for a wider web audience, but you can include Devanagari in parentheses if it adds flavor.

**Output Requirement:**
You MUST return the response in strict JSON format matching the schema provided. 
Do not include markdown code blocks in the output string (e.g., no \`\`\`json). Just the raw JSON object.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    ideas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy title for this specific meme idea" },
          memeTemplate: {
            type: Type.OBJECT,
            properties: {
              templateName: { type: Type.STRING },
              topText: { type: Type.STRING, description: "Mix of English/Nepali" },
              bottomText: { type: Type.STRING, description: "Punchline in authentic Nepali humor" },
              visualStyle: { type: Type.STRING, description: "Detailed description of the image content, facial expressions, and setting" },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["templateName", "topText", "bottomText", "visualStyle", "hashtags"],
          },
          reelsScript: {
            type: Type.OBJECT,
            properties: {
              concept: { type: Type.STRING },
              scenes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step by step scene breakdown" },
              dialogue: { type: Type.STRING, description: "Dialogue in Nepali (Romanized preferred)" },
              audioSuggestion: { type: Type.STRING },
              textOverlays: { type: Type.STRING },
            },
            required: ["concept", "scenes", "dialogue", "audioSuggestion", "textOverlays"],
          },
          captions: {
            type: Type.OBJECT,
            properties: {
              funny: { type: Type.STRING },
              relatable: { type: Type.STRING },
              deep: { type: Type.STRING },
            },
            required: ["funny", "relatable", "deep"],
          },
        },
        required: ["title", "memeTemplate", "reelsScript", "captions"],
      },
    },
  },
  required: ["ideas"],
};

export const generateMemeIdeas = async (formData: FormData): Promise<MemeResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Generate viral Nepali content ideas based on:
    Topic: ${formData.topic}
    Tone: ${formData.tone}
    Platform: ${formData.platform}
    Target Audience: ${formData.audience}
    
    Make it highly engaging, culturally accurate, and funny.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.8, // Slightly high for creativity
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini.");
    }

    return JSON.parse(text) as MemeResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateMemeImage = async (visualDescription: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Enhanced prompt for meme-style aesthetics
  const prompt = `
    Generate a high-quality, funny internet meme template image without text.
    
    Visual Description: ${visualDescription}
    
    Style Guidelines:
    - Art Style: Digital art or realistic stock photo style common in viral memes.
    - Facial Expressions: Extremely exaggerated, dramatic, and emotive (funny, shocked, disappointed, or sarcastic) to match the humor.
    - Lighting: Clear, bright, and focused on the subject.
    - Composition: Center the subject with space at the top and bottom for text overlays.
    
    IMPORTANT: Do NOT include any text, words, or letters inside the image itself. It must be a blank template.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};