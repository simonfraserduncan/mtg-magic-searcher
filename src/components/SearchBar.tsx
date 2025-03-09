
import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { getAutocomplete } from '@/services/searchService';
import { AutocompleteResult } from '@/types';

interface SearchBarProps {
  onSearch: (term: string) => void;
  initialTerm?: string;
}

const SearchBar = ({ onSearch, initialTerm = '' }: SearchBarProps) => {
  const [term, setTerm] = useState(initialTerm);
  const [debouncedTerm] = useDebounce(term, 300);
  const [isFocused, setIsFocused] = useState(false);
  const [autocomplete, setAutocomplete] = useState<AutocompleteResult>({ suggestions: [], cards: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAutocomplete = async () => {
      if (debouncedTerm.length < 2) {
        setAutocomplete({ suggestions: [], cards: [] });
        return;
      }

      setIsLoading(true);
      try {
        const result = await getAutocomplete(debouncedTerm);
        setAutocomplete(result);
      } catch (error) {
        console.error('Failed to fetch autocomplete:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutocomplete();
  }, [debouncedTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTerm(suggestion);
    onSearch(suggestion);
    setIsFocused(false);
  };

  const handleClear = () => {
    setTerm('');
    inputRef.current?.focus();
  };

  const showAutocomplete = isFocused && 
    (autocomplete.suggestions.length > 0 || autocomplete.cards.length > 0);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className={`w-5 h-5 ${isLoading ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for cards, abilities, or strategies..."
            className="w-full h-14 pl-10 pr-24 bg-card/80 dark:bg-card/40 backdrop-blur-sm rounded-xl border border-border/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300"
          />
          
          {term && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-16 flex items-center px-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={!term.trim()}
            className={`absolute inset-y-0 right-3 flex items-center px-3 rounded-lg ${
              term.trim() 
                ? 'text-primary hover:text-primary/80' 
                : 'text-muted-foreground'
            } transition-colors`}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
      
      {showAutocomplete && (
        <div 
          ref={autocompleteRef}
          className="absolute z-10 mt-2 w-full bg-card/90 backdrop-blur-md rounded-xl border border-border/80 shadow-lg overflow-hidden animate-scale-in"
        >
          {autocomplete.cards.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                Cards
              </div>
              <div className="space-y-1">
                {autocomplete.cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleSuggestionClick(card.name)}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors text-left"
                  >
                    {card.imageUrl ? (
                      <div className="w-8 h-8 rounded overflow-hidden bg-muted/30 flex-shrink-0">
                        <img 
                          src={card.imageUrl} 
                          alt={card.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-primary font-medium">Card</span>
                      </div>
                    )}
                    <span className="flex-1 truncate">{card.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {autocomplete.suggestions.length > 0 && (
            <div className="p-2 border-t border-border/60">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                Suggestions
              </div>
              <div className="space-y-1">
                {autocomplete.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
