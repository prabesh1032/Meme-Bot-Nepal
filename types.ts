export enum Tone {
  Satirical = 'Satirical',
  Motivational = 'Motivational',
  Sarcastic = 'Sarcastic',
  Relatable = 'Relatable',
  Political = 'Political',
  Cringe = 'Cringe',
}

export enum Platform {
  Facebook = 'Facebook',
  Tiktok = 'TikTok',
  Instagram = 'Instagram',
  Twitter = 'Twitter',
}

export enum Audience {
  Youth = 'Youth/GenZ',
  Professionals = 'Professionals',
  Students = 'Students',
  General = 'General Public',
  Diaspora = 'Nepali Diaspora',
}

export interface MemeTemplate {
  templateName: string;
  topText: string;
  bottomText: string;
  visualStyle: string;
  hashtags: string[];
}

export interface ReelsScript {
  concept: string;
  scenes: string[];
  dialogue: string;
  audioSuggestion: string;
  textOverlays: string;
}

export interface Captions {
  funny: string;
  relatable: string;
  deep: string;
}

export interface GeneratedIdea {
  title: string;
  memeTemplate: MemeTemplate;
  reelsScript: ReelsScript;
  captions: Captions;
}

export interface MemeResponse {
  ideas: GeneratedIdea[];
}

export interface FormData {
  topic: string;
  tone: Tone;
  platform: Platform;
  audience: Audience;
}