export interface GeneratedImage {
  id: string;
  prompt: string;
  base64Url: string;
  timestamp: number;
  aspectRatio: string;
}

export type AspectRatio = '1:1' | '1:2' | '2:3' | '9:16' | '16:9';

export interface GenerationConfig {
  aspectRatio: AspectRatio;
}

export interface AppState {
  isGenerating: boolean;
  currentImage: GeneratedImage | null;
  history: GeneratedImage[];
  error: string | null;
}