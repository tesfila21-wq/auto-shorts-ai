
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ScriptData } from "../types";

const API_KEY = process.env.API_KEY || "";

// Utility for robust API calling with retry logic for transient proxy errors
async function callWithRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error?.message?.includes('500') || error?.message?.includes('xhr'))) {
      console.warn(`Retrying API call due to error: ${error.message}. Retries left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return callWithRetry(fn, retries - 1);
    }
    throw error;
  }
}

// Audio helpers as required by Gemini Live/TTS API guidelines
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateScript = async (niche: string): Promise<ScriptData> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a high-quality YouTube Shorts script for the niche: ${niche}. 
      Ensure it has a powerful hook, engaging main content, and a smooth ending. 
      Also provide relevant keywords.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            mainContent: { type: Type.STRING },
            ending: { type: Type.STRING },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["hook", "mainContent", "ending", "keywords"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    const totalText = `${data.hook || ""} ${data.mainContent || ""} ${data.ending || ""}`;
    const wordCount = totalText.split(/\s+/).length;
    const estimatedDuration = Math.ceil(wordCount / 2.5);

    return { ...data, estimatedDuration };
  });
};

export const generateScenePrompts = async (script: ScriptData): Promise<string[]> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Target 8 to 10 images based on the script length.
    // For standard shorts (15-60s), we adjust the frequency to land in that range.
    let sceneCount = 9; // Default target
    if (script.estimatedDuration < 20) {
      sceneCount = 8;
    } else if (script.estimatedDuration > 45) {
      sceneCount = 10;
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this script, generate EXACTLY ${sceneCount} distinct visual scene descriptions for a YouTube Short. 
      Script: Hook: ${script.hook} Content: ${script.mainContent} Ending: ${script.ending}.
      IMPORTANT rules for prompts:
      1. They must be purely visual.
      2. DO NOT include any text, letters, numbers, watermarks, or logos in the scenes.
      3. Focus on cinematic photography and dynamic actions.
      Output as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  });
};

export const generateImage = async (prompt: string, style: string): Promise<string> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const fullPrompt = `${style} style photo: ${prompt}. Cinematic lighting, 8k, photorealistic, vibrant colors. ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO NUMBERS, NO OVERLAYS, NO LOGOS, NO SIGNAGE. JUST THE VISUAL SCENE.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: [{ text: fullPrompt }] },
      config: {
        imageConfig: {
          aspectRatio: "9:16",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Gemini");
  });
};

export const generateSpeech = async (text: string, voiceName: string): Promise<string> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");
    
    return base64Audio; 
  });
};
