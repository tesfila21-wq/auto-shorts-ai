
export enum Step {
  Auth = 'AUTH',
  Welcome = 'WELCOME',
  NicheSelection = 'NICHE_SELECTION',
  ScriptGeneration = 'SCRIPT_GENERATION',
  ImageGenerator = 'IMAGE_GENERATOR',
  VoiceGenerator = 'VOICE_GENERATOR',
  Download = 'DOWNLOAD'
}

export interface User {
  email: string;
  isCreator: boolean;
  credits: number;
  isPremium: boolean;
}

export interface ScriptData {
  hook: string;
  mainContent: string;
  ending: string;
  keywords: string[];
  estimatedDuration: number; // in seconds
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface VoiceData {
  audioUrl?: string;
  voiceName: string;
  speed: number;
  duration?: number; // actual audio duration in seconds
}

export interface Niche {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type ImageStyle = 'Realistic' | 'Cartoon' | '3D' | 'Minimal' | 'Aesthetic' | 'Urban' | 'Neon' | 'Cinematic';
