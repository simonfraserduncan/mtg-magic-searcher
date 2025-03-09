
import { Card, SearchQuery, SearchResult, AutocompleteResult } from '@/types';

// Mock data for demonstration
const MOCK_CARDS: Card[] = [
  {
    id: "1",
    name: "Lightning Bolt",
    manaCost: "{R}",
    cmc: 1,
    colors: ["Red"],
    colorIdentity: ["R"],
    type: "Instant",
    rarity: "common",
    set: "M10",
    text: "Lightning Bolt deals 3 damage to any target.",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=191089&type=card",
    price: 2.99
  },
  {
    id: "2",
    name: "Counterspell",
    manaCost: "{U}{U}",
    cmc: 2,
    colors: ["Blue"],
    colorIdentity: ["U"],
    type: "Instant",
    rarity: "uncommon",
    set: "7ED",
    text: "Counter target spell.",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=425807&type=card",
    price: 3.99
  },
  {
    id: "3",
    name: "Black Lotus",
    manaCost: "{0}",
    cmc: 0,
    colorIdentity: [],
    type: "Artifact",
    rarity: "rare",
    set: "LEA",
    text: "{T}, Sacrifice Black Lotus: Add three mana of any one color to your mana pool.",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=382866&type=card",
    price: 20000.00
  },
  {
    id: "4",
    name: "Tarmogoyf",
    manaCost: "{1}{G}",
    cmc: 2,
    colors: ["Green"],
    colorIdentity: ["G"],
    type: "Creature — Lhurgoyf",
    subtypes: ["Lhurgoyf"],
    rarity: "mythic",
    set: "FUT",
    text: "Tarmogoyf's power is equal to the number of card types among cards in all graveyards and its toughness is equal to that number plus 1.",
    power: "*",
    toughness: "*+1",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=425986&type=card",
    price: 50.00
  },
  {
    id: "5",
    name: "Wrath of God",
    manaCost: "{2}{W}{W}",
    cmc: 4,
    colors: ["White"],
    colorIdentity: ["W"],
    type: "Sorcery",
    rarity: "rare",
    set: "10E",
    text: "Destroy all creatures. They can't be regenerated.",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129808&type=card",
    price: 12.99
  },
  {
    id: "6",
    name: "Thoughtseize",
    manaCost: "{B}",
    cmc: 1,
    colors: ["Black"],
    colorIdentity: ["B"],
    type: "Sorcery",
    rarity: "rare",
    set: "THS",
    text: "Target player reveals their hand. You choose a nonland card from it. That player discards that card. You lose 2 life.",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=373632&type=card",
    price: 18.50
  },
  {
    id: "7",
    name: "Jace, the Mind Sculptor",
    manaCost: "{2}{U}{U}",
    cmc: 4,
    colors: ["Blue"],
    colorIdentity: ["U"],
    type: "Planeswalker — Jace",
    subtypes: ["Jace"],
    rarity: "mythic",
    set: "WWK",
    loyalty: "3",
    text: "+2: Look at the top card of target player's library. You may put that card on the bottom of that player's library.\n0: Draw three cards, then put two cards from your hand on top of your library in any order.\n−1: Return target creature to its owner's hand.\n−12: Exile all cards from target player's library, then that player shuffles their hand into their library.",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=195297&type=card",
    price: 90.00
  },
  {
    id: "8",
    name: "Sol Ring",
    manaCost: "{1}",
    cmc: 1,
    colorIdentity: [],
    type: "Artifact",
    rarity: "uncommon",
    set: "C21",
    text: "{T}: Add {C}{C}.",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=389684&type=card",
    price: 5.99
  },
  {
    id: "9",
    name: "Llanowar Elves",
    manaCost: "{G}",
    cmc: 1,
    colors: ["Green"],
    colorIdentity: ["G"],
    type: "Creature — Elf Druid",
    subtypes: ["Elf", "Druid"],
    rarity: "common",
    set: "DOM",
    power: "1",
    toughness: "1",
    text: "{T}: Add {G}.",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=450263&type=card",
    price: 0.99
  },
  {
    id: "10",
    name: "Path to Exile",
    manaCost: "{W}",
    cmc: 1,
    colors: ["White"],
    colorIdentity: ["W"],
    type: "Instant",
    rarity: "uncommon",
    set: "CON",
    text: "Exile target creature. Its controller may search their library for a basic land card, put that card onto the battlefield tapped, then shuffle their library.",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=179235&type=card",
    price: 7.50
  }
];

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Hybrid search function
export const searchCards = async (query: SearchQuery): Promise<SearchResult> => {
  console.log("Searching for:", query);
  
  // Simulate API delay
  await delay(800);
  
  const term = query.term.toLowerCase();
  
  // If no search term, return empty results
  if (!term) {
    return {
      exactMatches: [],
      semanticMatches: [],
      totalResults: 0
    };
  }
  
  // Filter based on search term - exact matches
  const exactMatches = MOCK_CARDS.filter(card => 
    card.name.toLowerCase().includes(term) || 
    (card.text?.toLowerCase().includes(term))
  );
  
  // Simulate semantic search with remaining cards that might be relevant
  // In a real implementation, this would use embeddings and vector search
  const semanticMatches = MOCK_CARDS.filter(card => 
    !exactMatches.includes(card) && (
      (term.includes("damage") && card.text?.toLowerCase().includes("damage")) ||
      (term.includes("counter") && card.text?.toLowerCase().includes("counter")) ||
      (term.includes("creature") && card.type.toLowerCase().includes("creature")) ||
      (term.includes("draw") && card.text?.toLowerCase().includes("draw")) ||
      (term.includes("mana") && card.text?.toLowerCase().includes("mana"))
    )
  );
  
  // Apply filters if any
  const applyFilters = (cards: Card[]) => {
    if (!query.filters) return cards;
    
    return cards.filter(card => {
      // Filter by colors
      if (query.filters.colors && query.filters.colors.length > 0) {
        const cardHasColor = card.colors?.some(color => 
          query.filters?.colors?.includes(color.toLowerCase())
        );
        if (!cardHasColor) return false;
      }
      
      // Filter by types
      if (query.filters.types && query.filters.types.length > 0) {
        const cardHasType = query.filters.types.some(type => 
          card.type.toLowerCase().includes(type.toLowerCase())
        );
        if (!cardHasType) return false;
      }
      
      // Filter by rarity
      if (query.filters.rarity && query.filters.rarity.length > 0) {
        if (!query.filters.rarity.includes(card.rarity.toLowerCase())) return false;
      }
      
      // Filter by mana cost
      if (query.filters.cmc && query.filters.cmc.length === 2) {
        const [min, max] = query.filters.cmc;
        if (card.cmc === undefined || card.cmc < min || card.cmc > max) return false;
      }
      
      // Filter by sets
      if (query.filters.sets && query.filters.sets.length > 0) {
        if (!query.filters.sets.includes(card.set.toLowerCase())) return false;
      }
      
      return true;
    });
  };
  
  const filteredExactMatches = applyFilters(exactMatches);
  const filteredSemanticMatches = applyFilters(semanticMatches);
  
  // Paginate results
  const paginatedExactMatches = filteredExactMatches.slice(
    (query.page - 1) * query.limit, 
    query.page * query.limit
  );
  
  const paginatedSemanticMatches = filteredSemanticMatches.slice(
    0, 
    Math.max(0, query.limit - paginatedExactMatches.length)
  );
  
  return {
    exactMatches: paginatedExactMatches,
    semanticMatches: paginatedSemanticMatches,
    totalResults: filteredExactMatches.length + filteredSemanticMatches.length
  };
};

