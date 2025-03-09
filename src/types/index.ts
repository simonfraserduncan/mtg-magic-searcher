
export interface Card {
  id: string;
  name: string;
  manaCost?: string;
  cmc?: number;
  colors?: string[];
  colorIdentity?: string[];
  type: string;
  subtypes?: string[];
  rarity: string;
  set: string;
  text?: string;
  flavor?: string;
  artist?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  imageUrl?: string;
  price?: number;
}

export interface SearchQuery {
  term: string;
  filters?: SearchFilters;
  page: number;
  limit: number;
}

export interface SearchFilters {
  colors?: string[];
  types?: string[];
  rarity?: string[];
  cmc?: number[];
  sets?: string[];
}

export interface SearchResult {
  exactMatches: Card[];
  semanticMatches: Card[];
  totalResults: number;
}

export interface AutocompleteResult {
  suggestions: string[];
  cards: {
    id: string;
    name: string;
    imageUrl?: string;
  }[];
}

export type ManaColor = 'white' | 'blue' | 'black' | 'red' | 'green' | 'colorless';

export interface CardType {
  id: string;
  name: string;
}

export interface CardSet {
  id: string;
  name: string;
  code: string;
  releaseDate: string;
}

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'mythic';
