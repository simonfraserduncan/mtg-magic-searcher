
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCardById } from '@/services/searchService';
import { Card } from '@/types';
import Header from '@/components/Header';
import CardDetail from '@/components/CardDetail';
import { toast } from "@/components/ui/use-toast";

const CardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) {
        setError('Invalid card ID');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const cardData = await getCardById(id);
        if (cardData) {
          setCard(cardData);
          console.log("Card data loaded:", cardData);
        } else {
          setError('Card not found');
          toast({
            title: "Card not found",
            description: "We couldn't find the card you're looking for.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Failed to load card data');
        toast({
          title: "Error loading card",
          description: "There was a problem loading the card data. Please try again.",
          variant: "destructive"
        });
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
              <button 
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Back to search
              </button>
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
