import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuoteDisplay } from "@/components/quote-display";
import { useTheme } from "@/hooks/use-theme";
import { useStats } from "@/hooks/use-quotes";
import { Moon, Sun, Quote } from "lucide-react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<"motivational" | "funny">("motivational");
  const { theme, toggleTheme } = useTheme();
  const { data: stats } = useStats();

  // Auto-generate new quote every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // This will be handled by the QuoteDisplay component
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gradient-bg min-h-screen transition-all duration-500 font-inter">
      <div className="min-h-screen relative overflow-hidden">
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl" />
          <div 
            className="floating-element absolute top-40 right-20 w-24 h-24 bg-secondary/20 rounded-full blur-lg" 
            style={{ animationDelay: '-2s' }}
          />
          <div 
            className="floating-element absolute bottom-32 left-1/4 w-40 h-40 bg-accent/15 rounded-full blur-2xl" 
            style={{ animationDelay: '-4s' }}
          />
          <div 
            className="floating-element absolute bottom-20 right-10 w-28 h-28 bg-primary/25 rounded-full blur-lg" 
            style={{ animationDelay: '-6s' }}
          />
        </div>
        
        {/* Header */}
        <header className="relative z-10 p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Quote className="text-white text-lg" />
              </div>
              <h1 className="text-2xl md:text-3xl font-playfair font-semibold text-charcoal dark:text-white">
                QuoteFlow
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="icon"
                className="p-3 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all duration-300"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-charcoal dark:text-white" />
                ) : (
                  <Moon className="h-5 w-5 text-charcoal dark:text-white" />
                )}
              </Button>
              
              {/* Category Filter - Desktop */}
              <div className="hidden md:flex bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-1">
                <Button
                  onClick={() => setActiveCategory("motivational")}
                  variant="ghost"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeCategory === "motivational"
                      ? "bg-white/40 text-charcoal"
                      : "text-charcoal/70 dark:text-white/70 hover:bg-white/20"
                  }`}
                >
                  Motivational
                </Button>
                <Button
                  onClick={() => setActiveCategory("funny")}
                  variant="ghost"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeCategory === "funny"
                      ? "bg-white/40 text-charcoal"
                      : "text-charcoal/70 dark:text-white/70 hover:bg-white/20"
                  }`}
                >
                  Funny
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Quote Display */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl mx-auto w-full">
            <QuoteDisplay category={activeCategory} />
            
            {/* Mobile Category Filter */}
            <div className="md:hidden flex justify-center mb-8">
              <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-1 flex">
                <Button
                  onClick={() => setActiveCategory("motivational")}
                  variant="ghost"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeCategory === "motivational"
                      ? "bg-white/40 text-charcoal"
                      : "text-charcoal/70 dark:text-white/70 hover:bg-white/20"
                  }`}
                >
                  Motivational
                </Button>
                <Button
                  onClick={() => setActiveCategory("funny")}
                  variant="ghost"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeCategory === "funny"
                      ? "bg-white/40 text-charcoal"
                      : "text-charcoal/70 dark:text-white/70 hover:bg-white/20"
                  }`}
                >
                  Funny
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-playfair font-semibold text-charcoal dark:text-white">
                  {stats?.quotesGenerated || 0}
                </div>
                <div className="text-sm text-charcoal/70 dark:text-white/70 font-inter">Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-playfair font-semibold text-charcoal dark:text-white">
                  {stats?.favoriteQuotes || 0}
                </div>
                <div className="text-sm text-charcoal/70 dark:text-white/70 font-inter">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-playfair font-semibold text-charcoal dark:text-white">
                  {stats?.wallpapersSaved || 0}
                </div>
                <div className="text-sm text-charcoal/70 dark:text-white/70 font-inter">Saved</div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="relative z-10 p-6 text-center">
          <p className="text-charcoal/60 dark:text-white/60 font-inter text-sm">
            Powered by <span className="font-medium">ZenQuotes API</span> • Made with ❤️ for inspiration
          </p>
        </footer>
      </div>
    </div>
  );
}
