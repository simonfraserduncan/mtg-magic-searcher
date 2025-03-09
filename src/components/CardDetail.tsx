
import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Share2, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card as CardType } from '@/types';
import { useLazyImage, useInView } from '@/utils/animations';
import { getSimilarCards } from '@/services/searchService';

interface CardDetailProps {
  card: CardType;
}

const CardDetail = ({ card }: CardDetailProps) => {
  const [similarCards, setSimilarCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const { src, isLoaded } = useLazyImage(
    card.imageUrl || '/placeholder.svg',
    '/placeholder.svg'
  );

  useEffect(() => {
    const fetchSimilarCards = async () => {
      try {
        const cards = await getSimilarCards(card.id);
        setSimilarCards(cards);
      } catch (error) {
        console.error('Failed to load similar cards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarCards();
  }, [card.id]);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 mb-6 py-2 px-4 text-sm rounded-lg hover:bg-accent/50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Search</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div
            ref={ref}
            className={`sticky top-24 transition-opacity duration-700 ${
              isInView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative aspect-[63/88] rounded-xl overflow-hidden shadow-xl">
              <img
                src={src}
                alt={card.name}
                className={`w-full h-full object-cover ${
                  isLoaded ? '' : 'blur-sm'
                } transition-all duration-500`}
              />

              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
                  <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="flex justify-between mt-4">
              <button className="flex items-center space-x-1 py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Save</span>
              </button>

              <button className="flex items-center space-x-1 py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {card.colors?.map((color) => (
                <span
                  key={color}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color.toLowerCase()}/10 text-${color.toLowerCase()} border border-${color.toLowerCase()}/20`}
                >
                  {color}
                </span>
              ))}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {card.rarity}
              </span>
            </div>

            <h1 className="text-3xl font-bold">{card.name}</h1>
            <p className="text-lg text-muted-foreground">{card.type}</p>

            {card.manaCost && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Mana Cost:</span>
                <span className="text-sm">{card.manaCost}</span>
              </div>
            )}
          </div>

          {card.text && (
            <div className="p-4 bg-card rounded-lg border border-border/80 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Card Text</h3>
              <p className="whitespace-pre-line">{card.text}</p>
            </div>
          )}

          {card.flavor && (
            <div className="p-4 bg-muted/30 rounded-lg border border-border/60">
              <p className="italic text-muted-foreground text-sm">{card.flavor}</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {card.power && card.toughness && (
              <div className="p-3 bg-card rounded-lg border border-border/80">
                <h3 className="text-xs font-medium text-muted-foreground mb-1">Power/Toughness</h3>
                <p className="text-lg font-medium">
                  {card.power}/{card.toughness}
                </p>
              </div>
            )}

            {card.loyalty && (
              <div className="p-3 bg-card rounded-lg border border-border/80">
                <h3 className="text-xs font-medium text-muted-foreground mb-1">Loyalty</h3>
                <p className="text-lg font-medium">{card.loyalty}</p>
              </div>
            )}

            <div className="p-3 bg-card rounded-lg border border-border/80">
              <h3 className="text-xs font-medium text-muted-foreground mb-1">Set</h3>
              <p className="text-lg font-medium">{card.set}</p>
            </div>

            {card.artist && (
              <div className="p-3 bg-card rounded-lg border border-border/80">
                <h3 className="text-xs font-medium text-muted-foreground mb-1">Artist</h3>
                <p className="text-lg font-medium">{card.artist || 'Unknown'}</p>
              </div>
            )}

            {card.price && (
              <div className="p-3 bg-card rounded-lg border border-border/80">
                <h3 className="text-xs font-medium text-muted-foreground mb-1">Price</h3>
                <p className="text-lg font-medium">${card.price.toFixed(2)}</p>
              </div>
            )}
          </div>

          {similarCards.length > 0 && (
            <div className="pt-6 mt-8 border-t border-border/60">
              <h2 className="text-xl font-medium mb-4">Similar Cards</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {similarCards.map((similarCard) => (
                  <Link
                    key={similarCard.id}
                    to={`/card/${similarCard.id}`}
                    className="block group"
                  >
                    <div className="aspect-[63/88] rounded-lg overflow-hidden bg-muted/30 shadow-sm hover:shadow-md transition-all duration-300">
                      {similarCard.imageUrl ? (
                        <img
                          src={similarCard.imageUrl}
                          alt={similarCard.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/50 text-center p-2">
                          <span className="text-sm">{similarCard.name}</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium line-clamp-1">{similarCard.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
