import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Quote, Stats } from "@shared/schema";
import { fallbackQuotes } from "@/lib/fallback-quotes";

export interface ExternalQuote {
  q?: string;
  a?: string;
  text?: string;
  author?: string;
}

export function useQuotes() {
  return useQuery<ExternalQuote[]>({
    queryKey: ["/api/quotes"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

export function useTypeFitQuotes() {
  return useQuery<ExternalQuote[]>({
    queryKey: ["/api/quotes/typefit"],
    enabled: false, // Only fetch when explicitly called
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useFavoriteQuotes() {
  return useQuery<Quote[]>({
    queryKey: ["/api/favorites"],
  });
}

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["/api/stats"],
  });
}

export function useAddToFavorites() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quote: { text: string; author: string; category: string }) => {
      const response = await apiRequest("POST", "/api/favorites", quote);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/favorites/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useUpdateStats() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (stats: Partial<{ quotesGenerated: number; favoriteQuotes: number; wallpapersSaved: number }>) => {
      const response = await apiRequest("PATCH", "/api/stats", stats);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useRandomQuote(category: string) {
  const zenQuotes = useQuotes();
  const typeFitQuotes = useTypeFitQuotes();

  const getRandomQuote = () => {
    let quotes: ExternalQuote[] = [];
    
    // Try to use API quotes first
    if (zenQuotes.data && zenQuotes.data.length > 0) {
      quotes = zenQuotes.data;
    } else if (typeFitQuotes.data && typeFitQuotes.data.length > 0) {
      quotes = typeFitQuotes.data;
    } else {
      // Fall back to local quotes
      quotes = fallbackQuotes[category as keyof typeof fallbackQuotes] || fallbackQuotes.motivational;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];

    return {
      text: selectedQuote.q || selectedQuote.text || "The only way to do great work is to love what you do.",
      author: selectedQuote.a || selectedQuote.author || "Steve Jobs",
      category,
    };
  };

  return { getRandomQuote, isLoading: zenQuotes.isLoading };
}
