
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCardById } from '@/services/searchService';
import { Card } from '@/types';
import Header from '@/components/Header';
import CardDetail from '@/components/CardDetail';

const CardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const cardData = await getCardById(id);
        if (cardData) {
          setCard(cardData);
        } else {
          setError('Card not found');
        }
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Failed to load card data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        {isLoading ? (
          <div className="container max-w-6xl mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading card details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="container max-w-6xl mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">😢</span>
              </div>
              <h2 className="text-2xl font-medium mb-2">Error Loading Card</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : card ? (
          <CardDetail card={card} />
        ) : null}
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

export default CardPage;
