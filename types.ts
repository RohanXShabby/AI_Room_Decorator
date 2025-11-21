export enum RoomStyle {
  GEN_Z = 'Gen Z',
  COLORFUL = 'Colorful',
  MINIMALIST = 'Minimalist',
  LUXURY = 'Luxury',
  DARK = 'Dark',
  COOL = 'Cool Tone',
  WARM = 'Warm Tone',
  MODERN = 'Modern',
  OLD_AESTHETIC = 'Old Aesthetic',
  FUTURISTIC = 'Futuristic',
  GAMER_TECH = 'Gamer Tech',
  INDUSTRIAL = 'Industrial',
  BOHEMIAN = 'Bohemian',
  SCANDINAVIAN = 'Scandinavian'
}

export interface GenerationState {
  originalImage: string | null;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface CostItem {
  item: string;
  cost: string;
}

export interface BudgetTier {
  tierName: string;
  description: string;
  items: CostItem[];
  total: string;
}

export interface CostEstimationResult {
  luxury: BudgetTier;
  affordable: BudgetTier;
}