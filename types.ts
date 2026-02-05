export interface LinkItem {
  id: string;
  name: string;
  url: string;
  icon?: string; // Optional emoji or icon identifier
}

export interface Category {
  id: string;
  title: string;
  color: string; // Tailwind color class reference (e.g., 'emerald', 'blue')
  items: LinkItem[];
}

export type AppData = Category[];

export interface NoteState {
  content: string;
}

export type CardDensity = 'compact' | 'normal' | 'relaxed';

export interface LayoutSettings {
  columns: number; // 2, 3, 4, 5
  density: CardDensity;
}