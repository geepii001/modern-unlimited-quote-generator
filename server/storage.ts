import { quotes, stats, type Quote, type InsertQuote, type Stats, type InsertStats } from "@shared/schema";

export interface IStorage {
  getQuote(id: number): Promise<Quote | undefined>;
  getFavoriteQuotes(): Promise<Quote[]>;
  addToFavorites(quote: InsertQuote): Promise<Quote>;
  removeFromFavorites(id: number): Promise<void>;
  getStats(): Promise<Stats>;
  updateStats(stats: Partial<InsertStats>): Promise<Stats>;
}

export class MemStorage implements IStorage {
  private quotes: Map<number, Quote>;
  private stats: Stats;
  private currentId: number;

  constructor() {
    this.quotes = new Map();
    this.currentId = 1;
    this.stats = {
      id: 1,
      quotesGenerated: 0,
      favoriteQuotes: 0,
      wallpapersSaved: 0,
    };
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }

  async getFavoriteQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values()).filter(quote => quote.isFavorite);
  }

  async addToFavorites(insertQuote: InsertQuote): Promise<Quote> {
    const id = this.currentId++;
    const quote: Quote = {
      ...insertQuote,
      id,
      isFavorite: true,
      createdAt: new Date(),
    };
    this.quotes.set(id, quote);
    if (this.stats) {
      this.stats.favoriteQuotes++;
    }
    return quote;
  }

  async removeFromFavorites(id: number): Promise<void> {
    const quote = this.quotes.get(id);
    if (quote) {
      this.quotes.delete(id);
      if (this.stats) {
        this.stats.favoriteQuotes--;
      }
    }
  }

  async getStats(): Promise<Stats> {
    return this.stats;
  }

  async updateStats(newStats: Partial<InsertStats>): Promise<Stats> {
    this.stats = { ...this.stats, ...newStats };
    return this.stats;
  }
}

export const storage = new MemStorage();
