export interface ProjectWebsite {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  category: 'AI Platform' | 'Community' | 'Emotional AI' | 'Knowledge & Quiz' | 'Autonomous AI';
  crownTitle: string;
  crownType: 'obsidian' | 'crimson' | 'void' | 'arcane' | 'solar';
  tagline: string;
  description: string;
  journalEntry: string;
  technologies: string[];
  features: string[];
  status: 'Live & Operational' | 'Active Vercel Deployment';
  accentColor: string;
  sigil: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  entryNumber: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
}

export interface RockFragment {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  opacity: number;
  color: string;
  shape: 'polygon' | 'shard' | 'ember';
  polygonPoints?: string;
}

export interface SoundScapeState {
  isPlaying: boolean;
  volume: number;
  engagementLevel: number; // 0 to 100
  preset: 'crypt_drone' | 'abyssal_winds' | 'ember_hearth';
}
