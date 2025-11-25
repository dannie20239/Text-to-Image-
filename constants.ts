import { AspectRatio } from './types';

export const APP_NAME = "Gemini Imagine";

export const ASPECT_RATIOS: { value: AspectRatio; label: string; icon: string }[] = [
  { value: '1:1', label: 'Square', icon: 'square' },
  { value: '16:9', label: 'Cinematic', icon: 'landscape' },
  { value: '9:16', label: 'Mobile', icon: 'portrait' },
  { value: '2:3', label: 'Portrait', icon: 'portrait_2_3' },
  { value: '1:2', label: 'Tall', icon: 'tall' },
];

export const SAMPLE_PROMPTS = [
  "A futuristic city made of transparent crystal at sunset, synthwave style",
  "A cute robot painting a canvas in a field of sunflowers",
  "Cyberpunk street food vendor in Tokyo, neon lights, rain, high detail",
  "A magical library floating in the clouds with flying books",
];