// Autocomplete function
export const getAutocomplete = async (term: string): Promise<AutocompleteResult> => {
  // Simulate API delay
  await delay(300);
  
  const lowercaseTerm = term.toLowerCase();
  
  if (!lowercaseTerm) {
    return {
      suggestions: [],
      cards: []
    };
  }
  
  // Find matching cards
  const matchingCards = MOCK_CARDS
    .filter(card => card.name.toLowerCase().includes(lowercaseTerm))
    .slice(0, 5)
    .map(card => ({
      id: card.id,
      name: card.name,
      imageUrl: card.imageUrl
    }));
  
  // Generate suggestions
  const suggestions = [
    ...matchingCards.map(card => card.name),
    // Add some keyword suggestions
    ...(lowercaseTerm.includes("damage") ? ["damage to player", "damage to creature"] : []),
    ...(lowercaseTerm.includes("counter") ? ["counter target spell", "counter ability"] : []),
    ...(lowercaseTerm.includes("draw") ? ["draw cards", "card advantage"] : []),
    ...(lowercaseTerm.includes("destroy") ? ["destroy target creature", "destroy all"] : [])
  ].slice(0, 5);
  
  return {
    suggestions,
    cards: matchingCards
  };
};

// Fetch a single card by ID
export const getCardById = async (id: string): Promise<Card | null> => {
  // Simulate API delay
  await delay(500);
  
  const card = MOCK_CARDS.find(card => card.id === id);
  return card || null;
};

// Get similar cards (for recommendations)
export const getSimilarCards = async (cardId: string): Promise<Card[]> => {
  // Simulate API delay
  await delay(700);
  
  const card = MOCK_CARDS.find(card => card.id === cardId);
  
  if (!card) return [];
  
  // Find cards with similar characteristics
  const similarCards = MOCK_CARDS.filter(c => 
    c.id !== cardId && (
      (card.colors?.some(color => c.colors?.includes(color))) ||
      (card.type.includes(c.type)) ||
      (card.cmc === c.cmc)
    )
  );
  
  return similarCards.slice(0, 4);
};
