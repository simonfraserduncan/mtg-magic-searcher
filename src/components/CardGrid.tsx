
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/types';
import { useLazyImage, useHoverEffect } from '@/utils/animations';

interface CardGridProps {
  exactMatches: Card[];
  semanticMatches: Card[];
  isLoading: boolean;
  searchTerm: string;
}

const CardGrid = ({ exactMatches, semanticMatches, isLoading, searchTerm }: CardGridProps) => {
  return (
    <div className="w-full space-y-8">
      {isLoading ? (
        <LoadingGrid />
      ) : exactMatches.length === 0 && semanticMatches.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <>
          {exactMatches.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">
                Exact Matches <span className="text-sm text-muted-foreground">({exactMatches.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {exactMatches.map((card) => (
                  <CardItem key={card.id} card={card} />
                ))}
              </div>
            </div>
          )}
          
          {semanticMatches.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">
                Related Results <span className="text-sm text-muted-foreground">({semanticMatches.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {semanticMatches.map((card) => (
                  <CardItem key={card.id} card={card} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CardItem = ({ card }: { card: Card }) => {
  const { isHovered, hoverProps } = useHoverEffect();
  const { src, isLoaded, blurClass } = useLazyImage(
    card.imageUrl || '/placeholder.svg',
    '/placeholder.svg'
  );
  
  return (
    <Link
      to={`/card/${card.id}`}
      className="block animate-fade-in"
      {...hoverProps}
    >
      <div className="relative overflow-hidden rounded-lg card-shadow transition-all duration-300">
        <div className="aspect-[63/88] bg-muted/30 relative">
          <img
            src={src}
            alt={card.name}
            className={`w-full h-full object-cover transition-all duration-500 ${blurClass}`}
            loading="lazy"
          />
          
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        <div className={`absolute inset-x-0 bottom-0 p-2 glass transition-all duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="text-sm font-medium leading-tight line-clamp-1">{card.name}</div>
          <div className="flex items-center space-x-1 mt-0.5">
            <span className="text-xs opacity-80">{card.type}</span>
            {card.price && (
              <>
                <span className="text-xs opacity-50">•</span>
                <span className="text-xs text-accent-foreground/70">${card.price.toFixed(2)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const LoadingGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[63/88] rounded-lg bg-muted-foreground/10" />
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({ searchTerm }: { searchTerm: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted/30 flex items-center justify-center">
        <img
          src="/placeholder.svg"
          alt="No results"
          className="w-8 h-8 opacity-50"
        />
      </div>
      <h3 className="text-xl font-medium">No cards found</h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        {searchTerm
          ? `We couldn't find any cards matching "${searchTerm}". Try a different search term or adjust your filters.`
          : 'Start by searching for a card name, text, or concept.'}
      </p>
    </div>
  );
};

export default CardGrid;
