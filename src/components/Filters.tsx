
import { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check, X } from 'lucide-react';
import { SearchFilters, ManaColor, CardType, CardRarity } from '@/types';

interface FiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

// Mock data for filters
const MANA_COLORS: { id: ManaColor; name: string }[] = [
  { id: 'white', name: 'White' },
  { id: 'blue', name: 'Blue' },
  { id: 'black', name: 'Black' },
  { id: 'red', name: 'Red' },
  { id: 'green', name: 'Green' },
  { id: 'colorless', name: 'Colorless' }
];

const CARD_TYPES: CardType[] = [
  { id: 'creature', name: 'Creature' },
  { id: 'instant', name: 'Instant' },
  { id: 'sorcery', name: 'Sorcery' },
  { id: 'artifact', name: 'Artifact' },
  { id: 'enchantment', name: 'Enchantment' },
  { id: 'planeswalker', name: 'Planeswalker' },
  { id: 'land', name: 'Land' }
];

const RARITIES: { id: CardRarity; name: string }[] = [
  { id: 'common', name: 'Common' },
  { id: 'uncommon', name: 'Uncommon' },
  { id: 'rare', name: 'Rare' },
  { id: 'mythic', name: 'Mythic' }
];

const Filters = ({ onFiltersChange, initialFilters }: FiltersProps) => {
  const defaultFilters: SearchFilters = {
    colors: [],
    types: [],
    rarity: [],
    cmc: [0, 15],
    sets: []
  };
  
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || defaultFilters);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSection(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const toggleFilter = <T extends keyof SearchFilters>(
    type: T, 
    value: SearchFilters[T] extends Array<infer U> ? U : never
  ) => {
    setFilters(prev => {
      const currentValues = prev[type] as any[] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
        
      return {
        ...prev,
        [type]: newValues
      };
    });
  };
  
  const handleReset = () => {
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };
  
  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? null : section);
  };
  
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);
  
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.colors?.length) count += filters.colors.length;
    if (filters.types?.length) count += filters.types.length;
    if (filters.rarity?.length) count += filters.rarity.length;
    if (filters.sets?.length) count += filters.sets.length;
    return count;
  };
  
  const activeCount = getActiveFilterCount();
  
  return (
    <div className="relative" ref={filtersRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center space-x-2 py-2 px-3 rounded-lg
          ${isOpen || activeCount > 0 
            ? 'bg-primary/10 text-primary border-primary/30' 
            : 'bg-card/70 hover:bg-card/90 border-border/80'
          } border transition-colors`}
      >
        <Filter className="w-4 h-4" />
        <span className="font-medium">Filters</span>
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            {activeCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute z-30 mt-2 p-3 bg-card/95 backdrop-blur-md rounded-xl border border-border/80 shadow-lg w-72 sm:w-96 animate-scale-in">
          <div className="flex items-center justify-between pb-2 border-b border-border/80">
            <h3 className="font-semibold">Filters</h3>
            <button
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Reset all
            </button>
          </div>
          
          <div className="space-y-1 mt-2">
            {/* Colors filter */}
            <FilterSection 
              title="Colors" 
              isActive={activeSection === 'colors'}
              onClick={() => toggleSection('colors')}
              activeCount={filters.colors?.length || 0}
            >
              <div className="grid grid-cols-3 gap-2 pt-2">
                {MANA_COLORS.map(color => (
                  <button
                    key={color.id}
                    onClick={() => toggleFilter('colors', color.id)}
                    className={`flex items-center justify-center space-x-1 p-1.5 rounded-md border transition-colors ${
                      filters.colors?.includes(color.id)
                        ? `bg-${color.id} text-${color.id}-foreground border-${color.id}`
                        : 'bg-card border-border/60 hover:bg-accent/50'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-${color.id} border border-${color.id}-foreground/20`} />
                    <span className="text-sm">{color.name}</span>
                  </button>
                ))}
              </div>
            </FilterSection>
            
            {/* Card Types filter */}
            <FilterSection 
              title="Card Types" 
              isActive={activeSection === 'types'}
              onClick={() => toggleSection('types')}
              activeCount={filters.types?.length || 0}
            >
              <div className="grid grid-cols-2 gap-2 pt-2">
                {CARD_TYPES.map(type => (
                  <CheckboxItem
                    key={type.id}
                    label={type.name}
                    checked={filters.types?.includes(type.id) || false}
                    onChange={() => toggleFilter('types', type.id)}
                  />
                ))}
              </div>
            </FilterSection>
            
            {/* Rarity filter */}
            <FilterSection 
              title="Rarity" 
              isActive={activeSection === 'rarity'}
              onClick={() => toggleSection('rarity')}
              activeCount={filters.rarity?.length || 0}
            >
              <div className="grid grid-cols-2 gap-2 pt-2">
                {RARITIES.map(rarity => (
                  <CheckboxItem
                    key={rarity.id}
                    label={rarity.name}
                    checked={filters.rarity?.includes(rarity.id) || false}
                    onChange={() => toggleFilter('rarity', rarity.id)}
                  />
                ))}
              </div>
            </FilterSection>
          </div>
          
          <div className="flex justify-end mt-4 pt-2 border-t border-border/80">
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveSection(null);
              }}
              className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  activeCount: number;
}

const FilterSection = ({ title, children, isActive, onClick, activeCount }: FilterSectionProps) => {
  return (
    <div className="border border-border/60 rounded-lg overflow-hidden transition-all duration-200">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-2.5 text-left transition-colors hover:bg-accent/30"
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium">{title}</span>
          {activeCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-medium">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isActive ? 'max-h-96 p-2' : 'max-h-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const CheckboxItem = ({ label, checked, onChange }: CheckboxItemProps) => {
  return (
    <label className="flex items-center space-x-2 p-1.5 rounded hover:bg-accent/30 cursor-pointer">
      <div
        className={`w-4 h-4 flex items-center justify-center rounded border ${
          checked
            ? 'bg-primary border-primary text-white'
            : 'border-muted-foreground/30'
        }`}
        onClick={(e) => {
          e.preventDefault();
          onChange();
        }}
      >
        {checked && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
      <span className="text-sm">{label}</span>
    </label>
  );
};

export default Filters;
