
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import Filters from '@/components/Filters';
import CardGrid from '@/components/CardGrid';
import { SearchQuery, SearchFilters, SearchResult } from '@/types';
import { searchCards } from '@/services/searchService';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    term: queryParams.get('q') || '',
    page: Number(queryParams.get('page')) || 1,
    limit: 20,
    filters: {}
  });
  
  const [searchResults, setSearchResults] = useState<SearchResult>({
    exactMatches: [],
    semanticMatches: [],
    totalResults: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery.term) return;
      
      setIsLoading(true);
      setHasSearched(true);
      
      try {
        const results = await searchCards(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchQuery.term) params.set('q', searchQuery.term);
    if (searchQuery.page > 1) params.set('page', searchQuery.page.toString());
    
    const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl, { replace: true });
  }, [searchQuery, navigate, location.pathname]);
  
  const handleSearch = (term: string) => {
    setSearchQuery(prev => ({
      ...prev,
      term,
      page: 1
    }));
  };
  
  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchQuery(prev => ({
      ...prev,
      filters,
      page: 1
    }));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 animate-slide-down">
              Find the Perfect MTG Cards
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-down" style={{ animationDelay: '100ms' }}>
              Search for cards by name, text, or strategy using our advanced hybrid search system
            </p>
            
            <div className="mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <SearchBar 
                onSearch={handleSearch} 
                initialTerm={searchQuery.term} 
              />
            </div>
            
            {hasSearched && (
              <div className="flex justify-center mb-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Filters 
                  onFiltersChange={handleFiltersChange} 
                  initialFilters={searchQuery.filters} 
                />
              </div>
            )}
          </div>
          
          {hasSearched && (
            <CardGrid 
              exactMatches={searchResults.exactMatches}
              semanticMatches={searchResults.semanticMatches}
              isLoading={isLoading}
              searchTerm={searchQuery.term}
            />
          )}
          
          {!hasSearched && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/5 flex items-center justify-center animate-float">
                <img 
                  src="/placeholder.svg" 
                  alt="Search illustration" 
                  className="w-12 h-12 opacity-60"
                />
              </div>
              <h2 className="text-2xl font-medium mb-2">Ready to discover cards?</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Search by card name, text, abilities, or even strategy concepts.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-8 border-t border-border/60">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>MTG Companion App - A powerful card search and deck building tool</p>
          <p className="mt-1">This application is not affiliated with Wizards of the Coast</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
