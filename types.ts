export type FabricType = 'Cotton' | 'Linen' | 'Silk' | 'Wool' | 'Denim' | 'Polyester' | 'Velvet' | 'Leather';
export type ClothingStyle = 'T-Shirt' | 'Hoodie' | 'Dress' | 'Blazer' | 'Shirt' | 'Skirt' | 'Trousers' | 'Coat';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type FitType = 'Slim Fit' | 'Regular Fit' | 'Loose/Oversized' | 'Tailored';

export interface SelectionItem {
  id: string;
  name: string;
  image: string;
}

export interface Measurements {
  bust: number; // in cm
  hips: number; // in cm
  gender: 'Male' | 'Female';
}

export interface DesignState {
  fabric: SelectionItem | null;
  style: SelectionItem | null;
  size: Size | null;
  measurements: Measurements;
  fit: FitType | null;
}

export interface GeneratedImages {
  front: string | null;
  side: string | null;
  back: string | null;
  price?: number;
}

// Ensure global window augmentation for AI Studio key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
