export type SkinType = 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  howToUse?: string;
  price: number;
  stock: number;
  category: Category;
  skinTypes: SkinType[];
  activeIngredients: string[];
  images: string[];
  isFeatured: boolean;
  rating: number;
}
