/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductShade {
  name: string;
  hex: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'skincare' | 'makeup' | 'fragrance';
  subcategory: string;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  longDescription: string;
  image: string;
  benefits: string[];
  ingredientsList: string[];
  howToUse: string;
  shades?: ProductShade[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedShade?: ProductShade;
}

export interface CosmeticIngredient {
  name: string;
  category: string;
  benefit: string;
  description: string;
  safetyRating: 'Excellent' | 'Good' | 'Fair';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
