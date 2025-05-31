import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRandomQuote, useAddToFavorites, useUpdateStats, useStats } from "@/hooks/use-quotes";
import { createWallpaper, downloadImage } from "@/lib/canvas";
import { useToast } from "@/hooks/use-toast";
import { ShareModal } from "./share-modal";
import { RefreshCw, Download, Heart, Share2, Loader2 } from "lucide-react";

interface Quote {
  text: string;
  author: string;
  category: string;
}

interface QuoteDisplayProps {
  category: string;
}

export function QuoteDisplay({ category }: QuoteDisplayProps) {
  const [currentQuote, setCurrentQuote] = useState<Quote>({
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivational"
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGeneratingWallpaper, setIsGeneratingWallpaper] = useState(false);
  
  const { toast } = useToast();
  const { getRandomQuote, isLoading } = useRandomQuote(category);
  const addToFavoritesMutation = useAddToFavorites();
  const updateStatsMutation = useUpdateStats();
  const { data: stats } = useStats();

  useEffect(() => {
    // Update category when it changes
    setCurrentQuote(prev => ({ ...prev, category }));
  }, [category]);

  const generateNewQuote = () => {
    const newQuote = getRandomQuote();
    setCurrentQuote(newQuote);
    
    // Update stats
    updateStatsMutation.mutate({
      quotesGenerated: (stats?.quotesGenerated || 0) + 1
    });
  };

  const saveAsWallpaper = async () => {
    setIsGeneratingWallpaper(true);
    try {
      const dataUrl = await createWallpaper(currentQuote);
      const filename = `quote-wallpaper-${Date.now()}.png`;
      downloadImage(dataUrl, filename);
      
      // Update wallpapers saved count
      updateStatsMutation.mutate({
        wallpapersSaved: (stats?.wallpapersSaved || 0) + 1
      });
      
      toast({
        title: "Wallpaper Downloaded!",
        description: "Your quote wallpaper has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate wallpaper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingWallpaper(false);
    }
  };

  const addToFavorites = () => {
    addToFavoritesMutation.mutate(currentQuote, {
      onSuccess: () => {
        toast({
          title: "Added to Favorites!",
          description: "Quote has been saved to your favorites.",
        });
      },
      onError: () => {
        toast({
          title: "Failed to Save",
          description: "Could not add quote to favorites. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <div className="quote-card rounded-3xl p-8 md:p-12 shadow-2xl mb-8 animate-fade-in">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="quote-transition">
            <blockquote className="text-center mb-8">
              <p className="text-2xl md:text-4xl lg:text-5xl font-playfair leading-relaxed text-charcoal dark:text-white mb-6 italic">
                "{currentQuote.text}"
              </p>
              <cite className="text-lg md:text-xl font-inter font-medium text-charcoal/80 dark:text-white/80 not-italic">
                — {currentQuote.author}
              </cite>
            </blockquote>
            
            <div className="flex justify-center mb-8">
              <Badge className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-medium">
                {currentQuote.category.charAt(0).toUpperCase() + currentQuote.category.slice(1)}
              </Badge>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={generateNewQuote}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-poppins font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Quote
          </Button>
          
          <Button
            onClick={saveAsWallpaper}
            disabled={isGeneratingWallpaper}
            variant="outline"
            className="px-6 py-3 bg-white/30 dark:bg-white/10 backdrop-blur-sm border border-white/30 text-charcoal dark:text-white rounded-xl font-poppins font-medium hover:bg-white/40 hover:scale-105 transition-all duration-300"
          >
            {isGeneratingWallpaper ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Save Wallpaper
          </Button>
          
          <Button
            onClick={addToFavorites}
            disabled={addToFavoritesMutation.isPending}
            variant="outline"
            className="px-6 py-3 bg-white/30 dark:bg-white/10 backdrop-blur-sm border border-white/30 text-charcoal dark:text-white rounded-xl font-poppins font-medium hover:bg-white/40 hover:scale-105 transition-all duration-300"
          >
            <Heart className="w-4 h-4 mr-2" />
            Favorite
          </Button>
          
          <Button
            onClick={() => setIsShareModalOpen(true)}
            variant="outline"
            className="px-6 py-3 bg-white/30 dark:bg-white/10 backdrop-blur-sm border border-white/30 text-charcoal dark:text-white rounded-xl font-poppins font-medium hover:bg-white/40 hover:scale-105 transition-all duration-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        quote={currentQuote}
      />
    </>
  );
}
