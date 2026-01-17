
import { Niche } from './types';

export const NICHES: Niche[] = [
  { id: 'motivation', name: 'Motivation', icon: 'fa-fire', color: 'bg-orange-500' },
  { id: 'tech', name: 'Tech Facts', icon: 'fa-microchip', color: 'bg-blue-500' },
  { id: 'health', name: 'Health Tips', icon: 'fa-heart-pulse', color: 'bg-green-500' },
  { id: 'fun-facts', name: 'Fun Facts', icon: 'fa-lightbulb', color: 'bg-yellow-500' },
  { id: 'business', name: 'Business', icon: 'fa-briefcase', color: 'bg-indigo-500' },
  { id: 'celebrity', name: 'Celebrity Stories', icon: 'fa-star', color: 'bg-purple-500' },
  { id: 'educational', name: 'Educational', icon: 'fa-book-open', color: 'bg-teal-500' },
  { id: 'true-crime', name: 'True Crime', icon: 'fa-mask', color: 'bg-red-900' },
];

export const IMAGE_STYLES: string[] = [
  'Realistic', 'Cartoon', '3D', 'Minimal', 'Aesthetic', 'Urban', 'Neon', 'Cinematic'
];

export const VOICES = [
  { id: 'Kore', name: 'Kore (Energetic)', gender: 'Male' },
  { id: 'Puck', name: 'Puck (Youthful)', gender: 'Male' },
  { id: 'Charon', name: 'Charon (Deep)', gender: 'Male' },
  { id: 'Fenrir', name: 'Fenrir (Robotic)', gender: 'Neutral' },
  { id: 'Zephyr', name: 'Zephyr (Professional)', gender: 'Female' },
];
